import * as fs from 'fs/promises';
import * as path from 'path';
import { Player, ValidationResult, ValidationError, ValidationWarning } from '../types';

export interface Team {
  manager: {
    github: string;
    teamName: string;
    email?: string;
    joined: string;
  };
  squad: {
    goalkeepers: Player[];
    defenders: Player[];
    midfielders: Player[];
    forwards: Player[];
  };
  formation: string;
  startingXI: string[];
  bench: string[];
  captain: string;
  viceCaptain: string;
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  transfers?: {
    free: number;
    made: number;
    cost: number;
  };
  chips?: Record<string, boolean>;
  metadata: {
    created: string;
    lastModified: string;
    gameweekLocked?: number | null;
    version: string;
  };
}


export class TeamService {
  private teamsPath: string;
  
  constructor() {
    this.teamsPath = path.join(process.cwd(), 'teams');
  }
  
  async loadTeam(username: string): Promise<Team | null> {
    try {
      const teamPath = path.join(this.teamsPath, username, 'team.json');
      const data = await fs.readFile(teamPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }
  
  async saveTeam(username: string, team: Team): Promise<void> {
    const teamDir = path.join(this.teamsPath, username);
    const teamPath = path.join(teamDir, 'team.json');
    
    // Ensure directory exists
    await fs.mkdir(teamDir, { recursive: true });
    
    // Update metadata
    team.metadata.lastModified = new Date().toISOString();
    
    // Save team
    await fs.writeFile(teamPath, JSON.stringify(team, null, 2));
  }
  
  async getGameweekHistory(username: string, gameweek: number): Promise<any> {
    try {
      const historyPath = path.join(
        this.teamsPath,
        username,
        'history',
        `gameweek-${gameweek}.json`
      );
      const data = await fs.readFile(historyPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }
  
  async getTransferHistory(username: string): Promise<any[]> {
    try {
      const transfersDir = path.join(this.teamsPath, username, 'transfers');
      const files = await fs.readdir(transfersDir);
      
      const transfers = await Promise.all(
        files.map(async (file) => {
          const data = await fs.readFile(path.join(transfersDir, file), 'utf-8');
          return JSON.parse(data);
        })
      );
      
      return transfers.sort((a, b) => b.gameweek - a.gameweek);
    } catch (error) {
      return [];
    }
  }
  
  async validateTeam(team: Team): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Budget validation
    if (team.budget.spent > 100.0) {
      errors.push({
        code: 'BUDGET_EXCEEDED',
        message: `Budget exceeded: £${team.budget.spent}m > £100m`,
        field: 'budget.spent',
        value: team.budget.spent,
        fix: `Remove players worth £${(team.budget.spent - 100).toFixed(1)}m`
      });
    }
    
    // Squad composition
    const composition = {
      GK: team.squad.goalkeepers.length,
      DEF: team.squad.defenders.length,
      MID: team.squad.midfielders.length,
      FWD: team.squad.forwards.length
    };
    
    const required = { GK: 2, DEF: 5, MID: 5, FWD: 3 };
    
    Object.entries(required).forEach(([pos, count]) => {
      if (composition[pos as keyof typeof composition] !== count) {
        errors.push({
          code: 'INVALID_SQUAD_COMPOSITION',
          message: `${pos}: ${composition[pos as keyof typeof composition]} players (need ${count})`,
          field: `squad.${pos.toLowerCase()}`,
          value: composition[pos as keyof typeof composition]
        });
      }
    });
    
    // Team limit (max 3 from same club)
    const teamCounts: Record<string, number> = {};
    const allPlayers = [
      ...team.squad.goalkeepers,
      ...team.squad.defenders,
      ...team.squad.midfielders,
      ...team.squad.forwards
    ];
    
    allPlayers.forEach(player => {
      teamCounts[player.team] = (teamCounts[player.team] || 0) + 1;
    });
    
    Object.entries(teamCounts).forEach(([club, count]) => {
      if (count > 3) {
        errors.push({
          code: 'TEAM_LIMIT_EXCEEDED',
          message: `Too many players from ${club}: ${count} > 3`,
          field: 'squad',
          value: count
        });
      }
    });
    
    // Captain validation
    if (!team.startingXI.includes(team.captain)) {
      errors.push({
        code: 'CAPTAIN_NOT_IN_XI',
        message: 'Captain must be in starting XI',
        field: 'captain',
        value: team.captain
      });
    }
    
    // Warnings
    if (team.budget.remaining < 1.0) {
      warnings.push({
        code: 'LOW_BUDGET',
        message: `Low remaining budget: £${team.budget.remaining}m`,
        suggestion: 'Consider keeping some budget for future transfers'
      });
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      info: {
        budget: team.budget,
        squad: {
          valid: errors.length === 0,
          composition
        },
        formation: team.formation
      }
    };
  }
}


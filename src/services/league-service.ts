import * as fs from 'fs/promises';
import * as path from 'path';

export interface League {
  id: string;
  name: string;
  code: string;
  type: 'classic' | 'h2h' | 'draft';
  creator: string;
  created: string;
  members: LeagueMember[];
  standings?: Standing[];
}

export interface LeagueMember {
  github: string;
  teamName: string;
  joined: string;
  role: 'admin' | 'member';
  active: boolean;
}

export interface Standing {
  rank: number;
  rankChange: number;
  github: string;
  teamName: string;
  points: number;
  totalPoints: number;
}

export class LeagueService {
  private leaguesPath: string;
  
  constructor() {
    this.leaguesPath = path.join(process.cwd(), 'leagues');
  }
  
  async getUserLeagues(username: string): Promise<League[]> {
    try {
      // Check global league
      const globalLeague = await this.loadLeague('global');
      const leagues: League[] = [];
      
      if (globalLeague) {
        leagues.push(globalLeague);
      }
      
      // Check private leagues
      const privatePath = path.join(this.leaguesPath, 'private');
      try {
        const privateLeagues = await fs.readdir(privatePath);
        
        for (const leagueName of privateLeagues) {
          const league = await this.loadLeague(`private/${leagueName}`);
          if (league && league.members.some(m => m.github === username)) {
            leagues.push(league);
          }
        }
      } catch (error) {
        // No private leagues directory
      }
      
      return leagues;
    } catch (error) {
      return [];
    }
  }
  
  async loadLeague(leaguePath: string): Promise<League | null> {
    try {
      // const configPath = path.join(this.leaguesPath, leaguePath, 'config.yaml');
      // const standingsPath = path.join(this.leaguesPath, leaguePath, 'standings.json');
      
      // For now, return mock data
      // In real implementation, would parse YAML config and load standings
      return {
        id: leaguePath,
        name: leaguePath === 'global' ? 'Global League' : leaguePath,
        code: 'ABC123',
        type: 'classic',
        creator: 'admin',
        created: new Date().toISOString(),
        members: [],
        standings: []
      };
    } catch (error) {
      return null;
    }
  }
  
  async getUserPosition(leagueId: string, username: string): Promise<any> {
    const league = await this.loadLeague(leagueId);
    
    if (!league || !league.standings) {
      return { rank: 0, total: 0, change: 0 };
    }
    
    const position = league.standings.findIndex(s => s.github === username) + 1;
    const standing = league.standings.find(s => s.github === username);
    
    return {
      rank: position,
      total: league.standings.length,
      change: standing?.rankChange || 0
    };
  }
  
  async createLeague(name: string, type: string, creator: string): Promise<string> {
    // Generate unique code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const league: League = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      code,
      type: type as 'classic' | 'h2h' | 'draft',
      creator,
      created: new Date().toISOString(),
      members: [{
        github: creator,
        teamName: '',
        joined: new Date().toISOString(),
        role: 'admin',
        active: true
      }]
    };
    
    // Save league
    const leaguePath = path.join(this.leaguesPath, 'private', league.id);
    await fs.mkdir(leaguePath, { recursive: true });
    
    // In real implementation, would save as YAML
    await fs.writeFile(
      path.join(leaguePath, 'config.json'),
      JSON.stringify(league, null, 2)
    );
    
    return code;
  }
  
  async joinLeague(_code: string, _username: string, _teamName: string): Promise<boolean> {
    // Find league by code
    // Add user to league members
    // For now, return success
    return true;
  }
}
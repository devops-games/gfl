import { Team, Player } from '../types';
import { RulesService } from './rules-service';
import { TeamService } from './team-service';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface Transfer {
  gameweek: number;
  timestamp: string;
  transfers: {
    out: Player;
    in: Player;
  }[];
  chip?: string;
  cost: number;
  freeTransfersUsed: number;
  extraTransfers: number;
  budgetBefore: number;
  budgetAfter: number;
}

export interface TransferValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  cost: number;
  budgetAfter: number;
  teamLimitViolations?: string[];
}

export class TransferService {
  private rulesService: RulesService;
  private teamService: TeamService;

  constructor() {
    this.rulesService = new RulesService();
    this.teamService = new TeamService();
  }

  async validateTransfer(
    team: Team,
    playersOut: Player[],
    playersIn: Player[],
    _gameweek: number,
    chip?: string
  ): Promise<TransferValidation> {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check if players out are in the team
    const allPlayers = this.getAllPlayers(team);
    const playerIds = new Set(allPlayers.map(p => p.id));
    
    for (const playerOut of playersOut) {
      if (!playerIds.has(playerOut.id)) {
        errors.push(`${playerOut.name} is not in your team`);
      }
    }

    // Check for duplicates in players in
    const playerInIds = playersIn.map(p => p.id);
    const duplicates = playerInIds.filter((id, index) => playerInIds.indexOf(id) !== index);
    if (duplicates.length > 0) {
      errors.push('Cannot sign the same player multiple times');
    }

    // Check if players in are already in the team
    for (const playerIn of playersIn) {
      if (playerIds.has(playerIn.id)) {
        errors.push(`${playerIn.name} is already in your team`);
      }
    }

    // Calculate budget impact
    const sellValue = await this.calculateSellValue(team, playersOut);
    const buyValue = playersIn.reduce((sum, p) => sum + p.price, 0);
    const budgetAfter = team.budget.remaining + sellValue - buyValue;

    if (budgetAfter < 0) {
      errors.push(`Insufficient budget: £${Math.abs(budgetAfter).toFixed(1)}m short`);
    }

    // Validate squad composition after transfers
    const newTeam = await this.applyTransfers(team, playersOut, playersIn);
    const compositionValidation = await this.rulesService.validateSquadComposition(newTeam);
    if (!compositionValidation.valid) {
      errors.push(...compositionValidation.errors);
    }

    // Validate team limits after transfers
    const newAllPlayers = this.getAllPlayers(newTeam);
    const teamLimitValidation = await this.rulesService.validateTeamLimits(newAllPlayers);
    if (!teamLimitValidation.valid) {
      errors.push(...teamLimitValidation.errors);
    }

    // Calculate transfer cost
    const transferCount = playersOut.length;
    const freeTransfers = team.transfers?.free || 1;
    const transferValidation = await this.rulesService.validateTransfers(
      transferCount,
      freeTransfers,
      chip
    );

    if (!transferValidation.valid) {
      errors.push(...transferValidation.errors);
    }

    // Check if formation is still valid
    if (!this.isFormationStillValid(newTeam)) {
      warnings.push('You may need to adjust your formation after these transfers');
    }

    // Check captain/vice-captain validity
    if (playersOut.some(p => p.id === team.captain)) {
      warnings.push('Your captain is being transferred out - select a new captain');
    }
    if (playersOut.some(p => p.id === team.viceCaptain)) {
      warnings.push('Your vice-captain is being transferred out - select a new vice-captain');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      cost: transferValidation.cost,
      budgetAfter,
      teamLimitViolations: teamLimitValidation.errors
    };
  }

  async executeTransfer(
    username: string,
    team: Team,
    playersOut: Player[],
    playersIn: Player[],
    gameweek: number,
    chip?: string
  ): Promise<Team> {
    // Validate first
    const validation = await this.validateTransfer(team, playersOut, playersIn, gameweek, chip);
    if (!validation.valid) {
      throw new Error(`Transfer validation failed: ${validation.errors.join(', ')}`);
    }

    // Apply transfers to team
    const newTeam = await this.applyTransfers(team, playersOut, playersIn);
    
    // Update budget
    const sellValue = await this.calculateSellValue(team, playersOut);
    const buyValue = playersIn.reduce((sum, p) => sum + p.price, 0);
    newTeam.budget.remaining = team.budget.remaining + sellValue - buyValue;
    newTeam.budget.spent = 100.0 - newTeam.budget.remaining;

    // Update transfer counts
    if (!chip || (chip !== 'wildcard' && chip !== 'free-hit')) {
      const transferCount = playersOut.length;
      const freeUsed = Math.min(transferCount, team.transfers?.free || 1);
      const extraUsed = Math.max(0, transferCount - freeUsed);
      
      newTeam.transfers = {
        free: Math.max(0, (team.transfers?.free || 1) - freeUsed),
        made: (team.transfers?.made || 0) + transferCount,
        cost: (team.transfers?.cost || 0) + (extraUsed * 4)
      };
    }

    // Record chip usage
    if (chip) {
      newTeam.chips = newTeam.chips || {};
      const rules = await this.rulesService.loadRules();
      
      if (chip === 'wildcard') {
        if (gameweek <= rules.chips.wildcard.firstHalfDeadline) {
          newTeam.chips.wildcard1 = true;
        } else {
          newTeam.chips.wildcard2 = true;
        }
      } else {
        newTeam.chips[chip as keyof typeof newTeam.chips] = true;
      }
    }

    // Save transfer history
    await this.saveTransferHistory(username, {
      gameweek,
      timestamp: new Date().toISOString(),
      transfers: playersOut.map((out, i) => ({ out, in: playersIn[i] })),
      chip,
      cost: validation.cost,
      freeTransfersUsed: Math.min(playersOut.length, team.transfers?.free || 1),
      extraTransfers: Math.max(0, playersOut.length - (team.transfers?.free || 1)),
      budgetBefore: team.budget.remaining,
      budgetAfter: validation.budgetAfter
    });

    // Save updated team
    await this.teamService.saveTeam(username, newTeam);

    return newTeam;
  }

  private async applyTransfers(
    team: Team,
    playersOut: Player[],
    playersIn: Player[]
  ): Promise<Team> {
    const newTeam = JSON.parse(JSON.stringify(team)); // Deep clone

    // Remove players out and add players in
    for (let i = 0; i < playersOut.length; i++) {
      const playerOut = playersOut[i];
      const playerIn = playersIn[i];

      // Find and remove player out
      const positions = ['goalkeepers', 'defenders', 'midfielders', 'forwards'];
      for (const pos of positions) {
        const index = newTeam.squad[pos].findIndex((p: Player) => p.id === playerOut.id);
        if (index !== -1) {
          newTeam.squad[pos].splice(index, 1);
          break;
        }
      }

      // Add player in to correct position
      const positionMap = {
        'GK': 'goalkeepers',
        'DEF': 'defenders',
        'MID': 'midfielders',
        'FWD': 'forwards'
      };
      const targetPosition = positionMap[playerIn.position];
      playerIn.purchasePrice = playerIn.price;
      playerIn.purchaseDate = new Date().toISOString();
      newTeam.squad[targetPosition].push(playerIn);

      // Update starting XI and bench if necessary
      const xiIndex = newTeam.startingXI.indexOf(playerOut.id);
      if (xiIndex !== -1) {
        newTeam.startingXI[xiIndex] = playerIn.id;
      }
      
      const benchIndex = newTeam.bench.indexOf(playerOut.id);
      if (benchIndex !== -1) {
        newTeam.bench[benchIndex] = playerIn.id;
      }

      // Update captain/vice-captain if necessary
      if (newTeam.captain === playerOut.id) {
        newTeam.captain = '';
      }
      if (newTeam.viceCaptain === playerOut.id) {
        newTeam.viceCaptain = '';
      }
    }

    return newTeam;
  }

  private async calculateSellValue(team: Team, playersOut: Player[]): Promise<number> {
    let totalValue = 0;
    
    for (const player of playersOut) {
      // Find the player in the team to get purchase price
      const allPlayers = this.getAllPlayers(team);
      const teamPlayer = allPlayers.find(p => p.id === player.id);
      
      if (teamPlayer && teamPlayer.purchasePrice) {
        const sellPrice = await this.rulesService.calculateSellPrice(
          teamPlayer.purchasePrice,
          player.price
        );
        totalValue += sellPrice;
      } else {
        totalValue += player.price;
      }
    }

    return totalValue;
  }

  private getAllPlayers(team: Team): Player[] {
    return [
      ...team.squad.goalkeepers,
      ...team.squad.defenders,
      ...team.squad.midfielders,
      ...team.squad.forwards
    ];
  }

  private isFormationStillValid(team: Team): boolean {
    const xiPlayers = this.getAllPlayers(team).filter(p => team.startingXI.includes(p.id));
    const positionCounts = {
      GK: 0,
      DEF: 0,
      MID: 0,
      FWD: 0
    };

    xiPlayers.forEach(p => {
      positionCounts[p.position]++;
    });

    const [def, mid, fwd] = team.formation.split('-').map(Number);
    return (
      positionCounts.GK === 1 &&
      positionCounts.DEF === def &&
      positionCounts.MID === mid &&
      positionCounts.FWD === fwd
    );
  }

  private async saveTransferHistory(username: string, transfer: Transfer): Promise<void> {
    const transfersDir = path.join(process.cwd(), 'teams', username, 'transfers');
    await fs.mkdir(transfersDir, { recursive: true });
    
    const filename = `gameweek-${transfer.gameweek}.json`;
    const filepath = path.join(transfersDir, filename);
    
    await fs.writeFile(filepath, JSON.stringify(transfer, null, 2));
  }

  async getTransferHistory(username: string): Promise<Transfer[]> {
    const transfersDir = path.join(process.cwd(), 'teams', username, 'transfers');
    
    try {
      const files = await fs.readdir(transfersDir);
      const transfers = await Promise.all(
        files.map(async (file) => {
          const data = await fs.readFile(path.join(transfersDir, file), 'utf-8');
          return JSON.parse(data);
        })
      );
      
      return transfers.sort((a, b) => b.gameweek - a.gameweek);
    } catch {
      return [];
    }
  }

  async calculateAccumulatedFreeTransfers(
    currentFree: number,
    gameweeksSinceLastTransfer: number
  ): Promise<number> {
    const rules = await this.rulesService.loadRules();
    const accumulated = currentFree + gameweeksSinceLastTransfer;
    return Math.min(accumulated, rules.transfers.maxAccumulated);
  }
}
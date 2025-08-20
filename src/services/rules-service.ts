import { Team, Player } from '../types';
import * as fs from 'fs/promises';
import * as path from 'path';
import { parse } from 'yaml';

export interface GameRules {
  budget: {
    initial: number;
    max: number;
  };
  squad: {
    size: number;
    composition: {
      GK: number;
      DEF: number;
      MID: number;
      FWD: number;
    };
    teamLimit: number; // Max players per club
  };
  transfers: {
    freePerWeek: number;
    maxAccumulated: number;
    costPerExtra: number;
    maxPerGameweek: number;
  };
  formations: string[];
  scoring: {
    goals: {
      GK: number;
      DEF: number;
      MID: number;
      FWD: number;
    };
    assists: number;
    cleanSheets: {
      GK: number;
      DEF: number;
      MID: number;
      FWD: number;
    };
    penalties: {
      yellowCard: number;
      redCard: number;
      ownGoal: number;
      penaltyMiss: number;
      goalsConceded: number; // Per 2 goals
    };
    bonus: {
      first: number;
      second: number;
      third: number;
    };
    goalkeeping: {
      penaltySave: number;
      savesPer3: number;
    };
    appearance: {
      full: number; // 60+ minutes
      partial: number; // <60 minutes
    };
    defensive: {
      defenders: { actions: number; threshold: number };
      others: { actions: number; threshold: number };
    };
  };
  chips: {
    wildcard: {
      available: number;
      firstHalfDeadline: number; // Gameweek
      effect: string;
    };
    freeHit: {
      available: number;
      effect: string;
    };
    tripleCaptain: {
      available: number;
      effect: string;
    };
    benchBoost: {
      available: number;
      effect: string;
    };
    mystery: {
      available: number;
      revealDate: string;
      effect: string;
    };
  };
  deadlines: {
    transferWindowCloseMinutes: number; // Before first match
    autoSubstitutionAfter: string; // 'all_matches_complete'
  };
  prices: {
    min: number;
    max: number;
    maxChangePerWeek: number;
    sellProfitPercentage: number; // 50% of profit
  };
  leagues: {
    maxPrivateLeagues: number;
    maxTeamsPerLeague: number;
    cupQualificationWeek: number;
  };
  season: {
    startDate: string;
    endDate: string;
    totalGameweeks: number;
    currentGameweek?: number;
  };
}

export class RulesService {
  private rules: GameRules | null = null;
  private rulesPath: string;

  constructor() {
    this.rulesPath = path.join(process.cwd(), 'data', 'rules', 'rules.yaml');
  }

  async loadRules(): Promise<GameRules> {
    if (this.rules) return this.rules;

    try {
      const rulesData = await fs.readFile(this.rulesPath, 'utf-8');
      this.rules = parse(rulesData);
      return this.rules!;
    } catch (error) {
      // Return default rules if file doesn't exist
      this.rules = this.getDefaultRules();
      return this.rules;
    }
  }

  private getDefaultRules(): GameRules {
    return {
      budget: {
        initial: 100.0,
        max: 100.0
      },
      squad: {
        size: 15,
        composition: {
          GK: 2,
          DEF: 5,
          MID: 5,
          FWD: 3
        },
        teamLimit: 3
      },
      transfers: {
        freePerWeek: 1,
        maxAccumulated: 5,
        costPerExtra: 4,
        maxPerGameweek: 20
      },
      formations: ['4-4-2', '4-3-3', '3-5-2', '3-4-3', '5-4-1', '5-3-2', '4-5-1'],
      scoring: {
        goals: {
          GK: 10,
          DEF: 6,
          MID: 5,
          FWD: 4
        },
        assists: 3,
        cleanSheets: {
          GK: 4,
          DEF: 4,
          MID: 1,
          FWD: 0
        },
        penalties: {
          yellowCard: -1,
          redCard: -3,
          ownGoal: -2,
          penaltyMiss: -2,
          goalsConceded: -1
        },
        bonus: {
          first: 3,
          second: 2,
          third: 1
        },
        goalkeeping: {
          penaltySave: 5,
          savesPer3: 1
        },
        appearance: {
          full: 2,
          partial: 1
        },
        defensive: {
          defenders: { actions: 2, threshold: 10 },
          others: { actions: 2, threshold: 12 }
        }
      },
      chips: {
        wildcard: {
          available: 2,
          firstHalfDeadline: 19,
          effect: 'Unlimited free transfers for one gameweek'
        },
        freeHit: {
          available: 1,
          effect: 'Unlimited transfers for one gameweek, team reverts after'
        },
        tripleCaptain: {
          available: 1,
          effect: 'Captain scores triple points'
        },
        benchBoost: {
          available: 1,
          effect: 'All 15 players score points'
        },
        mystery: {
          available: 1,
          revealDate: '2025-01-01',
          effect: 'To be revealed'
        }
      },
      deadlines: {
        transferWindowCloseMinutes: 90,
        autoSubstitutionAfter: 'all_matches_complete'
      },
      prices: {
        min: 4.0,
        max: 15.0,
        maxChangePerWeek: 0.3,
        sellProfitPercentage: 0.5
      },
      leagues: {
        maxPrivateLeagues: 20,
        maxTeamsPerLeague: 20,
        cupQualificationWeek: 16
      },
      season: {
        startDate: '2024-08-16',
        endDate: '2025-05-25',
        totalGameweeks: 38,
        currentGameweek: 1
      }
    };
  }

  async validateBudget(team: Team): Promise<{ valid: boolean; errors: string[] }> {
    const rules = await this.loadRules();
    const errors: string[] = [];

    if (team.budget.spent > rules.budget.max) {
      errors.push(`Budget exceeded: £${team.budget.spent}m > £${rules.budget.max}m`);
    }

    if (team.budget.spent < 0) {
      errors.push('Invalid budget: Cannot be negative');
    }

    return { valid: errors.length === 0, errors };
  }

  async validateSquadComposition(team: Team): Promise<{ valid: boolean; errors: string[] }> {
    const rules = await this.loadRules();
    const errors: string[] = [];

    const composition = {
      GK: team.squad.goalkeepers.length,
      DEF: team.squad.defenders.length,
      MID: team.squad.midfielders.length,
      FWD: team.squad.forwards.length
    };

    Object.entries(rules.squad.composition).forEach(([pos, required]) => {
      const actual = composition[pos as keyof typeof composition];
      if (actual !== required) {
        errors.push(`${pos}: ${actual} players (need exactly ${required})`);
      }
    });

    const totalPlayers = Object.values(composition).reduce((a, b) => a + b, 0);
    if (totalPlayers !== rules.squad.size) {
      errors.push(`Squad size: ${totalPlayers} players (need exactly ${rules.squad.size})`);
    }

    return { valid: errors.length === 0, errors };
  }

  async validateTeamLimits(players: Player[]): Promise<{ valid: boolean; errors: string[] }> {
    const rules = await this.loadRules();
    const errors: string[] = [];
    const teamCounts: Record<string, number> = {};

    players.forEach(player => {
      teamCounts[player.team] = (teamCounts[player.team] || 0) + 1;
    });

    Object.entries(teamCounts).forEach(([club, count]) => {
      if (count > rules.squad.teamLimit) {
        errors.push(`${club}: ${count} players (max ${rules.squad.teamLimit} per club)`);
      }
    });

    return { valid: errors.length === 0, errors };
  }

  async validateFormation(formation: string): Promise<{ valid: boolean; errors: string[] }> {
    const rules = await this.loadRules();
    const errors: string[] = [];

    if (!rules.formations.includes(formation)) {
      errors.push(`Invalid formation: ${formation}. Valid: ${rules.formations.join(', ')}`);
    }

    return { valid: errors.length === 0, errors };
  }

  async validateTransfers(
    transferCount: number,
    freeTransfers: number,
    chip?: string
  ): Promise<{ valid: boolean; cost: number; errors: string[] }> {
    const rules = await this.loadRules();
    const errors: string[] = [];
    let cost = 0;

    if (chip === 'wildcard' || chip === 'free-hit') {
      // Unlimited transfers with these chips
      return { valid: true, cost: 0, errors: [] };
    }

    if (transferCount > rules.transfers.maxPerGameweek) {
      errors.push(`Too many transfers: ${transferCount} (max ${rules.transfers.maxPerGameweek})`);
    }

    const extraTransfers = Math.max(0, transferCount - freeTransfers);
    cost = extraTransfers * rules.transfers.costPerExtra;

    return { valid: errors.length === 0, cost, errors };
  }

  async calculateSellPrice(purchasePrice: number, currentPrice: number): Promise<number> {
    const rules = await this.loadRules();
    
    if (currentPrice <= purchasePrice) {
      return currentPrice;
    }

    const profit = currentPrice - purchasePrice;
    const profitShare = Math.floor(profit * rules.prices.sellProfitPercentage * 10) / 10;
    return purchasePrice + profitShare;
  }

  async isChipAvailable(team: Team, chip: string): Promise<boolean> {
    const rules = await this.loadRules();
    const usedChips = team.chips || {};

    switch (chip) {
      case 'wildcard':
        const gameweek = rules.season.currentGameweek || 1;
        if (gameweek <= rules.chips.wildcard.firstHalfDeadline) {
          return !usedChips.wildcard1;
        } else {
          return !usedChips.wildcard2;
        }
      case 'free-hit':
        return !usedChips.freeHit;
      case 'triple-captain':
        return !usedChips.tripleCaptain;
      case 'bench-boost':
        return !usedChips.benchBoost;
      case 'mystery':
        const today = new Date();
        const revealDate = new Date(rules.chips.mystery.revealDate);
        return today >= revealDate && !usedChips.mystery;
      default:
        return false;
    }
  }

  async getDeadline(_gameweek?: number): Promise<Date | null> {
    // In a real implementation, this would fetch from fixtures data
    // For now, return a mock deadline
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + ((7 - deadline.getDay() + 5) % 7)); // Next Friday
    deadline.setHours(19, 30, 0, 0); // 7:30 PM
    return deadline;
  }

  async validateStartingXI(
    formation: string,
    startingXI: string[],
    players: Player[]
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (startingXI.length !== 11) {
      errors.push(`Starting XI must have exactly 11 players (has ${startingXI.length})`);
    }

    // Parse formation (e.g., "4-4-2")
    const [def, mid, fwd] = formation.split('-').map(Number);
    
    // Count positions in starting XI
    const startingPlayers = players.filter(p => startingXI.includes(p.id));
    const positionCounts = {
      GK: 0,
      DEF: 0,
      MID: 0,
      FWD: 0
    };

    startingPlayers.forEach(p => {
      positionCounts[p.position]++;
    });

    if (positionCounts.GK !== 1) {
      errors.push(`Must have exactly 1 goalkeeper (has ${positionCounts.GK})`);
    }
    if (positionCounts.DEF !== def) {
      errors.push(`Formation ${formation} requires ${def} defenders (has ${positionCounts.DEF})`);
    }
    if (positionCounts.MID !== mid) {
      errors.push(`Formation ${formation} requires ${mid} midfielders (has ${positionCounts.MID})`);
    }
    if (positionCounts.FWD !== fwd) {
      errors.push(`Formation ${formation} requires ${fwd} forwards (has ${positionCounts.FWD})`);
    }

    // Validate minimum requirements
    if (positionCounts.DEF < 3) {
      errors.push('Must have at least 3 defenders');
    }
    if (positionCounts.MID < 2) {
      errors.push('Must have at least 2 midfielders');
    }
    if (positionCounts.FWD < 1) {
      errors.push('Must have at least 1 forward');
    }

    return { valid: errors.length === 0, errors };
  }

  async validateCaptains(
    captain: string,
    viceCaptain: string,
    startingXI: string[]
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!captain) {
      errors.push('Captain must be selected');
    } else if (!startingXI.includes(captain)) {
      errors.push('Captain must be in starting XI');
    }

    if (!viceCaptain) {
      errors.push('Vice-captain must be selected');
    } else if (!startingXI.includes(viceCaptain)) {
      errors.push('Vice-captain must be in starting XI');
    }

    if (captain === viceCaptain) {
      errors.push('Captain and vice-captain must be different players');
    }

    return { valid: errors.length === 0, errors };
  }

  async getAvailableChips(team: Team): Promise<string[]> {
    const rules = await this.loadRules();
    const available: string[] = [];
    const gameweek = rules.season.currentGameweek || 1;

    if (gameweek <= rules.chips.wildcard.firstHalfDeadline) {
      if (!team.chips?.wildcard1) available.push('wildcard');
    } else {
      if (!team.chips?.wildcard2) available.push('wildcard');
    }

    if (!team.chips?.freeHit) available.push('free-hit');
    if (!team.chips?.tripleCaptain) available.push('triple-captain');
    if (!team.chips?.benchBoost) available.push('bench-boost');

    const today = new Date();
    const revealDate = new Date(rules.chips.mystery.revealDate);
    if (today >= revealDate && !team.chips?.mystery) {
      available.push('mystery');
    }

    return available;
  }
}
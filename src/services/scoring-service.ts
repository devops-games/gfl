import { Player } from '../types';
import { RulesService } from './rules-service';

export interface PlayerGameweekStats {
  playerId: string;
  minutes: number;
  goals: number;
  assists: number;
  cleanSheet: boolean;
  yellowCards: number;
  redCards: number;
  ownGoals: number;
  penaltiesMissed: number;
  penaltiesSaved: number;
  saves: number;
  goalsConceded: number;
  bonusPoints: number;
  defensiveActions?: number; // CBIT for defenders, CBIT + recoveries for others
}

export interface GameweekPoints {
  playerId: string;
  playerName: string;
  position: string;
  breakdown: {
    appearance: number;
    goals: number;
    assists: number;
    cleanSheet: number;
    saves: number;
    penaltySaves: number;
    yellowCards: number;
    redCards: number;
    ownGoals: number;
    penaltiesMissed: number;
    goalsConceded: number;
    bonus: number;
    defensive: number;
  };
  total: number;
  multiplier: number; // 1 for normal, 2 for captain, 3 for triple captain
  finalPoints: number;
}

export class ScoringService {
  private rulesService: RulesService;

  constructor() {
    this.rulesService = new RulesService();
  }

  async calculatePlayerPoints(
    player: Player,
    stats: PlayerGameweekStats,
    isCaptain: boolean = false,
    isTripleCaptain: boolean = false
  ): Promise<GameweekPoints> {
    const rules = await this.rulesService.loadRules();
    const scoring = rules.scoring;
    
    const breakdown = {
      appearance: 0,
      goals: 0,
      assists: 0,
      cleanSheet: 0,
      saves: 0,
      penaltySaves: 0,
      yellowCards: 0,
      redCards: 0,
      ownGoals: 0,
      penaltiesMissed: 0,
      goalsConceded: 0,
      bonus: 0,
      defensive: 0
    };

    // Appearance points
    if (stats.minutes >= 60) {
      breakdown.appearance = scoring.appearance.full;
    } else if (stats.minutes > 0) {
      breakdown.appearance = scoring.appearance.partial;
    }

    // Goals
    const goalPoints = scoring.goals[player.position as keyof typeof scoring.goals];
    breakdown.goals = stats.goals * goalPoints;

    // Assists
    breakdown.assists = stats.assists * scoring.assists;

    // Clean sheets
    if (stats.cleanSheet && stats.minutes >= 60) {
      const cleanSheetPoints = scoring.cleanSheets[player.position as keyof typeof scoring.cleanSheets];
      breakdown.cleanSheet = cleanSheetPoints;
    }

    // Goalkeeper specific
    if (player.position === 'GK') {
      // Penalty saves
      breakdown.penaltySaves = stats.penaltiesSaved * scoring.goalkeeping.penaltySave;
      
      // Saves (1 point per 3 saves)
      breakdown.saves = Math.floor(stats.saves / 3) * scoring.goalkeeping.savesPer3;
    }

    // Defensive actions (new for 2025/26)
    if (stats.defensiveActions) {
      if (player.position === 'DEF') {
        if (stats.defensiveActions >= scoring.defensive.defenders.threshold) {
          breakdown.defensive = scoring.defensive.defenders.actions;
        }
      } else if (player.position === 'MID' || player.position === 'FWD') {
        if (stats.defensiveActions >= scoring.defensive.others.threshold) {
          breakdown.defensive = scoring.defensive.others.actions;
        }
      }
    }

    // Penalties (negative points)
    breakdown.yellowCards = stats.yellowCards * scoring.penalties.yellowCard;
    breakdown.redCards = stats.redCards * scoring.penalties.redCard;
    breakdown.ownGoals = stats.ownGoals * scoring.penalties.ownGoal;
    breakdown.penaltiesMissed = stats.penaltiesMissed * scoring.penalties.penaltyMiss;

    // Goals conceded (GK and DEF only)
    if ((player.position === 'GK' || player.position === 'DEF') && stats.minutes >= 60) {
      breakdown.goalsConceded = Math.floor(stats.goalsConceded / 2) * scoring.penalties.goalsConceded;
    }

    // Bonus points
    breakdown.bonus = stats.bonusPoints;

    // Calculate total
    const total = Object.values(breakdown).reduce((sum, points) => sum + points, 0);

    // Apply multipliers
    let multiplier = 1;
    if (isTripleCaptain) {
      multiplier = 3;
    } else if (isCaptain) {
      multiplier = 2;
    }

    const finalPoints = total * multiplier;

    return {
      playerId: player.id,
      playerName: player.name,
      position: player.position,
      breakdown,
      total,
      multiplier,
      finalPoints
    };
  }

  async calculateTeamGameweekPoints(
    players: Player[],
    stats: PlayerGameweekStats[],
    captain: string,
    viceCaptain: string,
    startingXI: string[],
    bench: string[],
    chips?: { tripleCaptain?: boolean; benchBoost?: boolean }
  ): Promise<{ playerPoints: GameweekPoints[]; totalPoints: number; benchPoints: number }> {
    const playerPoints: GameweekPoints[] = [];
    let totalPoints = 0;
    let benchPoints = 0;

    // Create stats map for easy lookup
    const statsMap = new Map(stats.map(s => [s.playerId, s]));

    // Process starting XI
    for (const player of players) {
      const playerStats = statsMap.get(player.id);
      if (!playerStats) continue;

      const isInXI = startingXI.includes(player.id);
      const isOnBench = bench.includes(player.id);

      if (!isInXI && !isOnBench) continue;

      const isCaptain = player.id === captain;
      const isViceCaptain = player.id === viceCaptain;

      // Handle vice-captain if captain didn't play
      let effectiveCaptain = isCaptain;
      if (isViceCaptain && !statsMap.get(captain)?.minutes) {
        effectiveCaptain = true;
      }

      const points = await this.calculatePlayerPoints(
        player,
        playerStats,
        effectiveCaptain,
        effectiveCaptain && chips?.tripleCaptain
      );

      playerPoints.push(points);

      if (isInXI || chips?.benchBoost) {
        totalPoints += points.finalPoints;
      } else if (isOnBench) {
        benchPoints += points.finalPoints;
      }
    }

    // Handle auto-substitutions (simplified version)
    if (!chips?.benchBoost) {
      await this.processAutoSubstitutions(
        players,
        statsMap,
        startingXI,
        bench,
        playerPoints
      );
    }

    return { playerPoints, totalPoints, benchPoints };
  }

  private async processAutoSubstitutions(
    players: Player[],
    statsMap: Map<string, PlayerGameweekStats>,
    startingXI: string[],
    bench: string[],
    playerPoints: GameweekPoints[]
  ): Promise<void> {
    // Check which starting XI players didn't play
    const nonPlayers = startingXI.filter(id => {
      const stats = statsMap.get(id);
      return !stats || stats.minutes === 0;
    });

    if (nonPlayers.length === 0) return;

    // Get players by position
    const playerMap = new Map(players.map(p => [p.id, p]));
    
    // Process substitutions in bench order
    for (const benchId of bench) {
      if (nonPlayers.length === 0) break;
      
      const benchPlayer = playerMap.get(benchId);
      const benchStats = statsMap.get(benchId);
      
      if (!benchPlayer || !benchStats || benchStats.minutes === 0) continue;

      // Find a non-playing player that can be substituted
      for (let i = 0; i < nonPlayers.length; i++) {
        const nonPlayerId = nonPlayers[i];
        const nonPlayer = playerMap.get(nonPlayerId);
        
        if (!nonPlayer) continue;

        // Check if substitution maintains valid formation
        if (this.canSubstitute(
          players,
          startingXI,
          nonPlayerId,
          benchId,
          nonPlayer.position,
          benchPlayer.position
        )) {
          // Perform substitution in points
          const benchPointsEntry = playerPoints.find(p => p.playerId === benchId);
          const nonPlayerPointsEntry = playerPoints.find(p => p.playerId === nonPlayerId);
          
          if (benchPointsEntry && nonPlayerPointsEntry) {
            // Swap the points (bench player comes on)
            benchPointsEntry.breakdown.appearance = nonPlayerPointsEntry.breakdown.appearance;
            nonPlayerPointsEntry.breakdown.appearance = 0;
          }

          // Remove from non-players list
          nonPlayers.splice(i, 1);
          break;
        }
      }
    }
  }

  private canSubstitute(
    _players: Player[],
    _startingXI: string[],
    _outPlayerId: string,
    _inPlayerId: string,
    outPosition: string,
    inPosition: string
  ): boolean {
    // Simplified logic - goalkeepers can only be substituted by goalkeepers
    if (outPosition === 'GK') {
      return inPosition === 'GK';
    }

    // For outfield players, would need to check formation validity
    // This is a simplified version
    return inPosition !== 'GK';
  }

  async calculateBonusPoints(
    matchStats: PlayerGameweekStats[]
  ): Promise<Map<string, number>> {
    const rules = await this.rulesService.loadRules();
    const bonusMap = new Map<string, number>();

    // In a real implementation, this would use the BPS (Bonus Points System)
    // For now, simplified version based on goals + assists
    const bpsScores = matchStats.map(stats => ({
      playerId: stats.playerId,
      bps: (stats.goals * 24) + (stats.assists * 9) + (stats.cleanSheet ? 12 : 0) - 
           (stats.yellowCards * 3) - (stats.redCards * 9) - (stats.ownGoals * 6)
    }));

    // Sort by BPS and award bonus points
    bpsScores.sort((a, b) => b.bps - a.bps);

    if (bpsScores[0]) bonusMap.set(bpsScores[0].playerId, rules.scoring.bonus.first);
    if (bpsScores[1]) bonusMap.set(bpsScores[1].playerId, rules.scoring.bonus.second);
    if (bpsScores[2]) bonusMap.set(bpsScores[2].playerId, rules.scoring.bonus.third);

    return bonusMap;
  }

  async projectGameweekPoints(
    player: Player,
    fixtures: { home: boolean; opponent: string; difficulty: number }[]
  ): Promise<number> {
    // Simplified projection based on position and fixtures
    const basePoints: Record<string, number> = {
      GK: 3,
      DEF: 3.5,
      MID: 4,
      FWD: 4.5
    };

    let projectedPoints = basePoints[player.position] || 0;

    // Adjust for fixtures
    fixtures.forEach(fixture => {
      const difficultyMultiplier = (6 - fixture.difficulty) / 5; // Higher is easier
      const homeBonus = fixture.home ? 1.1 : 1.0;
      projectedPoints *= difficultyMultiplier * homeBonus;
    });

    return Math.round(projectedPoints * 10) / 10;
  }
}
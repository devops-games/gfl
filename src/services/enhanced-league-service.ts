import * as fs from 'fs/promises';
import * as path from 'path';
import { Team } from '../types';
import { TeamService } from './team-service';
import { ScoringService, PlayerGameweekStats } from './scoring-service';
import { RulesService } from './rules-service';

export interface LeagueStanding {
  rank: number;
  previousRank: number;
  teamName: string;
  manager: string;
  gameweekPoints: number;
  totalPoints: number;
  gameweeksPlayed: number;
  transfers: number;
  chipsUsed: number;
  teamValue: number;
}

export interface League {
  id: string;
  name: string;
  type: 'classic' | 'head-to-head' | 'cup';
  created: string;
  creator: string;
  members: string[];
  settings: {
    maxTeams: number;
    public: boolean;
    joinCode?: string;
    startGameweek: number;
    endGameweek: number;
    scoringType: 'points' | 'average';
  };
  standings: LeagueStanding[];
  fixtures?: HeadToHeadFixture[];
  metadata: {
    lastUpdated: string;
    totalPrizePool?: number;
    description?: string;
  };
}

export interface HeadToHeadFixture {
  gameweek: number;
  home: string;
  away: string;
  homeScore?: number;
  awayScore?: number;
  winner?: string;
  played: boolean;
}

export interface CupDraw {
  round: number;
  fixtures: HeadToHeadFixture[];
  qualified: string[];
  eliminated: string[];
}

export class EnhancedLeagueService {
  private leaguesPath: string;
  private teamService: TeamService;
  private scoringService: ScoringService;
  private rulesService: RulesService;
  
  constructor() {
    this.leaguesPath = path.join(process.cwd(), 'leagues');
    this.teamService = new TeamService();
    this.scoringService = new ScoringService();
    this.rulesService = new RulesService();
  }

  async createLeague(
    name: string,
    creator: string,
    type: 'classic' | 'head-to-head' = 'classic',
    settings?: Partial<League['settings']>
  ): Promise<League> {
    const league: League = {
      id: this.generateLeagueId(),
      name,
      type,
      created: new Date().toISOString(),
      creator,
      members: [creator],
      settings: {
        maxTeams: 20,
        public: false,
        joinCode: this.generateJoinCode(),
        startGameweek: 1,
        endGameweek: 38,
        scoringType: 'points',
        ...settings
      },
      standings: [],
      fixtures: type === 'head-to-head' ? this.generateH2HFixtures([creator]) : undefined,
      metadata: {
        lastUpdated: new Date().toISOString()
      }
    };

    await this.saveLeague(league);
    return league;
  }

  async joinLeague(leagueId: string, username: string, joinCode?: string): Promise<void> {
    const league = await this.loadLeague(leagueId);
    
    if (!league) {
      throw new Error('League not found');
    }

    if (league.members.includes(username)) {
      throw new Error('Already a member of this league');
    }

    if (league.members.length >= league.settings.maxTeams) {
      throw new Error('League is full');
    }

    if (!league.settings.public && league.settings.joinCode !== joinCode) {
      throw new Error('Invalid join code');
    }

    league.members.push(username);
    
    // Regenerate H2H fixtures if needed
    if (league.type === 'head-to-head') {
      league.fixtures = this.generateH2HFixtures(league.members);
    }
    
    await this.saveLeague(league);
  }

  async updateStandings(leagueId: string, gameweek: number): Promise<void> {
    const league = await this.loadLeague(leagueId);
    if (!league) return;

    const standings: LeagueStanding[] = [];

    for (const member of league.members) {
      const team = await this.teamService.loadTeam(member);
      if (!team) continue;

      const history = await this.teamService.getGameweekHistory(member, gameweek);
      const totalPoints = await this.calculateTotalPoints(member, gameweek);
      const transferHistory = await this.teamService.getTransferHistory(member);
      const chipsUsed = this.countChipsUsed(team);
      const teamValue = this.calculateTeamValue(team);

      standings.push({
        rank: 0, // Will be set after sorting
        previousRank: this.getPreviousRank(league.standings, member),
        teamName: team.manager.teamName,
        manager: member,
        gameweekPoints: history?.points || 0,
        totalPoints: league.settings.scoringType === 'average' 
          ? Math.round(totalPoints / gameweek * 10) / 10 
          : totalPoints,
        gameweeksPlayed: gameweek,
        transfers: transferHistory.length,
        chipsUsed,
        teamValue
      });
    }

    // Sort standings
    standings.sort((a, b) => {
      // Primary: Total points
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      // Secondary: Fewest transfers
      if (a.transfers !== b.transfers) return a.transfers - b.transfers;
      // Tertiary: Team value
      return b.teamValue - a.teamValue;
    });
    
    // Assign ranks
    standings.forEach((standing, index) => {
      standing.rank = index + 1;
    });

    league.standings = standings;
    league.metadata.lastUpdated = new Date().toISOString();
    await this.saveLeague(league);
  }

  async getGlobalStandings(): Promise<LeagueStanding[]> {
    try {
      const globalLeague = await this.loadLeague('global');
      return globalLeague?.standings || [];
    } catch {
      return [];
    }
  }

  async getLeagueStandings(leagueId: string): Promise<LeagueStanding[]> {
    const league = await this.loadLeague(leagueId);
    return league?.standings || [];
  }

  async getUserLeagues(username: string): Promise<League[]> {
    const leagues: League[] = [];
    
    try {
      // Check all league files
      const files = await fs.readdir(this.leaguesPath);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const league = await this.loadLeague(file.replace('.json', ''));
          if (league && league.members.includes(username)) {
            leagues.push(league);
          }
        }
      }
    } catch {
      // No leagues directory yet
    }
    
    return leagues;
  }

  async processHeadToHeadGameweek(
    leagueId: string,
    gameweek: number,
    gameweekStats: Map<string, PlayerGameweekStats[]>
  ): Promise<void> {
    const league = await this.loadLeague(leagueId);
    if (!league || league.type !== 'head-to-head') return;

    const fixtures = league.fixtures?.filter(f => f.gameweek === gameweek) || [];

    for (const fixture of fixtures) {
      const homeTeam = await this.teamService.loadTeam(fixture.home);
      const awayTeam = await this.teamService.loadTeam(fixture.away);

      if (!homeTeam || !awayTeam) continue;

      const homeStats = gameweekStats.get(fixture.home) || [];
      const awayStats = gameweekStats.get(fixture.away) || [];

      const homePoints = await this.calculateTeamGameweekPoints(homeTeam, homeStats);
      const awayPoints = await this.calculateTeamGameweekPoints(awayTeam, awayStats);

      fixture.homeScore = homePoints;
      fixture.awayScore = awayPoints;
      fixture.winner = homePoints > awayPoints ? fixture.home : 
                      awayPoints > homePoints ? fixture.away : 'draw';
      fixture.played = true;
    }

    // Update H2H standings based on wins/losses
    await this.updateH2HStandings(league);
    await this.saveLeague(league);
  }

  async processCupQualification(gameweek: number): Promise<void> {
    const rules = await this.rulesService.loadRules();
    
    if (gameweek !== rules.leagues.cupQualificationWeek) return;

    const globalStandings = await this.getGlobalStandings();
    
    // Sort by gameweek points for qualification
    const qualifiedTeams = globalStandings
      .sort((a, b) => b.gameweekPoints - a.gameweekPoints)
      .slice(0, this.getNearestPowerOfTwo(globalStandings.length))
      .map(s => s.manager);

    await this.createCupDraw(qualifiedTeams, 1);
  }

  async processCupRound(round: number, gameweekStats: Map<string, PlayerGameweekStats[]>): Promise<void> {
    const cupPath = path.join(this.leaguesPath, 'cup', `round-${round}.json`);
    
    try {
      const data = await fs.readFile(cupPath, 'utf-8');
      const cupDraw: CupDraw = JSON.parse(data);
      const winners: string[] = [];
      const eliminated: string[] = [];

      for (const fixture of cupDraw.fixtures) {
        const homeTeam = await this.teamService.loadTeam(fixture.home);
        const awayTeam = await this.teamService.loadTeam(fixture.away);

        if (!homeTeam || !awayTeam) continue;

        const homeStats = gameweekStats.get(fixture.home) || [];
        const awayStats = gameweekStats.get(fixture.away) || [];

        const homePoints = await this.calculateTeamGameweekPoints(homeTeam, homeStats);
        const awayPoints = await this.calculateTeamGameweekPoints(awayTeam, awayStats);

        fixture.homeScore = homePoints;
        fixture.awayScore = awayPoints;
        fixture.played = true;

        // Determine winner (away goals rule for ties)
        if (homePoints > awayPoints) {
          winners.push(fixture.home);
          eliminated.push(fixture.away);
        } else if (awayPoints > homePoints) {
          winners.push(fixture.away);
          eliminated.push(fixture.home);
        } else {
          // Tie - use total points as tiebreaker
          const homeTotal = await this.calculateTotalPoints(fixture.home, 38);
          const awayTotal = await this.calculateTotalPoints(fixture.away, 38);
          
          if (homeTotal >= awayTotal) {
            winners.push(fixture.home);
            eliminated.push(fixture.away);
          } else {
            winners.push(fixture.away);
            eliminated.push(fixture.home);
          }
        }
      }

      cupDraw.eliminated = eliminated;
      await fs.writeFile(cupPath, JSON.stringify(cupDraw, null, 2));

      // Create next round if there are winners
      if (winners.length > 1) {
        await this.createCupDraw(winners, round + 1);
      } else if (winners.length === 1) {
        // Cup winner!
        await this.recordCupWinner(winners[0]);
      }
    } catch {
      // No cup draw for this round
    }
  }

  private generateH2HFixtures(members: string[]): HeadToHeadFixture[] {
    const fixtures: HeadToHeadFixture[] = [];
    const gameweeks = 38;
    
    // Simple round-robin for now
    for (let gw = 1; gw <= gameweeks; gw++) {
      for (let i = 0; i < members.length; i += 2) {
        if (members[i + 1]) {
          fixtures.push({
            gameweek: gw,
            home: members[i],
            away: members[i + 1],
            played: false
          });
        }
      }
    }
    
    return fixtures;
  }

  private async updateH2HStandings(league: League): Promise<void> {
    const records: Map<string, { wins: number; draws: number; losses: number; points: number }> = new Map();
    
    // Initialize records
    league.members.forEach(member => {
      records.set(member, { wins: 0, draws: 0, losses: 0, points: 0 });
    });

    // Calculate records from fixtures
    league.fixtures?.filter(f => f.played).forEach(fixture => {
      const homeRecord = records.get(fixture.home)!;
      const awayRecord = records.get(fixture.away)!;
      
      if (fixture.winner === fixture.home) {
        homeRecord.wins++;
        homeRecord.points += 3;
        awayRecord.losses++;
      } else if (fixture.winner === fixture.away) {
        awayRecord.wins++;
        awayRecord.points += 3;
        homeRecord.losses++;
      } else {
        homeRecord.draws++;
        awayRecord.draws++;
        homeRecord.points++;
        awayRecord.points++;
      }
    });

    // Update standings based on H2H points
    const standings: LeagueStanding[] = [];
    
    for (const member of league.members) {
      const team = await this.teamService.loadTeam(member);
      const record = records.get(member)!;
      
      if (team) {
        standings.push({
          rank: 0,
          previousRank: this.getPreviousRank(league.standings, member),
          teamName: team.manager.teamName,
          manager: member,
          gameweekPoints: 0, // Not used in H2H
          totalPoints: record.points,
          gameweeksPlayed: record.wins + record.draws + record.losses,
          transfers: 0,
          chipsUsed: 0,
          teamValue: 0
        });
      }
    }

    standings.sort((a, b) => b.totalPoints - a.totalPoints);
    standings.forEach((standing, index) => {
      standing.rank = index + 1;
    });

    league.standings = standings;
  }

  private async calculateTeamGameweekPoints(
    team: Team,
    stats: PlayerGameweekStats[]
  ): Promise<number> {
    const allPlayers = [
      ...team.squad.goalkeepers,
      ...team.squad.defenders,
      ...team.squad.midfielders,
      ...team.squad.forwards
    ];

    const result = await this.scoringService.calculateTeamGameweekPoints(
      allPlayers,
      stats,
      team.captain,
      team.viceCaptain,
      team.startingXI,
      team.bench
    );

    return result.totalPoints;
  }

  private async calculateTotalPoints(username: string, upToGameweek: number): Promise<number> {
    let total = 0;
    
    for (let gw = 1; gw <= upToGameweek; gw++) {
      const history = await this.teamService.getGameweekHistory(username, gw);
      if (history?.points) {
        total += history.points;
      }
    }

    // Deduct transfer costs
    const team = await this.teamService.loadTeam(username);
    if (team?.transfers?.cost) {
      total -= team.transfers.cost;
    }

    return total;
  }

  private countChipsUsed(team: Team): number {
    if (!team.chips) return 0;
    return Object.values(team.chips).filter(used => used === true).length;
  }

  private calculateTeamValue(team: Team): number {
    const allPlayers = [
      ...team.squad.goalkeepers,
      ...team.squad.defenders,
      ...team.squad.midfielders,
      ...team.squad.forwards
    ];
    
    return allPlayers.reduce((sum, player) => sum + player.price, 0);
  }

  private getPreviousRank(standings: LeagueStanding[], username: string): number {
    const standing = standings.find(s => s.manager === username);
    return standing?.rank || 0;
  }

  private getNearestPowerOfTwo(n: number): number {
    let power = 1;
    while (power < n) {
      power *= 2;
    }
    return power / 2;
  }

  private async createCupDraw(teams: string[], round: number): Promise<void> {
    const fixtures: HeadToHeadFixture[] = [];
    const shuffled = [...teams].sort(() => Math.random() - 0.5);

    for (let i = 0; i < shuffled.length; i += 2) {
      if (shuffled[i + 1]) {
        fixtures.push({
          gameweek: 17 + round - 1,
          home: shuffled[i],
          away: shuffled[i + 1],
          played: false
        });
      }
    }

    const cupDraw: CupDraw = {
      round,
      fixtures,
      qualified: teams,
      eliminated: []
    };

    const cupPath = path.join(this.leaguesPath, 'cup', `round-${round}.json`);
    await fs.mkdir(path.dirname(cupPath), { recursive: true });
    await fs.writeFile(cupPath, JSON.stringify(cupDraw, null, 2));
  }

  private async recordCupWinner(winner: string): Promise<void> {
    const winnerPath = path.join(this.leaguesPath, 'cup', 'winner.json');
    await fs.writeFile(winnerPath, JSON.stringify({
      winner,
      date: new Date().toISOString()
    }, null, 2));
  }

  private generateLeagueId(): string {
    return `league-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateJoinCode(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  private async loadLeague(leagueId: string): Promise<League | null> {
    try {
      const leaguePath = path.join(this.leaguesPath, `${leagueId}.json`);
      const data = await fs.readFile(leaguePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  private async saveLeague(league: League): Promise<void> {
    const leaguePath = path.join(this.leaguesPath, `${league.id}.json`);
    await fs.mkdir(this.leaguesPath, { recursive: true });
    await fs.writeFile(leaguePath, JSON.stringify(league, null, 2));
  }
}
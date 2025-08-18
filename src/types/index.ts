// Command option types
export interface BaseCommandOptions {
  quiet?: boolean;
  verbose?: boolean;
  json?: boolean;
  debug?: boolean;
}

export interface StatusCommandOptions extends BaseCommandOptions {
  gameweek?: number;
  league?: string;
  detailed?: boolean;
  compact?: boolean;
}

export interface TransferCommandOptions extends BaseCommandOptions {
  out?: string;
  in?: string;
  gameweek?: number;
  plan?: boolean;
  chip?: string;
  batch?: string;
}

export interface CreateTeamCommandOptions extends BaseCommandOptions {
  template?: string;
  import?: string;
  random?: boolean;
  budget?: string;
}

export interface ValidateCommandOptions extends BaseCommandOptions {
  fix?: boolean;
  file?: string;
}

export interface DeadlineCommandOptions extends BaseCommandOptions {
  gameweek?: number;
  all?: boolean;
  fixtures?: boolean;
}

export interface CaptainCommandOptions extends BaseCommandOptions {
  set?: string;
  vice?: string;
  suggest?: boolean;
  popular?: boolean;
}

export interface ChipCommandOptions extends BaseCommandOptions {
  check?: boolean;
}

export interface SimulateCommandOptions extends BaseCommandOptions {
  captain?: string;
  formation?: string;
  transfers?: boolean;
  monteCarlo?: boolean;
}

export interface LeagueCommandOptions extends BaseCommandOptions {
  name?: string;
  type?: string;
}

export interface HistoryCommandOptions extends BaseCommandOptions {
  gameweek?: number;
  season?: boolean;
  export?: boolean;
  format?: string;
}

export interface SyncCommandOptions extends BaseCommandOptions {
  title?: string;
  description?: string;
}

export interface InitCommandOptions extends BaseCommandOptions {
  githubUser?: string;
  teamName?: string;
  force?: boolean;
}

// Data structure types
export interface Player {
  id: string;
  name: string;
  team: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  price: number;
  purchasePrice?: number;
  purchaseDate?: string;
  points?: number;
  status?: 'available' | 'injured' | 'suspended' | 'doubtful' | 'unavailable';
}

export interface Transfer {
  out: Player;
  in: Player;
}

export interface Standing {
  rank: number;
  rankChange: number;
  teamName: string;
  manager: string;
  gameweekPoints?: number;
  totalPoints?: number;
}

export interface Fixture {
  kickoff: Date | string;
  homeTeam: string;
  awayTeam: string;
  finished: boolean;
  homeScore?: number;
  awayScore?: number;
}

export interface ChipStatus {
  wildcard1: boolean;
  wildcard2: boolean;
  freeHit: boolean;
  tripleCaptain: boolean;
  benchBoost: boolean;
  mystery?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  info: {
    budget: {
      spent: number;
      remaining: number;
    };
    squad: {
      valid: boolean;
      composition: Record<string, number>;
    };
    formation?: string;
  };
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
  value?: unknown;
  fix?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  suggestion?: string;
}
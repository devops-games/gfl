# API Documentation

Complete API reference for the Fantasy Football League data structures, validation rules, and external integrations.

## Table of Contents
1. [Data Schemas](#data-schemas)
2. [Validation API](#validation-api)
3. [Scoring API](#scoring-api)
4. [External APIs](#external-apis)
5. [GitHub Actions API](#github-actions-api)
6. [CLI API](#cli-api)
7. [Error Codes](#error-codes)

---

## Data Schemas

### Team Schema

#### Complete Team Object
```typescript
interface Team {
  manager: Manager;
  squad: Squad;
  formation: Formation;
  startingXI: string[];
  bench: string[];
  captain: string;
  viceCaptain: string;
  budget: Budget;
  transfers?: TransferInfo;
  chips?: ChipStatus;
  metadata: Metadata;
}

interface Manager {
  github: string;        // GitHub username
  teamName: string;      // 3-50 characters
  email?: string;        // Optional email
  joined: string;        // ISO 8601 date
  favoriteTeam?: string; // Optional PL team code
}

interface Squad {
  goalkeepers: Player[]; // Exactly 2
  defenders: Player[];   // Exactly 5
  midfielders: Player[]; // Exactly 5
  forwards: Player[];    // Exactly 3
}

interface Player {
  id: string;           // Format: "player_XXX"
  name: string;
  team: string;         // 3-letter team code
  position: Position;   // GK | DEF | MID | FWD
  price: number;        // Current price
  purchasePrice?: number;
  purchaseDate?: string;
}

type Formation = "4-4-2" | "4-3-3" | "3-5-2" | "3-4-3" | "5-4-1" | "5-3-2" | "4-5-1";

interface Budget {
  total: number;        // Always 100.0 initially
  spent: number;        // Amount spent
  remaining: number;    // Amount remaining
}

interface TransferInfo {
  free: number;         // Free transfers available (0-5)
  made: number;         // Transfers made this GW
  cost: number;         // Point cost for extra transfers
}

interface ChipStatus {
  wildcard1: boolean;
  wildcard2: boolean;
  freeHit: boolean;
  tripleCaptain: boolean;
  benchBoost: boolean;
  mystery: boolean;
}

interface Metadata {
  created: string;      // ISO 8601
  lastModified: string; // ISO 8601
  gameweekLocked?: number | null;
  version: string;      // Schema version
}
```

#### Example Team JSON
```json
{
  "manager": {
    "github": "octocat",
    "teamName": "Octocat United FC",
    "email": "octocat@github.com",
    "joined": "2024-08-01T10:00:00Z",
    "favoriteTeam": "ARS"
  },
  "squad": {
    "goalkeepers": [
      {
        "id": "player_001",
        "name": "Alisson",
        "team": "LIV",
        "position": "GK",
        "price": 5.5,
        "purchasePrice": 5.5,
        "purchaseDate": "2024-08-01T10:00:00Z"
      },
      {
        "id": "player_002",
        "name": "Ramsdale",
        "team": "ARS",
        "position": "GK",
        "price": 4.5
      }
    ],
    "defenders": [/* 5 defenders */],
    "midfielders": [/* 5 midfielders */],
    "forwards": [/* 3 forwards */]
  },
  "formation": "4-4-2",
  "startingXI": [
    "player_001", "player_003", "player_004", "player_005", "player_006",
    "player_008", "player_009", "player_010", "player_011", "player_013", "player_014"
  ],
  "bench": ["player_002", "player_007", "player_012", "player_015"],
  "captain": "player_010",
  "viceCaptain": "player_013",
  "budget": {
    "total": 100.0,
    "spent": 99.5,
    "remaining": 0.5
  },
  "transfers": {
    "free": 1,
    "made": 0,
    "cost": 0
  },
  "chips": {
    "wildcard1": false,
    "wildcard2": false,
    "freeHit": false,
    "tripleCaptain": false,
    "benchBoost": false,
    "mystery": false
  },
  "metadata": {
    "created": "2024-08-01T10:00:00Z",
    "lastModified": "2024-08-15T14:30:00Z",
    "gameweekLocked": null,
    "version": "1.0.0"
  }
}
```

### Player Schema

#### Player Database Entry
```typescript
interface PlayerData {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  team: string;
  teamId: number;
  position: Position;
  price: number;
  priceHistory: PricePoint[];
  status: PlayerStatus;
  injuryNews?: string;
  chanceOfPlaying?: number;
  stats: PlayerStats;
  ownership: OwnershipData;
  fixtures: Fixture[];
}

interface PricePoint {
  gameweek: number;
  price: number;
  date: string;
}

type PlayerStatus = "available" | "injured" | "suspended" | "unavailable";

interface PlayerStats {
  season: SeasonStats;
  form: number;         // Last 5 gameweeks average
  ppg: number;          // Points per game
  ict: ICTIndex;
}

interface SeasonStats {
  points: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  bonus: number;
  minutes: number;
  saves?: number;       // GK only
  penaltiesSaved?: number; // GK only
  penaltiesMissed?: number;
}

interface ICTIndex {
  influence: number;
  creativity: number;
  threat: number;
  index: number;        // Combined score
}

interface OwnershipData {
  overall: number;      // Percentage
  top10k: number;       // Top 10k ownership
  movement: number;     // Change this GW
}
```

### Transfer Schema

#### Transfer Record
```typescript
interface TransferRecord {
  gameweek: number;
  timestamp: string;
  transfers: Transfer[];
  summary: TransferSummary;
}

interface Transfer {
  out: TransferPlayer;
  in: TransferPlayer;
  profit?: number;
}

interface TransferPlayer {
  id: string;
  name: string;
  team: string;
  position: Position;
  price: number;
  soldPrice?: number;    // For 'out' player
  purchasePrice?: number; // Original purchase price
}

interface TransferSummary {
  transfersMade: number;
  freeTransfersUsed: number;
  pointsDeduction: number;
  budgetBefore: number;
  budgetAfter: number;
  teamValueBefore: number;
  teamValueAfter: number;
}
```

### Gameweek Schema

#### Gameweek History
```typescript
interface GameweekHistory {
  gameweek: number;
  points: PointsBreakdown;
  captain: CaptainData;
  viceCaptain: ViceCaptainData;
  chips: ChipUsage;
  formation: Formation;
  squad: GameweekSquad;
  ranks: Rankings;
  teamValue: number;
  bank: number;
  transfers: TransferActivity;
}

interface PointsBreakdown {
  starting: number;
  bench: number;
  total: number;
  hits: number;         // Transfer cost
  net: number;          // Total - hits
}

interface CaptainData {
  player: string;
  playerId: string;
  points: number;
  multiplied: number;   // After 2x/3x
}

interface GameweekSquad {
  starting: string[];
  bench: string[];
  autoSubs: AutoSub[];
}

interface AutoSub {
  out: string;
  in: string;
  points: number;
}

interface Rankings {
  overall: number;
  overallChange: number;
  gameweek: number;
  leagues: LeagueRank[];
}
```

### League Schema

#### League Configuration
```typescript
interface League {
  id: string;
  name: string;
  code: string;          // 6-character join code
  type: LeagueType;
  scoring: ScoringType;
  creator: string;       // GitHub username
  created: string;
  settings: LeagueSettings;
  members: LeagueMember[];
  standings: Standings[];
}

type LeagueType = "classic" | "h2h" | "draft";
type ScoringType = "standard" | "custom";

interface LeagueSettings {
  maxTeams: number;
  startGameweek: number;
  endGameweek?: number;
  isPublic: boolean;
  requiresApproval: boolean;
  customRules?: CustomRules;
}

interface LeagueMember {
  github: string;
  teamName: string;
  joined: string;
  role: "admin" | "member";
  active: boolean;
}

interface Standings {
  gameweek: number;
  entries: StandingEntry[];
}

interface StandingEntry {
  rank: number;
  rankChange: number;
  github: string;
  teamName: string;
  points: number;
  totalPoints: number;
}
```

---

## Validation API

### Validation Engine

#### Main Validation Function
```javascript
/**
 * Validate a team against all FPL rules
 * @param {Object} team - Team object to validate
 * @param {Object} context - Validation context
 * @returns {ValidationResult}
 */
function validateTeam(team, context = {}) {
  const result = {
    valid: true,
    errors: [],
    warnings: [],
    info: {}
  };
  
  // Run all validators
  validators.forEach(validator => {
    const validatorResult = validator.validate(team, context);
    if (validatorResult.errors) {
      result.errors.push(...validatorResult.errors);
      result.valid = false;
    }
    if (validatorResult.warnings) {
      result.warnings.push(...validatorResult.warnings);
    }
  });
  
  return result;
}
```

#### Validation Result Structure
```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  info: ValidationInfo;
}

interface ValidationError {
  code: string;
  message: string;
  field?: string;
  value?: any;
  fix?: string;
}

interface ValidationWarning {
  code: string;
  message: string;
  suggestion?: string;
}

interface ValidationInfo {
  budget: {
    spent: number;
    remaining: number;
  };
  squad: {
    valid: boolean;
    composition: Record<Position, number>;
  };
  transfers?: {
    free: number;
    used: number;
    cost: number;
  };
}
```

### Validation Rules

#### Budget Validation
```javascript
const budgetValidator = {
  name: 'budget',
  validate: (team) => {
    const total = calculateTeamValue(team.squad);
    
    if (total > 100.0) {
      return {
        errors: [{
          code: 'BUDGET_EXCEEDED',
          message: `Budget exceeded: £${total}m > £100m`,
          field: 'squad',
          value: total,
          fix: `Remove players worth £${(total - 100).toFixed(1)}m`
        }]
      };
    }
    
    return { valid: true };
  }
};
```

#### Squad Composition Validation
```javascript
const squadValidator = {
  name: 'squad',
  validate: (team) => {
    const errors = [];
    const required = { GK: 2, DEF: 5, MID: 5, FWD: 3 };
    
    Object.entries(required).forEach(([position, count]) => {
      const actual = team.squad[position.toLowerCase() + 's']?.length || 0;
      if (actual !== count) {
        errors.push({
          code: 'INVALID_SQUAD_COMPOSITION',
          message: `${position}: ${actual} players (need ${count})`,
          field: `squad.${position.toLowerCase()}s`,
          value: actual
        });
      }
    });
    
    return errors.length > 0 ? { errors } : { valid: true };
  }
};
```

---

## Scoring API

### Points Calculation

#### Calculate Player Points
```javascript
/**
 * Calculate points for a player in a match
 * @param {Player} player - Player object
 * @param {MatchData} matchData - Match performance data
 * @returns {number} Points scored
 */
function calculatePlayerPoints(player, matchData) {
  let points = 0;
  
  // Base points by position
  const scoring = SCORING_RULES[player.position];
  
  // Goals
  points += matchData.goals * scoring.goals;
  
  // Assists
  points += matchData.assists * SCORING_RULES.assists;
  
  // Clean sheets
  if (matchData.cleanSheet) {
    points += scoring.cleanSheet;
  }
  
  // Minutes played
  if (matchData.minutes >= 60) {
    points += 2;
  } else if (matchData.minutes > 0) {
    points += 1;
  }
  
  // Cards
  points -= matchData.yellowCards * 1;
  points -= matchData.redCards * 3;
  
  // Special events
  points -= matchData.ownGoals * 2;
  points -= matchData.penaltiesMissed * 2;
  
  // Position-specific
  if (player.position === 'GK') {
    points += matchData.penaltiesSaved * 5;
    points += Math.floor(matchData.saves / 3);
  }
  
  // Defensive bonus (NEW)
  if (matchData.defensiveActions >= scoring.defensiveThreshold) {
    points += 2;
  }
  
  return points;
}
```

#### Scoring Rules Configuration
```javascript
const SCORING_RULES = {
  GK: {
    goals: 10,
    cleanSheet: 4,
    defensiveThreshold: null
  },
  DEF: {
    goals: 6,
    cleanSheet: 4,
    defensiveThreshold: 10
  },
  MID: {
    goals: 5,
    cleanSheet: 1,
    defensiveThreshold: 12
  },
  FWD: {
    goals: 4,
    cleanSheet: 0,
    defensiveThreshold: 12
  },
  assists: 3
};
```

---

## External APIs

### Fantasy Premier League API

#### Base Endpoints
```javascript
const FPL_API = {
  base: 'https://fantasy.premierleague.com/api',
  endpoints: {
    bootstrap: '/bootstrap-static/',     // General data
    fixtures: '/fixtures/',              // All fixtures
    gameweek: '/event/{id}/live/',      // Live GW data
    player: '/element-summary/{id}/',    // Player details
    teams: '/teams/',                    // PL teams
    transfers: '/transfers/',            // Transfer data
  }
};
```

#### Fetch Players Example
```javascript
async function fetchPlayers() {
  const response = await fetch(`${FPL_API.base}${FPL_API.endpoints.bootstrap}`);
  const data = await response.json();
  
  return data.elements.map(player => ({
    id: `player_${player.id}`,
    name: player.web_name,
    firstName: player.first_name,
    lastName: player.second_name,
    team: getTeamCode(player.team),
    position: getPosition(player.element_type),
    price: player.now_cost / 10,
    points: player.total_points,
    form: parseFloat(player.form),
    ownership: parseFloat(player.selected_by_percent),
    status: getStatus(player.status),
    chanceOfPlaying: player.chance_of_playing_next_round
  }));
}
```

### Match Data Integration

#### Fetch Live Gameweek Data
```javascript
async function fetchGameweekData(gameweek) {
  const url = `${FPL_API.base}/event/${gameweek}/live/`;
  const response = await fetch(url);
  const data = await response.json();
  
  return {
    gameweek: gameweek,
    elements: data.elements.map(element => ({
      id: element.id,
      stats: element.stats,
      points: element.total_points
    }))
  };
}
```

---

## GitHub Actions API

### Workflow Triggers

#### Pull Request Validation
```yaml
name: Validate Team Changes

on:
  pull_request:
    paths:
      - 'teams/**'
    types: [opened, synchronize, reopened]

env:
  NODE_VERSION: '18'

jobs:
  validate:
    runs-on: ubuntu-latest
    outputs:
      valid: ${{ steps.validation.outputs.valid }}
      errors: ${{ steps.validation.outputs.errors }}
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate Team
        id: validation
        run: |
          result=$(node scripts/validate-team.js \
            --user ${{ github.event.pull_request.user.login }} \
            --files "${{ steps.changed-files.outputs.all_changed_files }}")
          
          echo "valid=$(echo $result | jq -r '.valid')" >> $GITHUB_OUTPUT
          echo "errors=$(echo $result | jq -c '.errors')" >> $GITHUB_OUTPUT
```

### GitHub API Integration

#### Post PR Comment
```javascript
async function postPRComment(prNumber, comment) {
  const { Octokit } = require('@octokit/rest');
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
  
  await octokit.issues.createComment({
    owner: 'devops-games',
    repo: 'fantasy-football',
    issue_number: prNumber,
    body: comment
  });
}
```

#### Update PR Status
```javascript
async function updatePRStatus(sha, state, description) {
  await octokit.repos.createCommitStatus({
    owner: 'devops-games',
    repo: 'fantasy-football',
    sha: sha,
    state: state, // 'success' | 'failure' | 'pending'
    description: description,
    context: 'FFL Validation'
  });
}
```

---

## CLI API

### Command Structure

#### Command Registration
```javascript
// cli/commands/transfer.js
module.exports = {
  command: 'transfer',
  aliases: ['t', 'xfer'],
  description: 'Make player transfers',
  options: [
    {
      flag: '-o, --out <player>',
      description: 'Player to transfer out'
    },
    {
      flag: '-i, --in <player>',
      description: 'Player to transfer in'
    }
  ],
  action: async (options) => {
    // Command implementation
  }
};
```

#### CLI Configuration
```javascript
// cli/config.js
module.exports = {
  version: '1.0.0',
  name: 'ffl',
  description: 'Fantasy Football League CLI',
  defaults: {
    timezone: 'Europe/London',
    colorOutput: true,
    confirmTransfers: true
  }
};
```

---

## Error Codes

### Validation Errors

| Code | Description | Fix |
|------|-------------|-----|
| `BUDGET_EXCEEDED` | Team cost exceeds £100m | Remove expensive players |
| `INVALID_SQUAD_COMPOSITION` | Wrong number of players by position | Adjust squad to 2-5-5-3 |
| `TEAM_LIMIT_EXCEEDED` | More than 3 players from same club | Replace players from overrepresented team |
| `INVALID_FORMATION` | Formation doesn't meet minimums | Change to valid formation |
| `CAPTAIN_NOT_IN_XI` | Captain not in starting lineup | Select captain from starting XI |
| `DUPLICATE_PLAYER` | Same player selected twice | Remove duplicate |
| `DEADLINE_PASSED` | Submission after deadline | Wait for next gameweek |
| `INVALID_CHIP` | Chip not available or already used | Check chip availability |
| `TRANSFER_LIMIT_EXCEEDED` | More than 20 transfers in gameweek | Reduce number of transfers |
| `INSUFFICIENT_FUNDS` | Not enough budget for transfer | Choose cheaper replacement |

### System Errors

| Code | Description | Resolution |
|------|-------------|------------|
| `GITHUB_AUTH_FAILED` | GitHub authentication failed | Check token/credentials |
| `API_RATE_LIMIT` | API rate limit exceeded | Wait and retry |
| `NETWORK_ERROR` | Network request failed | Check connection |
| `FILE_NOT_FOUND` | Required file missing | Verify file exists |
| `INVALID_JSON` | JSON parsing failed | Fix JSON syntax |
| `PERMISSION_DENIED` | Insufficient permissions | Check file/repo permissions |
| `VALIDATION_TIMEOUT` | Validation took too long | Retry or contact support |

### Warning Codes

| Code | Description |
|------|-------------|
| `LOW_BUDGET` | Less than £1m remaining |
| `NO_FREE_TRANSFERS` | All free transfers used |
| `CHIP_AVAILABLE` | Reminder about unused chips |
| `PRICE_FALLING` | Player price likely to fall |
| `INJURY_RISK` | Player has injury concern |

---

## Rate Limits

### API Rate Limits

| Service | Limit | Window |
|---------|-------|--------|
| FPL API | 100 requests | 1 minute |
| GitHub API | 5000 requests | 1 hour |
| CLI Operations | Unlimited | - |
| Validation | 10 per PR | - |

### Rate Limit Headers
```javascript
// Check rate limit status
function checkRateLimit(headers) {
  return {
    limit: headers['x-ratelimit-limit'],
    remaining: headers['x-ratelimit-remaining'],
    reset: new Date(headers['x-ratelimit-reset'] * 1000)
  };
}
```

---

## Webhooks

### Webhook Events

```javascript
// Webhook payload structure
interface WebhookPayload {
  event: string;
  timestamp: string;
  data: {
    user: string;
    team: string;
    gameweek?: number;
    action: string;
    details: any;
  };
}

// Example webhook handler
app.post('/webhook', (req, res) => {
  const { event, data } = req.body;
  
  switch(event) {
    case 'team.created':
      handleTeamCreation(data);
      break;
    case 'transfer.completed':
      handleTransfer(data);
      break;
    case 'gameweek.calculated':
      handleGameweekResults(data);
      break;
  }
  
  res.status(200).send('OK');
});
```

---

*Version: 1.0.0*  
*Last Updated: January 2025*
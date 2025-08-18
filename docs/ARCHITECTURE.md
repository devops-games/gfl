# Git-Based Fantasy Football League - Technical Architecture

## Overview

This document describes the technical architecture of the world's first git-based Fantasy Football League, where team management happens through pull requests and scoring occurs via GitHub Actions.

## System Architecture

### Core Concept
```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Player Forks   │────▶│ Pull Request │────▶│  Main Repo      │
│  (Team Data)    │     │  (Changes)   │     │  (League State) │
└─────────────────┘     └──────────────┘     └─────────────────┘
         │                      │                      │
         │                      ▼                      ▼
         │              ┌──────────────┐     ┌─────────────────┐
         └─────────────▶│GitHub Actions│────▶│ Validated State │
                        │ (Validation) │     │   (Scoring)     │
                        └──────────────┘     └─────────────────┘
```

## Repository Structure

```
fantasy-football-league/
├── .github/
│   ├── workflows/
│   │   ├── validate-team.yml          # Team validation on PR
│   │   ├── calculate-gameweek.yml     # Weekly scoring automation
│   │   ├── update-prices.yml          # Player price updates
│   │   ├── process-transfers.yml      # Transfer validation
│   │   └── enforce-deadline.yml       # Deadline enforcement
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug-report.md
│   │   ├── feature-request.md
│   │   └── create-league.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS                     # Protected files
│
├── data/
│   ├── players/
│   │   ├── players.json               # Master player database
│   │   ├── prices.json                # Current player prices
│   │   └── stats/
│   │       └── gameweek-{n}.json      # Historical stats
│   ├── fixtures/
│   │   ├── fixtures.json              # Season fixtures
│   │   └── results.json               # Match results
│   └── rules/
│       ├── rules.yaml                 # Game rules configuration
│       └── scoring.yaml               # Scoring system config
│
├── teams/
│   ├── {github-username}/
│   │   ├── team.json                  # Current team
│   │   ├── transfers/
│   │   │   └── gameweek-{n}.json      # Transfer history
│   │   ├── chips/
│   │   │   └── used-chips.json        # Chip usage tracking
│   │   └── history/
│   │       └── gameweek-{n}.json      # Points history
│   └── README.md                      # Team registration guide
│
├── leagues/
│   ├── global/
│   │   ├── standings.json             # Overall standings
│   │   └── gameweek-{n}.json          # GW standings
│   └── private/
│       └── {league-name}/
│           ├── config.yaml            # League settings
│           ├── members.json           # Member list
│           └── standings.json         # League standings
│
├── scripts/
│   ├── validate-team.js               # Team validation logic
│   ├── calculate-points.js            # Points calculation
│   ├── process-transfers.js           # Transfer processing
│   ├── update-standings.js            # League standings update
│   ├── fetch-match-data.js            # External API integration
│   └── generate-reports.js            # Report generation
│
├── cli/
│   ├── ffl-cli.js                     # Main CLI entry point
│   ├── commands/
│   │   ├── create-team.js
│   │   ├── transfer.js
│   │   ├── status.js
│   │   └── simulate.js
│   └── utils/
│       ├── validation.js
│       └── formatting.js
│
├── server/                             # Optional local web UI
│   ├── index.js
│   └── public/
│       ├── index.html
│       └── assets/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
│   ├── API.md
│   ├── CONTRIBUTING.md
│   └── FAQ.md
│
├── package.json
├── package-lock.json
├── .gitignore
├── LICENSE
└── README.md
```

## Data Structures

### Formats

Data will be stored in a couple of different ways:

#### JSON
- Player databases
- Team data and history
- League standings and statistics
- Gameweek results and points
- When complex objects and nested data need to be represented
- Not expected to be edited by humans often

#### YAML
- Configuration files
- Application state
- Game rules and scoring systems
- League settings
- When humans are expected to edit it more frequently

## Data Schemas

### Team Data Structure

```json
{
  "manager": {
    "github": "username",
    "teamName": "Code Warriors FC",
    "email": "user@example.com",
    "joined": "2024-08-01T10:00:00Z"
  },
  "squad": {
    "goalkeepers": [
      {
        "id": "player_001",
        "name": "Alisson",
        "team": "LIV",
        "price": 5.5,
        "purchasePrice": 5.5,
        "purchaseDate": "2024-08-01T10:00:00Z"
      }
    ],
    "defenders": [...],
    "midfielders": [...],
    "forwards": [...]
  },
  "formation": "4-4-2",
  "startingXI": ["player_001", "player_003", ...],
  "bench": ["player_002", ...],
  "captain": "player_010",
  "viceCaptain": "player_008",
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

### Player Database Schema

```json
{
  "players": [
    {
      "id": "player_001",
      "firstName": "Mohamed",
      "lastName": "Salah",
      "displayName": "M.Salah",
      "team": "LIV",
      "teamId": 14,
      "position": "MID",
      "price": 12.5,
      "priceHistory": [
        {"gameweek": 1, "price": 13.0},
        {"gameweek": 2, "price": 12.5}
      ],
      "status": "available",
      "injuryNews": null,
      "chanceOfPlaying": 100,
      "stats": {
        "season": {
          "points": 245,
          "goals": 18,
          "assists": 12,
          "cleanSheets": 0,
          "yellowCards": 2,
          "redCards": 0,
          "bonus": 28
        },
        "form": 8.5,
        "ppg": 6.4,
        "ict": {
          "influence": 1200.5,
          "creativity": 980.3,
          "threat": 1450.2,
          "index": 362.0
        }
      },
      "ownership": {
        "overall": 45.2,
        "top10k": 68.5,
        "movement": 2.3
      }
    }
  ]
}
```

### Transfer Record Schema

```json
{
  "gameweek": 5,
  "timestamp": "2024-08-28T18:30:00Z",
  "transfers": [
    {
      "out": {
        "id": "player_050",
        "name": "Sterling",
        "team": "CHE",
        "soldPrice": 10.0,
        "purchasePrice": 10.5
      },
      "in": {
        "id": "player_051",
        "name": "Saka",
        "team": "ARS",
        "boughtPrice": 8.5
      },
      "profit": -0.5
    }
  ],
  "transfersMade": 1,
  "freeTransfersUsed": 1,
  "pointsDeduction": 0,
  "budgetBefore": 1.5,
  "budgetAfter": 3.0,
  "teamValueBefore": 100.5,
  "teamValueAfter": 99.0
}
```

## GitHub Actions Workflows

### Team Validation Workflow

```yaml
name: Validate Team Changes

on:
  pull_request:
    paths:
      - 'teams/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v35
        with:
          files: teams/**
      
      - name: Validate team ownership
        run: |
          node scripts/validate-ownership.js \
            --user ${{ github.event.pull_request.user.login }} \
            --files "${{ steps.changed-files.outputs.all_changed_files }}"
      
      - name: Check deadline
        run: |
          node scripts/check-deadline.js \
            --timestamp ${{ github.event.pull_request.created_at }}
      
      - name: Validate team rules
        run: |
          node scripts/validate-team.js \
            --files "${{ steps.changed-files.outputs.all_changed_files }}"
      
      - name: Validate transfers
        if: contains(steps.changed-files.outputs.all_changed_files, 'transfers/')
        run: |
          node scripts/validate-transfers.js \
            --user ${{ github.event.pull_request.user.login }}
      
      - name: Post validation results
        if: always()
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(
              fs.readFileSync('validation-results.json', 'utf8')
            );
            
            let comment = '## 🏆 Fantasy Football Validation\n\n';
            
            if (results.valid) {
              comment += '✅ **All checks passed!**\n\n';
              comment += '### Summary\n';
              comment += `- Budget: £${results.budget.spent}m / £100m\n`;
              comment += `- Squad: ${results.squad.valid} ✓\n`;
              comment += `- Formation: ${results.formation} ✓\n`;
              comment += `- Deadline: Not exceeded ✓\n`;
              
              if (results.transfers) {
                comment += '\n### Transfers\n';
                comment += `- Free transfers used: ${results.transfers.free}\n`;
                comment += `- Point deduction: ${results.transfers.deduction}\n`;
              }
              
              if (results.chip) {
                comment += `\n### Chip Activated\n`;
                comment += `- ${results.chip} activated for this gameweek\n`;
              }
            } else {
              comment += '❌ **Validation failed**\n\n';
              comment += '### Errors\n';
              results.errors.forEach(error => {
                comment += `- ❌ ${error}\n`;
              });
              comment += '\n### How to fix\n';
              comment += '1. Run `npm run ffl:validate` locally\n';
              comment += '2. Fix the errors listed above\n';
              comment += '3. Commit and push your changes\n';
            }
            
            await github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
      
      - name: Set PR status
        if: failure()
        run: exit 1
```

### Gameweek Calculation Workflow

```yaml
name: Calculate Gameweek Points

on:
  schedule:
    # Run every Tuesday at 2 AM UTC (after Monday matches)
    - cron: '0 2 * * 2'
  workflow_dispatch:
    inputs:
      gameweek:
        description: 'Gameweek to calculate'
        required: false
        type: number

jobs:
  calculate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          token: ${{ secrets.FFL_BOT_TOKEN }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Fetch match data
        run: |
          node scripts/fetch-match-data.js \
            --gameweek ${{ github.event.inputs.gameweek || 'current' }}
        env:
          FPL_API_KEY: ${{ secrets.FPL_API_KEY }}
      
      - name: Calculate points for all teams
        run: |
          node scripts/calculate-points.js \
            --gameweek ${{ github.event.inputs.gameweek || 'current' }}
      
      - name: Process auto-substitutions
        run: |
          node scripts/process-substitutions.js \
            --gameweek ${{ github.event.inputs.gameweek || 'current' }}
      
      - name: Update league standings
        run: |
          node scripts/update-standings.js
      
      - name: Generate gameweek report
        run: |
          node scripts/generate-reports.js \
            --gameweek ${{ github.event.inputs.gameweek || 'current' }}
      
      - name: Commit results
        run: |
          git config --global user.name 'FFL Bot'
          git config --global user.email 'ffl-bot@devops-games.com'
          
          GAMEWEEK=$(cat data/fixtures/current-gameweek.txt)
          
          git add data/players/stats/
          git add teams/*/history/
          git add leagues/
          git add reports/
          
          git commit -m "bot: Calculate gameweek $GAMEWEEK points
          
          - Points calculated for all teams
          - Auto-substitutions processed
          - League standings updated
          - Reports generated
          
          [skip ci]"
          
          git push
      
      - name: Create gameweek summary issue
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const summary = JSON.parse(
              fs.readFileSync('reports/gameweek-summary.json', 'utf8')
            );
            
            const body = fs.readFileSync(
              `reports/gameweek-${summary.gameweek}.md`,
              'utf8'
            );
            
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `📊 Gameweek ${summary.gameweek} Results`,
              body: body,
              labels: ['gameweek-results', 'announcement']
            });
```

## CLI Tool Architecture

### Command Structure

```javascript
// cli/ffl-cli.js
#!/usr/bin/env node

const { program } = require('commander');
const packageJson = require('../package.json');

program
  .version(packageJson.version)
  .description('Fantasy Football League CLI');

// Commands
program
  .command('create-team')
  .description('Create your initial team')
  .option('-i, --interactive', 'Interactive mode (default)', true)
  .option('-f, --file <path>', 'Load team from JSON file')
  .action(require('./commands/create-team'));

program
  .command('transfer')
  .description('Make transfers for upcoming gameweek')
  .option('-g, --gameweek <number>', 'Target gameweek')
  .option('-o, --out <player>', 'Player to transfer out')
  .option('-i, --in <player>', 'Player to transfer in')
  .action(require('./commands/transfer'));

program
  .command('status')
  .description('View team and league status')
  .option('-g, --gameweek <number>', 'Specific gameweek')
  .option('-l, --league <name>', 'Specific league')
  .action(require('./commands/status'));

program
  .command('simulate')
  .description('Simulate points for upcoming gameweek')
  .option('-c, --captain <player>', 'Set captain')
  .option('-v, --verbose', 'Detailed output')
  .action(require('./commands/simulate'));

program
  .command('deadline')
  .description('Show next deadline')
  .action(require('./commands/deadline'));

program
  .command('validate')
  .description('Validate team locally')
  .option('-f, --fix', 'Auto-fix issues where possible')
  .action(require('./commands/validate'));

program.parse(process.argv);
```

### Interactive Team Creation

```javascript
// commands/create-team.js
const inquirer = require('inquirer');
const chalk = require('chalk');
const Table = require('cli-table3');

async function createTeam(options) {
  console.log(chalk.green('⚽ Welcome to Fantasy Football League!'));
  console.log(chalk.gray('Let\'s create your team...\n'));
  
  // Step 1: Team Details
  const teamDetails = await inquirer.prompt([
    {
      type: 'input',
      name: 'teamName',
      message: 'Enter your team name:',
      validate: (input) => {
        if (input.length < 3) return 'Team name must be at least 3 characters';
        if (input.length > 50) return 'Team name must be less than 50 characters';
        return true;
      }
    },
    {
      type: 'list',
      name: 'favoriteTeam',
      message: 'Your favorite Premier League team:',
      choices: getTeamChoices()
    }
  ]);
  
  // Step 2: Squad Selection
  const squad = await selectSquad(options);
  
  // Step 3: Formation & Starting XI
  const formation = await selectFormation(squad);
  
  // Step 4: Captain Selection
  const captains = await selectCaptains(formation.startingXI);
  
  // Step 5: Save Team
  const team = {
    manager: {
      github: getGitHubUsername(),
      teamName: teamDetails.teamName,
      favoriteTeam: teamDetails.favoriteTeam
    },
    squad,
    formation: formation.type,
    startingXI: formation.startingXI,
    bench: formation.bench,
    captain: captains.captain,
    viceCaptain: captains.viceCaptain
  };
  
  await saveTeam(team);
  
  console.log(chalk.green('\n✅ Team created successfully!'));
  displayNextSteps();
}
```

## Validation System

### Validation Rules Engine

```javascript
// scripts/validation/rules.js

class ValidationRules {
  constructor() {
    this.rules = {
      budget: {
        max: 100.0,
        validate: (team) => this.validateBudget(team)
      },
      squad: {
        size: 15,
        composition: {
          GK: 2,
          DEF: 5,
          MID: 5,
          FWD: 3
        },
        validate: (team) => this.validateSquadComposition(team)
      },
      teamLimit: {
        maxPerClub: 3,
        validate: (team) => this.validateTeamLimits(team)
      },
      formation: {
        valid: ['4-4-2', '4-3-3', '3-5-2', '3-4-3', '5-4-1', '5-3-2'],
        minDef: 3,
        minMid: 2,
        minFwd: 1,
        validate: (team) => this.validateFormation(team)
      },
      transfers: {
        maxFree: 5,
        costPerExtra: 4,
        maxPerGameweek: 20,
        validate: (transfers) => this.validateTransfers(transfers)
      },
      chips: {
        available: ['wildcard1', 'wildcard2', 'freeHit', 'tripleCaptain', 'benchBoost'],
        validate: (team, chip) => this.validateChipUsage(team, chip)
      }
    };
  }
  
  validateAll(team) {
    const errors = [];
    
    for (const [category, rule] of Object.entries(this.rules)) {
      const result = rule.validate(team);
      if (!result.valid) {
        errors.push(...result.errors);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  validateBudget(team) {
    const total = this.calculateTeamValue(team.squad);
    
    if (total > this.rules.budget.max) {
      return {
        valid: false,
        errors: [`Budget exceeded: £${total}m > £${this.rules.budget.max}m`]
      };
    }
    
    return { valid: true, errors: [] };
  }
  
  validateSquadComposition(team) {
    const errors = [];
    const positions = this.countPositions(team.squad);
    
    for (const [pos, required] of Object.entries(this.rules.squad.composition)) {
      if (positions[pos] !== required) {
        errors.push(`Invalid ${pos} count: ${positions[pos]} (required: ${required})`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  validateTeamLimits(team) {
    const teamCounts = this.countPlayersPerTeam(team.squad);
    const errors = [];
    
    for (const [teamCode, count] of Object.entries(teamCounts)) {
      if (count > this.rules.teamLimit.maxPerClub) {
        errors.push(`Too many players from ${teamCode}: ${count} > ${this.rules.teamLimit.maxPerClub}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}
```

## Security & Anti-Cheat

### Branch Protection Rules

```yaml
# .github/branch-protection.yml
protection_rules:
  - pattern: main
    required_status_checks:
      strict: true
      contexts:
        - "Validate Team Changes"
        - "Check Deadline"
    enforce_admins: false
    required_pull_request_reviews:
      dismiss_stale_reviews: true
      require_code_owner_reviews: true
    restrictions:
      users: []
      teams: ["maintainers"]
```

### CODEOWNERS File

```
# .github/CODEOWNERS

# Core system files - protected
/.github/workflows/  @devops-games/maintainers
/scripts/           @devops-games/maintainers
/data/players/      @devops-games/maintainers
/data/fixtures/     @devops-games/maintainers
/data/rules/        @devops-games/maintainers

# User teams - owned by respective users
/teams/*/           @$1

# League administration
/leagues/global/    @devops-games/maintainers
/leagues/private/*/  @devops-games/league-admins
```

## Local Development

### Running Locally

```bash
# Install dependencies
npm install

# Set up git hooks
npm run setup:hooks

# Run tests
npm test

# Start local server
npm run dev

# Validate your team
npm run ffl:validate

# Run linting
npm run lint
```

### Environment Variables

```bash
# .env.example
NODE_ENV=development
PORT=3000

# API Keys (optional for local dev)
FPL_API_KEY=your_api_key_here
GITHUB_TOKEN=your_github_token

# Feature Flags
ENABLE_WEB_UI=true
ENABLE_NOTIFICATIONS=false
ENABLE_ANALYTICS=false

# Database (for future use)
DATABASE_URL=sqlite://./local.db
```

## Performance Considerations

### Optimization Strategies

1. **Git Operations**
   - Shallow clones for faster operations
   - Sparse checkout for team-specific operations
   - Git LFS for large data files (if needed)

2. **GitHub Actions**
   - Matrix builds for parallel processing
   - Caching dependencies
   - Conditional workflows to reduce unnecessary runs

3. **Data Management**
   - JSON compression for historical data
   - Incremental updates instead of full rewrites
   - Pagination for large datasets

4. **Scalability**
   - Sharding teams across multiple repos (if needed)
   - CDN for static assets
   - Rate limiting for API calls

## API Integration

### External Data Sources

```javascript
// scripts/api/fpl-client.js

class FPLApiClient {
  constructor(config) {
    this.baseUrl = 'https://fantasy.premierleague.com/api';
    this.headers = {
      'User-Agent': 'FFL-Git-League/1.0'
    };
  }
  
  async getPlayers() {
    const response = await fetch(`${this.baseUrl}/bootstrap-static/`, {
      headers: this.headers
    });
    
    const data = await response.json();
    return this.transformPlayers(data.elements);
  }
  
  async getFixtures(gameweek) {
    const response = await fetch(
      `${this.baseUrl}/fixtures/?event=${gameweek}`,
      { headers: this.headers }
    );
    
    return response.json();
  }
  
  async getLiveGameweek(gameweek) {
    const response = await fetch(
      `${this.baseUrl}/event/${gameweek}/live/`,
      { headers: this.headers }
    );
    
    return response.json();
  }
  
  transformPlayers(fplPlayers) {
    return fplPlayers.map(player => ({
      id: `player_${player.id}`,
      name: player.web_name,
      team: this.getTeamCode(player.team),
      position: this.getPosition(player.element_type),
      price: player.now_cost / 10,
      points: player.total_points,
      form: parseFloat(player.form),
      ownership: parseFloat(player.selected_by_percent)
    }));
  }
}
```

## Testing Strategy

### Test Structure

```javascript
// tests/unit/validation.test.js

describe('Team Validation', () => {
  describe('Budget Validation', () => {
    it('should reject team over budget', () => {
      const team = createTeamWithBudget(101.0);
      const result = validator.validateBudget(team);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Budget exceeded');
    });
    
    it('should accept team within budget', () => {
      const team = createTeamWithBudget(99.5);
      const result = validator.validateBudget(team);
      expect(result.valid).toBe(true);
    });
  });
  
  describe('Squad Composition', () => {
    it('should require exactly 15 players', () => {
      const team = createTeamWithPlayers(14);
      const result = validator.validateSquadSize(team);
      expect(result.valid).toBe(false);
    });
    
    it('should require 2 goalkeepers', () => {
      const team = createTeamWithPositions({ GK: 1 });
      const result = validator.validateSquadComposition(team);
      expect(result.errors).toContain('Invalid GK count');
    });
  });
});
```

## Deployment

### GitHub Pages (Static Site)

```yaml
# .github/workflows/deploy-pages.yml

name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'leagues/**'
      - 'teams/**/history/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Generate static site
        run: |
          node scripts/generate-static-site.js
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Monitoring & Analytics

### Key Metrics

1. **System Health**
   - PR validation success rate
   - Average validation time
   - GitHub Actions runtime
   - API call success rate

2. **Game Metrics**
   - Active teams count
   - Transfers per gameweek
   - Chip usage patterns
   - Average team value

3. **User Engagement**
   - PRs per user
   - Time to first transfer
   - League participation rate
   - CLI usage statistics

## Future Enhancements

### Planned Features

1. **Draft Mode**
   - Auction-style player selection
   - No duplicate players across league

2. **GraphQL API**
   - Real-time subscriptions
   - Custom queries for analytics

3. **Mobile App**
   - React Native client
   - Push notifications
   - Offline support

4. **AI Assistant**
   - Transfer suggestions
   - Captain recommendations
   - Formation optimization

5. **Blockchain Integration**
   - NFT achievements
   - Decentralized scoring verification
   - Token rewards

## Conclusion

This architecture provides a robust, scalable, and truly unique approach to fantasy football. By leveraging git as both the database and interaction mechanism, we create an educational and engaging experience that bridges gaming and professional development.

The system is designed to be:
- **Transparent**: All operations visible in git history
- **Fair**: Automated validation prevents cheating
- **Educational**: Teaches real development workflows
- **Scalable**: Can handle thousands of teams
- **Maintainable**: Clear separation of concerns

This is more than a game - it's a new paradigm for decentralized, developer-first gaming.
# CLI Guide - Fantasy Football League

Complete documentation for the Fantasy Football League command-line interface (CLI).

## Table of Contents
1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Core Commands](#core-commands)
4. [Advanced Commands](#advanced-commands)
5. [Configuration](#configuration)
6. [Examples](#examples)
7. [Troubleshooting](#troubleshooting)

## Installation

### Prerequisites
```bash
# Check Node.js version (requires 18+)
node --version

# Check npm version
npm --version

# Check git version
git --version
```

### Install the CLI
```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/fantasy-football-league.git
cd fantasy-football-league
npm install

# Make CLI globally available (optional)
npm link

# Now you can use 'ffl' from anywhere
ffl status
```

### First Run Setup
```bash
# Initialize configuration
npm run ffl:init

# This will:
# - Create ~/.fflrc configuration file
# - Set up your GitHub username
# - Configure preferences
# - Validate environment
```

## Quick Start

### Essential Commands
```bash
# Create your team (first time)
npm run ffl:create-team

# Check your team status
npm run ffl:status

# Make transfers
npm run ffl:transfer

# View next deadline
npm run ffl:deadline

# Validate team before submitting
npm run ffl:validate
```

## Core Commands

### `ffl create-team`
Create your initial fantasy football team.

#### Usage
```bash
npm run ffl:create-team [options]

# Options:
#   -i, --interactive    Interactive mode (default)
#   -f, --file <path>   Import team from JSON file
#   -t, --template <n>  Use a template team
#   -h, --help          Display help
```

#### Interactive Mode Flow
1. **Welcome Screen**
   - Display rules summary
   - Show budget (£100m)

2. **Team Name**
   - 3-50 characters
   - No profanity check

3. **Player Selection**
   - Position by position
   - Search and filter options
   - Real-time budget tracking
   - Player statistics display

4. **Formation Setup**
   - Choose from valid formations
   - Drag-and-drop interface (if supported)

5. **Captain Selection**
   - Select from starting XI
   - Vice-captain backup

6. **Review and Confirm**
   - Complete team summary
   - Validation check
   - Save options

#### Example
```bash
$ npm run ffl:create-team

⚽ Fantasy Football League - Team Creation
════════════════════════════════════════════

💰 Budget: £100.0m
📋 Squad: 0/15 players

? Enter your team name: Code Warriors FC
? Select team colors: Red and White

Selecting Goalkeepers (0/2)
════════════════════════════════════════════
Search: Ali█

1. Alisson (LIV) - £5.5m - Form: 8.2
2. Alireza Beiranvand (PER) - £4.0m - Form: 3.1

? Select goalkeeper: 1
✓ Added Alisson (£5.5m)
💰 Remaining: £94.5m

[Continue for all positions...]
```

### `ffl transfer`
Make transfers for the upcoming gameweek.

#### Usage
```bash
npm run ffl:transfer [options]

# Options:
#   -o, --out <player>    Player to transfer out
#   -i, --in <player>     Player to transfer in
#   -g, --gameweek <n>    Target gameweek (default: next)
#   -p, --plan            Plan mode (no save)
#   -c, --chip <type>     Use chip (wildcard/freehit)
#   -h, --help            Display help
```

#### Interactive Transfer
```bash
$ npm run ffl:transfer

Current Team - Gameweek 5
════════════════════════════════════════════
💰 Budget: £1.5m
📊 Free Transfers: 2
⚠️  Additional transfers: -4 points each

Your Squad:
┌─────┬──────────────┬──────┬───────┬────────┬──────┐
│ Pos │ Player       │ Team │ Price │ Points │ News │
├─────┼──────────────┼──────┼───────┼────────┼──────┤
│ GK  │ Alisson      │ LIV  │ £5.5m │ 42     │ ✓    │
│ GK  │ Ramsdale     │ ARS  │ £4.5m │ 38     │ ✓    │
│ DEF │ TAA          │ LIV  │ £7.0m │ 51     │ ✓    │
│ DEF │ Saliba       │ ARS  │ £5.0m │ 48     │ ✓    │
│ MID │ Sterling     │ CHE  │ £10.0m│ 28     │ 🤕   │
└─────┴──────────────┴──────┴───────┴────────┴──────┘

? Select player to transfer out: Sterling (Injured)
? Search for replacement: Saka

Available Players:
1. Saka (ARS) - £8.5m - Form: 9.1 - Next: FUL (H)
2. Sakamoto (COV) - £5.0m - Form: 4.2 - Next: LEI (A)

? Select player: 1

Transfer Summary:
OUT: Sterling (£10.0m) → IN: Saka (£8.5m)
Profit: £1.5m
New Budget: £3.0m
Free Transfers Used: 1/2

? Confirm transfer? Yes
✓ Transfer complete!
```

#### Quick Transfer
```bash
# Direct transfer with names
npm run ffl:transfer --out "Sterling" --in "Saka"

# Using player IDs
npm run ffl:transfer --out player_123 --in player_456
```

### `ffl status`
View your team status and league position.

#### Usage
```bash
npm run ffl:status [options]

# Options:
#   -g, --gameweek <n>    Specific gameweek (default: current)
#   -l, --league <name>   Specific league (default: global)
#   -d, --detailed        Show detailed statistics
#   -h, --help            Display help
```

#### Example Output
```bash
$ npm run ffl:status

Team: Code Warriors FC
════════════════════════════════════════════
Owner: @username
Created: August 1, 2024
Team Value: £100.5m
Bank: £0.5m

Gameweek 5 Performance
════════════════════════════════════════════
Points: 72 (↑ from 65)
Captain: Haaland (C) - 14 pts (28 doubled)
Chips Active: None
Transfers Made: 1 (-0 pts)

League Positions
════════════════════════════════════════════
Overall: 125,432 / 8,234,521 (Top 2%)
Gameweek: 89,234 / 8,234,521

Mini-Leagues:
1. DevOps Champions: 3rd / 20 (↑2)
2. Work League: 1st / 15 (→)
3. Friends League: 5th / 8 (↓1)

Next Deadline
════════════════════════════════════════════
Gameweek 6: Friday, Sept 15, 7:00 PM
Time Remaining: 2 days, 4 hours, 32 minutes
```

### `ffl deadline`
Show upcoming deadlines and fixture information.

#### Usage
```bash
npm run ffl:deadline [options]

# Options:
#   -g, --gameweek <n>    Specific gameweek
#   -a, --all             Show all future deadlines
#   -f, --fixtures        Include fixtures
#   -h, --help            Display help
```

#### Example Output
```bash
$ npm run ffl:deadline --fixtures

Next Deadline - Gameweek 6
════════════════════════════════════════════
📅 Friday, September 15, 2024
⏰ 7:00 PM BST (6:00 PM UTC)
⏳ 2 days, 4 hours, 32 minutes remaining

Fixtures:
Fri 20:00  Luton vs Everton
Sat 12:30  Fulham vs Manchester United
Sat 15:00  Liverpool vs Wolves
Sat 15:00  Tottenham vs Sheffield United
Sat 17:30  Manchester City vs Arsenal
Sun 14:00  Chelsea vs Bournemouth
Sun 16:30  Newcastle vs Brentford

Your Players' Fixtures:
✓ Alisson: vs Wolves (H) - FDR: 2 🟢
✓ TAA: vs Wolves (H) - FDR: 2 🟢
⚠️ Saka: @ Man City (A) - FDR: 5 🔴
```

### `ffl validate`
Validate your team against FPL rules.

#### Usage
```bash
npm run ffl:validate [options]

# Options:
#   -f, --fix             Auto-fix issues where possible
#   -v, --verbose         Detailed validation output
#   -h, --help            Display help
```

#### Example Output
```bash
$ npm run ffl:validate

Validating Team...
════════════════════════════════════════════

✓ Budget: £99.5m / £100m
✓ Squad Size: 15 players
✓ Positions: 2 GK, 5 DEF, 5 MID, 3 FWD
✓ Team Limits: Max 3 per club
✓ Formation: 4-4-2 (valid)
✓ Captain: In starting XI
✓ Vice-Captain: In starting XI
✓ Unique Players: No duplicates

Result: ✅ All validation checks passed!

Warnings:
⚠️ Player injured: Sterling (75% chance of playing)
⚠️ Fixture congestion: 3 players have 2 matches in 5 days
```

## Advanced Commands

### `ffl captain`
Set or change your captain and vice-captain.

```bash
npm run ffl:captain [options]

# Options:
#   -c, --captain <player>     Set captain
#   -v, --vice <player>        Set vice-captain
#   -s, --suggest              Get captain suggestions
#   -p, --popular              Show popular captains
```

#### Captain Suggestions
```bash
$ npm run ffl:captain --suggest

Captain Suggestions - Gameweek 6
════════════════════════════════════════════
Based on: Form, Fixtures, Historical Performance

1. Haaland (MCI) - Score: 9.5/10
   vs NFO (H), Form: 10.2, Owned: 78%
   
2. Salah (LIV) - Score: 8.8/10
   vs WOL (H), Form: 8.5, Owned: 45%
   
3. Saka (ARS) - Score: 7.2/10
   @ MCI (A), Form: 9.1, Owned: 32%

Popular Captains (Top 10k):
1. Haaland - 62.3%
2. Salah - 24.1%
3. Palmer - 5.8%
```

### `ffl chip`
Activate special chips.

```bash
npm run ffl:chip <type> [options]

# Types:
#   wildcard      Unlimited transfers
#   freehit       One-week unlimited
#   triple        Triple captain points
#   bench         All players score
#   mystery       (Available January 2025)

# Options:
#   -c, --check   Check chip availability
#   -h, --help    Display help
```

#### Example
```bash
$ npm run ffl:chip wildcard

Wildcard Activation - First Half Season
════════════════════════════════════════════
⚠️  This action cannot be undone!

Effects:
✓ Unlimited transfers this gameweek
✓ No point deductions
✓ Saved transfers preserved
✓ One use per half-season

? Activate Wildcard for Gameweek 6? Yes

✓ Wildcard activated!
You can now make unlimited transfers.
```

### `ffl simulate`
Simulate points for upcoming gameweek.

```bash
npm run ffl:simulate [options]

# Options:
#   -c, --captain <player>   Set captain for simulation
#   -f, --formation <type>   Test different formation
#   -t, --transfers          Include planned transfers
#   -m, --monte-carlo        Run probability simulation
```

#### Simulation Output
```bash
$ npm run ffl:simulate --monte-carlo

Gameweek 6 Simulation
════════════════════════════════════════════

Expected Points by Player:
┌──────────────┬───────┬────────┬─────────┐
│ Player       │ Fixture│ Expected│ Range   │
├──────────────┼───────┼────────┼─────────┤
│ Haaland (C)  │ NFO(H)│ 12.5   │ 4-20    │
│ Salah        │ WOL(H)│ 8.2    │ 2-15    │
│ TAA          │ WOL(H)│ 6.8    │ 2-12    │
└──────────────┴───────┴────────┴─────────┘

Simulation Results (1000 runs):
Expected Total: 67.3 points
Best Case (95%): 89 points
Worst Case (5%): 42 points
Median: 66 points

Probability Distribution:
90+ pts: ▓▓░░░░░░░░ 12%
80-89:   ▓▓▓▓░░░░░░ 18%
70-79:   ▓▓▓▓▓▓░░░░ 28%
60-69:   ▓▓▓▓▓▓▓▓░░ 31%
50-59:   ▓▓░░░░░░░░ 8%
<50 pts: ▓░░░░░░░░░ 3%
```

### `ffl league`
Manage leagues and view standings.

```bash
npm run ffl:league <action> [options]

# Actions:
#   create        Create a new league
#   join          Join a league
#   leave         Leave a league
#   standings     View standings
#   info          League information
```

#### Create League
```bash
$ npm run ffl:league create

Create Private League
════════════════════════════════════════════

? League name: DevOps Champions
? League type: Classic
? Maximum teams: 20
? Starting gameweek: 1
? Description: League for DevOps engineers

League Created!
════════════════════════════════════════════
Name: DevOps Champions
Code: ABC123
Type: Classic
Share: https://ffl.game/join/ABC123

Next: Create PR to register league
```

### `ffl history`
View historical performance.

```bash
npm run ffl:history [options]

# Options:
#   -g, --gameweek <n>    Specific gameweek
#   -s, --season          Full season summary
#   -c, --compare <user>  Compare with another manager
#   -e, --export          Export to CSV
```

## Configuration

### Configuration File
Location: `~/.fflrc` or project `.fflrc`

```json
{
  "github": {
    "username": "YOUR_USERNAME",
    "token": "ghp_..." // Optional, for API access
  },
  "preferences": {
    "colorScheme": "auto", // auto, light, dark
    "notifications": true,
    "autoValidate": true,
    "confirmTransfers": true,
    "timezone": "Europe/London"
  },
  "display": {
    "compactMode": false,
    "showPlayerPhotos": true,
    "tableStyle": "rounded", // rounded, simple, ascii
    "currency": "£"
  },
  "advanced": {
    "apiEndpoint": "https://fantasy.premierleague.com/api",
    "cacheTimeout": 300,
    "debugMode": false
  }
}
```

### Environment Variables
```bash
# .env file
FFL_GITHUB_USER=username
FFL_GITHUB_TOKEN=ghp_...
FFL_API_KEY=your_api_key
FFL_DEBUG=false
FFL_CACHE_DIR=~/.ffl/cache
```

## Examples

### Complete Team Setup
```bash
# 1. Fork and clone
git clone https://github.com/YOU/fantasy-football-league.git
cd fantasy-football-league

# 2. Install
npm install

# 3. Create team
npm run ffl:create-team

# 4. Validate
npm run ffl:validate

# 5. Commit
git add teams/YOUR_USERNAME/
git commit -m "feat: Create initial team"
git push origin main

# 6. Create PR on GitHub
```

### Weekly Routine
```bash
# Monday - Review gameweek
npm run ffl:history --gameweek last
npm run ffl:status

# Tuesday - Plan transfers
npm run ffl:simulate
npm run ffl:transfer --plan

# Thursday - Make transfers
npm run ffl:transfer
npm run ffl:captain --suggest

# Friday - Final checks
npm run ffl:validate
npm run ffl:deadline

# Saturday - Watch matches
npm run ffl:status --live  # If implemented
```

### Using Chips Strategically
```bash
# Check chip availability
npm run ffl:chip --check

# Plan wildcard (see changes without saving)
npm run ffl:chip wildcard --plan
npm run ffl:transfer --chip wildcard --plan

# Activate and use
npm run ffl:chip wildcard
npm run ffl:transfer  # Make unlimited transfers

# Commit with chip label
git commit -m "chip: Activate wildcard for GW10"
```

## Troubleshooting

### Common Issues

#### Command not found
```bash
# Ensure you're in the project directory
cd fantasy-football-league

# Or install globally
npm install -g .
```

#### Validation errors
```bash
# Run detailed validation
npm run ffl:validate --verbose

# Auto-fix where possible
npm run ffl:validate --fix
```

#### API rate limits
```bash
# Clear cache
rm -rf ~/.ffl/cache

# Use offline mode
npm run ffl:status --offline
```

#### Permission denied
```bash
# Check file permissions
ls -la teams/YOUR_USERNAME/

# Fix permissions
chmod 644 teams/YOUR_USERNAME/team.json
```

### Debug Mode
```bash
# Enable debug output
export FFL_DEBUG=true
npm run ffl:status

# Or inline
FFL_DEBUG=true npm run ffl:transfer
```

### Getting Help
```bash
# Built-in help
npm run ffl:help
npm run ffl:create-team --help

# Version information
npm run ffl:version

# Check for updates
npm run ffl:update
```

## CLI Development

### Adding Custom Commands
```javascript
// cli/commands/custom.js
module.exports = async function(options) {
  console.log('Custom command', options);
  // Your logic here
};

// Register in cli/index.js
program
  .command('custom')
  .description('My custom command')
  .action(require('./commands/custom'));
```

### Testing Commands
```bash
# Run tests
npm test

# Test specific command
npm test -- create-team

# Coverage report
npm run test:coverage
```

## Shortcuts and Aliases

### Bash Aliases
Add to `~/.bashrc` or `~/.zshrc`:
```bash
alias ffl='npm run ffl'
alias fflt='npm run ffl:transfer'
alias ffls='npm run ffl:status'
alias fflv='npm run ffl:validate'
alias ffld='npm run ffl:deadline'
```

### NPM Scripts
Additional scripts in `package.json`:
```json
{
  "scripts": {
    "ffl": "node cli/index.js",
    "ffl:quick-transfer": "node cli/index.js transfer --quick",
    "ffl:captain-stats": "node cli/index.js captain --stats",
    "ffl:week-review": "node cli/index.js history --week"
  }
}
```

## Advanced Features

### Batch Operations
```bash
# Multiple transfers in one command
npm run ffl:transfer --batch transfers.json

# Batch file format:
{
  "transfers": [
    {"out": "Sterling", "in": "Saka"},
    {"out": "Martinez", "in": "Ramsdale"}
  ]
}
```

### Export/Import
```bash
# Export team
npm run ffl:export --format json > my-team.json

# Import team
npm run ffl:import --file my-team.json

# Export history
npm run ffl:history --export --format csv > history.csv
```

### Integration with External Tools
```bash
# Pipe to jq for JSON processing
npm run ffl:status --json | jq '.points'

# Use with watch for live updates
watch -n 60 'npm run ffl:status --compact'

# Script automation
./scripts/auto-transfer.sh
```

---

For more information, see the [main documentation](./README.md) or run `npm run ffl:help`.
# CLI Guide - Git Fantasy League (GFL)

Complete documentation for the Git Fantasy League command-line interface (`gfl`).

## Table of Contents
1. [Installation](#installation)
2. [Usage Modes](#usage-modes)
3. [Interactive Mode](#interactive-mode)
4. [Command Mode](#command-mode)
5. [Core Commands](#core-commands)
6. [Advanced Commands](#advanced-commands)
7. [Configuration](#configuration)
8. [Examples](#examples)
9. [Troubleshooting](#troubleshooting)

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

### Install and Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/fantasy-football-league.git
cd fantasy-football-league

# Install dependencies
npm install

# Make the CLI globally available
npm link

# Now you can use 'gfl' from anywhere!
gfl --version
```

### First Run Setup
```bash
# Initialize configuration interactively
gfl init

# Or specify configuration directly
gfl init --github-user YOUR_USERNAME --team-name "Code Warriors FC"
```

## Usage Modes

The `gfl` CLI can be used in two modes:

### 1. Interactive Mode
Launch an interactive session with visual menus and prompts:
```bash
# Start interactive mode
gfl

# Or explicitly
gfl interactive
```

### 2. Command Mode
Execute specific commands directly from the terminal:
```bash
# Direct command execution
gfl status
gfl transfer --out "Sterling" --in "Saka"
gfl validate
```

## Interactive Mode

### Starting Interactive Mode
```bash
$ gfl

┌─────────────────────────────────────────┐
│   Git Fantasy League - Interactive CLI  │
│            Season 2024/25                │
└─────────────────────────────────────────┘

Welcome, @username!
Team: Code Warriors FC
Gameweek: 5

What would you like to do?

❯ 👀 View Team Status
  🔄 Make Transfers
  📊 Check League Standings
  ⏰ View Deadlines
  🎯 Set Captain
  💎 Use Chip
  ⚙️ Settings
  ❌ Exit

Use arrow keys to navigate, Enter to select
```

### Interactive Features

#### Modern UI Elements
- **Spinner animations** with `ora` for loading states
- **Colored output** with `chalk` for better readability
- **Interactive prompts** with `inquirer` for user input
- **Tables** with `cli-table3` for structured data
- **Progress bars** for long operations
- **Emoji support** for visual feedback

#### Interactive Team Creation
```bash
$ gfl create-team

⚽ Git Fantasy League - Team Creation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎮 Let's create your team!

? Enter your team name: › Code Warriors FC
? Select your team colours: › 
  ❯ 🔴 Red & White
    🔵 Blue & White
    💛 Yellow & Black
    💚 Green & White
    ⚫ Black & Gold
    🟣 Purple & Orange
    (Custom colours...)

Building squad...
💰 Budget: £100.0m

Selecting Goalkeepers (0/2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
? Search for goalkeeper: › Alis_

↑/↓ Navigate • Enter Select • Tab Autocomplete

  🥅 Alisson (LIV)
     £5.5m • Form: 8.2 • Owned: 45.2%
     
❯ 🥅 Alisson Ramses (FUL)  
     £4.0m • Form: 5.1 • Owned: 2.1%

[Live budget tracking shown]
💰 Spent: £5.5m / £100.0m
📊 Squad: 1/15 players
```

#### Interactive Transfer Interface
```bash
$ gfl transfer

🔄 Transfer Market - Gameweek 6
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Squad (Tap player to transfer out)
┌─────┬──────────────┬──────┬───────┬────────┬──────┐
│     │ Player       │ Team │ Price │ Points │ News │
├─────┼──────────────┼──────┼───────┼────────┼──────┤
│ 🥅  │ Alisson      │ LIV  │ £5.5m │ 42     │ ✅   │
│ 🥅  │ Ramsdale     │ ARS  │ £4.5m │ 38     │ ✅   │
│ 🛡️  │ TAA          │ LIV  │ £7.0m │ 51     │ ✅   │
│ 🛡️  │ Saliba       │ ARS  │ £5.0m │ 48     │ ✅   │
│ ⚡  │ Sterling     │ CHE  │ £10.0m│ 28     │ 🤕   │
└─────┴──────────────┴──────┴───────┴────────┴──────┘

? Select action: › 
  ❯ 🔄 Make Transfer
    📈 View Player Stats
    💹 Price Changes
    🔮 Run Simulation
    ✅ Confirm Transfers
    ❌ Cancel

Free Transfers: 2 | Extra: -4pts each
```

## Command Mode

### Basic Syntax
```bash
gfl <command> [options] [arguments]
```

### Global Options
```bash
gfl --help              # Show help
gfl --version          # Show version
gfl --config <path>    # Use custom config file
gfl --no-color        # Disable colored output
gfl --quiet           # Minimal output
gfl --verbose         # Detailed output
gfl --json            # JSON output for scripting
```

## Core Commands

### `gfl status`
View your team and league position.

```bash
# Basic status
gfl status

# Specific gameweek
gfl status --gameweek 5

# Detailed view with formations
gfl status --detailed

# JSON output for scripting
gfl status --json

# Compact view
gfl status --compact
```

### `gfl transfer`
Make player transfers.

```bash
# Interactive transfer mode
gfl transfer

# Direct transfer (non-interactive)
gfl transfer --out "Sterling" --in "Saka"

# Using player IDs
gfl transfer --out player_123 --in player_456

# Plan mode (preview without saving)
gfl transfer --plan

# With wildcard chip
gfl transfer --chip wildcard

# Batch transfers from file
gfl transfer --batch transfers.json
```

### `gfl create-team`
Create your initial team.

```bash
# Interactive team creation
gfl create-team

# From template
gfl create-team --template balanced

# Import from JSON
gfl create-team --import team.json

# Quick random team (for testing)
gfl create-team --random --budget 100
```

### `gfl validate`
Validate team against rules.

```bash
# Basic validation
gfl validate

# Auto-fix issues
gfl validate --fix

# Verbose output
gfl validate --verbose

# Check specific team file
gfl validate --file teams/username/team.json
```

### `gfl deadline`
Show deadlines and fixtures.

```bash
# Next deadline
gfl deadline

# All future deadlines
gfl deadline --all

# With fixtures
gfl deadline --fixtures

# Specific gameweek
gfl deadline --gameweek 10
```

## Advanced Commands

### `gfl captain`
Manage captaincy.

```bash
# Set captain interactively
gfl captain

# Direct set
gfl captain --set "Haaland"

# Set vice-captain
gfl captain --vice "Salah"

# Get AI suggestions
gfl captain --suggest

# Show popular captains
gfl captain --popular
```

### `gfl chip`
Activate special chips.

```bash
# View available chips
gfl chip

# Activate wildcard
gfl chip activate wildcard

# Check chip status
gfl chip status

# Plan chip usage (preview)
gfl chip plan triple-captain
```

### `gfl simulate`
Run simulations.

```bash
# Basic simulation
gfl simulate

# With specific captain
gfl simulate --captain "Haaland"

# Monte Carlo simulation (1000 runs)
gfl simulate --monte-carlo

# Test formation change
gfl simulate --formation "3-5-2"

# Include planned transfers
gfl simulate --with-transfers
```

### `gfl league`
League management.

```bash
# View standings
gfl league standings

# Join a league
gfl league join ABC123

# Create private league
gfl league create --name "DevOps Champions"

# League info
gfl league info --code ABC123

# Compare with rival
gfl league compare @rival_username
```

### `gfl history`
View historical data.

```bash
# Season summary
gfl history season

# Specific gameweek
gfl history gameweek 5

# Transfer history
gfl history transfers

# Points progression graph
gfl history graph

# Export to CSV
gfl history export --format csv
```

### `gfl sync`
Synchronize with GitHub.

```bash
# Pull latest changes
gfl sync pull

# Push your changes
gfl sync push

# Full sync (pull, merge, push)
gfl sync

# Create PR for changes
gfl sync pr --title "GW6 Transfers"
```

## Configuration

### Configuration File
The CLI uses a hierarchical configuration system:

1. **Global Config**: `~/.gflrc`
2. **Project Config**: `./gflrc.json`
3. **Environment Variables**: `GFL_*`
4. **Command Line Options**: Highest priority

#### Example Configuration
```json
{
  "github": {
    "username": "YOUR_USERNAME",
    "token": "ghp_...",
    "defaultBranch": "main"
  },
  "preferences": {
    "interactive": true,
    "colorOutput": true,
    "confirmTransfers": true,
    "autoValidate": true,
    "timezone": "Europe/London"
  },
  "display": {
    "theme": "dark",
    "compactMode": false,
    "showEmojis": true,
    "tableStyle": "rounded",
    "dateFormat": "DD/MM/YYYY",
    "currency": "£"
  },
  "notifications": {
    "deadlineReminder": true,
    "priceChanges": true,
    "injuryNews": true,
    "slackWebhook": "https://hooks.slack.com/..."
  },
  "advanced": {
    "apiEndpoint": "https://fantasy.premierleague.com/api",
    "cacheTimeout": 300,
    "maxRetries": 3,
    "debugMode": false
  }
}
```

### Environment Variables
```bash
# Set environment variables
export GFL_GITHUB_USER=username
export GFL_GITHUB_TOKEN=ghp_...
export GFL_INTERACTIVE=true
export GFL_COLOR=true
export GFL_DEBUG=false
```

### Setting Preferences
```bash
# Configure interactively
gfl config

# Set specific values
gfl config set github.username "YOUR_USERNAME"
gfl config set display.theme "dark"
gfl config set preferences.interactive true

# Get configuration value
gfl config get github.username

# Reset to defaults
gfl config reset
```

## Examples

### Complete Setup Flow
```bash
# 1. Install and link
npm install && npm link

# 2. Initialize configuration
gfl init

# 3. Create your team interactively
gfl

# 4. Validate before submission
gfl validate

# 5. Create PR with changes
gfl sync pr --title "Initial team creation"
```

### Weekly Management Routine
```bash
# Monday - Review last gameweek
gfl history gameweek --last
gfl league standings

# Wednesday - Plan transfers
gfl transfer --plan
gfl simulate --with-transfers

# Friday - Execute transfers
gfl transfer
gfl captain --suggest
gfl validate

# Friday evening - Final check
gfl deadline
gfl sync push
```

### Advanced Scripting
```bash
#!/bin/bash
# Auto-transfer script

# Get current team value in JSON
TEAM_VALUE=$(gfl status --json | jq '.team.value')

# Check if we should wildcard
if [ "$TEAM_VALUE" -lt "98.0" ]; then
  gfl chip activate wildcard
fi

# Get transfer suggestions
TRANSFERS=$(gfl suggest transfers --json)

# Execute transfers
echo "$TRANSFERS" | gfl transfer --batch -

# Validate and push
gfl validate --fix && gfl sync push
```

### CI/CD Integration
```yaml
# .github/workflows/validate.yml
name: Validate Team
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm link
      - run: gfl validate --verbose
      - run: gfl simulate --json > simulation.json
      - uses: actions/upload-artifact@v3
        with:
          name: simulation-results
          path: simulation.json
```

## Package Dependencies

The CLI uses modern npm packages for the best experience:

```json
{
  "dependencies": {
    "commander": "^11.0.0",      // Command parsing
    "inquirer": "^9.0.0",        // Interactive prompts
    "ora": "^7.0.0",             // Spinner animations
    "chalk": "^5.0.0",           // Colored output
    "cli-table3": "^0.6.0",      // Beautiful tables
    "figlet": "^1.6.0",          // ASCII art titles
    "boxen": "^7.0.0",           // Boxes around content
    "conf": "^11.0.0",           // Configuration management
    "update-notifier": "^6.0.0", // Update notifications
    "axios": "^1.5.0",           // HTTP requests
    "dayjs": "^1.11.0",          // Date handling
    "lodash": "^4.17.0",         // Utility functions
    "validator": "^13.0.0"       // Input validation
  }
}
```

## Troubleshooting

### Common Issues

#### Command not found
```bash
# Ensure npm link was run
npm link

# Or use npx
npx gfl status

# Or add to PATH
export PATH=$PATH:$(npm bin -g)
```

#### Permission errors
```bash
# Fix npm permissions
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

# Reinstall
npm install -g .
```

#### SSL/TLS errors
```bash
# For corporate proxies
export NODE_TLS_REJECT_UNAUTHORIZED=0
gfl config set advanced.strictSSL false
```

### Debug Mode
```bash
# Enable debug output
gfl --debug status

# Or set environment variable
export GFL_DEBUG=true
gfl status

# Verbose logging
gfl --verbose transfer
```

### Getting Help
```bash
# General help
gfl help

# Command-specific help
gfl help transfer
gfl transfer --help

# Interactive help
gfl ? # Shows contextual help

# Version info
gfl --version

# Check for updates
gfl update
```

---

For more information, see the [main documentation](./README.md) or visit the [project repository](https://github.com/devops-games/fantasy-football).
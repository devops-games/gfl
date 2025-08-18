# GitHub Issues Backlog for Git-Based Fantasy Football League

This document contains a comprehensive backlog of GitHub issues ready to be created in the repository. Each issue is formatted for easy copy-paste into GitHub.

## Issue Creation Order

Follow this order to maintain issue number references:
1. Create all labels first
2. Create milestones
3. Create epic issues (#1-#3)
4. Create remaining issues in numerical order

---

## Labels to Create First

```yaml
# Priority Labels
- name: priority-1
  color: "#d73a4a"
  description: "Must have for MVP"
  
- name: priority-2
  color: "#0075ca"
  description: "Should have for full release"
  
- name: priority-3
  color: "#cfd3d7"
  description: "Nice to have enhancement"

# Type Labels
- name: epic
  color: "#9333ea"
  description: "Epic issue with child issues"
  
- name: feature
  color: "#a2eeef"
  description: "New feature or request"
  
- name: bug
  color: "#d73a4a"
  description: "Something isn't working"
  
- name: documentation
  color: "#0075ca"
  description: "Improvements or additions to documentation"

# Component Labels
- name: github-actions
  color: "#000000"
  description: "GitHub Actions workflows"
  
- name: cli
  color: "#10b981"
  description: "CLI tool related"
  
- name: validation
  color: "#f59e0b"
  description: "Validation and rules"
  
- name: scoring
  color: "#8b5cf6"
  description: "Points calculation"
  
- name: infrastructure
  color: "#64748b"
  description: "Infrastructure and setup"
  
- name: transfers
  color: "#06b6d4"
  description: "Transfer system"
  
- name: chips
  color: "#ec4899"
  description: "Special chips/powers"
  
- name: leagues
  color: "#84cc16"
  description: "League management"
  
- name: data
  color: "#f97316"
  description: "Data management"
  
- name: ui
  color: "#6366f1"
  description: "User interface"
  
- name: security
  color: "#dc2626"
  description: "Security related"
  
- name: testing
  color: "#ef4444"
  description: "Testing related"
  
- name: integration
  color: "#eab308"
  description: "External integrations"
  
- name: analytics
  color: "#a855f7"
  description: "Analytics and reporting"

# Other Labels
- name: good-first-issue
  color: "#7057ff"
  description: "Good for newcomers"
  
- name: help-wanted
  color: "#008672"
  description: "Extra attention is needed"
  
- name: blocked
  color: "#e11d48"
  description: "Blocked by another issue"
  
- name: ready
  color: "#22c55e"
  description: "Ready for development"
```

---

## Milestones to Create

### Milestone 1: MVP Release
- **Title:** MVP Release
- **Due Date:** 4 weeks from start
- **Description:** Basic functional game with team creation and transfers. Core infrastructure and validation system operational.

### Milestone 2: Scoring System
- **Title:** Scoring System
- **Due Date:** 8 weeks from start
- **Description:** Automated points calculation, league standings, and gameweek processing.

### Milestone 3: Full Feature Set
- **Title:** Full Feature Set
- **Due Date:** 12 weeks from start
- **Description:** All chips, advanced features, and league management fully implemented.

### Milestone 4: Polish & Scale
- **Title:** Polish & Scale
- **Due Date:** 16 weeks from start
- **Description:** Performance optimization, analytics, integrations, and nice-to-have features.

---

## Issues

### Issue #1
**Title:** Epic: Core Infrastructure and Repository Structure  
**Labels:** `epic`, `infrastructure`, `priority-1`  
**Milestone:** MVP Release  
**Assignees:** @devops-games/maintainers  
**Body:**
```markdown
## Overview
Set up the foundational repository structure and core infrastructure for the git-based Fantasy Football League.

## Objectives
- Establish repository structure following best practices
- Set up GitHub Actions for CI/CD
- Configure branch protection and security
- Create initial documentation

## Child Issues
- [ ] #4 Initialize repository structure
- [ ] #5 Create GitHub Actions validation pipeline
- [ ] #6 Set up branch protection rules
- [ ] #7 Create CODEOWNERS file
- [ ] #8 Design team JSON schema

## Acceptance Criteria
- [ ] Repository structure matches proposed architecture
- [ ] Basic CI/CD pipeline is functional
- [ ] Branch protection prevents direct commits to main
- [ ] CODEOWNERS properly configured
- [ ] Clear documentation for contributors

## Technical Decisions
- Node.js version: 18 LTS
- Package manager: npm (for simplicity)
- Testing framework: Jest
- Linting: ESLint + Prettier

## Resources
- [Architecture Document](./docs/ARCHITECTURE.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)
```

---

### Issue #2
**Title:** Epic: Team Management System  
**Labels:** `epic`, `feature`, `priority-1`  
**Milestone:** MVP Release  
**Body:**
```markdown
## Overview
Implement the complete team management system allowing users to create, modify, and manage their fantasy football teams through git.

## Objectives
- Enable team creation via CLI
- Implement transfer system
- Validate all team operations
- Track team history

## Child Issues
- [ ] #9 Build CLI tool for team management
- [ ] #10 Implement team validation rules
- [ ] #11 Create transfer processing system
- [ ] #12 Add team history tracking
- [ ] #13 Implement captain selection

## Acceptance Criteria
- [ ] Users can create valid teams via CLI
- [ ] Transfers are processed correctly
- [ ] All FPL rules are enforced
- [ ] Team changes are tracked in git history
- [ ] Validation provides clear feedback

## User Flow
1. Fork repository
2. Run `npm run ffl:create-team`
3. Select players within budget
4. Commit team
5. Create PR to register
```

---

### Issue #3
**Title:** Epic: Scoring and League System  
**Labels:** `epic`, `scoring`, `leagues`, `priority-2`  
**Milestone:** Scoring System  
**Body:**
```markdown
## Overview
Build the automated scoring system and league management functionality.

## Objectives
- Automate points calculation
- Process gameweek results
- Maintain league standings
- Generate reports

## Child Issues
- [ ] #14 Build gameweek points calculator
- [ ] #15 Create league management system
- [ ] #16 Implement auto-substitution logic
- [ ] #17 Add league standings calculator
- [ ] #18 Generate gameweek reports

## Acceptance Criteria
- [ ] Points calculated accurately for all scenarios
- [ ] Auto-substitutions processed correctly
- [ ] League standings updated after each gameweek
- [ ] Reports generated automatically
- [ ] Historical data preserved

## Technical Approach
- GitHub Actions scheduled workflows
- External API integration for match data
- Idempotent calculations
- Transaction-safe updates
```

---

### Issue #4
**Title:** Initialize repository structure with required directories  
**Labels:** `infrastructure`, `good-first-issue`, `priority-1`, `ready`  
**Milestone:** MVP Release  
**Body:**
```markdown
## Description
Create the initial directory structure for the Fantasy Football League repository following the agreed architecture.

## Tasks
- [ ] Create `/data/players/` directory for player data
- [ ] Create `/data/fixtures/` directory for match schedules  
- [ ] Create `/data/rules/` directory for game rules
- [ ] Create `/teams/` directory with README for user teams
- [ ] Create `/leagues/` directory for league standings
- [ ] Create `/scripts/` directory for validation scripts
- [ ] Create `/cli/` directory for CLI tool
- [ ] Create `/.github/workflows/` for GitHub Actions
- [ ] Create `/.github/ISSUE_TEMPLATE/` with templates
- [ ] Create `/docs/` directory for documentation
- [ ] Create `/tests/` directory structure
- [ ] Add comprehensive README.md
- [ ] Add .gitignore file with Node.js template
- [ ] Add LICENSE file (MIT)
- [ ] Add package.json with initial dependencies

## Directory Structure
\`\`\`
fantasy-football-league/
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── data/
│   ├── players/
│   │   └── .gitkeep
│   ├── fixtures/
│   │   └── .gitkeep
│   └── rules/
│       └── .gitkeep
├── teams/
│   └── README.md
├── leagues/
│   ├── global/
│   │   └── .gitkeep
│   └── private/
│       └── .gitkeep
├── scripts/
│   └── .gitkeep
├── cli/
│   └── .gitkeep
├── docs/
│   └── .gitkeep
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
├── .gitignore
├── LICENSE
└── README.md
\`\`\`

## Notes
- Use .gitkeep files to preserve empty directories
- Ensure .gitignore includes node_modules, .env, .DS_Store
- README should include quick start instructions
```

---

### Issue #5
**Title:** Create GitHub Action for validating team changes  
**Labels:** `github-actions`, `validation`, `priority-1`  
**Milestone:** MVP Release  
**Depends on:** #4  
**Body:**
```markdown
## Description
Create a GitHub Action that validates team changes when PRs are submitted. This is the core validation engine for the game.

## Requirements

### Trigger Conditions
- Trigger on pull_request events for `/teams/**` paths
- Run on PR open, synchronize, and reopen events

### Validation Checks
1. **Ownership Validation**
   - GitHub username must match team directory name
   - Prevent users from modifying other teams

2. **Budget Validation**
   - Total squad value ≤ £100m
   - Track remaining budget

3. **Squad Composition**
   - Exactly 15 players
   - 2 GK, 5 DEF, 5 MID, 3 FWD
   - No duplicate players

4. **Team Limits**
   - Maximum 3 players from same Premier League club

5. **Formation Validation**
   - Valid formation for starting XI
   - Min 3 DEF, 2 MID, 1 FWD
   - Captain in starting XI

6. **Deadline Enforcement**
   - Check PR timestamp against gameweek deadline
   - Reject late submissions

### Output
- Post validation results as PR comment
- Use check runs API for pass/fail status
- Provide clear error messages with fixes

## Implementation

### Workflow File: `.github/workflows/validate-team.yml`
\`\`\`yaml
name: Validate Team Changes

on:
  pull_request:
    paths:
      - 'teams/**'
    types: [opened, synchronize, reopened]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      # ... (see full implementation in body)
\`\`\`

### Validation Script Structure
\`\`\`javascript
// scripts/validate-team.js
class TeamValidator {
  validateAll(teamPath, username) {
    const results = {
      valid: true,
      errors: [],
      warnings: [],
      summary: {}
    };
    
    // Run all validation checks
    // Return structured results
  }
}
\`\`\`

## Testing
- [ ] Test with valid team configuration
- [ ] Test each validation rule failure
- [ ] Test deadline enforcement
- [ ] Test PR comment formatting
- [ ] Test with multiple file changes

## Success Criteria
- Validation completes in < 30 seconds
- Clear error messages that guide fixes
- No false positives
- Handles edge cases gracefully
```

---

### Issue #6
**Title:** Set up branch protection rules  
**Labels:** `security`, `infrastructure`, `priority-1`  
**Milestone:** MVP Release  
**Body:**
```markdown
## Description
Configure branch protection rules to ensure code quality and prevent unauthorized changes.

## Branch Protection for `main`

### Required Status Checks
- [ ] "Validate Team Changes" must pass
- [ ] "Check Deadline" must pass
- [ ] "Run Tests" must pass
- [ ] Strict mode enabled (branch must be up to date)

### Pull Request Requirements
- [ ] Require pull request before merging
- [ ] Dismiss stale reviews on new commits
- [ ] Require review from CODEOWNERS
- [ ] No direct commits (including administrators)

### Additional Settings
- [ ] Require signed commits (optional, discuss first)
- [ ] Require linear history
- [ ] Include administrators in restrictions
- [ ] Don't allow force pushes
- [ ] Don't allow deletions

## Implementation Steps
1. Navigate to Settings → Branches
2. Add rule for `main` branch
3. Configure all protection rules
4. Test with sample PR
5. Document in CONTRIBUTING.md

## CODEOWNERS Configuration
\`\`\`
# Core system files - protected
/.github/workflows/     @devops-games/maintainers
/scripts/              @devops-games/maintainers
/data/players/         @devops-games/maintainers
/data/fixtures/        @devops-games/maintainers
/data/rules/           @devops-games/maintainers

# User teams - self-owned
/teams/*/              @$1

# League administration
/leagues/global/       @devops-games/maintainers
/leagues/private/*/    @devops-games/league-admins
\`\`\`

## Verification
- [ ] Try direct commit to main (should fail)
- [ ] Try PR without passing checks (should block)
- [ ] Try PR modifying another user's team (should require review)
- [ ] Verify CODEOWNERS is working
```

---

### Issue #7
**Title:** Create CODEOWNERS file  
**Labels:** `security`, `infrastructure`, `priority-1`, `good-first-issue`  
**Milestone:** MVP Release  
**Body:**
```markdown
## Description
Create a CODEOWNERS file to automatically request reviews from the right people and protect critical files.

## Requirements
- Protect system files from unauthorized changes
- Allow users to own their team directories
- Designate maintainers for core functionality
- Set up league administrator permissions

## CODEOWNERS File Content
\`\`\`
# Fantasy Football League Code Owners
# Order matters - last matching pattern takes precedence

# Default owners for everything
* @devops-games/maintainers

# Core system files - require maintainer review
/.github/                @devops-games/maintainers
/scripts/                @devops-games/maintainers
/data/                   @devops-games/maintainers
/cli/                    @devops-games/maintainers
package.json            @devops-games/maintainers
package-lock.json       @devops-games/maintainers

# User teams - owned by respective users
# This allows users to modify only their own team
/teams/*/               @$1

# League administration
/leagues/global/        @devops-games/maintainers
/leagues/private/*/     @devops-games/league-admins

# Documentation can be updated by contributors
/docs/                  @devops-games/maintainers @devops-games/contributors
README.md              @devops-games/maintainers @devops-games/contributors

# Test files
/tests/                 @devops-games/maintainers @devops-games/qa
\`\`\`

## Tasks
- [ ] Create `.github/CODEOWNERS` file
- [ ] Create necessary GitHub teams:
  - `@devops-games/maintainers`
  - `@devops-games/contributors`
  - `@devops-games/league-admins`
  - `@devops-games/qa`
- [ ] Test with sample PRs
- [ ] Document in CONTRIBUTING.md

## Testing
- [ ] User modifying own team (should auto-approve)
- [ ] User modifying another's team (should require review)
- [ ] Modifying core scripts (should require maintainer)
- [ ] Updating documentation (should require contributor/maintainer)
```

---

### Issue #8
**Title:** Design and implement team.json schema  
**Labels:** `data`, `validation`, `priority-1`  
**Milestone:** MVP Release  
**Body:**
```markdown
## Description
Define the JSON schema for team files and implement validation. This schema is the core data structure for all team operations.

## Schema Definition

### Complete Team Schema
\`\`\`json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["manager", "squad", "formation", "startingXI", "bench", "captain", "viceCaptain", "budget", "metadata"],
  "properties": {
    "manager": {
      "type": "object",
      "required": ["github", "teamName"],
      "properties": {
        "github": {
          "type": "string",
          "pattern": "^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$"
        },
        "teamName": {
          "type": "string",
          "minLength": 3,
          "maxLength": 50
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "joined": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    "squad": {
      "type": "object",
      "required": ["goalkeepers", "defenders", "midfielders", "forwards"],
      "properties": {
        "goalkeepers": {
          "type": "array",
          "minItems": 2,
          "maxItems": 2,
          "items": { "$ref": "#/definitions/player" }
        },
        "defenders": {
          "type": "array",
          "minItems": 5,
          "maxItems": 5,
          "items": { "$ref": "#/definitions/player" }
        },
        "midfielders": {
          "type": "array",
          "minItems": 5,
          "maxItems": 5,
          "items": { "$ref": "#/definitions/player" }
        },
        "forwards": {
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "items": { "$ref": "#/definitions/player" }
        }
      }
    },
    "formation": {
      "type": "string",
      "enum": ["4-4-2", "4-3-3", "3-5-2", "3-4-3", "5-4-1", "5-3-2", "4-5-1"]
    },
    "startingXI": {
      "type": "array",
      "minItems": 11,
      "maxItems": 11,
      "items": {
        "type": "string",
        "pattern": "^player_[0-9]+$"
      }
    },
    "bench": {
      "type": "array",
      "minItems": 4,
      "maxItems": 4,
      "items": {
        "type": "string",
        "pattern": "^player_[0-9]+$"
      }
    },
    "captain": {
      "type": "string",
      "pattern": "^player_[0-9]+$"
    },
    "viceCaptain": {
      "type": "string",
      "pattern": "^player_[0-9]+$"
    },
    "budget": {
      "type": "object",
      "required": ["spent", "remaining"],
      "properties": {
        "spent": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        },
        "remaining": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        }
      }
    },
    "metadata": {
      "type": "object",
      "required": ["created", "lastModified"],
      "properties": {
        "created": {
          "type": "string",
          "format": "date-time"
        },
        "lastModified": {
          "type": "string",
          "format": "date-time"
        },
        "gameweekLocked": {
          "type": ["integer", "null"],
          "minimum": 1,
          "maximum": 38
        }
      }
    }
  },
  "definitions": {
    "player": {
      "type": "object",
      "required": ["id", "name", "team", "price"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^player_[0-9]+$"
        },
        "name": {
          "type": "string"
        },
        "team": {
          "type": "string",
          "pattern": "^[A-Z]{3}$"
        },
        "price": {
          "type": "number",
          "minimum": 4.0,
          "maximum": 15.0
        },
        "purchasePrice": {
          "type": "number"
        },
        "purchaseDate": {
          "type": "string",
          "format": "date-time"
        }
      }
    }
  }
}
\`\`\`

## Implementation Tasks
- [ ] Create JSON schema file
- [ ] Implement validation using ajv library
- [ ] Create validation helper functions
- [ ] Add schema versioning support
- [ ] Create migration scripts for schema updates
- [ ] Write comprehensive tests
- [ ] Document schema in wiki

## Validation Rules
- Budget spent + remaining must equal initial budget
- All player IDs must be unique
- Captain must be in startingXI
- Vice-captain must be in startingXI
- Captain ≠ Vice-captain
- StartingXI + bench = all players in squad
- Formation matches startingXI positions

## Example Valid Team File
\`\`\`json
{
  "manager": {
    "github": "octocat",
    "teamName": "Octocat United",
    "email": "octocat@github.com"
  },
  "squad": {
    "goalkeepers": [...],
    "defenders": [...],
    "midfielders": [...],
    "forwards": [...]
  },
  "formation": "4-4-2",
  "startingXI": ["player_001", ...],
  "bench": ["player_012", ...],
  "captain": "player_007",
  "viceCaptain": "player_010",
  "budget": {
    "spent": 99.5,
    "remaining": 0.5
  },
  "metadata": {
    "created": "2024-08-01T10:00:00Z",
    "lastModified": "2024-08-01T10:00:00Z",
    "gameweekLocked": null
  }
}
\`\`\`
```

---

### Issue #9
**Title:** Build CLI tool for team management  
**Labels:** `cli`, `feature`, `priority-1`  
**Milestone:** MVP Release  
**Depends on:** #8  
**Body:**
```markdown
## Description
Build a comprehensive command-line interface for managing fantasy teams. This will be the primary way users interact with the game.

## Commands to Implement

### Core Commands
1. **`ffl create-team`** - Interactive team creation wizard
2. **`ffl transfer`** - Make transfers for upcoming gameweek
3. **`ffl status`** - View current team and league position
4. **`ffl simulate`** - Simulate points for upcoming gameweek
5. **`ffl deadline`** - Show next transfer deadline
6. **`ffl validate`** - Validate team locally before PR

### Additional Commands
7. **`ffl captain <player>`** - Set captain for gameweek
8. **`ffl chip <type>`** - Activate a chip
9. **`ffl league <action>`** - League management
10. **`ffl history [gameweek]`** - View historical performance

## Technical Requirements

### Stack
- Commander.js for CLI framework
- Inquirer.js for interactive prompts
- Chalk for colored output
- CLI-Table3 for formatted tables
- Ora for loading spinners
- Fuzzy for player search

### Features
- [ ] Interactive player selection with filters
- [ ] Real-time budget tracking
- [ ] Search with autocomplete
- [ ] Formation visualization
- [ ] Transfer suggestions
- [ ] Validation feedback
- [ ] Progress indicators
- [ ] Error handling with helpful messages
- [ ] Offline mode support
- [ ] Config file support (~/.fflrc)

## Implementation Structure
\`\`\`javascript
#!/usr/bin/env node
// cli/index.js

const { program } = require('commander');
const package = require('../package.json');

program
  .version(package.version)
  .description('Fantasy Football League CLI');

program
  .command('create-team')
  .alias('ct')
  .description('Create your initial team')
  .option('-i, --interactive', 'Interactive mode (default)', true)
  .option('-f, --file <path>', 'Import from file')
  .option('-t, --template <name>', 'Use team template')
  .action(require('./commands/create-team'));

// ... more commands

program.parse(process.argv);
\`\`\`

## User Experience

### Team Creation Flow
1. Welcome message with instructions
2. Team name input (validation)
3. Budget display (£100m)
4. Position-by-position selection:
   - Show available players
   - Filter by price/team/form
   - Search by name
   - Show remaining budget
   - Confirm each selection
5. Formation selection
6. Starting XI selection
7. Captain/Vice-captain selection
8. Review and confirm
9. Save team and show next steps

### Transfer Flow
1. Show current team
2. Display transfer budget
3. Select player to remove
4. Search for replacement
5. Show point cost if applicable
6. Confirm transfer
7. Update team file
8. Show summary

## Output Examples
\`\`\`
⚽ Fantasy Football League CLI v1.0.0

Creating your team...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Budget: £100.0m
📋 Squad: 0/15 players selected

Select Goalkeepers (0/2):
┌─────┬──────────────┬──────┬───────┬────────┬───────┐
│ #   │ Player       │ Team │ Price │ Points │ Own % │
├─────┼──────────────┼──────┼───────┼────────┼───────┤
│ 1   │ Alisson      │ LIV  │ £5.5m │ 176    │ 28.4% │
│ 2   │ Ederson      │ MCI  │ £5.5m │ 169    │ 15.2% │
│ 3   │ Ramsdale     │ ARS  │ £5.0m │ 152    │ 12.8% │
└─────┴──────────────┴──────┴───────┴────────┴───────┘

? Select a goalkeeper (type to search): █
\`\`\`

## Testing
- [ ] Unit tests for all commands
- [ ] Integration tests with mock data
- [ ] E2E tests for complete flows
- [ ] Performance tests with large datasets
- [ ] Cross-platform testing (Windows/Mac/Linux)

## Documentation
- [ ] Man page generation
- [ ] Built-in help for all commands
- [ ] Examples in help text
- [ ] Video tutorial
- [ ] CLI usage guide in docs/
```

---

### Issue #10
**Title:** Implement comprehensive team validation rules  
**Labels:** `validation`, `feature`, `priority-1`  
**Milestone:** MVP Release  
**Body:**
```markdown
## Description
Implement all Fantasy Premier League rules validation to ensure fair play and game integrity.

## Validation Categories

### 1. Budget Rules
- [ ] Total squad value ≤ £100m
- [ ] Track spending precisely to 0.1m
- [ ] Validate price changes don't exceed limits
- [ ] Check selling price calculations

### 2. Squad Composition
- [ ] Exactly 15 players total
- [ ] 2 Goalkeepers
- [ ] 5 Defenders  
- [ ] 5 Midfielders
- [ ] 3 Forwards
- [ ] No duplicate players

### 3. Team Restrictions
- [ ] Maximum 3 players from any single club
- [ ] Validate against current season teams
- [ ] Handle promoted/relegated teams

### 4. Formation Rules
- [ ] Valid formations only
- [ ] Minimum 3 defenders
- [ ] Minimum 2 midfielders
- [ ] Minimum 1 forward
- [ ] 11 players in starting XI
- [ ] 4 players on bench

### 5. Captain Rules
- [ ] Captain must be in starting XI
- [ ] Vice-captain must be in starting XI
- [ ] Captain ≠ Vice-captain

### 6. Transfer Rules
- [ ] Track free transfers (max 5 accumulated)
- [ ] Calculate point deductions (-4 per extra)
- [ ] Maximum 20 transfers per gameweek
- [ ] Validate transfer window timing

### 7. Chip Usage
- [ ] Track chip usage per season
- [ ] Prevent multiple chips same gameweek
- [ ] Validate chip availability
- [ ] Check chip-specific rules

### 8. Deadline Enforcement
- [ ] Check against gameweek deadlines
- [ ] Handle timezone conversions
- [ ] Reject late submissions
- [ ] Grace period configuration (optional)

## Implementation

### Validation Engine
\`\`\`javascript
// scripts/validation/engine.js
class ValidationEngine {
  constructor(rules) {
    this.rules = rules;
    this.errors = [];
    this.warnings = [];
  }

  validate(team, context) {
    this.errors = [];
    this.warnings = [];
    
    for (const rule of this.rules) {
      if (!rule.enabled) continue;
      
      const result = rule.validate(team, context);
      
      if (result.errors) {
        this.errors.push(...result.errors);
      }
      
      if (result.warnings) {
        this.warnings.push(...result.warnings);
      }
    }
    
    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }
}
\`\`\`

### Rule Structure
\`\`\`javascript
// scripts/validation/rules/budget.js
module.exports = {
  name: 'budget',
  enabled: true,
  priority: 1,
  validate: (team, context) => {
    const errors = [];
    const total = calculateTeamValue(team.squad);
    
    if (total > 100.0) {
      errors.push({
        code: 'BUDGET_EXCEEDED',
        message: \`Budget exceeded: £\${total}m > £100m\`,
        field: 'squad',
        severity: 'error'
      });
    }
    
    return { errors };
  }
};
\`\`\`

## Error Messages

### User-Friendly Format
\`\`\`
❌ Validation Failed

BUDGET_EXCEEDED: Your team costs £101.5m but the budget is £100m
  → Remove expensive players or find cheaper alternatives
  → You need to save £1.5m

INVALID_FORMATION: Your formation 2-5-3 has too few defenders
  → Minimum 3 defenders required
  → Move a midfielder or forward to defense

DUPLICATE_PLAYER: Mohamed Salah appears twice in your squad
  → Each player can only be selected once
  → Remove the duplicate entry
\`\`\`

## Testing Strategy
- [ ] Unit tests for each validation rule
- [ ] Integration tests for combined rules
- [ ] Edge case testing
- [ ] Performance testing with concurrent validations
- [ ] Regression test suite

## Configuration
\`\`\`json
// data/rules/validation.json
{
  "budget": {
    "max": 100.0,
    "enabled": true
  },
  "squad": {
    "size": 15,
    "positions": {
      "GK": 2,
      "DEF": 5,
      "MID": 5,
      "FWD": 3
    }
  },
  "teamLimit": {
    "maxPerClub": 3
  },
  "transfers": {
    "maxFree": 5,
    "pointCost": 4,
    "maxPerGameweek": 20
  }
}
\`\`\`
```

---

### Issue #11
**Title:** Create transfer processing and validation system  
**Labels:** `transfers`, `feature`, `priority-2`  
**Milestone:** MVP Release  
**Depends on:** #10  
**Body:**
```markdown
## Description
Implement the complete transfer system with validation, history tracking, and point deductions.

## Features Required

### Core Transfer Logic
- [ ] Process player swaps (out → in)
- [ ] Update team budget
- [ ] Track free transfers used
- [ ] Calculate point deductions
- [ ] Validate transfer legality
- [ ] Update player prices

### Transfer Tracking
- [ ] Create transfer history files
- [ ] Track cumulative transfers
- [ ] Calculate transfer efficiency
- [ ] Monitor team value changes

### Validation Rules
- [ ] Player exists and available
- [ ] Budget sufficient for transfer
- [ ] Not exceeding 20 transfers/gameweek
- [ ] Player not already in team
- [ ] Position requirements maintained
- [ ] Team limit (3 per club) maintained

## Data Structures

### Transfer Record
\`\`\`json
{
  "gameweek": 5,
  "timestamp": "2024-08-28T18:30:00Z",
  "transfers": [
    {
      "out": {
        "id": "player_050",
        "name": "Sterling",
        "team": "CHE",
        "position": "MID",
        "soldPrice": 10.0,
        "purchasePrice": 10.5,
        "profit": -0.5
      },
      "in": {
        "id": "player_051",
        "name": "Saka",
        "team": "ARS",
        "position": "MID",
        "boughtPrice": 8.5
      }
    }
  ],
  "freeTransfersAvailable": 2,
  "freeTransfersUsed": 1,
  "pointsDeduction": 0,
  "budgetBefore": 1.5,
  "budgetAfter": 3.0,
  "teamValueBefore": 100.5,
  "teamValueAfter": 99.0
}
\`\`\`

### Transfer Summary
\`\`\`json
{
  "season": {
    "totalTransfers": 15,
    "freeTransfers": 12,
    "paidTransfers": 3,
    "pointsLost": 12,
    "wildcardsUsed": 1,
    "freeHitsUsed": 0
  },
  "gameweek": {
    "transfers": 2,
    "pointsDeduction": 4,
    "netSpend": -1.5
  }
}
\`\`\`

## Implementation

### Transfer Processor
\`\`\`javascript
// scripts/transfers/processor.js
class TransferProcessor {
  constructor(team, gameweek) {
    this.team = team;
    this.gameweek = gameweek;
    this.transfers = [];
  }

  async processTransfer(out, in) {
    // Validate transfer
    const validation = await this.validateTransfer(out, in);
    if (!validation.valid) {
      throw new TransferError(validation.errors);
    }
    
    // Calculate financials
    const sellPrice = this.calculateSellPrice(out);
    const buyPrice = in.price;
    
    // Check budget
    const newBudget = this.team.budget.remaining + sellPrice - buyPrice;
    if (newBudget < 0) {
      throw new TransferError('Insufficient funds');
    }
    
    // Execute transfer
    this.removePlayer(out);
    this.addPlayer(in);
    this.updateBudget(newBudget);
    
    // Record transfer
    this.recordTransfer(out, in, sellPrice, buyPrice);
    
    return {
      success: true,
      transfer: this.transfers[this.transfers.length - 1]
    };
  }
  
  calculateSellPrice(player) {
    const profit = player.currentPrice - player.purchasePrice;
    if (profit <= 0) {
      return player.currentPrice;
    }
    // 50% of profit, rounded down to nearest 0.1
    return player.purchasePrice + Math.floor(profit / 2 * 10) / 10;
  }
}
\`\`\`

### Transfer Validation
\`\`\`javascript
// scripts/transfers/validator.js
class TransferValidator {
  validate(team, out, in, context) {
    const errors = [];
    
    // Check player availability
    if (!this.isPlayerAvailable(in)) {
      errors.push('Player not available');
    }
    
    // Check position match (optional)
    if (context.requireSamePosition && out.position !== in.position) {
      errors.push('Position mismatch');
    }
    
    // Check team limits
    const newTeamCount = this.getTeamCount(team, in.team) - 
                        (out.team === in.team ? 0 : 1);
    if (newTeamCount > 3) {
      errors.push(\`Too many players from \${in.team}\`);
    }
    
    // Check budget
    const funds = this.calculateAvailableFunds(team, out, in);
    if (funds < 0) {
      errors.push(\`Insufficient funds (need £\${Math.abs(funds)}m more)\`);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}
\`\`\`

## CLI Integration
\`\`\`bash
# Make a single transfer
npm run ffl:transfer --out Sterling --in Saka

# Interactive transfer mode
npm run ffl:transfer

# Plan future transfers
npm run ffl:transfer --plan --gameweek 10
\`\`\`

## Testing Requirements
- [ ] Test successful transfers
- [ ] Test each validation failure
- [ ] Test sell price calculations
- [ ] Test free transfer accumulation
- [ ] Test point deductions
- [ ] Test transfer history
- [ ] Test edge cases (same player, same team)
- [ ] Test concurrent transfers
```

---

### Issue #12
**Title:** Add team history tracking system  
**Labels:** `data`, `feature`, `priority-2`  
**Milestone:** MVP Release  
**Body:**
```markdown
## Description
Implement comprehensive history tracking for all team changes and gameweek performance.

## History Components

### 1. Gameweek History
Track performance for each gameweek:
- Points scored
- Captain choice
- Bench points
- Transfers made
- Chips used
- Rank movements

### 2. Transfer History
Complete record of all transfers:
- Player in/out
- Prices
- Profit/loss
- Point deductions

### 3. Decision History
Track key decisions:
- Captain changes
- Formation changes
- Chip activations

## File Structure
\`\`\`
teams/{username}/history/
├── gameweek-1.json
├── gameweek-2.json
├── ...
├── transfers.json
├── chips.json
└── summary.json
\`\`\`

## Gameweek History Schema
\`\`\`json
{
  "gameweek": 5,
  "points": {
    "starting": 65,
    "bench": 12,
    "total": 65,
    "hits": -4,
    "net": 61
  },
  "captain": {
    "player": "Mohamed Salah",
    "points": 14,
    "multiplied": 28
  },
  "viceCaptain": {
    "player": "Erling Haaland",
    "played": true
  },
  "chips": {
    "used": null
  },
  "formation": "4-4-2",
  "squad": {
    "starting": [...],
    "bench": [...],
    "autoSubs": [
      {
        "out": "player_001",
        "in": "player_012",
        "points": 6
      }
    ]
  },
  "ranks": {
    "overall": 125432,
    "overallChange": +5234,
    "gameweek": 89234
  },
  "teamValue": 100.5,
  "bank": 0.5,
  "transfers": {
    "made": 2,
    "cost": 4
  }
}
\`\`\`

## Implementation Tasks
- [ ] Create history file structure
- [ ] Implement history writer
- [ ] Add history reader with queries
- [ ] Create history analytics
- [ ] Build history visualization
- [ ] Add history export feature
- [ ] Implement history compression
- [ ] Create backup system

## Analytics Features
\`\`\`javascript
// scripts/history/analytics.js
class HistoryAnalytics {
  getBestGameweek() {
    return this.history.reduce((best, gw) => 
      gw.points.total > best.points.total ? gw : best
    );
  }
  
  getCaptainSuccessRate() {
    const successful = this.history.filter(gw => 
      gw.captain.points >= 10
    ).length;
    return (successful / this.history.length * 100).toFixed(1);
  }
  
  getBenchPointsWasted() {
    return this.history.reduce((total, gw) => 
      total + gw.points.bench, 0
    );
  }
  
  getTransferEfficiency() {
    // Points gained vs points spent on transfers
  }
}
\`\`\`

## Git Integration
- History files tracked in git
- Each gameweek creates a commit
- Tags for milestones
- Blame for decision tracking
```

---

### Issue #13
**Title:** Implement captain and vice-captain selection  
**Labels:** `feature`, `priority-1`  
**Milestone:** MVP Release  
**Body:**
```markdown
## Description
Implement the captain selection system with double points and vice-captain backup functionality.

## Requirements

### Captain Rules
- Captain scores double points (positive and negative)
- Must be selected from starting XI
- Can be changed until deadline
- One captain per gameweek

### Vice-Captain Rules
- Backup if captain doesn't play (0 minutes)
- Also scores double points when activated
- Must be different from captain
- Must be in starting XI

## Implementation

### Captain Selection in CLI
\`\`\`javascript
// cli/commands/captain.js
async function selectCaptain(team) {
  const choices = team.startingXI.map(playerId => {
    const player = getPlayer(playerId);
    return {
      name: \`\${player.name} (\${player.team}) - Form: \${player.form}\`,
      value: playerId,
      short: player.name
    };
  });
  
  const captain = await inquirer.prompt([
    {
      type: 'list',
      name: 'captain',
      message: 'Select your captain (2x points):',
      choices,
      default: team.captain
    }
  ]);
  
  const viceCaptainChoices = choices.filter(c => 
    c.value !== captain.captain
  );
  
  const viceCaptain = await inquirer.prompt([
    {
      type: 'list',
      name: 'viceCaptain',
      message: 'Select your vice-captain:',
      choices: viceCaptainChoices,
      default: team.viceCaptain
    }
  ]);
  
  return {
    captain: captain.captain,
    viceCaptain: viceCaptain.viceCaptain
  };
}
\`\`\`

### Captain Statistics
\`\`\`javascript
// scripts/captain/stats.js
class CaptainStats {
  getPlayerCaptainHistory(playerId) {
    return {
      timesCaptained: 15,
      totalPoints: 180,
      averagePoints: 12,
      bestReturn: 28,
      worstReturn: -2,
      blanks: 3
    };
  }
  
  getPopularCaptains(gameweek) {
    return [
      { player: 'Haaland', percentage: 45.2 },
      { player: 'Salah', percentage: 28.5 },
      { player: 'Palmer', percentage: 8.3 }
    ];
  }
  
  getCaptainRecommendations(team, gameweek) {
    // Algorithm considering:
    // - Form
    // - Fixtures
    // - Home/Away
    // - Historical performance
    // - Ownership
  }
}
\`\`\`

### Validation
\`\`\`javascript
// scripts/validation/captain.js
function validateCaptaincy(team) {
  const errors = [];
  
  if (!team.captain) {
    errors.push('Captain must be selected');
  }
  
  if (!team.viceCaptain) {
    errors.push('Vice-captain must be selected');
  }
  
  if (team.captain === team.viceCaptain) {
    errors.push('Captain and vice-captain must be different');
  }
  
  if (!team.startingXI.includes(team.captain)) {
    errors.push('Captain must be in starting XI');
  }
  
  if (!team.startingXI.includes(team.viceCaptain)) {
    errors.push('Vice-captain must be in starting XI');
  }
  
  return errors;
}
\`\`\`

## UI/UX Features
- Visual badges on team display (C) and (VC)
- One-click captain swap
- Captain success rate display
- Popular captains percentage
- Fixture analysis for captain picks
- Historical captain performance

## Testing
- [ ] Captain selection flow
- [ ] Vice-captain activation
- [ ] Double points calculation
- [ ] Validation rules
- [ ] Captain statistics
- [ ] Captain recommendations
```

---

### Issue #14
**Title:** Build automated gameweek points calculator  
**Labels:** `scoring`, `github-actions`, `priority-2`  
**Milestone:** Scoring System  
**Body:**
```markdown
## Description
Create the automated system to calculate points for all teams after each gameweek completes.

## Scoring Rules Implementation

### Basic Points
\`\`\`javascript
const SCORING_RULES = {
  goals: {
    GK: 10,  // NEW: Increased from 6
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
  minutes: {
    0: 0,
    '1-59': 1,
    '60+': 2
  },
  yellowCards: -1,
  redCards: -3,
  ownGoals: -2,
  penaltiesMissed: -2,
  penaltiesSaved: 5,
  saves: {
    per3: 1
  },
  goalsConceded: {
    per2: -1  // GK/DEF only
  },
  bonus: [3, 2, 1],  // Top 3 BPS
  defensiveActions: {
    // NEW for 2025/26
    DEF: { threshold: 10, points: 2 },
    MID: { threshold: 12, points: 2 },
    FWD: { threshold: 12, points: 2 }
  }
};
\`\`\`

### Points Calculator
\`\`\`javascript
// scripts/scoring/calculator.js
class PointsCalculator {
  calculatePlayerPoints(player, matchData) {
    let points = 0;
    
    // Minutes played
    points += this.getMinutePoints(matchData.minutes);
    
    // Goals
    points += matchData.goals * SCORING_RULES.goals[player.position];
    
    // Assists
    points += matchData.assists * SCORING_RULES.assists;
    
    // Clean sheets
    if (matchData.cleanSheet) {
      points += SCORING_RULES.cleanSheets[player.position];
    }
    
    // Cards
    points += matchData.yellowCards * SCORING_RULES.yellowCards;
    points += matchData.redCards * SCORING_RULES.redCards;
    
    // Own goals
    points += matchData.ownGoals * SCORING_RULES.ownGoals;
    
    // Goalkeeper specific
    if (player.position === 'GK') {
      points += Math.floor(matchData.saves / 3);
      points += matchData.penaltiesSaved * SCORING_RULES.penaltiesSaved;
    }
    
    // Defensive actions (NEW)
    if (this.hasDefensiveBonus(player, matchData)) {
      points += SCORING_RULES.defensiveActions[player.position].points;
    }
    
    // Goals conceded
    if (['GK', 'DEF'].includes(player.position)) {
      points -= Math.floor(matchData.goalsConceded / 2);
    }
    
    // Penalties missed
    points += matchData.penaltiesMissed * SCORING_RULES.penaltiesMissed;
    
    return points;
  }
  
  calculateBonusPoints(match) {
    // Calculate BPS for all players
    const bpsScores = match.players.map(p => ({
      player: p,
      bps: this.calculateBPS(p)
    })).sort((a, b) => b.bps - a.bps);
    
    // Award bonus points to top 3
    const bonusPoints = {};
    if (bpsScores[0]) bonusPoints[bpsScores[0].player.id] = 3;
    if (bpsScores[1]) bonusPoints[bpsScores[1].player.id] = 2;
    if (bpsScores[2]) bonusPoints[bpsScores[2].player.id] = 1;
    
    return bonusPoints;
  }
  
  calculateTeamPoints(team, gameweekData) {
    let totalPoints = 0;
    
    // Starting XI points
    for (const playerId of team.startingXI) {
      const playerPoints = this.getPlayerGameweekPoints(playerId, gameweekData);
      
      // Apply captain multiplier
      if (playerId === team.captain) {
        playerPoints *= 2;
      }
      
      totalPoints += playerPoints;
    }
    
    // Process auto-subs
    const autoSubs = this.processAutoSubs(team, gameweekData);
    for (const sub of autoSubs) {
      totalPoints += sub.pointsGained;
    }
    
    // Apply chip effects
    if (team.activeChip === 'tripleCaptain') {
      // Add extra captain points
      const captainBase = this.getPlayerGameweekPoints(team.captain, gameweekData);
      totalPoints += captainBase;  // 3x total
    }
    
    if (team.activeChip === 'benchBoost') {
      // Add all bench points
      for (const playerId of team.bench) {
        totalPoints += this.getPlayerGameweekPoints(playerId, gameweekData);
      }
    }
    
    // Subtract transfer costs
    totalPoints -= team.transferCost || 0;
    
    return totalPoints;
  }
}
\`\`\`

### GitHub Action Workflow
\`\`\`yaml
name: Calculate Gameweek Points

on:
  schedule:
    # Run Tuesday 2 AM after Monday matches
    - cron: '0 2 * * 2'
  workflow_dispatch:
    inputs:
      gameweek:
        description: 'Gameweek number'
        required: true
        type: number

jobs:
  calculate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          token: \${{ secrets.GITHUB_TOKEN }}
      
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
            --gameweek \${{ github.event.inputs.gameweek || 'current' }}
        env:
          FPL_API_KEY: \${{ secrets.FPL_API_KEY }}
      
      - name: Calculate all team points
        run: |
          node scripts/calculate-points.js \
            --gameweek \${{ github.event.inputs.gameweek || 'current' }}
      
      - name: Process auto-substitutions
        run: |
          node scripts/process-auto-subs.js \
            --gameweek \${{ github.event.inputs.gameweek || 'current' }}
      
      - name: Update standings
        run: |
          node scripts/update-standings.js
      
      - name: Generate reports
        run: |
          node scripts/generate-reports.js
      
      - name: Commit results
        run: |
          git config user.name 'FFL Bot'
          git config user.email 'bot@ffl.com'
          git add .
          git commit -m "bot: Calculate gameweek points"
          git push
\`\`\`

## Testing Requirements
- [ ] Test all scoring scenarios
- [ ] Test bonus points calculation
- [ ] Test captain doubling
- [ ] Test auto-substitutions
- [ ] Test chip effects
- [ ] Test transfer deductions
- [ ] Test edge cases (red cards, etc.)
- [ ] Performance test with 1000+ teams
```

---

## Additional Documentation Files

You now have the following comprehensive documentation files in `/Users/martinpalastanga/code/meatbased/fantasy-football-docs/`:

1. **README.md** - Main project overview and quick start guide
2. **GAME_RULES.md** - Complete FPL rules adapted for git-based system
3. **ARCHITECTURE.md** - Technical architecture and implementation details
4. **USER_STORIES.md** - Web application user stories (for reference)
5. **ISSUES_BACKLOG.md** - This file with all GitHub issues ready to create

## Next Steps

1. **Move the documentation** to your target directory:
   ```bash
   mv /Users/martinpalastanga/code/meatbased/fantasy-football-docs /Users/martinpalastanga/code/devops-games/fantasy-football
   ```

2. **Create the GitHub repository** at https://github.com/devops-games/fantasy-football

3. **Set up the repository**:
   - Add all the labels from this document
   - Create the milestones
   - Start creating issues in order

4. **Begin development** starting with the MVP issues (priority-1)

This documentation provides everything needed to build the world's first git-based Fantasy Football League!
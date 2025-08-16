# Fantasy Football Game Rules

This document outlines the complete rules for the Git-Based Fantasy Football League, based on the official Fantasy Premier League (FPL) rules with adaptations for our git-based system.

## Table of Contents
1. [Team Selection](#team-selection)
2. [Budget & Pricing](#budget--pricing)
3. [Transfers](#transfers)
4. [Scoring System](#scoring-system)
5. [Captaincy](#captaincy)
6. [Chips (Special Powers)](#chips-special-powers)
7. [Deadlines](#deadlines)
8. [Leagues & Competition](#leagues--competition)
9. [Git-Specific Rules](#git-specific-rules)

## Team Selection

### Squad Composition
Your squad must consist of exactly **15 players**:
- **2 Goalkeepers** (GK)
- **5 Defenders** (DEF)
- **5 Midfielders** (MID)
- **3 Forwards** (FWD)

### Starting XI and Bench
- Select **11 players** for your starting lineup each gameweek
- **4 players** on the bench (ordered by priority)
- Valid formations must include:
  - Minimum 3 defenders
  - Minimum 2 midfielders
  - Minimum 1 forward

### Team Restrictions
- Maximum **3 players** from any single Premier League club
- Players can only be selected once (no duplicates)

## Budget & Pricing

### Initial Budget
- Every manager starts with **£100 million**
- Must select entire 15-player squad within budget
- Remaining budget can be saved for future transfers

### Player Prices
- Prices range from £4.0m to £15.0m
- Prices change based on transfer activity:
  - **Rise**: High demand (many managers transferring in)
  - **Fall**: Low demand (many managers transferring out)
  - Maximum change: ±£0.3m per gameweek
  - No changes during active gameweek

### Selling Players
- Players sell for their **current price** if you bought them at or below that price
- If a player's value has risen since purchase, you receive:
  - Purchase price + (50% of profit, rounded down to nearest £0.1m)
  - Example: Bought at £8.0m, current price £8.4m, sell price = £8.2m

## Transfers

### Free Transfers
- **1 free transfer** per gameweek
- Can accumulate up to **5 free transfers** (NEW for 2024/25)
- Unused transfers carry over (up to the maximum)
- Saved transfers **no longer reset** when using chips

### Additional Transfers
- Cost: **-4 points** per extra transfer
- Maximum **20 transfers** per gameweek
- Points deducted in the gameweek transfers are made

### Transfer Window
- Opens after previous gameweek completes
- Closes at the **gameweek deadline** (usually 90 minutes before first match)
- Late transfers not accepted (enforced by GitHub Actions)

## Scoring System

### Basic Scoring

#### Actions
| Action | GK/DEF | MID | FWD |
|--------|--------|-----|-----|
| Goal | 6 pts | 5 pts | 4 pts |
| Assist | 3 pts | 3 pts | 3 pts |
| Clean Sheet | 4 pts | 1 pt | 0 pts |
| Appearance (≥60 min) | 2 pts | 2 pts | 2 pts |
| Appearance (<60 min) | 1 pt | 1 pt | 1 pt |

#### Penalties
| Event | Points |
|-------|--------|
| Yellow Card | -1 pt |
| Red Card | -3 pts |
| Own Goal | -2 pts |
| Penalty Miss | -2 pts |
| Goals Conceded (GK/DEF, per 2) | -1 pt |

#### Goalkeepers Only
| Action | Points |
|--------|--------|
| Penalty Save | 5 pts |
| Save (per 3 saves) | 1 pt |
| Goal Scored | 10 pts (NEW) |

### Bonus Points System (BPS)
- Top 3 players in each match receive bonus points:
  - 1st: **3 bonus points**
  - 2nd: **2 bonus points**
  - 3rd: **1 bonus point**
- Calculated using detailed performance metrics

### Defensive Actions (NEW for 2025/26)
- **Defenders**: 2 points for 10+ clearances, blocks, interceptions, tackles (CBIT)
- **Midfielders/Forwards**: 2 points for 12+ CBIT + ball recoveries

## Captaincy

### Captain Selection
- Choose one captain from your starting XI
- Captain scores **double points** (positive and negative)
- Must be selected before gameweek deadline

### Vice-Captain
- Backup captain selection
- Automatically activated if captain doesn't play
- Also scores double points when activated

### Strategy Tips
- Popular choices: High-scoring forwards/midfielders
- Consider fixtures and form
- Home advantage often matters

## Chips (Special Powers)

### Available Chips

#### 1. Wildcard (2 per season)
- **Effect**: Unlimited free transfers for one gameweek
- **Availability**: One for first half, one for second half of season
- **Git Implementation**: Add label `chip:wildcard` to PR
- **Restrictions**: Cannot be cancelled once activated

#### 2. Free Hit (1 per season)
- **Effect**: Unlimited transfers for one gameweek only
- **Special**: Team reverts to previous squad after gameweek
- **Git Implementation**: Label `chip:free-hit`
- **Use Case**: Navigate blank/double gameweeks

#### 3. Triple Captain (1 per season)
- **Effect**: Captain scores **triple points** instead of double
- **Git Implementation**: Label `chip:triple-captain`
- **Strategy**: Best used in double gameweeks

#### 4. Bench Boost (1 per season)
- **Effect**: All 15 players score points (including bench)
- **Git Implementation**: Label `chip:bench-boost`
- **Strategy**: Ensure strong bench before using

#### 5. Mystery Chip (NEW - Revealed January 2025)
- **Effect**: To be announced
- **Availability**: Usable from January 2025
- **Git Implementation**: Label `chip:mystery`

### Chip Rules
- Only **one chip** can be active per gameweek
- Cannot be combined
- Must be activated before deadline
- Tracked in user's chip history file

## Deadlines

### Gameweek Deadlines
- Usually **90 minutes** before first match of gameweek
- Typically Friday evening or Saturday early afternoon UK time
- **No exceptions** for late submissions

### Git-Specific Deadline Enforcement
```bash
# Check next deadline
npm run ffl:deadline

# Deadline enforcement via GitHub Actions
- PRs submitted after deadline auto-rejected
- Timestamp taken from PR creation time
- Clear error messages provided
```

## Leagues & Competition

### Global League
- All participants automatically entered
- Ranked by total points
- Tiebreakers:
  1. Total goals scored by players
  2. Fewest transfers made
  3. Alphabetical by team name

### Private Leagues
- Create via PR with league configuration
- Types available:
  - **Classic**: Total points scoring
  - **Head-to-Head**: Weekly matchups
- Maximum 20 teams per private league
- Unique join codes generated

### Cup Competition
- Qualification after Gameweek 16
- Single elimination knockout format
- Random draw each round
- Higher gameweek score advances

### Scoring Ties
- H2H leagues: Away goals rule
- Cup: Manager with higher gameweek rank advances

## Git-Specific Rules

### Team Ownership
- One team per GitHub account
- Username must match team directory
- No automated/bot accounts allowed

### Pull Request Requirements
- Must originate from personal fork
- Clear commit messages required
- Must pass all validation checks
- Human-initiated (no automation)

### File Structure
```json
// teams/{github-username}/team.json
{
  "manager": {
    "github": "username",
    "teamName": "Team Name"
  },
  "squad": { /* 15 players */ },
  "formation": "4-4-2",
  "startingXI": [ /* 11 player IDs */ ],
  "captain": "player_id",
  "viceCaptain": "player_id"
}
```

### Validation Rules
All PRs automatically validated for:
- Budget compliance
- Squad composition
- Player uniqueness
- Team limits
- Deadline compliance
- Ownership verification

### Fair Play
- Git history provides complete audit trail
- All teams publicly visible
- Tampering detectable through git blame
- Branch protection prevents direct commits

## Special Gameweeks

### Double Gameweeks (DGW)
- Some teams play **twice** in one gameweek
- Players can score points in both matches
- Ideal for Triple Captain/Bench Boost

### Blank Gameweeks (BGW)
- Some teams have **no fixture**
- Players from these teams score 0 points
- Plan transfers or use Free Hit

### Season Milestones
- **Gameweek 1-3**: Unlimited transfers (settling period)
- **Gameweek 16**: Cup qualification
- **Gameweek 19**: First Wildcard expires
- **January**: Mystery Chip revealed
- **Gameweek 38**: Final gameweek

## Auto-Substitutions

### When They Occur
- Player doesn't feature (0 minutes played)
- After all matches in gameweek complete

### Priority Order
1. Goalkeeper replaced only by substitute goalkeeper
2. Outfield players replaced in bench order
3. Must maintain valid formation
4. If valid formation impossible, no substitution

### Points Application
- Substitute's points automatically added
- Shown in gameweek history
- Cannot be manually overridden

## Scoring Corrections

### When They Happen
- Official statistics reviewed post-match
- Usually within 24-48 hours
- Affects bonus points most commonly

### Git Implementation
- Automated recalculation via GitHub Actions
- New commit with corrections
- League standings updated
- Notification in team history

## Prize Structure

### Global League
- **1st Place**: Bragging rights + special badge
- **Top 10**: Recognition in Hall of Fame
- **Top 100**: Mentioned in season review

### Private Leagues
- Determined by league creator
- Can include custom prizes
- Enforced through league rules

## Disputes and Issues

### Reporting Problems
- Create GitHub issue with evidence
- Tag with appropriate label
- Maintainers review within 48 hours

### Common Issues
- Missed deadlines (no exceptions)
- Technical failures (case-by-case)
- Rule clarifications (added to FAQ)

## Season Schedule

### Key Dates (2024/25 Season)
- **Season Start**: August 16, 2024
- **First Wildcard Deadline**: December 28, 2024
- **Mystery Chip Reveal**: January 2025
- **Season End**: May 25, 2025

### Important Notes
- Dates subject to fixture changes
- Follow GitHub notifications
- Check announcements regularly

---

## Quick Reference Card

### Essential Commands
```bash
npm run ffl:create-team  # Start here
npm run ffl:transfer     # Weekly transfers
npm run ffl:status       # Check position
npm run ffl:deadline     # Don't miss it!
```

### PR Labels for Chips
- `chip:wildcard`
- `chip:free-hit`
- `chip:triple-captain`
- `chip:bench-boost`
- `chip:mystery` (from January)

### Key Limits
- Budget: £100m
- Squad: 15 players
- Max per team: 3 players
- Free transfers saved: 5 max
- Transfer cost: -4 points
- Max transfers/GW: 20

---

*Last updated: January 2025*
*Based on official FPL rules with git-specific adaptations*
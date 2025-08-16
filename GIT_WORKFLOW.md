# Git Workflow Guide for Fantasy Football League

This guide explains how to participate in the Fantasy Football League using git workflows. If you're new to git, this will teach you everything you need to know!

## Table of Contents
1. [Getting Started](#getting-started)
2. [Creating Your Team](#creating-your-team)
3. [Making Transfers](#making-transfers)
4. [Using Chips](#using-chips)
5. [Common Git Commands](#common-git-commands)
6. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites
- GitHub account (free)
- Git installed on your computer
- Node.js (version 18 or higher)
- Basic terminal/command line knowledge

### Initial Setup

#### 1. Fork the Repository
Visit https://github.com/devops-games/fantasy-football and click the "Fork" button in the top right. This creates your personal copy of the league.

#### 2. Clone Your Fork
```bash
# Replace YOUR_USERNAME with your GitHub username
git clone https://github.com/YOUR_USERNAME/fantasy-football-league.git
cd fantasy-football-league
```

#### 3. Set Up Remotes
```bash
# Add the main repository as 'upstream'
git remote add upstream https://github.com/devops-games/fantasy-football.git

# Verify your remotes
git remote -v
# You should see:
# origin    https://github.com/YOUR_USERNAME/fantasy-football-league.git (fetch)
# origin    https://github.com/YOUR_USERNAME/fantasy-football-league.git (push)
# upstream  https://github.com/devops-games/fantasy-football.git (fetch)
# upstream  https://github.com/devops-games/fantasy-football.git (push)
```

#### 4. Install Dependencies
```bash
npm install
```

#### 5. Configure Git Hooks
```bash
npm run setup:hooks
```

## Creating Your Team

### Step 1: Sync Your Fork
Always start by syncing with the latest data:
```bash
git checkout main
git pull upstream main
git push origin main
```

### Step 2: Create Your Team
```bash
npm run ffl:create-team
```

This launches an interactive wizard that will:
1. Ask for your team name
2. Guide you through selecting 15 players
3. Help you set your formation
4. Select captain and vice-captain
5. Save your team configuration

### Step 3: Commit Your Team
```bash
# Add your team files
git add teams/YOUR_USERNAME/

# Commit with a meaningful message
git commit -m "feat: Create initial team for YOUR_USERNAME

Team: YOUR_TEAM_NAME
Formation: 4-4-2
Captain: PLAYER_NAME
Budget: £99.5m spent"

# Push to your fork
git push origin main
```

### Step 4: Create Pull Request
1. Go to your fork on GitHub
2. Click "Pull requests" → "New pull request"
3. Ensure:
   - Base repository: `devops-games/fantasy-football`
   - Base: `main`
   - Head repository: `YOUR_USERNAME/fantasy-football-league`
   - Compare: `main`
4. Click "Create pull request"
5. Title: "Register team: YOUR_TEAM_NAME"
6. Description: Add any notes about your team
7. Submit!

### Step 5: Wait for Validation
- GitHub Actions will automatically validate your team
- Check the PR comments for validation results
- If validation fails, fix issues and push updates
- Once approved, your team is registered!

## Making Transfers

### Regular Transfers

#### 1. Create a Transfer Branch
```bash
# Sync with latest
git checkout main
git pull upstream main

# Create branch for gameweek transfers
git checkout -b gameweek-5-transfers
```

#### 2. Make Your Transfers
```bash
npm run ffl:transfer
```

Interactive mode will:
- Show your current team
- Display available budget
- Let you select players to transfer out/in
- Calculate point costs
- Update your team file

#### 3. Commit and Push
```bash
# Add modified files
git add teams/YOUR_USERNAME/

# Commit with transfer details
git commit -m "transfers: Gameweek 5

OUT: Sterling (£10.0m)
IN: Saka (£8.5m)
Free transfers used: 1
Points deduction: 0"

# Push your branch
git push origin gameweek-5-transfers
```

#### 4. Create Pull Request
- Go to GitHub and create PR from your branch
- Must be submitted before the gameweek deadline
- Late submissions are automatically rejected

### Quick Transfer (Advanced)
```bash
# One-line transfer
npm run ffl:transfer --out "Sterling" --in "Saka"

# Commit and push
git add -A && git commit -m "transfers: Sterling → Saka" && git push
```

## Using Chips

### Available Chips
- **Wildcard**: Unlimited transfers (2 per season)
- **Free Hit**: One-week unlimited transfers
- **Triple Captain**: Captain scores 3x points
- **Bench Boost**: All 15 players score
- **Mystery Chip**: Revealed January 2025

### How to Use a Chip

#### 1. Create Branch
```bash
git checkout -b gameweek-10-wildcard
```

#### 2. Make Changes
For Wildcard/Free Hit:
```bash
npm run ffl:transfer --chip wildcard
# Make unlimited transfers
```

For Triple Captain/Bench Boost:
```bash
npm run ffl:chip triple-captain
```

#### 3. Create PR with Chip Label
When creating your pull request:
1. Add the appropriate label:
   - `chip:wildcard`
   - `chip:free-hit`
   - `chip:triple-captain`
   - `chip:bench-boost`
   - `chip:mystery`
2. The system will validate chip usage
3. Chip will be marked as used

## Common Git Commands

### Daily Workflow
```bash
# Start your day - sync with latest
git checkout main
git pull upstream main
git push origin main

# Check your status
git status

# See your team
cat teams/YOUR_USERNAME/team.json | jq '.'
```

### Making Changes
```bash
# Create a branch for changes
git checkout -b descriptive-branch-name

# Make your changes
npm run ffl:transfer

# See what changed
git diff

# Stage changes
git add teams/YOUR_USERNAME/

# Commit with message
git commit -m "type: description"

# Push to your fork
git push origin branch-name
```

### Fixing Mistakes
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Discard uncommitted changes
git checkout -- .

# Amend last commit message
git commit --amend -m "new message"
```

### Syncing with Upstream
```bash
# Fetch latest changes
git fetch upstream

# Merge upstream changes
git checkout main
git merge upstream/main

# Resolve conflicts if any
git status  # See conflicted files
# Edit files to resolve
git add .
git commit -m "resolve: merge conflicts"
```

## Troubleshooting

### Common Issues

#### "Permission denied" when pushing
**Problem**: You're trying to push to the main repo instead of your fork
**Solution**: 
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/fantasy-football-league.git
```

#### "Validation failed" on PR
**Problem**: Your team breaks FPL rules
**Solution**: 
```bash
# Run validation locally
npm run ffl:validate

# Fix issues shown
npm run ffl:fix  # Auto-fix where possible

# Commit fixes
git add -A
git commit -m "fix: validation errors"
git push
```

#### "Merge conflict" error
**Problem**: Your branch has conflicts with main
**Solution**:
```bash
# Update your branch
git checkout main
git pull upstream main
git checkout your-branch
git rebase main

# Resolve conflicts in your editor
# Look for <<<<<<< ======= >>>>>>> markers

# Continue after resolving
git add .
git rebase --continue
git push --force-with-lease origin your-branch
```

#### "Deadline exceeded" error
**Problem**: PR submitted after gameweek deadline
**Solution**: Wait for next gameweek - no exceptions!

#### Lost track of changes
```bash
# See history
git log --oneline -10

# See what changed
git diff HEAD~1

# See who changed what
git blame teams/YOUR_USERNAME/team.json
```

## Best Practices

### Commit Messages
Use conventional commits:
- `feat:` New feature (team creation)
- `transfers:` Player transfers
- `fix:` Bug fixes
- `docs:` Documentation
- `chip:` Chip activation

Examples:
```bash
git commit -m "feat: Create initial team with Haaland as captain"
git commit -m "transfers: GW5 - Salah in for Sterling (-4 pts)"
git commit -m "fix: Correct formation to valid 4-4-2"
git commit -m "chip: Activate wildcard for GW10"
```

### Branch Naming
- `gameweek-{n}-transfers` for transfers
- `gameweek-{n}-{chip}` for chip usage
- `fix-{issue}` for fixes
- `feature-{description}` for features

### PR Descriptions
Include relevant information:
```markdown
## Gameweek 5 Transfers

### Changes
- OUT: Sterling (£10.0m) - Injured
- IN: Saka (£8.5m) - Good fixtures

### Team Status
- Free transfers used: 1/2
- Points deduction: 0
- Budget remaining: £1.5m
- Team value: £100.5m

### Notes
Preparing for Arsenal's good fixture run
```

## Advanced Git Techniques

### Cherry-picking Commits
Transfer specific changes between branches:
```bash
# Find commit hash
git log --oneline

# Apply to current branch
git cherry-pick abc123
```

### Stashing Changes
Temporarily save work:
```bash
# Save current changes
git stash

# Do something else
git checkout main
git pull upstream main

# Restore changes
git checkout your-branch
git stash pop
```

### Interactive Rebase
Clean up commit history:
```bash
# Combine last 3 commits
git rebase -i HEAD~3

# In editor, change 'pick' to 'squash' for commits to combine
# Save and exit
```

### Aliases for Efficiency
Add to `~/.gitconfig`:
```ini
[alias]
    st = status
    co = checkout
    br = branch
    cm = commit -m
    pu = push origin
    pl = pull upstream main
    ffl = !npm run ffl:status
```

Use like:
```bash
git st  # status
git cm "transfers: quick change"  # commit
git pu  # push to origin
```

## Git Tips for FFL

### View Team History
```bash
# See all changes to your team
git log --follow teams/YOUR_USERNAME/team.json

# See specific gameweek
git show gameweek-5:teams/YOUR_USERNAME/team.json
```

### Compare Teams
```bash
# Compare with another manager
git diff main:teams/OTHER_USER/team.json teams/YOUR_USERNAME/team.json
```

### Track Your Performance
```bash
# See your points history
git log --follow teams/YOUR_USERNAME/history/

# See specific gameweek performance
cat teams/YOUR_USERNAME/history/gameweek-5.json | jq '.points'
```

### Blame Captain Choices
```bash
# See who to blame for captain picks
git blame teams/YOUR_USERNAME/team.json | grep captain
```

## Learning Resources

### Git Tutorials
- [GitHub's Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)
- [Pro Git Book](https://git-scm.com/book)

### FFL Specific
- [Game Rules](./GAME_RULES.md)
- [CLI Documentation](./CLI_GUIDE.md)
- [FAQ](./FAQ.md)

### Getting Help
- Create an issue for bugs
- Use discussions for questions
- Check PR comments for feedback
- Join our Discord (if available)

## Quick Reference Card

```bash
# Essential Commands
npm run ffl:create-team    # Create team
npm run ffl:transfer       # Make transfers
npm run ffl:status         # Check status
npm run ffl:validate       # Validate locally
npm run ffl:deadline       # Check deadline

# Git Essentials
git status                 # What changed?
git add .                  # Stage changes
git commit -m "msg"        # Commit
git push origin branch     # Push to fork
git pull upstream main     # Sync with league

# PR Workflow
1. Sync: git pull upstream main
2. Branch: git checkout -b gameweek-X
3. Change: npm run ffl:transfer
4. Commit: git commit -m "transfers: ..."
5. Push: git push origin gameweek-X
6. Create PR on GitHub
```

---

Remember: Every decision is tracked in git history - choose wisely! 🚀
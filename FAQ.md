# Frequently Asked Questions (FAQ)

## Table of Contents
1. [General Questions](#general-questions)
2. [Getting Started](#getting-started)
3. [Game Rules](#game-rules)
4. [Git & GitHub](#git--github)
5. [Technical Issues](#technical-issues)
6. [League Management](#league-management)
7. [Scoring & Points](#scoring--points)
8. [Transfers & Team Management](#transfers--team-management)
9. [Chips & Special Features](#chips--special-features)
10. [Troubleshooting](#troubleshooting)

---

## General Questions

### What is the Git-Based Fantasy Football League?
It's the world's first Fantasy Football game played entirely through git version control and GitHub pull requests. Instead of using a traditional web interface, you manage your team by editing JSON files and submitting pull requests. All validation and scoring happens automatically through GitHub Actions.

### Why use git for Fantasy Football?
- **Educational**: Learn professional development workflows while having fun
- **Transparent**: Every decision is tracked in git history
- **Fair**: Automated validation prevents cheating
- **Decentralized**: No central server required
- **Free**: Runs entirely on GitHub's free tier
- **Unique**: Combines gaming with software development skills

### Who is this for?
- Software developers who love football
- Students learning git and GitHub
- Teams looking for a fun way to practice git workflows
- Anyone interested in a unique take on Fantasy Football

### Is this free to play?
Yes! The entire system runs on GitHub's free tier. No servers, no subscription fees, no hidden costs.

### Do I need programming experience?
Basic command-line knowledge is helpful, but we provide step-by-step guides for everything. If you can follow instructions and type commands, you can play!

---

## Getting Started

### How do I join the league?
1. Create a GitHub account (free)
2. Fork the repository
3. Clone to your computer
4. Run `npm run ffl:create-team`
5. Commit your team
6. Create a pull request
7. Wait for validation
8. You're in!

### What software do I need?
- **Required**: Git, Node.js (v18+), npm
- **Recommended**: VSCode or any text editor
- **Optional**: GitHub Desktop for easier git management

### How long does setup take?
First-time setup takes about 15-30 minutes including:
- Installing prerequisites (10 min)
- Creating your team (10 min)
- Submitting your first PR (5 min)

### Can I play on mobile?
While you can view the league on mobile GitHub, team management requires a computer for running CLI commands. We're exploring mobile-friendly options for the future.

### Can I change my team name?
Yes, but only once per season. Edit your team.json file and submit a PR with the change.

---

## Game Rules

### How does scoring work?
We follow official Fantasy Premier League rules:
- Goals: 4-6 points (depending on position)
- Assists: 3 points
- Clean sheets: 1-4 points (depending on position)
- Bonus points for top performers
- Captain scores double points
- [Full scoring details](./GAME_RULES.md#scoring-system)

### What's the budget?
£100 million to select 15 players:
- 2 Goalkeepers
- 5 Defenders
- 5 Midfielders
- 3 Forwards

### How many players can I have from one team?
Maximum 3 players from any single Premier League club.

### When are the deadlines?
Usually 90 minutes before the first match of each gameweek (typically Friday evening or Saturday afternoon UK time). Check with:
```bash
npm run ffl:deadline
```

### What happens if I miss the deadline?
Your PR is automatically rejected by GitHub Actions. No exceptions! Your team from the previous gameweek will be used.

### How do price changes work?
Player prices change based on transfer activity:
- High demand = price rises
- Low demand = price falls
- Maximum change: ±£0.3m per gameweek
- Prices locked during active gameweek

---

## Git & GitHub

### I'm new to git. Where do I start?
Check our [Git Workflow Guide](./GIT_WORKFLOW.md) which explains everything step-by-step. Key commands:
```bash
git add .           # Stage changes
git commit -m "msg" # Commit changes
git push           # Push to GitHub
```

### What's a pull request?
A pull request (PR) is how you propose changes to the main repository. It's like saying "Here are my team changes, please review and accept them."

### Why was my PR rejected?
Common reasons:
1. **Validation failed** - Your team breaks FPL rules
2. **Deadline passed** - Submitted after gameweek deadline
3. **Ownership mismatch** - Editing someone else's team
4. **Merge conflicts** - Your branch is outdated

Run `npm run ffl:validate` locally to check for issues.

### How do I update my fork?
```bash
git checkout main
git pull upstream main
git push origin main
```

### What's the difference between origin and upstream?
- **origin**: Your personal fork on GitHub
- **upstream**: The main league repository

### Can I delete old branches?
Yes! After your PR is merged:
```bash
git branch -d branch-name  # Delete locally
git push origin --delete branch-name  # Delete on GitHub
```

---

## Technical Issues

### "Command not found" error
Make sure you're in the project directory:
```bash
cd fantasy-football-league
npm install  # If first time
```

### "Permission denied" when pushing
You're probably trying to push to the main repo instead of your fork:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/fantasy-football-league.git
```

### Validation fails but my team looks correct
Run detailed validation:
```bash
npm run ffl:validate --verbose
```
Common issues:
- Budget slightly over £100m (check decimal places)
- Duplicate player IDs
- Invalid formation

### My changes aren't showing in the PR
Did you commit and push?
```bash
git status  # Check for uncommitted changes
git add .
git commit -m "fix: Update team"
git push origin your-branch-name
```

### Error: "Merge conflict"
Your branch is outdated. Update it:
```bash
git checkout main
git pull upstream main
git checkout your-branch
git rebase main
# Resolve conflicts in your editor
git add .
git rebase --continue
git push --force-with-lease
```

---

## League Management

### How do I create a private league?
1. Create a league configuration file
2. Submit a PR with label `league-creation`
3. Share the generated code with friends
4. Maximum 20 teams per private league

### Can I join multiple leagues?
Yes! You can join up to 50 leagues total. Your team is the same across all leagues.

### How do I leave a league?
Submit a PR removing your username from the league's members.json file.

### Who can see my team?
Everyone! All teams are public in the git repository. This ensures transparency and prevents cheating.

### How are ties broken?
1. Most goals scored by players
2. Fewest transfers made
3. Alphabetical by team name

---

## Scoring & Points

### When are points calculated?
Automatically via GitHub Actions after all matches in a gameweek are complete (usually Tuesday 2 AM UTC).

### How do I check my points?
```bash
npm run ffl:status  # Current gameweek
npm run ffl:history --gameweek 5  # Specific gameweek
```

### What are bonus points?
The top 3 performing players in each match get bonus points:
- 1st: 3 points
- 2nd: 2 points
- 3rd: 1 point

### Do substitutes score points?
Only if they replace a player who didn't play (0 minutes). This happens automatically.

### How does captain scoring work?
Your captain scores double points. If your captain doesn't play, your vice-captain becomes captain automatically.

### What's the average score?
Typically 50-60 points per gameweek, but this varies based on fixtures and goals scored.

---

## Transfers & Team Management

### How many free transfers do I get?
- 1 free transfer per gameweek
- Can accumulate up to 5 free transfers
- Additional transfers cost -4 points each

### Can I cancel a transfer?
Not after committing and pushing. Think carefully before confirming!

### How do I plan future transfers?
```bash
npm run ffl:transfer --plan --gameweek 10
```
This shows changes without saving them.

### Why can't I afford a player?
Check your available budget:
```bash
npm run ffl:status  # Shows current budget
```
You might need to sell expensive players first.

### Can I change my formation?
Yes, anytime before the deadline:
```bash
npm run ffl:formation
```

### How do I change my captain?
```bash
npm run ffl:captain
```
Or edit team.json directly and set the captain and viceCaptain fields.

---

## Chips & Special Features

### What chips are available?
1. **Wildcard** (2x): Unlimited transfers for one gameweek
2. **Free Hit** (1x): Unlimited transfers, team reverts next week
3. **Triple Captain** (1x): Captain scores 3x points
4. **Bench Boost** (1x): All 15 players score points
5. **Mystery Chip**: Revealed January 2025

### How do I use a chip?
Add the appropriate label to your PR:
- `chip:wildcard`
- `chip:free-hit`
- `chip:triple-captain`
- `chip:bench-boost`

### Can I use multiple chips at once?
No, only one chip per gameweek.

### When should I use my Wildcard?
Common strategies:
- Early season: Fix initial team mistakes
- International breaks: Navigate injuries
- Double gameweeks: Maximize players with 2 fixtures

### What happens with Free Hit?
Your team changes for one week only, then automatically reverts to your previous team.

---

## Troubleshooting

### My team disappeared!
Check you're on the right branch:
```bash
git branch  # See current branch
git checkout main
```

### I accidentally deleted my team file
Restore from git:
```bash
git checkout HEAD -- teams/YOUR_USERNAME/team.json
```

### GitHub Actions aren't running
Check:
1. PR is from your fork (not a branch on main repo)
2. You've enabled Actions in your fork settings
3. The workflow files exist in `.github/workflows/`

### I can't see validation results
Look for bot comments on your PR. If missing:
1. Check Actions tab for errors
2. Ensure workflows have permission to comment

### My PR has been open for days
Possible reasons:
- Validation is failing (check comments)
- Waiting for gameweek to complete
- Maintainers haven't reviewed yet

Tag `@devops-games/maintainers` if urgent.

### Local validation passes but GitHub fails
Ensure your fork is up-to-date:
```bash
git pull upstream main
npm install  # Update dependencies
```

### How do I debug issues?
Enable debug mode:
```bash
export FFL_DEBUG=true
npm run ffl:validate
```

### I found a bug! What do I do?
1. Check if it's already reported in [Issues](https://github.com/devops-games/fantasy-football/issues)
2. If not, create a new issue with:
   - Clear description
   - Steps to reproduce
   - Error messages
   - Your environment (OS, Node version)

---

## Advanced Questions

### Can I automate my team management?
While you can script local operations, PRs must be manually created to ensure human participation. No bots allowed!

### How is data stored?
All data is stored as JSON files in the git repository:
- `/teams/` - User teams
- `/data/players/` - Player database
- `/leagues/` - League standings
- `/history/` - Historical data

### Can I contribute to the project?
Yes! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines. We welcome:
- Bug fixes
- Feature additions
- Documentation improvements
- Testing

### Is there an API?
No traditional API, but you can:
- Parse JSON files directly from the repo
- Use GitHub's API to read data
- Build your own tools on top

### Can I run my own league?
Yes! Fork the entire repository and customize:
- Modify rules in `/data/rules/`
- Change scoring system
- Add custom features
- Run your own instance

### How do I export my data?
```bash
# Export team
cat teams/YOUR_USERNAME/team.json > my-team-backup.json

# Export history
npm run ffl:history --export --format csv > my-history.csv
```

### Can I analyze league data?
Yes! All data is open. You can:
- Clone the repo and analyze JSON files
- Build visualizations
- Create statistics tools
- Share insights with the community

---

## Didn't Find Your Answer?

### More Resources
- [README](./README.md) - Project overview
- [Game Rules](./GAME_RULES.md) - Detailed FPL rules
- [Git Workflow](./GIT_WORKFLOW.md) - Git instructions
- [CLI Guide](./CLI_GUIDE.md) - Command documentation
- [Architecture](./ARCHITECTURE.md) - Technical details

### Get Help
- **GitHub Discussions**: Ask questions
- **Issues**: Report bugs
- **Discord**: Community chat (if available)
- **Email**: support@devops-games.com

### Suggest FAQ Additions
If your question isn't answered here, please:
1. Check GitHub Discussions first
2. Create a new discussion if not found
3. We'll add common questions to this FAQ

---

*Last updated: January 2025*
*Version: 1.0.0*
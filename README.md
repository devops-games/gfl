# Git-Based Fantasy Football League

A revolutionary approach to Fantasy Football where software engineers use git workflows, pull requests, and CI/CD pipelines to manage their teams. This is the world's first "Infrastructure as Game" implementation.

## 🎮 What Makes This Unique?

This isn't just another fantasy football app. It's a game played entirely through git:
- **Fork & PR Workflow**: Each player forks the repo and submits PRs to make changes
- **Git as Database**: All team data stored as JSON files in version control
- **GitHub Actions as Referee**: Automated validation and scoring through CI/CD
- **Commits as Audit Trail**: Complete history of every decision
- **DevOps as Gameplay**: Learn professional development workflows while playing

## 🚀 Quick Start

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/{your-username}/fantasy-football-league.git
cd fantasy-football-league

# 3. Add upstream remote
git remote add upstream https://github.com/devops-games/fantasy-football.git

# 4. Install dependencies
npm install

# 5. Create your team
npm run ffl:create-team

# 6. Commit and push
git add teams/{your-github-username}/
git commit -m "feat: Register team for {your-username}"
git push origin main

# 7. Create a PR to join the league!
```

## 📖 How It Works

### The Game Flow
1. **Team Registration**: Fork the repo, create your team via CLI, submit a PR
2. **Weekly Management**: Make transfers through PRs before each gameweek deadline
3. **Validation**: GitHub Actions automatically validate all changes against FPL rules
4. **Scoring**: Automated gameweek processing calculates points from real match data
5. **Competition**: League standings updated automatically after each gameweek

### Key Commands

```bash
npm run ffl:create-team    # Interactive team creation
npm run ffl:transfer       # Make transfers for upcoming gameweek  
npm run ffl:status         # View your team and league position
npm run ffl:simulate       # Simulate points for upcoming gameweek
npm run ffl:deadline       # Show next transfer deadline
npm run ffl:validate       # Validate your team locally
```

## 🏆 Game Rules

Based on official Fantasy Premier League rules:
- **Budget**: £100 million to pick 15 players
- **Squad**: 2 goalkeepers, 5 defenders, 5 midfielders, 3 forwards
- **Team Limit**: Maximum 3 players from any Premier League club
- **Transfers**: 1 free transfer per week (can accumulate up to 5)
- **Extra Transfers**: -4 points per additional transfer
- **Captain**: Scores double points
- **Chips**: Wildcard, Free Hit, Triple Captain, Bench Boost

## 🔧 Technical Architecture

### Repository Structure
```
fantasy-football-league/
├── .github/workflows/     # GitHub Actions for validation & scoring
├── data/
│   ├── players/          # Player database and prices
│   ├── fixtures/         # Match schedules
│   └── rules/            # Game rules configuration
├── teams/                # Each user's team in their subdirectory
├── leagues/              # League standings and configurations
├── scripts/              # Validation and scoring scripts
└── cli/                  # Command-line interface tool
```

### Validation Pipeline
Every PR triggers automated validation:
- ✅ Budget constraints
- ✅ Squad composition rules
- ✅ Transfer deadlines
- ✅ Ownership verification
- ✅ Points calculations

## 🎯 Why This Approach?

### For Developers
- Learn git workflows in a fun, practical way
- Practice PR etiquette and code review
- Understand CI/CD pipelines
- Experience collaborative development

### For the Game
- **Transparent**: All teams and changes are public
- **Fair**: Automated validation prevents cheating
- **Auditable**: Complete history of all decisions
- **Decentralized**: No central server required
- **Educational**: Combines gaming with professional skills

## 📚 Documentation

- [Game Rules](./docs/GAME_RULES.md) - Detailed FPL rules and scoring
- [Git Workflow Guide](./docs/GIT_WORKFLOW.md) - How to use git for team management
- [Architecture](./docs/ARCHITECTURE.md) - Technical design and implementation
- [CLI Documentation](./docs/CLI_GUIDE.md) - Command-line tool usage
- [Contributing](./docs/CONTRIBUTING.md) - How to contribute to the project

## 🤝 Community

- **League Chat**: Discussions happen in PR comments
- **Issues**: Report bugs or suggest features
- **Wiki**: Community strategies and tips

## 🏗️ Project Status

This is a novel concept in active development. Current features:
- [x] Core architecture design
- [x] Validation system design
- [ ] CLI tool implementation
- [ ] GitHub Actions workflows
- [ ] Points calculation engine
- [ ] Web dashboard

## 📝 License

MIT License - See [LICENSE](./LICENSE) for details

## 🙏 Acknowledgments

- Inspired by Fantasy Premier League
- Built for the developer community
- Powered by GitHub Actions

---

**Ready to revolutionize fantasy football?** Fork the repo and join the league!
# Git Football League

> Fantasy Football, Forked

A revolutionary approach to Fantasy Football using git workflows, pull requests, to manage teams and CI/CD pipelines to enforce the rules.

## 📖 How Does It Work?

Unlike traditional fantasy football platforms, GFL uses git as the game engine:

1. **Fork the League Repository** → Your fork becomes your team's home
2. **Create Your Team** → Use the CLI to select 15 players within £100m budget
3. **Submit a Pull Request** → Your team joins the league when PR is merged
4. **Make Weekly Transfers** → Edit your team JSON, create PR before deadline
5. **GitHub Actions Validate** → Automated checks ensure all rules are followed
6. **PR Gets Merged** → Your changes are accepted for the gameweek
7. **Points Calculated Automatically** → GitHub Actions process match results
8. **League Table Updates** → Rankings stored in git, visible to all

Every action creates a permanent record in git history. No black box algorithms, no hidden data - just transparent, auditable gameplay through version control.

## 🎮 What Makes This Unique?

This isn't just another fantasy football app. It's a game played entirely through git:
- **Fork & PR Workflow**: Each player forks the repo and submits PRs to make changes
- **Git as Database**: Team and player data stored as JSON files, configuration as YAML, all in version control
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

# 5. Install the CLI globally
npm link

# 6. Initialize and create your team (now with Ink-powered UI!)
gfl init
gfl create-team

# 7. Commit and push
git add teams/{your-github-username}/
git commit -m "feat: Register team for {your-username}"
git push origin main

# 8. Create a PR to join the league!
```

## 📖 How It Works

### The Game Flow
1. **Team Registration**: Fork the repo, create your team via CLI, submit a PR
2. **Weekly Management**: Make transfers through PRs before each gameweek deadline
3. **Validation**: GitHub Actions automatically validate all changes against FPL rules
4. **Scoring**: Automated gameweek processing calculates points from real match data
5. **Competition**: League standings updated automatically after each gameweek

### Key Commands (Now with Ink React UI!)

The CLI now features a modern React-based interface using Ink:

the `gfl` command line utility


```bash
gfl create-team    # Interactive team creation
gfl transfer       # Make transfers for upcoming gameweek  
gfl status         # View your team and league position
gfl simulate       # Simulate points for upcoming gameweek
gfl deadline       # Show next transfer deadline
gfl validate       # Validate your team locally
```

#### Interactive Mode Features
- 🎨 **React Components**: Built with Ink for smooth, flicker-free updates
- 🌈 **Gradient Text**: Beautiful rainbow gradients for titles
- ⚡ **Real-time Updates**: UI updates without screen clearing
- 🎮 **Smooth Navigation**: Responsive keyboard controls
- 📊 **Dynamic Layouts**: Flexible box layouts that adapt to content
- 🔄 **Loading Spinners**: Smooth animations during async operations

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
gfl/
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
- [x] CLI tool implementation
- [ ] GitHub Actions workflows
- [ ] Points calculation engine
- [ ] Web dashboard

### New: Ink-Powered CLI
The CLI has been completely rebuilt using Ink (React for CLIs):
- Modern component-based architecture
- Smooth animations and transitions
- Real-time UI updates
- Beautiful gradient effects
- Responsive keyboard navigation

## 📝 License

MIT License - See [LICENSE](./LICENSE) for details

## 🙏 Acknowledgments

- Friday brown bag for inspiring this idea

---

**Ready to revolutionize fantasy football?** Fork the repo and join the league!

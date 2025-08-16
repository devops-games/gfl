# Contributing to Fantasy Football League

Thank you for your interest in contributing to the git-based Fantasy Football League! This document provides guidelines and instructions for contributing to the project.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [How to Contribute](#how-to-contribute)
3. [Development Setup](#development-setup)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Issue Guidelines](#issue-guidelines)
8. [Documentation](#documentation)

## Code of Conduct

### Our Pledge
We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual identity.

### Our Standards
Examples of behavior that contributes to creating a positive environment:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior:
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information
- Other conduct which could be considered inappropriate

### Enforcement
Violations may result in temporary or permanent ban from the project. Report issues to the maintainers at devops-games@example.com.

## How to Contribute

### Ways to Contribute
1. **Playing the game** - Join the league and provide feedback
2. **Report bugs** - Help us identify issues
3. **Suggest features** - Share ideas for improvements
4. **Write code** - Fix bugs or implement features
5. **Improve documentation** - Help others understand the project
6. **Review PRs** - Help review code contributions
7. **Create content** - Write tutorials, create videos

### Getting Started
1. Fork the repository
2. Set up your development environment
3. Find an issue to work on (check "good-first-issue" label)
4. Create a branch for your work
5. Make your changes
6. Submit a pull request

## Development Setup

### Prerequisites
```bash
# Required versions
Node.js: 18.0.0 or higher
npm: 8.0.0 or higher
git: 2.30.0 or higher

# Optional but recommended
VSCode or similar editor
GitHub CLI
Docker (for testing)
```

### Local Development
```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/fantasy-football-league.git
cd fantasy-football-league

# 2. Add upstream remote
git remote add upstream https://github.com/devops-games/fantasy-football.git

# 3. Install dependencies
npm install

# 4. Set up git hooks
npm run setup:hooks

# 5. Create .env file
cp .env.example .env
# Edit .env with your settings

# 6. Run tests
npm test

# 7. Start development
npm run dev
```

### Development Scripts
```bash
npm run dev          # Start development server
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
npm run validate     # Run all checks
npm run build        # Build for production
```

## Coding Standards

### JavaScript/TypeScript Style Guide
We follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with some modifications:

```javascript
// ✅ Good
const calculatePoints = (player, gameweekData) => {
  const basePoints = gameweekData[player.id]?.points || 0;
  const captainMultiplier = player.isCaptain ? 2 : 1;
  
  return basePoints * captainMultiplier;
};

// ❌ Bad
function calc_points(p, gw_data) {
  var points = gw_data[p.id] ? gw_data[p.id].points : 0
  if(p.isCaptain) points *= 2
  return points
}
```

### File Structure
```
src/
├── commands/        # CLI commands
│   ├── create-team.js
│   └── transfer.js
├── validation/      # Validation logic
│   ├── rules/
│   └── engine.js
├── scoring/         # Points calculation
│   ├── calculator.js
│   └── rules.js
├── utils/          # Utility functions
│   ├── git.js
│   └── format.js
└── tests/          # Test files
    ├── unit/
    └── integration/
```

### Naming Conventions
```javascript
// Files: kebab-case
create-team.js
validate-transfer.js

// Classes: PascalCase
class TeamValidator { }
class PointsCalculator { }

// Functions/Variables: camelCase
const calculatePoints = () => {};
const playerData = {};

// Constants: UPPER_SNAKE_CASE
const MAX_PLAYERS_PER_TEAM = 3;
const BUDGET_LIMIT = 100.0;

// Private methods: underscore prefix
class Team {
  _validateBudget() { }
}
```

### Comments and Documentation
```javascript
/**
 * Calculate points for a player in a gameweek
 * @param {Object} player - Player object with id and position
 * @param {Object} matchData - Match statistics for the player
 * @param {boolean} isCaptain - Whether player is captain
 * @returns {number} Total points for the player
 * @example
 * calculatePlayerPoints(
 *   { id: 'player_001', position: 'MID' },
 *   { goals: 1, assists: 2 },
 *   true
 * ); // Returns 22 (doubled for captain)
 */
function calculatePlayerPoints(player, matchData, isCaptain = false) {
  // Implementation
}
```

### Error Handling
```javascript
// ✅ Good - Specific error handling
try {
  const team = await loadTeam(username);
  return validateTeam(team);
} catch (error) {
  if (error.code === 'TEAM_NOT_FOUND') {
    console.error(`Team not found for user: ${username}`);
    return { valid: false, error: 'Team does not exist' };
  }
  
  if (error.code === 'VALIDATION_ERROR') {
    console.error('Validation failed:', error.message);
    return { valid: false, error: error.message };
  }
  
  // Unexpected error
  console.error('Unexpected error:', error);
  throw error;
}

// ❌ Bad - Generic error handling
try {
  // do something
} catch (e) {
  console.log('Error');
}
```

## Testing Guidelines

### Test Structure
```javascript
// tests/unit/validation/budget.test.js
describe('Budget Validation', () => {
  describe('validateBudget', () => {
    it('should accept team within budget', () => {
      const team = createTeamWithBudget(99.5);
      const result = validateBudget(team);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should reject team over budget', () => {
      const team = createTeamWithBudget(101.0);
      const result = validateBudget(team);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Budget exceeded');
    });
  });
});
```

### Testing Requirements
- Minimum 80% code coverage
- All new features must include tests
- All bug fixes must include regression tests
- Tests must be deterministic (no random failures)
- Use meaningful test descriptions

### Test Categories
1. **Unit Tests** - Test individual functions/classes
2. **Integration Tests** - Test component interactions
3. **E2E Tests** - Test complete workflows
4. **Performance Tests** - Test with large datasets

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- budget.test.js

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

## Pull Request Process

### Before Creating a PR
1. **Update your fork**
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes**
   - Follow coding standards
   - Write/update tests
   - Update documentation

4. **Test locally**
   ```bash
   npm run validate  # Runs all checks
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: Add new feature"
   ```

### Commit Message Format
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks
- `perf:` Performance improvements

Examples:
```bash
feat(cli): Add transfer planning mode
fix(validation): Correct budget calculation for sold players
docs: Update CLI guide with new commands
test(scoring): Add tests for bonus points calculation
```

### Creating the PR
1. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

2. Go to GitHub and create PR

3. Fill out PR template:
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Changes Made
   - Change 1
   - Change 2
   
   ## Testing
   - [ ] Tests pass locally
   - [ ] Added new tests
   - [ ] Updated documentation
   
   ## Screenshots (if applicable)
   
   ## Related Issues
   Fixes #123
   ```

### PR Review Process
1. Automated checks run (tests, linting, validation)
2. Code review by maintainers
3. Address feedback
4. Approval from maintainer
5. Merge into main branch

### After PR is Merged
```bash
# Delete local branch
git branch -d feature/your-feature-name

# Delete remote branch
git push origin --delete feature/your-feature-name

# Update your fork
git checkout main
git pull upstream main
git push origin main
```

## Issue Guidelines

### Creating Issues

#### Bug Report Template
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS 12.0]
- Node version: [e.g., 18.0.0]
- npm version: [e.g., 8.0.0]

## Additional Context
Any other relevant information

## Possible Solution
Optional: Suggest a fix
```

#### Feature Request Template
```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches considered

## Additional Context
Mockups, examples, etc.
```

### Working on Issues
1. Check if someone is already working on it
2. Comment that you'd like to work on it
3. Wait for assignment from maintainer
4. Create PR referencing the issue

### Issue Labels
- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvements
- `good-first-issue` - Good for newcomers
- `help-wanted` - Extra attention needed
- `question` - Further information requested
- `wontfix` - Will not be worked on
- `duplicate` - Duplicate of another issue
- `invalid` - Not a valid issue

## Documentation

### Documentation Requirements
- All public APIs must be documented
- Include examples for complex features
- Keep documentation up-to-date with code changes
- Use clear, concise language
- Include diagrams where helpful

### Documentation Structure
```
docs/
├── README.md           # Project overview
├── GAME_RULES.md      # FPL rules
├── ARCHITECTURE.md    # Technical design
├── GIT_WORKFLOW.md    # Git guide
├── CLI_GUIDE.md       # CLI documentation
├── API.md             # API reference
├── CONTRIBUTING.md    # This file
└── FAQ.md            # Frequently asked questions
```

### Writing Style
- Use active voice
- Keep sentences short and clear
- Use examples liberally
- Define technical terms
- Include links to related docs

### Updating Documentation
```bash
# When adding a new feature
1. Update relevant .md files
2. Add JSDoc comments to code
3. Update CLI help text
4. Add to FAQ if needed

# Check documentation
npm run docs:check

# Generate API docs
npm run docs:generate
```

## Release Process

### Version Numbering
We use [Semantic Versioning](https://semver.org/):
- MAJOR.MINOR.PATCH (e.g., 1.2.3)
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Release notes drafted
- [ ] Tag created

### Release Commands
```bash
# Patch release (1.0.0 -> 1.0.1)
npm version patch

# Minor release (1.0.0 -> 1.1.0)
npm version minor

# Major release (1.0.0 -> 2.0.0)
npm version major

# Create release tag
git tag -a v1.2.3 -m "Release version 1.2.3"
git push upstream v1.2.3
```

## Getting Help

### Resources
- [Project Documentation](./README.md)
- [GitHub Discussions](https://github.com/devops-games/fantasy-football/discussions)
- [Issue Tracker](https://github.com/devops-games/fantasy-football/issues)
- [Discord Server](#) (if available)

### Contact
- General: devops-games@example.com
- Security: security@devops-games.com

### FAQ for Contributors

**Q: How do I get started?**
A: Check issues labeled "good-first-issue" and follow the setup guide above.

**Q: Can I work on multiple issues?**
A: Yes, but please limit yourself to 2-3 open PRs at a time.

**Q: How long before my PR is reviewed?**
A: We aim to review PRs within 48-72 hours.

**Q: Can I add a new dependency?**
A: Please discuss in an issue first. We try to minimize dependencies.

**Q: What if my PR fails checks?**
A: Check the failure details and fix the issues. Ask for help if needed.

## Recognition

### Contributors
All contributors are recognized in:
- README.md contributors section
- CONTRIBUTORS.md file
- GitHub contributors page

### Special Recognition
- 🏆 Top contributors get special badges
- 📝 Documentation contributors get writer badge
- 🐛 Bug hunters get debugger badge
- 🎨 UI/UX contributors get designer badge

## Thank You!
Your contributions make this project better for everyone. Whether you're fixing a typo, reporting a bug, or implementing a major feature, every contribution matters!

Happy coding! 🚀
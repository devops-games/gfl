# Claude Development Instructions for Git Football League

This document provides instructions for Claude when working on the Git Football League (GFL) project.

## Project Overview
Git Football League is a revolutionary fantasy football game played entirely through git workflows, pull requests, and GitHub Actions. Players manage teams using version control as the core game mechanic.

## Core Development Standards

### Language and TypeScript Requirements
- **Always use TypeScript** for all new development
- **Never use `any` type** - always provide proper type definitions
- Use strict TypeScript configuration settings
- Define interfaces for all data structures
- Use type guards and type assertions appropriately
- Leverage TypeScript's utility types (Partial, Required, Pick, etc.)

### Code Style Guidelines
- Use British English spelling throughout the codebase
- Avoid excessive use of hyphens in comments and documentation
- Write concise, clear code without unnecessary verbosity
- Use meaningful variable and function names
- Keep functions focused and single-purpose
- Maximum line length: 100 characters

### CLI Development Standards
- Use `commander` for command parsing
- Use `inquirer` for interactive prompts
- Use `ora` for loading spinners
- Use `chalk` for coloured terminal output
- Use `cli-table3` for formatted tables
- Implement both interactive and direct command modes
- Always provide `--help` for commands
- Include validation feedback with clear error messages

## Git and GitHub Integration

### Pull Request Validation
- All team changes must go through PRs
- Validate team data against FPL rules
- Check budget constraints (£100m limit)
- Verify squad composition (2 GK, 5 DEF, 5 MID, 3 FWD)
- Enforce maximum 3 players per Premier League club
- Validate transfer deadlines

### GitHub Actions Workflows
- Implement comprehensive validation workflows
- Use matrix builds for parallel processing
- Cache dependencies for performance
- Clear status checks and feedback comments
- Automated points calculation after gameweeks

## Data Structure Standards

### JSON Data Files
- Team data stored in `teams/{github-username}/team.json`
- Player database in `data/players/players.json`
- League standings in `leagues/global/standings.json`
- Use consistent schema across all JSON files
- Include metadata fields (created, lastModified, version)

### YAML Configuration
- Game rules in `data/rules/rules.yaml`
- League settings in `leagues/{league-name}/config.yaml`
- Use YAML for human-editable configuration
- Include comments for clarity

## Command Structure

### Core Commands to Maintain
```bash
gfl create-team    # Interactive team creation
gfl transfer       # Make transfers
gfl status         # View team and league position
gfl validate       # Validate team locally
gfl deadline       # Show next deadline
gfl captain        # Set captain
gfl chip           # Use special chips
gfl simulate       # Run simulations
```

### Command Patterns
- Interactive mode as default where appropriate
- Direct mode with flags for automation
- JSON output option for scripting
- Verbose and quiet modes
- Dry-run capabilities for testing

## Testing Requirements

### Test Coverage
- Unit tests for validation logic
- Integration tests for CLI commands
- End-to-end tests for complete workflows
- Mock external API calls
- Test error handling and edge cases

### Test Structure
```typescript
describe('Team Validation', () => {
  describe('Budget Validation', () => {
    it('should reject team over budget', () => {
      // Test implementation
    });
  });
});
```

## Documentation Standards

### Code Documentation
- JSDoc comments for all public functions
- Type definitions with clear descriptions
- Example usage in comments
- Link to relevant game rules where applicable

### User Documentation
- Keep README.md concise and focused
- Detailed guides in `docs/` directory
- Include practical examples
- Maintain CLI help text accuracy

## Performance Considerations

### Optimisation Guidelines
- Use shallow git clones where possible
- Implement caching for frequently accessed data
- Paginate large datasets
- Minimise API calls to external services
- Use async/await for concurrent operations

## Security Practices

### Data Validation
- Sanitise all user inputs
- Validate GitHub usernames match PR authors
- Never store sensitive tokens in code
- Use environment variables for configuration
- Implement rate limiting for API calls

## Error Handling

### User-Friendly Errors
```typescript
if (budget > 100.0) {
  throw new ValidationError(
    `Budget exceeded: £${budget}m > £100.0m\n` +
    `Please remove players or choose cheaper alternatives.`
  );
}
```

### Error Recovery
- Provide actionable error messages
- Suggest fixes where possible
- Include relevant documentation links
- Log errors appropriately

## Fantasy Football Rules Integration

### Core Rules to Enforce
- Budget: £100 million
- Squad: 15 players (2 GK, 5 DEF, 5 MID, 3 FWD)
- Maximum 3 players per club
- Transfer cost: -4 points per extra transfer
- Valid formations (minimum 3 DEF, 2 MID, 1 FWD)
- Chip usage (Wildcard, Free Hit, Triple Captain, Bench Boost)

### Scoring System
- Implement official FPL scoring rules
- Handle bonus points (BPS)
- Process auto-substitutions
- Calculate captain double points

## Development Workflow

### Branch Strategy
- Feature branches: `feature/description`
- Bug fixes: `fix/issue-description`
- Gameweek branches: `gameweek-{n}-{action}`

### Commit Messages
```
feat: Add triple captain chip activation
fix: Correct budget calculation for transfers
transfers: GW5 - Salah in for Sterling
docs: Update CLI guide with new commands
test: Add validation tests for formations
```

## CLI User Experience

### Interactive Mode Excellence
- Clear visual hierarchy with emojis
- Progress indicators for long operations
- Colour coding for different information types
- Table formatting for data display
- Contextual help and suggestions

### Response Formatting
- Success: Green text with ✅
- Warning: Yellow text with ⚠️
- Error: Red text with ❌
- Info: Blue text with ℹ️

## Integration Points

### External APIs
- Fantasy Premier League API for player data
- GitHub API for PR management
- Rate limit handling
- Fallback mechanisms for API failures

## Future Considerations

### Scalability
- Design for thousands of concurrent users
- Consider sharding strategies
- Implement caching layers
- Optimise GitHub Actions usage

### Feature Extensions
- Web dashboard (separate from CLI)
- Mobile app integration
- AI-powered suggestions
- League customisation options

## Important Notes

- **NEVER** create files unless absolutely necessary
- **ALWAYS** prefer editing existing files
- **DO NOT** create documentation unless explicitly requested
- Validate all changes locally before committing
- Test with realistic data volumes
- Consider backwards compatibility
- Maintain audit trail integrity

## Quick Reference

### File Locations
- CLI source: `src/`
- Commands: `src/commands/`
- Validation: `scripts/validate-team.js`
- Tests: `tests/`
- Documentation: `docs/`
- Team data: `teams/{username}/`
- League data: `leagues/`

### Key Dependencies
- commander: CLI framework
- inquirer: Interactive prompts
- TypeScript: Type safety
- Jest: Testing framework
- GitHub Actions: CI/CD

### Testing Commands
```bash
npm test           # Run all tests
npm run lint       # Check code style
npm run typecheck  # TypeScript validation
npm run validate   # Validate team data
```

Remember: This is a game that teaches professional development workflows whilst being genuinely fun to play. Maintain that balance in all development decisions.
- Refer to the @docs/GAME_RULES.md to understand functionality, rules and constraints when creating and updating features. Consider the entire workflow, and how a user will use the system. Be aware that there are potentially multiple happy paths.
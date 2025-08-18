# Git Fantasy League CLI

A TypeScript-based command-line interface for managing your Fantasy Football team through git workflows.

## Quick Start

```bash
# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Link the CLI globally
npm link

# Initialize your configuration
gfl init

# Start interactive mode
gfl
```

## Project Structure

```
src/
├── index.ts                 # Main CLI entry point
├── commands/                # Command implementations
│   ├── interactive.ts       # Interactive mode
│   ├── status.ts           # Team status command
│   ├── transfer.ts         # Transfer management
│   ├── create-team.ts      # Team creation
│   ├── validate.ts         # Team validation
│   └── ...                 # Other commands
├── services/               # Business logic
│   ├── team-service.ts     # Team management
│   └── league-service.ts   # League operations
└── utils/                  # Utilities
    ├── config-manager.ts   # Configuration management
    └── display.ts          # Display helpers
```

## Development

```bash
# Run in development mode
npm run dev

# Watch for changes
npm run watch

# Run linter
npm run lint

# Run tests
npm run test
```

## Usage Modes

### Interactive Mode
```bash
gfl
# or
gfl interactive
```

### Command Mode
```bash
gfl status
gfl transfer --out "Sterling" --in "Saka"
gfl validate
gfl sync push
```

## Key Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Interactive UI**: Beautiful CLI with colors, spinners, and tables
- **Dual Mode**: Use interactively or as traditional CLI commands
- **Configuration**: Hierarchical config system with environment variable support
- **Git Integration**: Seamless sync with GitHub repository
- **Validation**: Comprehensive team validation against FPL rules

## Technologies Used

- **Commander.js**: Command parsing and CLI structure
- **Inquirer.js**: Interactive prompts and menus
- **Chalk**: Terminal string styling
- **Ora**: Elegant terminal spinners
- **CLI-Table3**: Beautiful Unicode tables
- **TypeScript**: Type-safe development
- **Conf**: Configuration management

## Configuration

The CLI uses a hierarchical configuration system:

1. **Global Config**: `~/.gflrc`
2. **Project Config**: `./.gflrc.json`
3. **Environment Variables**: `GFL_*`
4. **Command Line Options**: Highest priority

## Testing

The CLI includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- status.test.ts
```

## Building for Production

```bash
# Build optimised version
npm run build

# Package for distribution
npm pack
```

## Architecture Decisions

### Why TypeScript?
- Type safety prevents runtime errors
- Better IDE support and autocomplete
- Modern JavaScript features with backward compatibility
- Easier refactoring and maintenance

### Why Not NestJS?
- NestJS is designed for server applications with dependency injection
- Overkill for a CLI tool
- Commander.js is purpose-built for CLIs
- Simpler architecture with less boilerplate

### Package Choices
- **Commander**: Industry standard for Node.js CLIs
- **Inquirer**: Best interactive prompt library
- **Chalk/Ora**: Modern terminal UI components
- **Conf**: Simple, reliable configuration management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT
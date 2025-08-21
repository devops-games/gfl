#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import updateNotifier from 'update-notifier';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { interactiveMode } from './commands/interactive';
import { statusCommand } from './commands/status';
import { transferCommand } from './commands/transfer';
import { createTeamCommand } from './commands/create-team';
import { validateCommand } from './commands/validate';
import { deadlineCommand } from './commands/deadline';
import { captainCommand } from './commands/captain';
import { chipCommand } from './commands/chip';
import { simulateCommand } from './commands/simulate';
import { leagueCommand } from './commands/league';
import { historyCommand } from './commands/history';
import { syncCommand } from './commands/sync';
import { configCommand } from './commands/config';
import { initCommand } from './commands/init';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
const version = pkg.version;

const program = new Command();

// Check for updates
updateNotifier({ pkg }).notify();

// ASCII art banner
const showBanner = () => {
  console.log(
    chalk.cyan(
      figlet.textSync('GFL', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      })
    )
  );
  console.log(chalk.gray('Git Fantasy League - Command Line Interface\n'));
};

// Main program configuration
program
  .name('gfl')
  .description('Git Fantasy League CLI - Manage your fantasy football team through git')
  .version(version)
  .option('--no-color', 'Disable colored output')
  .option('--quiet', 'Minimal output')
  .option('--verbose', 'Detailed output')
  .option('--json', 'JSON output for scripting')
  .option('--config <path>', 'Use custom config file')
  .option('--debug', 'Enable debug mode')
  .hook('preAction', (_thisCommand, actionCommand) => {
    if (!actionCommand.opts().quiet && !actionCommand.opts().json) {
      showBanner();
    }
  });

// Interactive mode (default when no command is provided)
program
  .command('interactive', { isDefault: true })
  .alias('i')
  .description('Start interactive mode')
  .action(async (options) => {
    await interactiveMode(options);
  });

// Initialize configuration
program
  .command('init')
  .description('Initialize GFL configuration')
  .option('--github-user <username>', 'GitHub username')
  .option('--team-name <name>', 'Team name')
  .option('--force', 'Overwrite existing configuration')
  .action(async (options) => {
    await initCommand(options);
  });

// Team status
program
  .command('status')
  .alias('s')
  .description('View your team and league position')
  .option('-g, --gameweek <number>', 'Specific gameweek')
  .option('-l, --league <name>', 'Specific league')
  .option('-d, --detailed', 'Show detailed statistics')
  .option('-c, --compact', 'Compact view')
  .action(async (options) => {
    await statusCommand(options);
  });

// Transfers
program
  .command('transfer')
  .alias('t')
  .description('Make player transfers')
  .option('-o, --out <player>', 'Player to transfer out')
  .option('-i, --in <player>', 'Player to transfer in')
  .option('-g, --gameweek <number>', 'Target gameweek')
  .option('-p, --plan', 'Plan mode (no save)')
  .option('-c, --chip <type>', 'Use chip (wildcard/freehit)')
  .option('--batch <file>', 'Batch transfers from file')
  .action(async (options) => {
    await transferCommand(options);
  });

// Create team
program
  .command('create-team')
  .alias('create')
  .description('Create your initial team')
  .option('-t, --template <type>', 'Use a template team')
  .option('-i, --import <file>', 'Import team from JSON file')
  .option('-r, --random', 'Create random team (for testing)')
  .option('-b, --budget <amount>', 'Budget amount', '100')
  .action(async (options) => {
    await createTeamCommand(options);
  });

// Validate team
program
  .command('validate')
  .alias('v')
  .description('Validate team against rules')
  .option('-f, --fix', 'Auto-fix issues where possible')
  .option('-v, --verbose', 'Detailed validation output')
  .option('--file <path>', 'Validate specific team file')
  .action(async (options) => {
    await validateCommand(options);
  });

// View deadlines
program
  .command('deadline')
  .alias('d')
  .description('Show deadlines and fixtures')
  .option('-g, --gameweek <number>', 'Specific gameweek')
  .option('-a, --all', 'Show all future deadlines')
  .option('-f, --fixtures', 'Include fixtures')
  .action(async (options) => {
    await deadlineCommand(options);
  });

// Captain management
program
  .command('captain')
  .alias('c')
  .description('Manage captaincy')
  .option('-s, --set <player>', 'Set captain')
  .option('-v, --vice <player>', 'Set vice-captain')
  .option('--suggest', 'Get captain suggestions')
  .option('--popular', 'Show popular captains')
  .action(async (options) => {
    await captainCommand(options);
  });

// Chip management
program
  .command('chip [action] [type]')
  .description('Manage special chips')
  .option('-c, --check', 'Check chip availability')
  .action(async (action, type, options) => {
    await chipCommand(action, type, options);
  });

// Simulations
program
  .command('simulate')
  .alias('sim')
  .description('Run simulations')
  .option('-c, --captain <player>', 'Set captain for simulation')
  .option('-f, --formation <type>', 'Test different formation')
  .option('-t, --transfers', 'Include planned transfers')
  .option('-m, --monte-carlo', 'Run Monte Carlo simulation')
  .action(async (options) => {
    await simulateCommand(options);
  });

// League management
program
  .command('league <action> [code]')
  .alias('l')
  .description('League management')
  .option('-n, --name <name>', 'League name')
  .option('-t, --type <type>', 'League type')
  .action(async (action, code, options) => {
    await leagueCommand(action, code, options);
  });

// History
program
  .command('history [type]')
  .alias('h')
  .description('View historical data')
  .option('-g, --gameweek <number>', 'Specific gameweek')
  .option('-s, --season', 'Full season summary')
  .option('-e, --export', 'Export to file')
  .option('--format <type>', 'Export format (csv/json)', 'json')
  .action(async (type, options) => {
    await historyCommand(type, options);
  });

// Git sync
program
  .command('sync [action]')
  .description('Synchronize with GitHub')
  .option('--title <title>', 'PR title')
  .option('--description <desc>', 'PR description')
  .action(async (action, options) => {
    await syncCommand(action, options);
  });

// Configuration management
program
  .command('config [action] [key] [value]')
  .description('Manage configuration')
  .action(async (action, key, value) => {
    await configCommand(action, key, value);
  });

// Help command
program
  .command('help [command]')
  .description('Display help for command')
  .action((command) => {
    if (command) {
      const subCommand = program.commands.find(c => c.name() === command);
      if (subCommand) {
        subCommand.outputHelp();
      } else {
        console.log(chalk.red(`Unknown command: ${command}`));
      }
    } else {
      program.outputHelp();
    }
  });

// Error handling
program.exitOverride();

async function main() {
  try {
    await program.parseAsync(process.argv);
    
    // If no arguments provided, start interactive mode
    if (process.argv.length === 2) {
      await interactiveMode({});
    }
  } catch (error: any) {
    if (error.code === 'commander.help') {
      // Help was requested
      process.exit(0);
    } else if (error.code === 'commander.version') {
      // Version was requested
      process.exit(0);
    } else {
      console.error(chalk.red('Error:'), error.message);
      if (program.opts().debug) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }
}

main();
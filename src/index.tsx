#!/usr/bin/env node

import { render } from 'ink';
import { Command } from 'commander';
import updateNotifier from 'update-notifier';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import App from './components/App.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
const version = pkg.version;

const program = new Command();

// Check for updates
updateNotifier({ pkg }).notify();

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
  .option('--debug', 'Enable debug mode');

// Interactive mode (default when no command is provided)
program
  .command('interactive', { isDefault: true })
  .alias('i')
  .description('Start interactive mode')
  .action(async (options) => {
    const { waitUntilExit } = render(<App mode="interactive" options={options} />);
    await waitUntilExit();
  });

// Initialize configuration
program
  .command('init')
  .description('Initialize GFL configuration')
  .option('--github-user <username>', 'GitHub username')
  .option('--team-name <name>', 'Team name')
  .option('--force', 'Overwrite existing configuration')
  .action(async (options) => {
    const { waitUntilExit } = render(<App mode="init" options={options} />);
    await waitUntilExit();
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
    const { waitUntilExit } = render(<App mode="status" options={options} />);
    await waitUntilExit();
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
    const { waitUntilExit } = render(<App mode="transfer" options={options} />);
    await waitUntilExit();
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
    const { waitUntilExit } = render(<App mode="create-team" options={options} />);
    await waitUntilExit();
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
    const { waitUntilExit } = render(<App mode="validate" options={options} />);
    await waitUntilExit();
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
    const { waitUntilExit } = render(<App mode="deadline" options={options} />);
    await waitUntilExit();
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
    const { waitUntilExit } = render(<App mode="captain" options={options} />);
    await waitUntilExit();
  });

// Chip management
program
  .command('chip [action] [type]')
  .description('Manage special chips')
  .option('-c, --check', 'Check chip availability')
  .action(async (action, type, options) => {
    const { waitUntilExit } = render(<App mode="chip" options={{ ...options, action, type }} />);
    await waitUntilExit();
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
    const { waitUntilExit } = render(<App mode="simulate" options={options} />);
    await waitUntilExit();
  });

// League management
program
  .command('league <action> [code]')
  .alias('l')
  .description('League management')
  .option('-n, --name <name>', 'League name')
  .option('-t, --type <type>', 'League type')
  .action(async (action, code, options) => {
    const { waitUntilExit } = render(<App mode="league" options={{ ...options, action, code }} />);
    await waitUntilExit();
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
    const { waitUntilExit } = render(<App mode="history" options={{ ...options, type }} />);
    await waitUntilExit();
  });

// Git sync
program
  .command('sync [action]')
  .description('Synchronize with GitHub')
  .option('--title <title>', 'PR title')
  .option('--description <desc>', 'PR description')
  .action(async (action, options) => {
    const { waitUntilExit } = render(<App mode="sync" options={{ ...options, action }} />);
    await waitUntilExit();
  });

// Configuration management
program
  .command('config [action] [key] [value]')
  .description('Manage configuration')
  .action(async (action, key, value) => {
    const { waitUntilExit } = render(<App mode="config" options={{ action, key, value }} />);
    await waitUntilExit();
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
        console.log(`Unknown command: ${command}`);
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
      const { waitUntilExit } = render(<App mode="interactive" options={{}} />);
      await waitUntilExit();
    }
  } catch (error: any) {
    if (error.code === 'commander.help') {
      // Help was requested
      process.exit(0);
    } else if (error.code === 'commander.version') {
      // Version was requested
      process.exit(0);
    } else {
      console.error('Error:', error.message);
      if (program.opts().debug) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }
}

main();
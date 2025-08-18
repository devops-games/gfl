import inquirer from 'inquirer';
import chalk from 'chalk';
import { statusCommand } from './status';
import { transferCommand } from './transfer';
import { createTeamCommand } from './create-team';
import { validateCommand } from './validate';
import { deadlineCommand } from './deadline';
import { captainCommand } from './captain';
import { chipCommand } from './chip';
import { simulateCommand } from './simulate';
import { leagueCommand } from './league';
import { historyCommand } from './history';
import { syncCommand } from './sync';
import { ConfigManager } from '../utils/config-manager';
import { displayBanner } from '../utils/display';

interface MenuChoice {
  name: string;
  value: string;
  icon: string;
}

export async function interactiveMode(_options: any): Promise<void> {
  const configManager = new ConfigManager();
  const config = await configManager.load();
  
  // Display welcome message
  console.clear();
  displayBanner();
  
  if (config.github?.username) {
    console.log(chalk.green(`Welcome back, @${config.github.username}!`));
    if (config.team?.name) {
      console.log(chalk.gray(`Team: ${config.team.name}`));
    }
  } else {
    console.log(chalk.yellow('Welcome to Git Fantasy League!'));
    console.log(chalk.gray('Run "gfl init" to set up your configuration\n'));
  }
  
  // Main menu loop
  let exit = false;
  while (!exit) {
    const menuChoices: MenuChoice[] = [
      { name: 'View Team Status', value: 'status', icon: '👀' },
      { name: 'Make Transfers', value: 'transfer', icon: '🔄' },
      { name: 'Check League Standings', value: 'league', icon: '📊' },
      { name: 'View Deadlines', value: 'deadline', icon: '⏰' },
      { name: 'Set Captain', value: 'captain', icon: '🎯' },
      { name: 'Use Chip', value: 'chip', icon: '💎' },
      { name: 'Run Simulation', value: 'simulate', icon: '🔮' },
      { name: 'Validate Team', value: 'validate', icon: '✅' },
      { name: 'View History', value: 'history', icon: '📜' },
      { name: 'Sync with GitHub', value: 'sync', icon: '🔄' },
      { name: 'Settings', value: 'settings', icon: '⚙️' },
      { name: 'Exit', value: 'exit', icon: '❌' }
    ];
    
    // If no team exists, show create team option
    if (!config.team?.created) {
      menuChoices.unshift({ name: 'Create Team', value: 'create-team', icon: '🏗️' });
    }
    
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do? (← Back option available in submenus)',
        choices: menuChoices.map(choice => ({
          name: `${choice.icon}  ${choice.name}`,
          value: choice.value
        })),
        pageSize: 15
      }
    ]);
    
    console.clear();
    displayBanner();
    
    let skipPause = false;
    
    switch (action) {
      case 'status':
        const statusResult = await handleStatus();
        skipPause = statusResult === undefined;
        break;
      
      case 'transfer':
        const transferResult = await handleTransfer();
        skipPause = transferResult === undefined;
        break;
      
      case 'create-team':
        const createResult = await handleCreateTeam();
        skipPause = createResult === undefined;
        break;
      
      case 'league':
        const leagueResult = await handleLeague();
        skipPause = leagueResult === undefined;
        break;
      
      case 'deadline':
        const deadlineResult = await handleDeadline();
        skipPause = deadlineResult === undefined;
        break;
      
      case 'captain':
        const captainResult = await handleCaptain();
        skipPause = captainResult === undefined;
        break;
      
      case 'chip':
        const chipResult = await handleChip();
        skipPause = chipResult === undefined;
        break;
      
      case 'simulate':
        await handleSimulate();
        break;
      
      case 'validate':
        await handleValidate();
        break;
      
      case 'history':
        const historyResult = await handleHistory();
        skipPause = historyResult === undefined;
        break;
      
      case 'sync':
        const syncResult = await handleSync();
        skipPause = syncResult === undefined;
        break;
      
      case 'settings':
        const settingsResult = await handleSettings();
        skipPause = settingsResult === undefined;
        break;
      
      case 'exit':
        exit = true;
        console.log(chalk.green('\n👋 Goodbye! Good luck with your team!\n'));
        break;
    }
    
    if (!exit && action !== 'exit' && !skipPause) {
      // Pause before returning to menu
      await inquirer.prompt([
        {
          type: 'input',
          name: 'continue',
          message: chalk.gray('Press Enter to continue...')
        }
      ]);
    }
    
    if (!exit) {
      console.clear();
    }
  }
}

async function handleStatus(): Promise<void> {
  const { view } = await inquirer.prompt([
    {
      type: 'list',
      name: 'view',
      message: 'Select view:',
      choices: [
        { name: '← Back', value: 'back' },
        { name: 'Current Gameweek', value: 'current' },
        { name: 'Specific Gameweek', value: 'specific' },
        { name: 'Season Overview', value: 'season' },
        { name: 'Detailed Statistics', value: 'detailed' }
      ]
    }
  ]);
  
  if (view === 'back') return;
  
  let options: any = {};
  
  if (view === 'specific') {
    const { gameweek } = await inquirer.prompt([
      {
        type: 'number',
        name: 'gameweek',
        message: 'Enter gameweek number:',
        validate: (input) => input >= 1 && input <= 38
      }
    ]);
    options.gameweek = gameweek;
  } else if (view === 'detailed') {
    options.detailed = true;
  }
  
  await statusCommand(options);
}

async function handleTransfer(): Promise<void> {
  const { mode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Transfer mode:',
      choices: [
        { name: '← Back', value: 'back' },
        { name: 'Interactive Transfer', value: 'interactive' },
        { name: 'Quick Transfer', value: 'quick' },
        { name: 'Plan Transfers', value: 'plan' },
        { name: 'Use Wildcard', value: 'wildcard' },
        { name: 'Use Free Hit', value: 'freehit' }
      ]
    }
  ]);
  
  if (mode === 'back') return;
  
  const options: any = {};
  
  if (mode === 'plan') {
    options.plan = true;
  } else if (mode === 'wildcard') {
    options.chip = 'wildcard';
  } else if (mode === 'freehit') {
    options.chip = 'freehit';
  }
  
  await transferCommand(options);
}

async function handleCreateTeam(): Promise<void> {
  const { method } = await inquirer.prompt([
    {
      type: 'list',
      name: 'method',
      message: 'How would you like to create your team?',
      choices: [
        { name: '← Back', value: 'back' },
        { name: 'Build from scratch', value: 'scratch' },
        { name: 'Use a template', value: 'template' },
        { name: 'Import from file', value: 'import' },
        { name: 'Random team (testing)', value: 'random' }
      ]
    }
  ]);
  
  if (method === 'back') return;
  
  const options: any = {};
  
  if (method === 'template') {
    const { template } = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'Select template:',
        choices: [
          { name: 'Balanced Team', value: 'balanced' },
          { name: 'Premium Attack', value: 'attack' },
          { name: 'Budget Defense', value: 'defense' },
          { name: 'Differential Team', value: 'differential' }
        ]
      }
    ]);
    options.template = template;
  } else if (method === 'import') {
    const { file } = await inquirer.prompt([
      {
        type: 'input',
        name: 'file',
        message: 'Enter file path:',
        default: './team.json'
      }
    ]);
    options.import = file;
  } else if (method === 'random') {
    options.random = true;
  }
  
  await createTeamCommand(options);
}

async function handleLeague(): Promise<void> {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'League action:',
      choices: [
        { name: '← Back', value: 'back' },
        { name: 'View Standings', value: 'standings' },
        { name: 'Join League', value: 'join' },
        { name: 'Create League', value: 'create' },
        { name: 'League Info', value: 'info' },
        { name: 'Compare with Rival', value: 'compare' }
      ]
    }
  ]);
  
  if (action === 'back') return;
  
  if (action === 'join') {
    const { code } = await inquirer.prompt([
      {
        type: 'input',
        name: 'code',
        message: 'Enter league code:',
        validate: (input) => input.length === 6
      }
    ]);
    await leagueCommand('join', code, {});
  } else if (action === 'create') {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'League name:'
      },
      {
        type: 'list',
        name: 'type',
        message: 'League type:',
        choices: ['classic', 'h2h', 'draft']
      }
    ]);
    await leagueCommand('create', '', answers);
  } else {
    await leagueCommand(action, '', {});
  }
}

async function handleDeadline(): Promise<void> {
  const { view } = await inquirer.prompt([
    {
      type: 'list',
      name: 'view',
      message: 'Deadline view:',
      choices: [
        { name: '← Back', value: 'back' },
        { name: 'Next Deadline', value: 'next' },
        { name: 'All Deadlines', value: 'all' },
        { name: 'With Fixtures', value: 'fixtures' }
      ]
    }
  ]);
  
  if (view === 'back') return;
  
  const options: any = {};
  if (view === 'all') options.all = true;
  if (view === 'fixtures') options.fixtures = true;
  
  if (view !== 'back') {
    await deadlineCommand(options);
  }
}

async function handleCaptain(): Promise<void> {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Captain action:',
      choices: [
        { name: '← Back', value: 'back' },
        { name: 'Set Captain', value: 'set' },
        { name: 'Get Suggestions', value: 'suggest' },
        { name: 'View Popular Captains', value: 'popular' }
      ]
    }
  ]);
  
  if (action === 'back') return;
  
  const options: any = {};
  if (action === 'suggest') options.suggest = true;
  if (action === 'popular') options.popular = true;
  
  if (action !== 'back') {
    await captainCommand(options);
  }
}

async function handleChip(): Promise<void> {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Chip action:',
      choices: [
        { name: '← Back', value: 'back' },
        { name: 'View Available Chips', value: 'status' },
        { name: 'Activate Wildcard', value: 'wildcard' },
        { name: 'Activate Free Hit', value: 'freehit' },
        { name: 'Activate Triple Captain', value: 'triple' },
        { name: 'Activate Bench Boost', value: 'bench' }
      ]
    }
  ]);
  
  if (action === 'back') return;
  
  if (action === 'status') {
    await chipCommand('status', '', { check: true });
  } else {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to activate ${action}?`,
        default: false
      }
    ]);
    
    if (confirm) {
      await chipCommand('activate', action, {});
    }
  }
}

async function handleSimulate(): Promise<void> {
  const options = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'monteCarlo',
      message: 'Run Monte Carlo simulation (1000 iterations)?',
      default: false
    },
    {
      type: 'confirm',
      name: 'transfers',
      message: 'Include planned transfers?',
      default: false
    }
  ]);
  
  await simulateCommand(options);
}

async function handleValidate(): Promise<void> {
  const { autoFix } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'autoFix',
      message: 'Auto-fix issues where possible?',
      default: false
    }
  ]);
  
  await validateCommand({ fix: autoFix, verbose: true });
}

async function handleHistory(): Promise<void> {
  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'History type:',
      choices: [
        { name: '← Back', value: 'back' },
        { name: 'Season Summary', value: 'season' },
        { name: 'Gameweek History', value: 'gameweek' },
        { name: 'Transfer History', value: 'transfers' },
        { name: 'Points Graph', value: 'graph' }
      ]
    }
  ]);
  
  if (type === 'back') return;
  
  if (type !== 'back') {
    await historyCommand(type, {});
  }
}

async function handleSync(): Promise<void> {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Sync action:',
      choices: [
        { name: '← Back', value: 'back' },
        { name: 'Pull Latest Changes', value: 'pull' },
        { name: 'Push Your Changes', value: 'push' },
        { name: 'Full Sync', value: 'sync' },
        { name: 'Create Pull Request', value: 'pr' }
      ]
    }
  ]);
  
  if (action === 'back') return;
  
  let options: any = {};
  
  if (action === 'pr') {
    const prDetails = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'PR title:',
        default: 'Update team for upcoming gameweek'
      },
      {
        type: 'input',
        name: 'description',
        message: 'PR description (optional):'
      }
    ]);
    options = prDetails;
  }
  
  await syncCommand(action === 'sync' ? undefined : action, options);
}

async function handleSettings(): Promise<void> {
  const configManager = new ConfigManager();
  await configManager.load();
  
  const { section } = await inquirer.prompt([
    {
      type: 'list',
      name: 'section',
      message: 'Settings section:',
      choices: [
        { name: '← Back', value: 'back' },
        { name: 'GitHub Configuration', value: 'github' },
        { name: 'Display Preferences', value: 'display' },
        { name: 'Notification Settings', value: 'notifications' },
        { name: 'Advanced Settings', value: 'advanced' },
        { name: 'Reset to Defaults', value: 'reset' }
      ]
    }
  ]);
  
  if (section === 'back') return;
  
  if (section === 'reset') {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to reset all settings?',
        default: false
      }
    ]);
    
    if (confirm) {
      await configManager.reset();
      console.log(chalk.green('✅ Settings reset to defaults'));
    }
  } else {
    // Handle other settings sections
    console.log(chalk.yellow('Settings management coming soon...'));
  }
}
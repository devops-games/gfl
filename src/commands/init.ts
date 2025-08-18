import chalk from 'chalk';
import inquirer from 'inquirer';
import { ConfigManager } from '../utils/config-manager';
import { createSpinner } from '../utils/display';

export async function initCommand(options: any): Promise<void> {
  console.log(chalk.cyan('\n🎮 Git Fantasy League - Initial Setup\n'));
  
  const configManager = new ConfigManager();
  const existingConfig = await configManager.load();
  
  if (existingConfig.github?.username && !options.force) {
    console.log(chalk.yellow('Configuration already exists!'));
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Do you want to overwrite existing configuration?',
        default: false
      }
    ]);
    
    if (!overwrite) {
      console.log(chalk.gray('Setup cancelled'));
      return;
    }
  }
  
  // Collect configuration
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'githubUsername',
      message: 'Enter your GitHub username:',
      default: options.githubUser || existingConfig.github?.username,
      validate: (input) => input.length > 0 || 'Username is required'
    },
    {
      type: 'input',
      name: 'teamName',
      message: 'Enter your team name (optional):',
      default: options.teamName || existingConfig.team?.name
    },
    {
      type: 'confirm',
      name: 'colorOutput',
      message: 'Enable colored output?',
      default: true
    },
    {
      type: 'confirm',
      name: 'interactive',
      message: 'Use interactive mode by default?',
      default: true
    },
    {
      type: 'list',
      name: 'theme',
      message: 'Select display theme:',
      choices: [
        { name: 'Auto (system)', value: 'auto' },
        { name: 'Light', value: 'light' },
        { name: 'Dark', value: 'dark' }
      ],
      default: 'auto'
    }
  ]);
  
  const spinner = createSpinner('Saving configuration...');
  spinner.start();
  
  try {
    // Save configuration
    const config = {
      github: {
        username: answers.githubUsername,
        defaultBranch: 'main'
      },
      team: {
        name: answers.teamName,
        created: false
      },
      preferences: {
        interactive: answers.interactive,
        colorOutput: answers.colorOutput,
        confirmTransfers: true,
        autoValidate: true,
        timezone: 'Europe/London'
      },
      display: {
        theme: answers.theme,
        showEmojis: true,
        tableStyle: 'rounded' as const,
        dateFormat: 'DD/MM/YYYY',
        currency: '£'
      }
    };
    
    await configManager.save(config);
    spinner.succeed('Configuration saved!');
    
    console.log(chalk.green('\n✅ Setup complete!\n'));
    console.log('Next steps:');
    console.log('1. Run "gfl create-team" to create your team');
    console.log('2. Run "gfl" to start interactive mode');
    console.log('3. Run "gfl help" to see all commands');
    
  } catch (error: any) {
    spinner.fail('Failed to save configuration');
    console.error(chalk.red(error.message));
  }
}
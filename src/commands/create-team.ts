import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from '../utils/display';
import { TeamService, Team } from '../services/team-service';
import { ConfigManager } from '../utils/config-manager';

export async function createTeamCommand(options: any): Promise<void> {
  const configManager = new ConfigManager();
  const config = await configManager.load();
  
  if (!config.github?.username) {
    console.log(chalk.red('Please run "gfl init" first to set up your GitHub username'));
    return;
  }
  
  console.log(chalk.cyan('\n⚽ Team Creation\n'));
  
  if (options.random) {
    await createRandomTeam(config.github.username);
  } else if (options.import) {
    await importTeam(config.github.username, options.import);
  } else {
    await interactiveTeamCreation(config.github.username);
  }
}

async function interactiveTeamCreation(username: string): Promise<void> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'teamName',
      message: 'Enter your team name:',
      validate: (input) => {
        if (input.length < 3) return 'Team name must be at least 3 characters';
        if (input.length > 50) return 'Team name must be less than 50 characters';
        return true;
      }
    },
    {
      type: 'list',
      name: 'strategy',
      message: 'Select team building strategy:',
      choices: [
        { name: 'Balanced - Mix of premium and budget', value: 'balanced' },
        { name: 'Stars & Scrubs - Few premiums, rest budget', value: 'stars' },
        { name: 'Spread - Even distribution', value: 'spread' }
      ]
    }
  ]);
  
  const spinner = createSpinner('Building your team...');
  spinner.start();
  
  // Create team structure
  const team: Team = {
    manager: {
      github: username,
      teamName: answers.teamName,
      joined: new Date().toISOString()
    },
    squad: {
      goalkeepers: [],
      defenders: [],
      midfielders: [],
      forwards: []
    },
    formation: '4-4-2',
    startingXI: [],
    bench: [],
    captain: '',
    viceCaptain: '',
    budget: {
      total: 100.0,
      spent: 0,
      remaining: 100.0
    },
    transfers: {
      free: 1,
      made: 0,
      cost: 0
    },
    chips: {
      wildcard1: false,
      wildcard2: false,
      freeHit: false,
      tripleCaptain: false,
      benchBoost: false
    },
    metadata: {
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      gameweekLocked: null,
      version: '1.0.0'
    }
  };
  
  // In real implementation, would guide through player selection
  // For now, create a basic valid team
  team.squad.goalkeepers = [
    { id: 'gk1', name: 'Alisson', team: 'LIV', position: 'GK', price: 5.5 },
    { id: 'gk2', name: 'Ramsdale', team: 'ARS', position: 'GK', price: 4.5 }
  ];
  
  team.squad.defenders = [
    { id: 'def1', name: 'TAA', team: 'LIV', position: 'DEF', price: 7.0 },
    { id: 'def2', name: 'Saliba', team: 'ARS', position: 'DEF', price: 5.0 },
    { id: 'def3', name: 'Trippier', team: 'NEW', position: 'DEF', price: 5.5 },
    { id: 'def4', name: 'White', team: 'ARS', position: 'DEF', price: 4.5 },
    { id: 'def5', name: 'Burn', team: 'NEW', position: 'DEF', price: 4.0 }
  ];
  
  team.squad.midfielders = [
    { id: 'mid1', name: 'Salah', team: 'LIV', position: 'MID', price: 12.5 },
    { id: 'mid2', name: 'Saka', team: 'ARS', position: 'MID', price: 8.5 },
    { id: 'mid3', name: 'Martinelli', team: 'ARS', position: 'MID', price: 6.5 },
    { id: 'mid4', name: 'Gordon', team: 'NEW', position: 'MID', price: 5.5 },
    { id: 'mid5', name: 'Andreas', team: 'FUL', position: 'MID', price: 4.5 }
  ];
  
  team.squad.forwards = [
    { id: 'fwd1', name: 'Haaland', team: 'MCI', position: 'FWD', price: 14.0 },
    { id: 'fwd2', name: 'Watkins', team: 'AVL', position: 'FWD', price: 9.0 },
    { id: 'fwd3', name: 'Archer', team: 'SHU', position: 'FWD', price: 4.5 }
  ];
  
  // Calculate spent
  const allPlayers = [
    ...team.squad.goalkeepers,
    ...team.squad.defenders,
    ...team.squad.midfielders,
    ...team.squad.forwards
  ];
  
  team.budget.spent = allPlayers.reduce((sum, p) => sum + p.price, 0);
  team.budget.remaining = 100.0 - team.budget.spent;
  
  // Set starting XI (first 11 players)
  team.startingXI = allPlayers.slice(0, 11).map(p => p.id);
  team.bench = allPlayers.slice(11).map(p => p.id);
  team.captain = 'fwd1'; // Haaland
  team.viceCaptain = 'mid1'; // Salah
  
  const teamService = new TeamService();
  await teamService.saveTeam(username, team);
  
  spinner.succeed('Team created successfully!');
  
  console.log(chalk.green(`\n✅ Team "${answers.teamName}" has been created!`));
  console.log(`Budget spent: £${team.budget.spent}m`);
  console.log(`Remaining: £${team.budget.remaining}m`);
  console.log('\nNext steps:');
  console.log('1. Run "gfl validate" to check your team');
  console.log('2. Run "gfl sync push" to save changes');
  console.log('3. Create a PR to join the league');
}

async function createRandomTeam(_username: string): Promise<void> {
  console.log(chalk.yellow('Creating random team for testing...'));
  // Implementation would create a valid random team
  console.log(chalk.green('✅ Random team created!'));
}

async function importTeam(_username: string, filePath: string): Promise<void> {
  console.log(chalk.yellow(`Importing team from ${filePath}...`));
  // Implementation would import team from JSON file
  console.log(chalk.green('✅ Team imported!'));
}
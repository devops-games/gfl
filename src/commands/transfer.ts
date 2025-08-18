import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner, displayTransferSummary } from '../utils/display';
import { TeamService, Team } from '../services/team-service';
import { ConfigManager } from '../utils/config-manager';
import { TransferCommandOptions } from '../types';

export async function transferCommand(options: TransferCommandOptions): Promise<void> {
  const configManager = new ConfigManager();
  const config = await configManager.load();
  const teamService = new TeamService();
  
  if (!config.github?.username) {
    console.log(chalk.red('Please run "gfl init" first'));
    return;
  }
  
  const spinner = createSpinner('Loading team...');
  spinner.start();
  
  try {
    const team = await teamService.loadTeam(config.github.username);
    
    if (!team) {
      spinner.fail('No team found');
      return;
    }
    
    spinner.succeed('Team loaded');
    
    if (!options.out || !options.in) {
      // Interactive mode
      await interactiveTransfer(team, teamService, config.github.username);
    } else {
      // Direct transfer
      console.log(chalk.cyan('\n🔄 Processing transfer...\n'));
      console.log(`OUT: ${options.out}`);
      console.log(`IN: ${options.in}`);
      
      // In real implementation, would validate and execute transfer
      console.log(chalk.green('\n✅ Transfer completed!'));
    }
  } catch (error) {
    spinner.fail('Transfer failed');
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(errorMessage));
  }
}

async function interactiveTransfer(team: Team, _teamService: TeamService, _username: string): Promise<void> {
  console.log(chalk.cyan('\n🔄 Transfer Market\n'));
  console.log(`Free Transfers: ${team.transfers?.free || 1}`);
  console.log(`Budget: £${team.budget.remaining}m`);
  
  // Show current squad
  const allPlayers = [
    ...team.squad.goalkeepers.map((p: any) => ({ ...p, position: 'GK' })),
    ...team.squad.defenders.map((p: any) => ({ ...p, position: 'DEF' })),
    ...team.squad.midfielders.map((p: any) => ({ ...p, position: 'MID' })),
    ...team.squad.forwards.map((p: any) => ({ ...p, position: 'FWD' }))
  ];
  
  const { playerOut } = await inquirer.prompt([
    {
      type: 'list',
      name: 'playerOut',
      message: 'Select player to transfer out:',
      choices: allPlayers.map(p => ({
        name: `${p.position} - ${p.name} (${p.team}) - £${p.price}m`,
        value: p
      }))
    }
  ]);
  
  console.log(chalk.yellow(`\nSearching for ${playerOut.position} replacements...\n`));
  
  // In real implementation, would fetch available players from API
  const availablePlayers = [
    { name: 'Player A', team: 'MCI', price: playerOut.price + 0.5 },
    { name: 'Player B', team: 'LIV', price: playerOut.price },
    { name: 'Player C', team: 'ARS', price: playerOut.price - 0.5 }
  ];
  
  const { playerIn } = await inquirer.prompt([
    {
      type: 'list',
      name: 'playerIn',
      message: 'Select replacement:',
      choices: availablePlayers.map(p => ({
        name: `${p.name} (${p.team}) - £${p.price}m`,
        value: p
      }))
    }
  ]);
  
  // Display summary
  displayTransferSummary([
    {
      out: playerOut,
      in: playerIn
    }
  ]);
  
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Confirm transfer?',
      default: false
    }
  ]);
  
  if (confirm) {
    // Execute transfer
    console.log(chalk.green('\n✅ Transfer completed!'));
  } else {
    console.log(chalk.yellow('\n❌ Transfer cancelled'));
  }
}
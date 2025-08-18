import chalk from 'chalk';
import { ConfigManager } from '../utils/config-manager';
import { 
  createTeamTable, 
  formatCurrency, 
  formatPoints,
  createSpinner
} from '../utils/display';
import { TeamService } from '../services/team-service';
import { LeagueService } from '../services/league-service';
import { StatusCommandOptions } from '../types';

export async function statusCommand(options: StatusCommandOptions): Promise<void> {
  const spinner = createSpinner('Loading team status...');
  spinner.start();
  
  try {
    const configManager = new ConfigManager();
    const config = await configManager.load();
    
    if (!config.github?.username) {
      spinner.fail('GitHub username not configured');
      console.log(chalk.yellow('\nPlease run "gfl init" to configure your account'));
      return;
    }
    
    const teamService = new TeamService();
    const leagueService = new LeagueService();
    
    // Load team data
    const team = await teamService.loadTeam(config.github.username);
    
    if (!team) {
      spinner.fail('No team found');
      console.log(chalk.yellow('\nPlease run "gfl create-team" to create your team'));
      return;
    }
    
    spinner.succeed('Team loaded');
    
    // Display team information
    console.log(chalk.cyan('\n📊 Team Status\n'));
    console.log(chalk.bold(`Team: ${team.manager.teamName}`));
    console.log(`Manager: @${team.manager.github}`);
    console.log(`Created: ${new Date(team.metadata.created).toLocaleDateString()}`);
    console.log();
    
    // Budget information
    console.log(chalk.cyan('💰 Budget'));
    console.log(`Spent: ${formatCurrency(team.budget.spent)}`);
    console.log(`Remaining: ${formatCurrency(team.budget.remaining)}`);
    console.log(`Team Value: ${formatCurrency(team.budget.spent + team.budget.remaining)}`);
    console.log();
    
    // Squad overview
    if (options.detailed) {
      console.log(chalk.cyan('👥 Squad\n'));
      const allPlayers = [
        ...team.squad.goalkeepers,
        ...team.squad.defenders,
        ...team.squad.midfielders,
        ...team.squad.forwards
      ];
      console.log(createTeamTable(allPlayers));
    } else {
      console.log(chalk.cyan('👥 Squad Summary'));
      console.log(`Formation: ${team.formation}`);
      console.log(`Captain: ${team.captain}`);
      console.log(`Vice-Captain: ${team.viceCaptain}`);
    }
    
    // Gameweek performance
    if (options.gameweek) {
      const gameweekData = await teamService.getGameweekHistory(
        config.github.username,
        options.gameweek
      );
      
      if (gameweekData) {
        console.log(chalk.cyan(`\n🎮 Gameweek ${options.gameweek} Performance\n`));
        console.log(`Points: ${formatPoints(gameweekData.points.net)}`);
        console.log(`Transfers: ${gameweekData.transfers.made}`);
        if (gameweekData.transfers.hits > 0) {
          console.log(chalk.red(`Transfer Cost: -${gameweekData.transfers.hits} pts`));
        }
      }
    }
    
    // League positions
    const leagues = await leagueService.getUserLeagues(config.github.username);
    if (leagues && leagues.length > 0) {
      console.log(chalk.cyan('\n🏆 League Positions\n'));
      
      for (const league of leagues) {
        const position = await leagueService.getUserPosition(
          league.id,
          config.github.username
        );
        console.log(`${league.name}: ${position.rank}/${position.total} ${formatRankChange(position.change)}`);
      }
    }
    
    // Chips status
    if (team.chips) {
      console.log(chalk.cyan('\n💎 Chips\n'));
      const chipStatus = Object.entries(team.chips)
        .map(([chip, used]) => {
          const icon = used ? '❌' : '✅';
          return `${icon} ${formatChipName(chip)}: ${used ? 'Used' : 'Available'}`;
        })
        .join('\n');
      console.log(chipStatus);
    }
    
    // Transfer info
    if (team.transfers) {
      console.log(chalk.cyan('\n🔄 Transfers\n'));
      console.log(`Free Transfers: ${team.transfers.free}`);
      console.log(`Transfers Made: ${team.transfers.made}`);
      if (team.transfers.cost > 0) {
        console.log(chalk.red(`Point Cost: -${team.transfers.cost}`));
      }
    }
    
    if (options.json) {
      // Output JSON for scripting
      console.log(JSON.stringify({
        team,
        leagues,
        gameweek: options.gameweek
      }, null, 2));
    }
    
  } catch (error) {
    spinner.fail('Failed to load team status');
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error: ${errorMessage}`));
    if (options.verbose && error instanceof Error) {
      console.error(error.stack);
    }
  }
}

function formatRankChange(change: number): string {
  if (change > 0) {
    return chalk.green(`↑${change}`);
  } else if (change < 0) {
    return chalk.red(`↓${Math.abs(change)}`);
  }
  return chalk.gray('→');
}

function formatChipName(chip: string): string {
  const names: Record<string, string> = {
    wildcard1: 'Wildcard 1',
    wildcard2: 'Wildcard 2',
    freeHit: 'Free Hit',
    tripleCaptain: 'Triple Captain',
    benchBoost: 'Bench Boost',
    mystery: 'Mystery Chip'
  };
  return names[chip] || chip;
}
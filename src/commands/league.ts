import chalk from 'chalk';
import { createLeagueTable } from '../utils/display';

export async function leagueCommand(action: string, code: string, options: any): Promise<void> {
  console.log(chalk.cyan('\n🏆 League Management\n'));
  
  switch (action) {
    case 'standings':
      const standings = [
        { rank: 1, rankChange: 2, teamName: 'Code Warriors', manager: 'user1', gameweekPoints: 72, totalPoints: 450 },
        { rank: 2, rankChange: -1, teamName: 'Debug United', manager: 'user2', gameweekPoints: 68, totalPoints: 445 },
        { rank: 3, rankChange: -1, teamName: 'Git Gud FC', manager: 'user3', gameweekPoints: 65, totalPoints: 440 }
      ];
      console.log(createLeagueTable(standings));
      break;
      
    case 'join':
      console.log(chalk.green(`✅ Joined league with code: ${code}`));
      break;
      
    case 'create':
      console.log(chalk.green(`✅ League "${options.name}" created!`));
      console.log(`League code: ${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      break;
      
    default:
      console.log(chalk.yellow('Available actions: standings, join, create'));
  }
}
import chalk from 'chalk';
import { formatDeadline, displayFixtures } from '../utils/display';

export async function deadlineCommand(options: any): Promise<void> {
  console.log(chalk.cyan('\n⏰ Transfer Deadlines\n'));
  
  // Mock deadline data
  const nextDeadline = new Date();
  nextDeadline.setDate(nextDeadline.getDate() + 3);
  nextDeadline.setHours(19, 0, 0, 0);
  
  console.log(chalk.bold('Next Deadline:'));
  console.log(formatDeadline(nextDeadline));
  
  if (options.fixtures) {
    console.log(chalk.cyan('\n⚽ Upcoming Fixtures\n'));
    
    // Mock fixtures
    const fixtures = [
      {
        kickoff: nextDeadline,
        homeTeam: 'LIV',
        awayTeam: 'MCI',
        finished: false
      },
      {
        kickoff: new Date(nextDeadline.getTime() + 24 * 60 * 60 * 1000),
        homeTeam: 'ARS',
        awayTeam: 'CHE',
        finished: false
      }
    ];
    
    displayFixtures(fixtures);
  }
  
  if (options.all) {
    console.log(chalk.cyan('\n📅 All Future Deadlines\n'));
    
    for (let i = 1; i <= 5; i++) {
      const deadline = new Date(nextDeadline);
      deadline.setDate(deadline.getDate() + (i * 7));
      console.log(`Gameweek ${i + 5}: ${formatDeadline(deadline)}`);
    }
  }
}
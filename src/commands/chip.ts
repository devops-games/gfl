import chalk from 'chalk';
import { displayChipStatus } from '../utils/display';

export async function chipCommand(action: string, type: string, options: any): Promise<void> {
  console.log(chalk.cyan('\n💎 Chip Management\n'));
  
  const chips = {
    wildcard1: false,
    wildcard2: false,
    freeHit: false,
    tripleCaptain: false,
    benchBoost: false
  };
  
  if (action === 'status' || options.check) {
    displayChipStatus(chips);
  } else if (action === 'activate') {
    console.log(chalk.yellow(`Activating ${type} chip...`));
    console.log(chalk.green('✅ Chip activated for this gameweek!'));
  } else {
    displayChipStatus(chips);
  }
}

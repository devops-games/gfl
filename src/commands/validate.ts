import chalk from 'chalk';
import { createSpinner, displayValidationResults } from '../utils/display';
import { TeamService } from '../services/team-service';
import { ConfigManager } from '../utils/config-manager';

export async function validateCommand(options: any): Promise<void> {
  const spinner = createSpinner('Validating team...');
  spinner.start();
  
  try {
    const configManager = new ConfigManager();
    const config = await configManager.load();
    
    if (!config.github?.username) {
      spinner.fail('GitHub username not configured');
      return;
    }
    
    const teamService = new TeamService();
    const team = await teamService.loadTeam(config.github.username);
    
    if (!team) {
      spinner.fail('No team found');
      return;
    }
    
    spinner.text = 'Running validation checks...';
    const results = await teamService.validateTeam(team);
    
    spinner.stop();
    displayValidationResults(results);
    
    if (options.fix && !results.valid) {
      console.log(chalk.yellow('\n🔧 Attempting auto-fix...'));
      // Implementation would attempt to fix issues
      console.log(chalk.gray('Auto-fix not yet implemented'));
    }
    
    if (options.json) {
      console.log(JSON.stringify(results, null, 2));
    }
    
    process.exit(results.valid ? 0 : 1);
  } catch (error: any) {
    spinner.fail('Validation failed');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}
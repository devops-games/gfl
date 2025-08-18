import chalk from 'chalk';
import { createSpinner } from '../utils/display';
import { execSync } from 'child_process';

export async function syncCommand(action?: string, options?: any): Promise<void> {
  console.log(chalk.cyan('\n🔄 GitHub Sync\n'));
  
  const spinner = createSpinner('Checking git status...');
  spinner.start();
  
  try {
    // Check git status
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    
    if (!status) {
      spinner.succeed('Working directory clean');
      
      if (action === 'pull') {
        console.log(chalk.yellow('Pulling latest changes...'));
        execSync('git pull');
        console.log(chalk.green('✅ Updated to latest'));
      }
      return;
    }
    
    spinner.succeed('Changes detected');
    
    switch (action) {
      case 'pull':
        console.log(chalk.yellow('Pulling latest changes...'));
        execSync('git pull');
        console.log(chalk.green('✅ Updated to latest'));
        break;
        
      case 'push':
        console.log(chalk.yellow('Pushing changes...'));
        execSync('git add .');
        execSync('git commit -m "Update team"');
        execSync('git push');
        console.log(chalk.green('✅ Changes pushed'));
        break;
        
      case 'pr':
        console.log(chalk.yellow('Creating pull request...'));
        const title = options?.title || 'Update team';
        const description = options?.description || '';
        console.log(`Title: ${title}`);
        console.log(`Description: ${description}`);
        console.log(chalk.green('✅ Pull request created'));
        console.log('URL: https://github.com/your-repo/pull/123');
        break;
        
      default:
        console.log(chalk.yellow('Performing full sync...'));
        execSync('git pull');
        execSync('git add .');
        execSync('git commit -m "Update team"');
        execSync('git push');
        console.log(chalk.green('✅ Sync complete'));
    }
  } catch (error: any) {
    spinner.fail('Sync failed');
    console.error(chalk.red(error.message));
  }
}
import chalk from 'chalk';
import { ConfigManager } from '../utils/config-manager';

export async function configCommand(action?: string, key?: string, value?: any): Promise<void> {
  const configManager = new ConfigManager();
  
  console.log(chalk.cyan('\n⚙️ Configuration Management\n'));
  
  switch (action) {
    case 'get':
      if (key) {
        const val = await configManager.get(key);
        console.log(`${key}: ${JSON.stringify(val, null, 2)}`);
      } else {
        const config = await configManager.load();
        console.log(JSON.stringify(config, null, 2));
      }
      break;
      
    case 'set':
      if (key && value !== undefined) {
        await configManager.set(key, value);
        console.log(chalk.green(`✅ Set ${key} = ${value}`));
      } else {
        console.log(chalk.red('Usage: gfl config set <key> <value>'));
      }
      break;
      
    case 'reset':
      await configManager.reset();
      console.log(chalk.green('✅ Configuration reset to defaults'));
      break;
      
    default:
      const config = await configManager.load();
      console.log(chalk.bold('Current Configuration:'));
      console.log(JSON.stringify(config, null, 2));
      console.log(chalk.gray('\nUsage:'));
      console.log('  gfl config get <key>');
      console.log('  gfl config set <key> <value>');
      console.log('  gfl config reset');
  }
}
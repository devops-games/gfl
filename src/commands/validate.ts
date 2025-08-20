import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner, displayValidationResults, createTeamTable, formatCurrency } from '../utils/display';
import { TeamService, Team } from '../services/team-service';
import { ConfigManager } from '../utils/config-manager';
import { RulesService } from '../services/rules-service';
import { ValidationResult } from '../types';

export async function validateCommand(options: any): Promise<void> {
  const spinner = createSpinner('Loading team data...');
  spinner.start();
  
  try {
    const configManager = new ConfigManager();
    const config = await configManager.load();
    
    if (!config.github?.username) {
      spinner.fail('GitHub username not configured');
      console.log(chalk.yellow('\nPlease run "gfl init" first to set up your account'));
      return;
    }
    
    const teamService = new TeamService();
    let team = await teamService.loadTeam(config.github.username);
    
    if (!team) {
      spinner.fail('No team found');
      console.log(chalk.yellow('\nPlease run "gfl create-team" to create your team'));
      return;
    }
    
    spinner.text = 'Running validation checks...';
    
    // Initialize rules service
    const rulesService = new RulesService();
    
    // Run all validation checks
    const checks = [
      { name: 'Budget', fn: async () => await validateBudgetWithRules(team!, rulesService) },
      { name: 'Squad composition', fn: async () => await validateSquadCompositionWithRules(team!, rulesService) },
      { name: 'Team limits', fn: async () => await validateTeamLimitsWithRules(team!, rulesService) },
      { name: 'Formation', fn: async () => await validateFormationWithRules(team!, rulesService) },
      { name: 'Captain selection', fn: async () => await validateCaptainsWithRules(team!, rulesService) },
      { name: 'Starting XI', fn: async () => await validateStartingXIWithRules(team!, rulesService) },
      { name: 'Chip usage', fn: async () => await validateChipUsage(team!, rulesService) },
      { name: 'Transfer limits', fn: async () => await validateTransferLimits(team!, rulesService) }
    ];
    
    const checkResults: any[] = [];
    for (const check of checks) {
      spinner.text = `Checking ${check.name}...`;
      const result = await check.fn();
      checkResults.push({ name: check.name, ...result });
    }
    
    const results = await teamService.validateTeam(team);
    
    spinner.stop();
    
    // Display detailed validation results
    console.log(chalk.cyan('\n🏆 Team Validation Report\n'));
    console.log(chalk.bold(`Team: ${team.manager.teamName}`));
    console.log(chalk.gray(`Manager: @${team.manager.github}\n`));
    
    // Show check results
    checkResults.forEach(check => {
      const icon = check.valid ? '✅' : '❌';
      const color = check.valid ? chalk.green : chalk.red;
      console.log(color(`${icon} ${check.name}: ${check.valid ? 'Passed' : 'Failed'}`) + (check.details ? chalk.gray(` - ${check.details}`) : ''));
    });
    
    console.log();
    displayValidationResults(results);
    
    // Display squad if verbose
    if (options.verbose) {
      console.log(chalk.cyan('\n👥 Current Squad\n'));
      const allPlayers = [
        ...team.squad.goalkeepers,
        ...team.squad.defenders,
        ...team.squad.midfielders,
        ...team.squad.forwards
      ];
      console.log(createTeamTable(allPlayers));
    }
    
    // Auto-fix option
    if (options.fix && !results.valid) {
      console.log(chalk.yellow('\n🔧 Auto-fix Mode\n'));
      team = await attemptAutoFix(team, results, teamService, config.github.username);
    }
    
    // Interactive fix
    if (!options.fix && !results.valid && !options.json) {
      const { wantFix } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'wantFix',
          message: 'Would you like to fix these issues?',
          default: true
        }
      ]);
      
      if (wantFix) {
        team = await interactiveFix(team, results, teamService, config.github.username);
      }
    }
    
    // JSON output
    if (options.json) {
      console.log(JSON.stringify(results, null, 2));
    }
    
    // Exit with appropriate code
    process.exit(results.valid ? 0 : 1);
  } catch (error: any) {
    spinner.fail('Validation failed');
    console.error(chalk.red('Error:'), error.message);
    if (options.debug) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Enhanced validation helper functions using rules service
async function validateBudgetWithRules(team: Team, rulesService: RulesService): Promise<{ valid: boolean; details: string }> {
  const result = await rulesService.validateBudget(team);
  const details = `${formatCurrency(team.budget.spent)} / ${formatCurrency(100.0)}`;
  return { valid: result.valid, details: result.errors.length > 0 ? result.errors[0] : details };
}

async function validateSquadCompositionWithRules(team: Team, rulesService: RulesService): Promise<{ valid: boolean; details: string }> {
  const result = await rulesService.validateSquadComposition(team);
  const counts = {
    GK: team.squad.goalkeepers.length,
    DEF: team.squad.defenders.length,
    MID: team.squad.midfielders.length,
    FWD: team.squad.forwards.length
  };
  const details = `${counts.GK}-${counts.DEF}-${counts.MID}-${counts.FWD} (required: 2-5-5-3)`;
  return { valid: result.valid, details: result.errors.length > 0 ? result.errors.join(', ') : details };
}

async function validateTeamLimitsWithRules(team: Team, rulesService: RulesService): Promise<{ valid: boolean; details: string }> {
  const allPlayers = [
    ...team.squad.goalkeepers,
    ...team.squad.defenders,
    ...team.squad.midfielders,
    ...team.squad.forwards
  ];
  const result = await rulesService.validateTeamLimits(allPlayers);
  const details = result.valid ? 'Max 3 per club ✓' : result.errors.join(', ');
  return { valid: result.valid, details };
}

async function validateFormationWithRules(team: Team, rulesService: RulesService): Promise<{ valid: boolean; details: string }> {
  const result = await rulesService.validateFormation(team.formation);
  return { valid: result.valid, details: result.errors.length > 0 ? result.errors[0] : team.formation };
}

async function validateCaptainsWithRules(team: Team, rulesService: RulesService): Promise<{ valid: boolean; details: string }> {
  const result = await rulesService.validateCaptains(team.captain, team.viceCaptain, team.startingXI);
  
  const allPlayers = [
    ...team.squad.goalkeepers,
    ...team.squad.defenders,
    ...team.squad.midfielders,
    ...team.squad.forwards
  ];
  
  const captain = allPlayers.find(p => p.id === team.captain);
  const viceCaptain = allPlayers.find(p => p.id === team.viceCaptain);
  
  const details = result.valid 
    ? `C: ${captain?.name || 'None'}, VC: ${viceCaptain?.name || 'None'}` 
    : result.errors.join(', ');
  return { valid: result.valid, details };
}

async function validateStartingXIWithRules(team: Team, rulesService: RulesService): Promise<{ valid: boolean; details: string }> {
  const allPlayers = [
    ...team.squad.goalkeepers,
    ...team.squad.defenders,
    ...team.squad.midfielders,
    ...team.squad.forwards
  ];
  
  const result = await rulesService.validateStartingXI(team.formation, team.startingXI, allPlayers);
  const details = result.valid 
    ? `${team.startingXI.length} starting, ${team.bench.length} bench` 
    : result.errors.join(', ');
  return { valid: result.valid, details };
}

// New validation functions
async function validateChipUsage(team: Team, rulesService: RulesService): Promise<{ valid: boolean; details: string }> {
  const availableChips = await rulesService.getAvailableChips(team);
  const details = availableChips.length > 0 
    ? `Available: ${availableChips.join(', ')}` 
    : 'All chips used';
  return { valid: true, details };
}

async function validateTransferLimits(team: Team, rulesService: RulesService): Promise<{ valid: boolean; details: string }> {
  const transfers = team.transfers || { free: 1, made: 0, cost: 0 };
  const result = await rulesService.validateTransfers(transfers.made, transfers.free);
  const details = `${transfers.free} free, ${transfers.made} made (cost: ${result.cost} pts)`;
  return { valid: result.valid, details };
}

// Auto-fix functionality
async function attemptAutoFix(
  team: Team,
  results: ValidationResult,
  teamService: TeamService,
  username: string
): Promise<Team> {
  let fixed = false;
  
  for (const error of results.errors) {
    switch (error.code) {
      case 'CAPTAIN_NOT_IN_XI':
        // Set first player in XI as captain
        if (team.startingXI.length > 0) {
          team.captain = team.startingXI[0];
          console.log(chalk.green('✓ Fixed: Captain set to first player in starting XI'));
          fixed = true;
        }
        break;
        
      case 'INVALID_FORMATION':
        // Default to 4-4-2
        team.formation = '4-4-2';
        console.log(chalk.green('✓ Fixed: Formation set to 4-4-2'));
        fixed = true;
        break;
        
      default:
        console.log(chalk.yellow(`⚠ Cannot auto-fix: ${error.message}`));
    }
  }
  
  if (fixed) {
    team.metadata.lastModified = new Date().toISOString();
    await teamService.saveTeam(username, team);
    console.log(chalk.green('\n✅ Fixes applied and team saved'));
  }
  
  return team;
}

// Interactive fix functionality
async function interactiveFix(
  team: Team,
  results: ValidationResult,
  teamService: TeamService,
  username: string
): Promise<Team> {
  console.log(chalk.cyan('\n🛠️ Interactive Fix Mode\n'));
  
  for (const error of results.errors) {
    console.log(chalk.red(`Issue: ${error.message}`));
    
    if (error.fix) {
      console.log(chalk.gray(`Suggested fix: ${error.fix}`));
    }
    
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Skip this issue', value: 'skip' },
          { name: 'Open team editor', value: 'edit' },
          { name: 'Save and exit', value: 'save' }
        ]
      }
    ]);
    
    if (action === 'save') {
      break;
    } else if (action === 'edit') {
      // Would open team editor
      console.log(chalk.gray('Team editor not yet implemented'));
    }
  }
  
  team.metadata.lastModified = new Date().toISOString();
  await teamService.saveTeam(username, team);
  console.log(chalk.green('\nTeam saved'));
  
  return team;
}
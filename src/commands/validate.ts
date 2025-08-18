import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner, displayValidationResults, createTeamTable, formatCurrency } from '../utils/display';
import { TeamService, Team } from '../services/team-service';
import { ConfigManager } from '../utils/config-manager';
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
    
    // Run all validation checks
    const checks = [
      { name: 'Budget', fn: () => validateBudget(team!) },
      { name: 'Squad composition', fn: () => validateSquadComposition(team!) },
      { name: 'Team limits', fn: () => validateTeamLimits(team!) },
      { name: 'Formation', fn: () => validateFormation(team!) },
      { name: 'Captain selection', fn: () => validateCaptains(team!) },
      { name: 'Starting XI', fn: () => validateStartingXI(team!) }
    ];
    
    const checkResults: any[] = [];
    for (const check of checks) {
      spinner.text = `Checking ${check.name}...`;
      const result = check.fn();
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

// Validation helper functions
function validateBudget(team: Team): { valid: boolean; details: string } {
  const valid = team.budget.spent <= 100.0;
  const details = `${formatCurrency(team.budget.spent)} / ${formatCurrency(100.0)}`;
  return { valid, details };
}

function validateSquadComposition(team: Team): { valid: boolean; details: string } {
  const counts = {
    GK: team.squad.goalkeepers.length,
    DEF: team.squad.defenders.length,
    MID: team.squad.midfielders.length,
    FWD: team.squad.forwards.length
  };
  
  const required = { GK: 2, DEF: 5, MID: 5, FWD: 3 };
  const valid = Object.entries(required).every(([pos, count]) => counts[pos as keyof typeof counts] === count);
  const details = `${counts.GK}-${counts.DEF}-${counts.MID}-${counts.FWD} (required: 2-5-5-3)`;
  
  return { valid, details };
}

function validateTeamLimits(team: Team): { valid: boolean; details: string } {
  const teamCounts: Record<string, number> = {};
  const allPlayers = [
    ...team.squad.goalkeepers,
    ...team.squad.defenders,
    ...team.squad.midfielders,
    ...team.squad.forwards
  ];
  
  allPlayers.forEach(player => {
    teamCounts[player.team] = (teamCounts[player.team] || 0) + 1;
  });
  
  const violations = Object.entries(teamCounts).filter(([_, count]) => count > 3);
  const valid = violations.length === 0;
  const details = valid ? 'Max 3 per club ✓' : violations.map(([club, count]) => `${club}: ${count}`).join(', ');
  
  return { valid, details };
}

function validateFormation(team: Team): { valid: boolean; details: string } {
  const validFormations = ['4-4-2', '4-3-3', '3-5-2', '3-4-3', '5-4-1', '5-3-2'];
  const valid = validFormations.includes(team.formation);
  const details = team.formation;
  return { valid, details };
}

function validateCaptains(team: Team): { valid: boolean; details: string } {
  const captainInXI = team.startingXI.includes(team.captain);
  const viceCaptainInXI = team.startingXI.includes(team.viceCaptain);
  const valid = captainInXI && viceCaptainInXI;
  
  const allPlayers = [
    ...team.squad.goalkeepers,
    ...team.squad.defenders,
    ...team.squad.midfielders,
    ...team.squad.forwards
  ];
  
  const captain = allPlayers.find(p => p.id === team.captain);
  const viceCaptain = allPlayers.find(p => p.id === team.viceCaptain);
  
  const details = `C: ${captain?.name || 'None'}, VC: ${viceCaptain?.name || 'None'}`;
  return { valid, details };
}

function validateStartingXI(team: Team): { valid: boolean; details: string } {
  const valid = team.startingXI.length === 11 && team.bench.length === 4;
  const details = `${team.startingXI.length} starting, ${team.bench.length} bench`;
  return { valid, details };
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
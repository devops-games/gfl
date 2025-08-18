import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner, createTeamTable, formatCurrency } from '../utils/display';
import { TeamService, Team } from '../services/team-service';
import { ConfigManager } from '../utils/config-manager';
import { PlayerService } from '../services/player-service';
import { Player } from '../types';

export async function createTeamCommand(options: any): Promise<void> {
  const configManager = new ConfigManager();
  const config = await configManager.load();
  
  if (!config.github?.username) {
    console.log(chalk.red('Please run "gfl init" first to set up your GitHub username'));
    return;
  }
  
  console.log(chalk.cyan('\n⚽ Team Creation\n'));
  
  if (options.random) {
    await createRandomTeam(config.github.username);
  } else if (options.import) {
    await importTeam(config.github.username, options.import);
  } else {
    await interactiveTeamCreation(config.github.username);
  }
}

async function interactiveTeamCreation(username: string): Promise<void> {
  const playerService = new PlayerService();
  const teamService = new TeamService();
  
  // Get basic team info
  const teamInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'teamName',
      message: 'Enter your team name:',
      validate: (input) => {
        if (input.length < 3) return 'Team name must be at least 3 characters';
        if (input.length > 50) return 'Team name must be less than 50 characters';
        return true;
      }
    },
    {
      type: 'list',
      name: 'method',
      message: 'How would you like to build your team?',
      choices: [
        { name: 'Auto-build with strategy', value: 'auto' },
        { name: 'Manual player selection', value: 'manual' },
        { name: 'Import from template', value: 'template' }
      ]
    }
  ]);
  
  let team: Team;
  
  if (teamInfo.method === 'auto') {
    team = await autoBuildTeam(username, teamInfo.teamName, playerService);
  } else if (teamInfo.method === 'manual') {
    team = await manualBuildTeam(username, teamInfo.teamName, playerService);
  } else {
    team = await templateBuildTeam(username, teamInfo.teamName, playerService);
  }
  
  // Select formation and set starting XI
  await setupFormation(team);
  
  // Select captain and vice-captain
  await selectCaptains(team);
  
  // Save team
  const spinner = createSpinner('Saving your team...');
  spinner.start();
  
  await teamService.saveTeam(username, team);
  
  spinner.succeed('Team created successfully!');
  
  // Display summary
  console.log(chalk.green(`\n✅ Team "${teamInfo.teamName}" has been created!`));
  console.log(chalk.cyan('\n📊 Team Summary\n'));
  console.log(`Formation: ${team.formation}`);
  console.log(`Budget spent: ${formatCurrency(team.budget.spent)}`);
  console.log(`Remaining: ${formatCurrency(team.budget.remaining)}`);
  console.log(`Captain: ${team.squad.goalkeepers.concat(team.squad.defenders, team.squad.midfielders, team.squad.forwards).find(p => p.id === team.captain)?.name}`);
  
  console.log(chalk.cyan('\n👥 Your Squad\n'));
  const allPlayers = [
    ...team.squad.goalkeepers,
    ...team.squad.defenders,
    ...team.squad.midfielders,
    ...team.squad.forwards
  ];
  console.log(createTeamTable(allPlayers));
  
  console.log(chalk.yellow('\n📝 Next steps:'));
  console.log('1. Run "gfl validate" to check your team');
  console.log('2. Run "gfl status" to view team details');
  console.log('3. Run "gfl transfer" to make changes');
}

async function autoBuildTeam(username: string, teamName: string, playerService: PlayerService): Promise<Team> {
  const { strategy } = await inquirer.prompt([
    {
      type: 'list',
      name: 'strategy',
      message: 'Select team building strategy:',
      choices: [
        { name: 'Balanced - Mix of premium and budget players', value: 'balanced' },
        { name: 'Stars & Scrubs - Few premiums, rest budget', value: 'stars' },
        { name: 'Spread - Even distribution across all positions', value: 'spread' }
      ]
    }
  ]);
  
  const spinner = createSpinner('Building your team...');
  spinner.start();
  
  const recommendedSquad = await playerService.getRecommendedSquad(100.0, strategy);
  
  spinner.succeed('Team built!');
  
  const team: Team = {
    manager: {
      github: username,
      teamName: teamName,
      joined: new Date().toISOString()
    },
    squad: {
      goalkeepers: recommendedSquad.goalkeepers.map(p => ({
        ...p,
        purchasePrice: p.price,
        purchaseDate: new Date().toISOString()
      })),
      defenders: recommendedSquad.defenders.map(p => ({
        ...p,
        purchasePrice: p.price,
        purchaseDate: new Date().toISOString()
      })),
      midfielders: recommendedSquad.midfielders.map(p => ({
        ...p,
        purchasePrice: p.price,
        purchaseDate: new Date().toISOString()
      })),
      forwards: recommendedSquad.forwards.map(p => ({
        ...p,
        purchasePrice: p.price,
        purchaseDate: new Date().toISOString()
      }))
    },
    formation: '4-4-2',
    startingXI: [],
    bench: [],
    captain: '',
    viceCaptain: '',
    budget: {
      total: 100.0,
      spent: recommendedSquad.totalCost,
      remaining: 100.0 - recommendedSquad.totalCost
    },
    transfers: {
      free: 1,
      made: 0,
      cost: 0
    },
    chips: {
      wildcard1: false,
      wildcard2: false,
      freeHit: false,
      tripleCaptain: false,
      benchBoost: false
    },
    metadata: {
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      gameweekLocked: null,
      version: '1.0.0'
    }
  };
  
  return team;
}

async function manualBuildTeam(username: string, teamName: string, playerService: PlayerService): Promise<Team> {
  const team: Team = {
    manager: {
      github: username,
      teamName: teamName,
      joined: new Date().toISOString()
    },
    squad: {
      goalkeepers: [],
      defenders: [],
      midfielders: [],
      forwards: []
    },
    formation: '4-4-2',
    startingXI: [],
    bench: [],
    captain: '',
    viceCaptain: '',
    budget: {
      total: 100.0,
      spent: 0,
      remaining: 100.0
    },
    transfers: {
      free: 1,
      made: 0,
      cost: 0
    },
    chips: {
      wildcard1: false,
      wildcard2: false,
      freeHit: false,
      tripleCaptain: false,
      benchBoost: false
    },
    metadata: {
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      gameweekLocked: null,
      version: '1.0.0'
    }
  };
  
  // Select goalkeepers
  console.log(chalk.cyan('\n🥅 Select 2 Goalkeepers\n'));
  team.squad.goalkeepers = await selectPlayers(playerService, 'GK', 2, team.budget.remaining);
  team.budget.spent += team.squad.goalkeepers.reduce((sum, p) => sum + p.price, 0);
  team.budget.remaining = 100.0 - team.budget.spent;
  
  // Select defenders
  console.log(chalk.cyan('\n🛡️ Select 5 Defenders\n'));
  team.squad.defenders = await selectPlayers(playerService, 'DEF', 5, team.budget.remaining);
  team.budget.spent += team.squad.defenders.reduce((sum, p) => sum + p.price, 0);
  team.budget.remaining = 100.0 - team.budget.spent;
  
  // Select midfielders
  console.log(chalk.cyan('\n⚡ Select 5 Midfielders\n'));
  team.squad.midfielders = await selectPlayers(playerService, 'MID', 5, team.budget.remaining);
  team.budget.spent += team.squad.midfielders.reduce((sum, p) => sum + p.price, 0);
  team.budget.remaining = 100.0 - team.budget.spent;
  
  // Select forwards
  console.log(chalk.cyan('\n⚔️ Select 3 Forwards\n'));
  team.squad.forwards = await selectPlayers(playerService, 'FWD', 3, team.budget.remaining);
  team.budget.spent += team.squad.forwards.reduce((sum, p) => sum + p.price, 0);
  team.budget.remaining = 100.0 - team.budget.spent;
  
  return team;
}

async function templateBuildTeam(username: string, teamName: string, playerService: PlayerService): Promise<Team> {
  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Select a template team:',
      choices: [
        { name: 'Premium Attack - Haaland + Salah focus', value: 'premium-attack' },
        { name: 'Solid Defence - Premium defenders', value: 'solid-defence' },
        { name: 'Midfield Masters - Stacked midfield', value: 'midfield-heavy' },
        { name: 'Budget Squad - Value picks only', value: 'budget' }
      ]
    }
  ]);
  
  // Load template players based on selection
  const squad = await getTemplateSquad(template, playerService);
  
  const team: Team = {
    manager: {
      github: username,
      teamName: teamName,
      joined: new Date().toISOString()
    },
    squad,
    formation: '4-4-2',
    startingXI: [],
    bench: [],
    captain: '',
    viceCaptain: '',
    budget: {
      total: 100.0,
      spent: 0,
      remaining: 100.0
    },
    transfers: {
      free: 1,
      made: 0,
      cost: 0
    },
    chips: {
      wildcard1: false,
      wildcard2: false,
      freeHit: false,
      tripleCaptain: false,
      benchBoost: false
    },
    metadata: {
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      gameweekLocked: null,
      version: '1.0.0'
    }
  };
  
  // Calculate budget
  const allPlayers = [
    ...squad.goalkeepers,
    ...squad.defenders,
    ...squad.midfielders,
    ...squad.forwards
  ];
  team.budget.spent = allPlayers.reduce((sum, p) => sum + p.price, 0);
  team.budget.remaining = 100.0 - team.budget.spent;
  
  return team;
}

async function selectPlayers(
  playerService: PlayerService,
  position: 'GK' | 'DEF' | 'MID' | 'FWD',
  count: number,
  budget: number
): Promise<Player[]> {
  const selected: Player[] = [];
  let remainingBudget = budget;
  
  for (let i = 0; i < count; i++) {
    const avgRemaining = remainingBudget / (count - i);
    console.log(chalk.gray(`Budget remaining: ${formatCurrency(remainingBudget)} (Avg per player: ${formatCurrency(avgRemaining)})\n`));
    
    const availablePlayers = await playerService.getPlayersByPosition(position);
    const affordablePlayers = availablePlayers
      .filter(p => p.price <= remainingBudget - ((count - i - 1) * 4.0)) // Ensure we can afford minimum price players for remaining slots
      .filter(p => !selected.some(s => s.id === p.id))
      .slice(0, 15); // Show top 15 options
    
    const { playerId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'playerId',
        message: `Select ${position} ${i + 1}/${count}:`,
        choices: affordablePlayers.map(p => ({
          name: `${p.name} (${p.team}) - ${formatCurrency(p.price)} - ${p.points || 0}pts`,
          value: p.id
        }))
      }
    ]);
    
    const player = affordablePlayers.find(p => p.id === playerId)!;
    selected.push({
      ...player,
      purchasePrice: player.price,
      purchaseDate: new Date().toISOString()
    });
    
    remainingBudget -= player.price;
  }
  
  return selected;
}

async function getTemplateSquad(template: string, playerService: PlayerService) {
  const players = await playerService.loadPlayers();
  
  switch (template) {
    case 'premium-attack':
      return {
        goalkeepers: [
          players.find(p => p.id === 'player_002')!, // Ramsdale
          players.find(p => p.id === 'player_075')!  // Flekken
        ],
        defenders: [
          players.find(p => p.id === 'player_010')!, // TAA
          players.find(p => p.id === 'player_011')!, // Saliba
          players.find(p => p.id === 'player_012')!, // Trippier
          players.find(p => p.id === 'player_042')!, // Dunk
          players.find(p => p.id === 'player_054')!  // Mykolenko
        ],
        midfielders: [
          players.find(p => p.id === 'player_020')!, // Salah
          players.find(p => p.id === 'player_021')!, // Saka
          players.find(p => p.id === 'player_023')!, // Gordon
          players.find(p => p.id === 'player_024')!, // Andreas
          players.find(p => p.id === 'player_029')!  // Luiz
        ],
        forwards: [
          players.find(p => p.id === 'player_030')!, // Haaland
          players.find(p => p.id === 'player_031')!, // Watkins
          players.find(p => p.id === 'player_032')!  // Archer
        ]
      };
    
    case 'solid-defence':
      return {
        goalkeepers: [
          players.find(p => p.id === 'player_001')!, // Alisson
          players.find(p => p.id === 'player_003')!  // Ederson
        ],
        defenders: [
          players.find(p => p.id === 'player_010')!, // TAA
          players.find(p => p.id === 'player_015')!, // Dias
          players.find(p => p.id === 'player_060')!, // Van Dijk
          players.find(p => p.id === 'player_011')!, // Saliba
          players.find(p => p.id === 'player_012')!  // Trippier
        ],
        midfielders: [
          players.find(p => p.id === 'player_021')!, // Saka
          players.find(p => p.id === 'player_022')!, // Odegaard
          players.find(p => p.id === 'player_028')!, // Mitoma
          players.find(p => p.id === 'player_048')!, // Bruno G.
          players.find(p => p.id === 'player_024')!  // Andreas
        ],
        forwards: [
          players.find(p => p.id === 'player_037')!, // Isak
          players.find(p => p.id === 'player_034')!, // Jackson
          players.find(p => p.id === 'player_074')!  // Ferguson
        ]
      };
    
    default:
      // Default balanced team
      return {
        goalkeepers: [
          players.find(p => p.id === 'player_001')!, // Alisson
          players.find(p => p.id === 'player_002')!  // Ramsdale
        ],
        defenders: [
          players.find(p => p.id === 'player_010')!, // TAA
          players.find(p => p.id === 'player_011')!, // Saliba
          players.find(p => p.id === 'player_012')!, // Trippier
          players.find(p => p.id === 'player_013')!, // Gabriel
          players.find(p => p.id === 'player_014')!  // Botman
        ],
        midfielders: [
          players.find(p => p.id === 'player_020')!, // Salah
          players.find(p => p.id === 'player_021')!, // Saka
          players.find(p => p.id === 'player_022')!, // Odegaard
          players.find(p => p.id === 'player_023')!, // Gordon
          players.find(p => p.id === 'player_024')!  // Andreas
        ],
        forwards: [
          players.find(p => p.id === 'player_030')!, // Haaland
          players.find(p => p.id === 'player_031')!, // Watkins
          players.find(p => p.id === 'player_032')!  // Archer
        ]
      };
  }
}

async function setupFormation(team: Team): Promise<void> {
  const { formation } = await inquirer.prompt([
    {
      type: 'list',
      name: 'formation',
      message: 'Select your formation:',
      choices: [
        { name: '4-4-2 (Classic balanced)', value: '4-4-2' },
        { name: '4-3-3 (Attacking)', value: '4-3-3' },
        { name: '3-5-2 (Midfield heavy)', value: '3-5-2' },
        { name: '3-4-3 (Very attacking)', value: '3-4-3' },
        { name: '5-4-1 (Defensive)', value: '5-4-1' },
        { name: '5-3-2 (Balanced defensive)', value: '5-3-2' }
      ]
    }
  ]);
  
  team.formation = formation;
  
  // Auto-select starting XI based on formation
  const [def, mid, fwd] = formation.split('-').map(Number);
  
  team.startingXI = [
    team.squad.goalkeepers[0].id,
    ...team.squad.defenders.slice(0, def).map(p => p.id),
    ...team.squad.midfielders.slice(0, mid).map(p => p.id),
    ...team.squad.forwards.slice(0, fwd).map(p => p.id)
  ];
  
  // Set bench (remaining players)
  const allPlayers = [
    ...team.squad.goalkeepers,
    ...team.squad.defenders,
    ...team.squad.midfielders,
    ...team.squad.forwards
  ];
  
  team.bench = allPlayers
    .filter(p => !team.startingXI.includes(p.id))
    .slice(0, 4)
    .map(p => p.id);
}

async function selectCaptains(team: Team): Promise<void> {
  const allPlayers = [
    ...team.squad.goalkeepers,
    ...team.squad.defenders,
    ...team.squad.midfielders,
    ...team.squad.forwards
  ];
  
  const startingPlayers = allPlayers.filter(p => team.startingXI.includes(p.id));
  
  const { captain } = await inquirer.prompt([
    {
      type: 'list',
      name: 'captain',
      message: 'Select your captain (2x points):',
      choices: startingPlayers
        .sort((a, b) => (b.points || 0) - (a.points || 0))
        .map(p => ({
          name: `${p.name} (${p.team}) - ${p.points || 0}pts`,
          value: p.id
        }))
    }
  ]);
  
  team.captain = captain;
  
  const { viceCaptain } = await inquirer.prompt([
    {
      type: 'list',
      name: 'viceCaptain',
      message: 'Select your vice-captain:',
      choices: startingPlayers
        .filter(p => p.id !== captain)
        .sort((a, b) => (b.points || 0) - (a.points || 0))
        .map(p => ({
          name: `${p.name} (${p.team}) - ${p.points || 0}pts`,
          value: p.id
        }))
    }
  ]);
  
  team.viceCaptain = viceCaptain;
}

async function createRandomTeam(username: string): Promise<void> {
  const playerService = new PlayerService();
  const teamService = new TeamService();
  
  console.log(chalk.yellow('Creating random team for testing...'));
  
  const squad = await playerService.getRecommendedSquad(100.0, 'balanced');
  
  const team: Team = {
    manager: {
      github: username,
      teamName: `Random FC ${Math.floor(Math.random() * 1000)}`,
      joined: new Date().toISOString()
    },
    squad: {
      goalkeepers: squad.goalkeepers.map(p => ({
        ...p,
        purchasePrice: p.price,
        purchaseDate: new Date().toISOString()
      })),
      defenders: squad.defenders.map(p => ({
        ...p,
        purchasePrice: p.price,
        purchaseDate: new Date().toISOString()
      })),
      midfielders: squad.midfielders.map(p => ({
        ...p,
        purchasePrice: p.price,
        purchaseDate: new Date().toISOString()
      })),
      forwards: squad.forwards.map(p => ({
        ...p,
        purchasePrice: p.price,
        purchaseDate: new Date().toISOString()
      }))
    },
    formation: '4-4-2',
    startingXI: [],
    bench: [],
    captain: '',
    viceCaptain: '',
    budget: {
      total: 100.0,
      spent: squad.totalCost,
      remaining: 100.0 - squad.totalCost
    },
    transfers: {
      free: 1,
      made: 0,
      cost: 0
    },
    chips: {
      wildcard1: false,
      wildcard2: false,
      freeHit: false,
      tripleCaptain: false,
      benchBoost: false
    },
    metadata: {
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      gameweekLocked: null,
      version: '1.0.0'
    }
  };
  
  // Auto-set starting XI
  const allPlayers = [
    ...team.squad.goalkeepers,
    ...team.squad.defenders,
    ...team.squad.midfielders,
    ...team.squad.forwards
  ];
  
  team.startingXI = [
    team.squad.goalkeepers[0].id,
    ...team.squad.defenders.slice(0, 4).map(p => p.id),
    ...team.squad.midfielders.slice(0, 4).map(p => p.id),
    ...team.squad.forwards.slice(0, 2).map(p => p.id)
  ];
  
  team.bench = allPlayers
    .filter(p => !team.startingXI.includes(p.id))
    .slice(0, 4)
    .map(p => p.id);
  
  // Set best players as captains
  const startingPlayers = allPlayers
    .filter(p => team.startingXI.includes(p.id))
    .sort((a, b) => (b.points || 0) - (a.points || 0));
  
  team.captain = startingPlayers[0].id;
  team.viceCaptain = startingPlayers[1].id;
  
  await teamService.saveTeam(username, team);
  
  console.log(chalk.green('✅ Random team created!'));
  console.log(`Team: ${team.manager.teamName}`);
  console.log(`Budget: ${formatCurrency(team.budget.spent)}`);
}

async function importTeam(username: string, filePath: string): Promise<void> {
  const teamService = new TeamService();
  
  console.log(chalk.yellow(`Importing team from ${filePath}...`));
  
  try {
    const fs = await import('fs/promises');
    const data = await fs.readFile(filePath, 'utf-8');
    const importedTeam = JSON.parse(data);
    
    // Update manager info
    importedTeam.manager.github = username;
    importedTeam.metadata.created = new Date().toISOString();
    importedTeam.metadata.lastModified = new Date().toISOString();
    
    await teamService.saveTeam(username, importedTeam);
    
    console.log(chalk.green('✅ Team imported!'));
    console.log(`Team: ${importedTeam.manager.teamName}`);
  } catch (error) {
    console.log(chalk.red('Failed to import team:'), error);
  }
}
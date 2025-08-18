import chalk from 'chalk';
import Table from 'cli-table3';
import figlet from 'figlet';
import ora, { Ora } from 'ora';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Player, Standing, Transfer, Fixture, ChipStatus, ValidationResult } from '../types';

dayjs.extend(relativeTime);

export function displayBanner(): void {
  console.log(
    chalk.cyan(
      figlet.textSync('GFL', {
        font: 'Standard',
        horizontalLayout: 'default'
      })
    )
  );
  console.log(chalk.gray('Git Fantasy League - Season 2024/25'));
  console.log(chalk.gray('━'.repeat(50)) + '\n');
}

export function createSpinner(text: string): Ora {
  return ora({
    text,
    spinner: 'dots',
    color: 'cyan'
  });
}

export function formatCurrency(amount: number, currency: string = '£'): string {
  return `${currency}${amount.toFixed(1)}m`;
}

export function formatPoints(points: number): string {
  if (points > 0) {
    return chalk.green(`+${points}`);
  } else if (points < 0) {
    return chalk.red(points.toString());
  }
  return points.toString();
}

export function formatDeadline(deadline: string | Date): string {
  const deadlineDate = dayjs(deadline);
  const now = dayjs();
  
  if (deadlineDate.isBefore(now)) {
    return chalk.red('Deadline passed');
  }
  
  const timeUntil = deadlineDate.fromNow();
  const formatted = deadlineDate.format('ddd DD MMM, HH:mm');
  
  if (deadlineDate.diff(now, 'hours') < 24) {
    return chalk.yellow(`${formatted} (${timeUntil})`);
  }
  
  return `${formatted} (${timeUntil})`;
}

export function createTeamTable(players: Player[]): string {
  const table = new Table({
    head: ['Pos', 'Player', 'Team', 'Price', 'Points', 'Status'].map(h => chalk.cyan(h)),
    style: {
      head: [],
      border: ['gray']
    },
    chars: {
      'top': '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      'bottom': '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      'left': '║',
      'left-mid': '╟',
      'right': '║',
      'right-mid': '╢',
      'mid': '─',
      'mid-mid': '┼'
    }
  });
  
  players.forEach(player => {
    const status = getPlayerStatusIcon(player.status || 'available');
    table.push([
      getPositionIcon(player.position),
      player.name,
      player.team,
      formatCurrency(player.price),
      player.points?.toString() || '-',
      status
    ]);
  });
  
  return table.toString();
}

export function createLeagueTable(standings: Standing[]): string {
  const table = new Table({
    head: ['Rank', 'Change', 'Team', 'Manager', 'GW', 'Total'].map(h => chalk.cyan(h)),
    style: {
      head: [],
      border: ['gray']
    }
  });
  
  standings.forEach(entry => {
    const rankChange = formatRankChange(entry.rankChange);
    table.push([
      entry.rank,
      rankChange,
      entry.teamName,
      `@${entry.manager}`,
      entry.gameweekPoints?.toString() || '-',
      chalk.bold(entry.totalPoints?.toString() || '-')
    ]);
  });
  
  return table.toString();
}

function getPositionIcon(position: string): string {
  switch (position) {
    case 'GK': return '🥅';
    case 'DEF': return '🛡️';
    case 'MID': return '⚡';
    case 'FWD': return '⚔️';
    default: return position;
  }
}

function getPlayerStatusIcon(status: string | undefined): string {
  switch (status) {
    case 'available': return '✅';
    case 'injured': return '🤕';
    case 'suspended': return '🔴';
    case 'doubtful': return '⚠️';
    case 'unavailable': return '❌';
    default: return '❓';
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

export function displayTransferSummary(transfers: Transfer[]): void {
  console.log(chalk.cyan('\n📋 Transfer Summary\n'));
  
  transfers.forEach((transfer, index) => {
    console.log(chalk.gray(`Transfer ${index + 1}:`));
    console.log(`  ${chalk.red('OUT:')} ${transfer.out.name} (${transfer.out.team}) - ${formatCurrency(transfer.out.price)}`);
    console.log(`  ${chalk.green('IN:')} ${transfer.in.name} (${transfer.in.team}) - ${formatCurrency(transfer.in.price)}`);
    
    const profit = transfer.in.price - transfer.out.price;
    if (profit !== 0) {
      console.log(`  ${chalk.yellow('Net:')} ${formatCurrency(Math.abs(profit))} ${profit > 0 ? 'spent' : 'gained'}`);
    }
    console.log();
  });
}

export function displayValidationResults(results: ValidationResult): void {
  if (results.valid) {
    console.log(chalk.green('\n✅ All validation checks passed!\n'));
    
    if (results.info) {
      console.log(chalk.cyan('Team Summary:'));
      console.log(`  Budget: ${formatCurrency(results.info.budget.spent)} / ${formatCurrency(100)}`);
      console.log(`  Squad: Valid (2-5-5-3)`);
      console.log(`  Formation: ${results.info.formation || 'Not set'}`);
    }
  } else {
    console.log(chalk.red('\n❌ Validation failed\n'));
    
    if (results.errors && results.errors.length > 0) {
      console.log(chalk.red('Errors:'));
      results.errors.forEach((error) => {
        console.log(`  • ${error.message}`);
        if (error.fix) {
          console.log(chalk.gray(`    Fix: ${error.fix}`));
        }
      });
    }
  }
  
  if (results.warnings && results.warnings.length > 0) {
    console.log(chalk.yellow('\nWarnings:'));
    results.warnings.forEach((warning) => {
      console.log(`  ⚠️ ${warning.message}`);
      if (warning.suggestion) {
        console.log(chalk.gray(`    Suggestion: ${warning.suggestion}`));
      }
    });
  }
}

export function displayFixtures(fixtures: Fixture[]): void {
  const grouped = fixtures.reduce((acc, fixture) => {
    const date = dayjs(fixture.kickoff).format('ddd DD MMM');
    if (!acc[date]) acc[date] = [];
    acc[date].push(fixture);
    return acc;
  }, {} as Record<string, any[]>);
  
  Object.entries(grouped).forEach(([date, matches]) => {
    console.log(chalk.cyan(`\n${date}`));
    console.log(chalk.gray('─'.repeat(40)));
    
    matches.forEach((match) => {
      const time = dayjs(match.kickoff).format('HH:mm');
      const score = match.finished 
        ? `${match.homeScore}-${match.awayScore}` 
        : 'vs';
      console.log(`  ${time}  ${match.homeTeam} ${score} ${match.awayTeam}`);
    });
  });
}

export function displayChipStatus(chips: ChipStatus): void {
  console.log(chalk.cyan('\n💎 Chip Status\n'));
  
  const chipInfo = [
    { name: 'Wildcard 1', key: 'wildcard1', icon: '🃏' },
    { name: 'Wildcard 2', key: 'wildcard2', icon: '🃏' },
    { name: 'Free Hit', key: 'freeHit', icon: '🎯' },
    { name: 'Triple Captain', key: 'tripleCaptain', icon: '3️⃣' },
    { name: 'Bench Boost', key: 'benchBoost', icon: '📈' }
  ];
  
  chipInfo.forEach(chip => {
    const used = chips[chip.key as keyof ChipStatus];
    const status = used ? chalk.gray('Used') : chalk.green('Available');
    console.log(`  ${chip.icon}  ${chip.name}: ${status}`);
  });
}

export class ProgressBar {
  // private current: number = 0;
  private total: number;
  private width: number = 40;
  
  constructor(total: number) {
    this.total = total;
  }
  
  update(current: number, message?: string): void {
    // this.current = current;
    const percentage = Math.floor((current / this.total) * 100);
    const filled = Math.floor((current / this.total) * this.width);
    const empty = this.width - filled;
    
    const bar = chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
    const text = message || `Progress: ${current}/${this.total}`;
    
    process.stdout.write(`\r${bar} ${percentage}% ${text}`);
    
    if (current >= this.total) {
      console.log(); // New line when complete
    }
  }
}
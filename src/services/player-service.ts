import * as fs from 'fs/promises';
import * as path from 'path';
import { Player } from '../types';

export class PlayerService {
  private playersPath: string;
  private playersCache: Player[] | null = null;
  
  constructor() {
    this.playersPath = path.join(process.cwd(), 'data', 'players', 'players.json');
  }
  
  async loadPlayers(): Promise<Player[]> {
    if (this.playersCache) {
      return this.playersCache;
    }
    
    try {
      const data = await fs.readFile(this.playersPath, 'utf-8');
      const parsed = JSON.parse(data);
      this.playersCache = parsed.players;
      return this.playersCache || [];
    } catch (error) {
      console.error('Error loading players database:', error);
      return [];
    }
  }
  
  async getPlayersByPosition(position: 'GK' | 'DEF' | 'MID' | 'FWD'): Promise<Player[]> {
    const players = await this.loadPlayers();
    return players
      .filter(p => p.position === position && p.status === 'available')
      .sort((a, b) => (b.points || 0) - (a.points || 0));
  }
  
  async searchPlayers(query: string): Promise<Player[]> {
    const players = await this.loadPlayers();
    const lowerQuery = query.toLowerCase();
    
    return players.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.team.toLowerCase().includes(lowerQuery)
    );
  }
  
  async getPlayerById(id: string): Promise<Player | undefined> {
    const players = await this.loadPlayers();
    return players.find(p => p.id === id);
  }
  
  async getPlayersByTeam(teamCode: string): Promise<Player[]> {
    const players = await this.loadPlayers();
    return players.filter(p => p.team === teamCode);
  }
  
  async getPlayersByPriceRange(min: number, max: number, position?: string): Promise<Player[]> {
    const players = await this.loadPlayers();
    return players.filter(p => {
      const priceMatch = p.price >= min && p.price <= max;
      const posMatch = !position || p.position === position;
      return priceMatch && posMatch && p.status === 'available';
    }).sort((a, b) => (b.points || 0) - (a.points || 0));
  }
  
  async getTopPlayers(limit: number = 10, position?: string): Promise<Player[]> {
    const players = await this.loadPlayers();
    const filtered = position 
      ? players.filter(p => p.position === position && p.status === 'available')
      : players.filter(p => p.status === 'available');
    
    return filtered
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, limit);
  }
  
  async getBudgetPlayers(maxPrice: number = 5.0): Promise<Player[]> {
    const players = await this.loadPlayers();
    return players
      .filter(p => p.price <= maxPrice && p.status === 'available')
      .sort((a, b) => (b.points || 0) - (a.points || 0));
  }
  
  formatPlayerDisplay(player: Player): string {
    return `${player.name} (${player.team}) - £${player.price}m - ${player.points || 0}pts`;
  }
  
  async getRecommendedSquad(budget: number = 100.0, strategy: 'balanced' | 'stars' | 'spread' = 'balanced'): Promise<{
    goalkeepers: Player[];
    defenders: Player[];
    midfielders: Player[];
    forwards: Player[];
    totalCost: number;
  }> {
    const players = await this.loadPlayers();
    
    // Budget allocation based on strategy
    const allocation = this.getBudgetAllocation(budget, strategy);
    
    // Select players for each position
    const goalkeepers = await this.selectBestPlayers(players, 'GK', 2, allocation.gk);
    const defenders = await this.selectBestPlayers(players, 'DEF', 5, allocation.def);
    const midfielders = await this.selectBestPlayers(players, 'MID', 5, allocation.mid);
    const forwards = await this.selectBestPlayers(players, 'FWD', 3, allocation.fwd);
    
    const totalCost = 
      goalkeepers.reduce((sum, p) => sum + p.price, 0) +
      defenders.reduce((sum, p) => sum + p.price, 0) +
      midfielders.reduce((sum, p) => sum + p.price, 0) +
      forwards.reduce((sum, p) => sum + p.price, 0);
    
    return {
      goalkeepers,
      defenders,
      midfielders,
      forwards,
      totalCost
    };
  }
  
  private getBudgetAllocation(budget: number, strategy: string) {
    switch (strategy) {
      case 'stars':
        return {
          gk: budget * 0.09,   // 9% on GKs
          def: budget * 0.25,  // 25% on DEFs
          mid: budget * 0.40,  // 40% on MIDs (premiums)
          fwd: budget * 0.26   // 26% on FWDs (premiums)
        };
      case 'spread':
        return {
          gk: budget * 0.10,   // 10% on GKs
          def: budget * 0.30,  // 30% on DEFs
          mid: budget * 0.35,  // 35% on MIDs
          fwd: budget * 0.25   // 25% on FWDs
        };
      default: // balanced
        return {
          gk: budget * 0.10,   // 10% on GKs
          def: budget * 0.28,  // 28% on DEFs
          mid: budget * 0.37,  // 37% on MIDs
          fwd: budget * 0.25   // 25% on FWDs
        };
    }
  }
  
  private async selectBestPlayers(
    players: Player[], 
    position: string, 
    count: number, 
    budget: number
  ): Promise<Player[]> {
    const positionPlayers = players
      .filter(p => p.position === position && p.status === 'available')
      .sort((a, b) => {
        // Sort by points per million (value)
        const aValue = (a.points || 0) / a.price;
        const bValue = (b.points || 0) / b.price;
        return bValue - aValue;
      });
    
    const selected: Player[] = [];
    let spent = 0;
    const avgPrice = budget / count;
    
    // Select mix of premium and budget based on allocation
    for (let i = 0; i < count && i < positionPlayers.length; i++) {
      if (i < count / 2) {
        // First half: get best value within 150% of average price
        const affordable = positionPlayers.find(p => 
          !selected.includes(p) && 
          p.price <= avgPrice * 1.5 &&
          spent + p.price <= budget
        );
        if (affordable) {
          selected.push(affordable);
          spent += affordable.price;
        }
      } else {
        // Second half: get budget options
        const budgetPlayer = positionPlayers.find(p => 
          !selected.includes(p) && 
          p.price <= avgPrice * 0.8 &&
          spent + p.price <= budget
        );
        if (budgetPlayer) {
          selected.push(budgetPlayer);
          spent += budgetPlayer.price;
        }
      }
    }
    
    // Fill remaining spots with cheapest available
    while (selected.length < count) {
      const cheapest = positionPlayers
        .filter(p => !selected.includes(p))
        .sort((a, b) => a.price - b.price)[0];
      
      if (cheapest) {
        selected.push(cheapest);
        spent += cheapest.price;
      } else {
        break;
      }
    }
    
    return selected;
  }
}
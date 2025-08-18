import Conf from 'conf';
import * as fs from 'fs/promises';
import * as path from 'path';
import { parse } from 'yaml';

export interface GFLConfig {
  github?: {
    username?: string;
    token?: string;
    defaultBranch?: string;
  };
  team?: {
    name?: string;
    created?: boolean;
    path?: string;
  };
  preferences?: {
    interactive?: boolean;
    colorOutput?: boolean;
    confirmTransfers?: boolean;
    autoValidate?: boolean;
    timezone?: string;
  };
  display?: {
    theme?: 'light' | 'dark' | 'auto';
    compactMode?: boolean;
    showEmojis?: boolean;
    tableStyle?: 'rounded' | 'simple' | 'ascii';
    dateFormat?: string;
    currency?: string;
  };
  notifications?: {
    deadlineReminder?: boolean;
    priceChanges?: boolean;
    injuryNews?: boolean;
    slackWebhook?: string;
  };
  advanced?: {
    apiEndpoint?: string;
    cacheTimeout?: number;
    maxRetries?: number;
    debugMode?: boolean;
    strictSSL?: boolean;
  };
}

type ConfigStore = Conf<GFLConfig>;

export class ConfigManager {
  private store: ConfigStore;
  private projectConfigPath: string;
  
  constructor() {
    this.store = new Conf<GFLConfig>({
      projectName: 'gfl',
      defaults: this.getDefaults()
    });
    this.projectConfigPath = path.join(process.cwd(), '.gflrc.json');
  }
  
  private getDefaults(): GFLConfig {
    return {
      preferences: {
        interactive: true,
        colorOutput: true,
        confirmTransfers: true,
        autoValidate: true,
        timezone: 'Europe/London'
      },
      display: {
        theme: 'auto',
        compactMode: false,
        showEmojis: true,
        tableStyle: 'rounded',
        dateFormat: 'DD/MM/YYYY',
        currency: '£'
      },
      notifications: {
        deadlineReminder: true,
        priceChanges: true,
        injuryNews: true
      },
      advanced: {
        apiEndpoint: 'https://fantasy.premierleague.com/api',
        cacheTimeout: 300,
        maxRetries: 3,
        debugMode: false,
        strictSSL: true
      }
    };
  }
  
  async load(): Promise<GFLConfig> {
    // Load global config
    let config = this.store.store;
    
    // Check for project-specific config
    try {
      const projectConfig = await fs.readFile(this.projectConfigPath, 'utf-8');
      const projectData = JSON.parse(projectConfig);
      config = { ...config, ...projectData };
    } catch (error) {
      // No project config, that's fine
    }
    
    // Check environment variables
    config = this.loadFromEnv(config);
    
    return config;
  }
  
  private loadFromEnv(config: GFLConfig): GFLConfig {
    if (process.env.GFL_GITHUB_USER) {
      config.github = config.github || {};
      config.github.username = process.env.GFL_GITHUB_USER;
    }
    
    if (process.env.GFL_GITHUB_TOKEN) {
      config.github = config.github || {};
      config.github.token = process.env.GFL_GITHUB_TOKEN;
    }
    
    if (process.env.GFL_INTERACTIVE !== undefined) {
      config.preferences = config.preferences || {};
      config.preferences.interactive = process.env.GFL_INTERACTIVE === 'true';
    }
    
    if (process.env.GFL_COLOR !== undefined) {
      config.preferences = config.preferences || {};
      config.preferences.colorOutput = process.env.GFL_COLOR === 'true';
    }
    
    if (process.env.GFL_DEBUG !== undefined) {
      config.advanced = config.advanced || {};
      config.advanced.debugMode = process.env.GFL_DEBUG === 'true';
    }
    
    return config;
  }
  
  async save(config: GFLConfig): Promise<void> {
    // Save to global config
    this.store.set(config);
  }
  
  async saveProject(config: GFLConfig): Promise<void> {
    // Save to project-specific config
    await fs.writeFile(
      this.projectConfigPath,
      JSON.stringify(config, null, 2)
    );
  }
  
  async get(key: string): Promise<unknown> {
    const config = await this.load();
    return this.getNestedValue(config as Record<string, unknown>, key);
  }
  
  async set(key: string, value: unknown): Promise<void> {
    const config = await this.load();
    this.setNestedValue(config as Record<string, unknown>, key, value);
    await this.save(config);
  }
  
  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((current: unknown, key: string) => {
      return (current as Record<string, unknown>)?.[key];
    }, obj);
  }
  
  private setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key] as Record<string, unknown>;
    }, obj);
    target[lastKey] = value;
  }
  
  async reset(): Promise<void> {
    this.store.clear();
    await this.save(this.getDefaults());
  }
  
  async loadTeamConfig(): Promise<any> {
    const config = await this.load();
    const teamPath = config.team?.path || `teams/${config.github?.username}`;
    
    try {
      const teamFile = path.join(process.cwd(), teamPath, 'team.json');
      const teamData = await fs.readFile(teamFile, 'utf-8');
      return JSON.parse(teamData);
    } catch (error) {
      return null;
    }
  }
  
  async loadRulesConfig(): Promise<any> {
    try {
      const rulesFile = path.join(process.cwd(), 'data', 'rules', 'rules.yaml');
      const rulesData = await fs.readFile(rulesFile, 'utf-8');
      return parse(rulesData);
    } catch (error) {
      // Return default rules if file doesn't exist
      return {
        budget: { max: 100.0 },
        squad: {
          size: 15,
          composition: { GK: 2, DEF: 5, MID: 5, FWD: 3 }
        },
        teamLimit: { maxPerClub: 3 },
        transfers: { maxFree: 5, costPerExtra: 4 }
      };
    }
  }
}
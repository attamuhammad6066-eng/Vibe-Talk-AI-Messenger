/**
 * SettingsManager.ts
 * Implements a robust DataStore / settings persistence layer for securely storing
 * application preferences such as 'App Lock', Biometric protection, theme, and notification settings.
 */

export interface AppSettings {
  appLockEnabled: boolean;
  biometricPromptOnResume: boolean;
  theme: string;
  accentColor: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  dataSaverMode: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  appLockEnabled: true,
  biometricPromptOnResume: true,
  theme: 'dark',
  accentColor: '#8B5CF6',
  notificationsEnabled: true,
  soundEnabled: true,
  dataSaverMode: false
};

const SETTINGS_KEY = 'vibetalk_datastore_settings_v1';

export class SettingsManager {
  private static instance: SettingsManager;
  private settings: AppSettings;

  private constructor() {
    this.settings = this.loadFromStore();
  }

  public static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  private loadFromStore(): AppSettings {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (raw) {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
        }
      }
    } catch (err) {
      console.error('Failed to load settings from DataStore:', err);
    }
    return DEFAULT_SETTINGS;
  }

  private saveToStore(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
      }
    } catch (err) {
      console.error('Failed to save settings to DataStore:', err);
    }
  }

  /**
   * Get all application settings.
   */
  public getSettings(): AppSettings {
    return { ...this.settings };
  }

  /**
   * Get specific 'App Lock' preference boolean.
   */
  public isAppLockEnabled(): boolean {
    return this.settings.appLockEnabled;
  }

  /**
   * Set and securely persist 'App Lock' preference boolean.
   */
  public setAppLockEnabled(enabled: boolean): void {
    this.settings.appLockEnabled = enabled;
    this.saveToStore();
  }

  /**
   * Update arbitrary settings patch.
   */
  public updateSettings(patch: Partial<AppSettings>): AppSettings {
    this.settings = { ...this.settings, ...patch };
    this.saveToStore();
    return { ...this.settings };
  }
}

export const settingsManager = SettingsManager.getInstance();

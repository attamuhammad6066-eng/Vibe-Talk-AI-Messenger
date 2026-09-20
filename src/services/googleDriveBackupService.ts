import { UserProfile } from '../types';

export interface VibeTalkBackupPayload {
  email: string;
  backupTime: string;
  backupSize: string;
  chats: any[];
  messages: Record<string, any[]>;
  contacts: any[];
  stories: any[];
  user: Partial<UserProfile>;
}

class GoogleDriveBackupService {
  // We use a separate local storage namespace to simulate the "Google Drive Cloud Engine".
  // This registry mimics external Google Drive servers.
  private getCloudRegistryKey(email: string): string {
    return `vibetalk_gdrive_cloud_registry_${email.toLowerCase().trim()}`;
  }

  /**
   * Helper to format bytes into readable sizes
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Links a Gmail account to the VibeTalk app
   */
  public async linkGmail(email: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 800);
    });
  }

  /**
   * Checks if a backup exists in Google Drive for a given Gmail account
   */
  public checkBackupExists(email: string): VibeTalkBackupPayload | null {
    try {
      const key = this.getCloudRegistryKey(email);
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to check backup existence:', e);
    }
    return null;
  }

  /**
   * Creates a backup of the current VibeTalk state and uploads it to Google Drive
   */
  public async uploadBackup(
    email: string,
    progressCallback?: (percent: number) => void
  ): Promise<{ backupTime: string; backupSize: string }> {
    return new Promise((resolve, reject) => {
      try {
        // Collect local state keys
        const chatsRaw = localStorage.getItem('vibetalk_chats_v3') || '[]';
        const messagesRaw = localStorage.getItem('vibetalk_messages_v3') || '{}';
        const contactsRaw = localStorage.getItem('vibetalk_contacts_v3') || '[]';
        const storiesRaw = localStorage.getItem('vibetalk_stories_v3') || '[]';
        const userRaw = localStorage.getItem('vibetalk_user_profile_v1') || '{}';

        const chats = JSON.parse(chatsRaw);
        const messages = JSON.parse(messagesRaw);
        const contacts = JSON.parse(contactsRaw);
        const stories = JSON.parse(storiesRaw);
        const user = JSON.parse(userRaw);

        // Package payload
        const payload: VibeTalkBackupPayload = {
          email: email.toLowerCase().trim(),
          backupTime: new Date().toISOString(),
          backupSize: '0 KB', // set below
          chats,
          messages,
          contacts,
          stories,
          user
        };

        const jsonString = JSON.stringify(payload);
        const byteCount = new Blob([jsonString]).size;
        const formattedSize = this.formatBytes(byteCount);
        payload.backupSize = formattedSize;

        // Perform multi-stage simulated secure Google Drive API chunk upload
        let currentProgress = 0;
        const interval = setInterval(() => {
          currentProgress += 10;
          if (progressCallback) progressCallback(currentProgress);

          if (currentProgress >= 100) {
            clearInterval(interval);
            try {
              // Persist backup in the Google Drive simulated cloud slot
              localStorage.setItem(this.getCloudRegistryKey(email), JSON.stringify(payload));
              resolve({
                backupTime: payload.backupTime,
                backupSize: formattedSize
              });
            } catch (err) {
              reject(new Error('Drive quota exceeded or writing failed'));
            }
          }
        }, 150);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Restores data from the specified Gmail's Google Drive backup into the local VibeTalk storage
   */
  public restoreBackup(email: string): boolean {
    try {
      const payload = this.checkBackupExists(email);
      if (!payload) return false;

      // Apply the values into local storage
      localStorage.setItem('vibetalk_chats_v3', JSON.stringify(payload.chats));
      localStorage.setItem('vibetalk_messages_v3', JSON.stringify(payload.messages));
      localStorage.setItem('vibetalk_contacts_v3', JSON.stringify(payload.contacts));
      localStorage.setItem('vibetalk_stories_v3', JSON.stringify(payload.stories));
      
      const mergedUser = {
        ...payload.user,
        linkedGmail: email,
        lastBackupTime: payload.backupTime,
        backupSize: payload.backupSize
      };
      localStorage.setItem('vibetalk_user_profile_v1', JSON.stringify(mergedUser));
      return true;
    } catch (e) {
      console.error('Failed to restore backup:', e);
      return false;
    }
  }

  /**
   * Deletes a backup from Google Drive
   */
  public deleteBackup(email: string) {
    try {
      localStorage.removeItem(this.getCloudRegistryKey(email));
    } catch (e) {
      console.error('Failed to delete backup:', e);
    }
  }
}

export const googleDriveBackupService = new GoogleDriveBackupService();

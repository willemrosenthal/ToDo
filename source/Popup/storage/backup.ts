import { openDB } from 'idb';
import { STORES } from './constants';
import { TabType, RecentlyDeleted } from '../types';

// Type declarations for File System Access API

const maxBackups = 15;
declare global {
  interface Window {
    showSaveFilePicker(options?: {
      suggestedName?: string;
      types?: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }): Promise<FileSystemFileHandle>;
    showOpenFilePicker(options?: {
      types?: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }): Promise<FileSystemFileHandle[]>;
  }
}

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
  getFile(): Promise<File>;
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: string): Promise<void>;
  close(): Promise<void>;
}

interface BackupData {
  timestamp: string;
  version: string;
  tabs: TabType[];
  tabData: Record<string, any>;
  recentlyDeleted: RecentlyDeleted[];
  settings: Record<string, any>;
  user: Record<string, any>;
}

const backupKey = 'todo-backups';

export const createBackup = async (download?: boolean): Promise<void> => {
  console.log('⬇️createBackup');
  try {
    const db = await openDB('toDoList', 1);

    console.log('db', db);

    // Collect all data from each store
    const tabs = await db.getAll(STORES.TABS);
    const recentlyDeleted = await db.getAll(STORES.RECENTLY_DELETED);
    const settings = await db.getAll(STORES.SETTINGS);
    const user = await db.getAll(STORES.USER);

    console.log('tabs', tabs);
    console.log('recentlyDeleted', recentlyDeleted);
    console.log('settings', settings);
    console.log('user', user);

    // Get tab data for each tab
    const tabData: Record<string, any> = {};
    for (const tab of tabs) {
      tabData[tab.id] = await db.get(STORES.TAB_DATA, tab.id);
    }

    // Create backup object
    const backupData: BackupData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      tabs,
      tabData,
      recentlyDeleted,
      settings,
      user,
    };

    console.log('backupData', backupData);

    // Convert to JSON string
    const jsonString = JSON.stringify(backupData, null, 2);

    console.log('jsonString', jsonString);

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `todo-backup-${timestamp}.json`;

    if (download) {
      // Use File System Access API to save the file
      if ('showSaveFilePicker' in window) {
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: 'JSON Backup File',
              accept: {
                'application/json': ['.json'],
              },
            },
          ],
        });

        const writable = await handle.createWritable();
        console.log('writable', writable);
        await writable.write(jsonString);
        await writable.close();

        console.log('✅ Backup created successfully:', filename);
      } else {
        // Fallback for browsers that don't support File System Access API
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('✅ Backup created successfully (fallback):', filename);
      }
    }
    // save in local storage
    const getExistingBackups = localStorage.getItem(backupKey);
    const parsedBackups = getExistingBackups ? JSON.parse(getExistingBackups) : [];
    console.log('parsedBackups', parsedBackups);
    parsedBackups.push(jsonString);
    if (parsedBackups.length > maxBackups) {
      parsedBackups.shift();
    }
    console.log('parsedBackups', parsedBackups);
    localStorage.setItem(backupKey, JSON.stringify(parsedBackups));
  } catch (error) {
    console.error('❌ Error creating backup:', error);
    throw error;
  }
};

export const getBackups = async (): Promise<BackupData[]> => {
  const getExistingBackups = localStorage.getItem(backupKey);
  if (!getExistingBackups) return [];

  const backupStrings = JSON.parse(getExistingBackups);
  return backupStrings.map((backupString: string) => JSON.parse(backupString));
};

export const restoreMostRecentBackup = async () => {
  const backups = await getBackups();
  console.log('backups', backups);

  if (backups.length === 0) {
    console.log('No backups available');
    return;
  }

  const mostRecentBackup = backups[backups.length - 1];
  console.log('mostRecentBackup', mostRecentBackup);

  // remove most recent backup from local storage
  const backupStrings = JSON.parse(localStorage.getItem(backupKey) || '[]');
  backupStrings.pop();
  localStorage.setItem(backupKey, JSON.stringify(backupStrings));

  await restoreFromBackup(mostRecentBackup);
};

// Optional: Function to restore from backup
export const restoreFromBackup = async (backupData: BackupData): Promise<void> => {
  console.log('restoreFromBackup', backupData);
  try {
    const db = await openDB('toDoList', 1);

    // Clear existing data
    await db.clear(STORES.TABS);
    await db.clear(STORES.TAB_DATA);
    await db.clear(STORES.RECENTLY_DELETED);
    await db.clear(STORES.SETTINGS);
    await db.clear(STORES.USER);

    // Restore tabs
    for (const tab of backupData.tabs) {
      console.log('tab', tab);
      await db.put(STORES.TABS, tab, tab.id);
    }

    // Restore tab data
    for (const [tabId, data] of Object.entries(backupData.tabData)) {
      console.log('data', data);
      await db.put(STORES.TAB_DATA, data, tabId);
    }

    // Restore recently deleted
    for (const item of backupData.recentlyDeleted) {
      console.log('item', item);
      await db.put(STORES.RECENTLY_DELETED, item, item.id);
    }

    // Restore settings
    for (const [key, value] of Object.entries(backupData.settings)) {
      await db.put(STORES.SETTINGS, value, key);
    }

    // Restore user data
    for (const [key, value] of Object.entries(backupData.user)) {
      await db.put(STORES.USER, value, key);
    }

    console.log('✅ Backup restored successfully');
  } catch (error) {
    console.error('❌ Error restoring backup:', error);
    throw error;
  }
};

// Optional: Function to load backup file
export const loadBackupFile = async (): Promise<BackupData> => {
  if ('showOpenFilePicker' in window) {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'JSON Backup File',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    });

    const file = await fileHandle.getFile();
    const content = await file.text();
    return JSON.parse(content);
  } else {
    // Fallback implementation
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    return new Promise((resolve, reject) => {
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const content = e.target?.result as string;
              resolve(JSON.parse(content));
            } catch (error) {
              reject(error);
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    });
  }
};

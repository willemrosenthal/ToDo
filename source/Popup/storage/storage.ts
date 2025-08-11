import { openDB } from 'idb';
import { STORES } from './constants';
import { v4 as uuidv4 } from 'uuid';
import { UserData, RecentlyDeleted, TabContent, TabType } from '../types';
import { signal } from '@preact/signals-react';
import { Settings } from '../signal/settings';

let pendingOperations = 0;
let allOperationPromises: Promise<void>[] = [];
const accessingDb = signal<Promise<void>>(Promise.resolve());

export const waitForDbAccessEnd = async () => {
  if (pendingOperations === 0) {
    return; // No operations pending, can close immediately
  }

  // Wait for all pending operations to complete
  await accessingDb.value;
};

const setAccessingDb = () => {
  pendingOperations++;

  // Create a promise for this specific operation
  let resolveOperation: () => void;
  const operationPromise = new Promise<void>((resolve) => {
    resolveOperation = resolve;
  });

  // Store the resolve function and add promise to the list
  (operationPromise as any).resolve = resolveOperation;
  allOperationPromises.push(operationPromise);

  // Update the main promise to wait for all operations
  accessingDb.value = Promise.all(allOperationPromises).then(() => {});
};

const setAccessingDbResolved = () => {
  pendingOperations--;

  // Find and resolve the oldest pending operation with a 50ms delay
  if (allOperationPromises.length > 0) {
    const oldestPromise = allOperationPromises.shift();
    if (oldestPromise && (oldestPromise as any).resolve) {
      setTimeout(() => {
        (oldestPromise as any).resolve();
      }, 50);
    }
  }
};

// Open (or create) the database
console.log('A');
const dbPromise = openDB('toDoList', 1, {
  upgrade(db) {
    db.createObjectStore(STORES.SETTINGS);
    db.createObjectStore(STORES.TABS);
    db.createObjectStore(STORES.TAB_DATA);
    db.createObjectStore(STORES.RECENTLY_DELETED);
    db.createObjectStore(STORES.USER_DATA);
  },
});
console.log('B');

const maxRecentlyDeleted = 8;
let totalTabs = 0;

// Create a new tab
export const newTab = async (tabToCreate?: Partial<TabType>, initialContent?: string) => {
  setAccessingDb();
  const db = await dbPromise;
  // create the tab
  const tabToMake = {
    id: uuidv4(),
    order: totalTabs,
    title: `Tab ${totalTabs + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...(tabToCreate || {}),
  };
  await db.put(STORES.TABS, tabToMake, tabToMake.id);

  // create the tab data
  const newTabContent: TabContent = {
    id: tabToMake.id,
    content: initialContent || '',
  };
  await db.put(STORES.TAB_DATA, newTabContent, tabToMake.id);

  // increment number of tabs
  totalTabs++;

  setAccessingDbResolved();
  return tabToMake;
};

export const updateTab = async (updates: Partial<TabType>) => {
  setAccessingDb();
  const db = await dbPromise;
  const tabToUpdate = await db.get(STORES.TABS, updates.id);
  const updatedTab = {
    ...tabToUpdate,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await db.put(STORES.TABS, updatedTab, updates.id);
  setAccessingDbResolved();
};

export const getRecentlyDeleted = async (): Promise<RecentlyDeleted[]> => {
  setAccessingDb();
  const db = await dbPromise;
  const recentlyDeleted = await db.getAll(STORES.RECENTLY_DELETED);
  const sortedRecentlyDeleted = recentlyDeleted.sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());
  setAccessingDbResolved();
  return sortedRecentlyDeleted;
};

// Delete a tab
export const deleteTab = async (tabId: string) => {
  setAccessingDb();
  if (totalTabs) {
    const db = await dbPromise;
    // get tab to be deleted
    const tab = await db.get(STORES.TABS, tabId);
    const tabData = await db.get(STORES.TAB_DATA, tabId);
    // save recently deleted tab data
    await saveRecentlyDeleted(tab, tabData);
    // delete tab
    await db.delete(STORES.TABS, tabId);
    await db.delete(STORES.TAB_DATA, tabId);
    totalTabs--;
  }
  setAccessingDbResolved();
};

const saveRecentlyDeleted = async (tab: TabType, tabData: any) => {
  const db = await dbPromise;
  const recentlyDeleted: RecentlyDeleted = {
    id: tab.id,
    tabName: tab.title,
    deletedAt: new Date().toISOString(),
    createdAt: tab.createdAt,
    data: tabData,
  };

  // get total entries in recently deleted
  const totalRecentlyDeleted = await db.count(STORES.RECENTLY_DELETED);

  if (totalRecentlyDeleted >= maxRecentlyDeleted) {
    const allRecentlyDeleted = await db.getAll(STORES.RECENTLY_DELETED);
    const oldestRecentlyDeleted = allRecentlyDeleted.sort((a, b) => new Date(a.deletedAt).getTime() - new Date(b.deletedAt).getTime())[0];
    // delete oldest recently deleted
    await db.delete(STORES.RECENTLY_DELETED, oldestRecentlyDeleted.id);
  }

  // save recently deleted
  await db.put(STORES.RECENTLY_DELETED, recentlyDeleted, recentlyDeleted.id);
};

export const deleteRecentlyDeleted = async (recentlyDeletedId: string) => {
  setAccessingDb();
  const db = await dbPromise;
  await db.delete(STORES.RECENTLY_DELETED, recentlyDeletedId);
  setAccessingDbResolved();
};

export const getTabs = async (): Promise<TabType[]> => {
  setAccessingDb();
  const db = await dbPromise;
  const tabs = await db.getAll(STORES.TABS);
  totalTabs = tabs.length;
  const orderedTabs = tabs.sort((a, b) => a.order - b.order);
  setAccessingDbResolved();
  return orderedTabs;
};

export const getAllTabsData = async (): Promise<TabContent[]> => {
  setAccessingDb();
  const db = await dbPromise;
  const allTabsData = await db.getAll(STORES.TAB_DATA);
  setAccessingDbResolved();
  return allTabsData;
};

export const isTabDataFormat = (td): boolean => {
  return typeof td === 'object' && td !== null && 'id' in td && 'content' in td;
};

export const getTabData = async (tabId: string): Promise<string> => {
  setAccessingDb();
  const db = await dbPromise;
  // could come in as a string (old version), or TabContent (new)
  const tabData = await db.get(STORES.TAB_DATA, tabId);
  setAccessingDbResolved();

  // return the content of the tab (new version)
  if (isTabDataFormat(tabData)) return tabData.content;
  // return the string-only content (old version)
  return tabData;
};

export const saveTabData = async (tabId: string, data: string) => {
  setAccessingDb();
  const db = await dbPromise;
  const tabContentDataToSave: TabContent = {
    id: tabId,
    content: data,
  };
  await db.put(STORES.TAB_DATA, tabContentDataToSave, tabId);
  setAccessingDbResolved();
};

export const getUserData = async (): Promise<UserData | null> => {
  setAccessingDb();
  const db = await dbPromise;
  const userData = await db.get(STORES.USER_DATA, 'userData');
  setAccessingDbResolved();
  return userData || null;
};

export const saveUserData = async (userData: Partial<UserData>) => {
  setAccessingDb();
  const db = await dbPromise;
  await db.put(STORES.USER_DATA, userData, 'userData');
  setAccessingDbResolved();
};

export const loadSettings = async () => {
  setAccessingDb();
  const db = await dbPromise;
  const settings = await db.get(STORES.SETTINGS, 'settings');
  setAccessingDbResolved();
  return settings;
};

export const saveSettings = async (settings: Partial<Settings>) => {
  setAccessingDb();
  const currentSettings = await loadSettings();
  const updatedSettings = {
    ...currentSettings,
    ...settings,
  };
  const db = await dbPromise;
  await db.put(STORES.SETTINGS, updatedSettings, 'settings');
  setAccessingDbResolved();
};

// Save data persistently
// export const saveData = async (key: string, value: any, storeName: STORES = STORES.TABS) => {
//   const db = await dbPromise;
//   await db.put(storeName, value, key);
// };

// // Get data
// export const getData = async (key: string, storeName: STORES = STORES.TABS) => {
//   const db = await dbPromise;
//   return db.get(storeName, key);
// };

// // Example usage
// saveData("theme", "dark"); // Saves theme setting persistently
// getData("theme").then(console.log); // Logs 'dark' even after cache is cleared

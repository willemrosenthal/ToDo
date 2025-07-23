import { openDB } from 'idb';
import { STORES } from './constants';
import { v4 as uuidv4 } from 'uuid';
import { RecentlyDeleted, TabType } from '../types';

// Open (or create) the database
const dbPromise = openDB('toDoList', 1, {
  upgrade(db) {
    db.createObjectStore(STORES.SETTINGS);
    db.createObjectStore(STORES.TABS);
    db.createObjectStore(STORES.TAB_DATA);
    db.createObjectStore(STORES.RECENTLY_DELETED);
    db.createObjectStore(STORES.USER);
  },
});

const maxRecentlyDeleted = 8;
let totalTabs = 0;

// Create a new tab
export const newTab = async (tabToCreate?: Partial<TabType>) => {
  const db = await dbPromise;
  const newTab = {
    id: uuidv4(),
    order: totalTabs,
    title: `Tab ${totalTabs + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...tabToCreate,
  };
  await db.put(STORES.TABS, newTab, newTab.id);
  await db.put(STORES.TAB_DATA, {}, newTab.id);
  totalTabs++;
  return newTab;
};

export const updateTab = async (updates: Partial<TabType>) => {
  const db = await dbPromise;
  const tabToUpdate = await db.get(STORES.TABS, updates.id);
  const updatedTab = {
    ...tabToUpdate,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  console.log('👍 updatedTab', updatedTab);
  await db.put(STORES.TABS, updatedTab, updates.id);
};

export const getRecentlyDeleted = async (): Promise<RecentlyDeleted[]> => {
  const db = await dbPromise;
  const recentlyDeleted = await db.getAll(STORES.RECENTLY_DELETED);
  const sortedRecentlyDeleted = recentlyDeleted.sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());
  return sortedRecentlyDeleted;
};

// Delete a tab
export const deleteTab = async (tabId: string) => {
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
  const db = await dbPromise;
  await db.delete(STORES.RECENTLY_DELETED, recentlyDeletedId);
};

export const getTabs = async (): Promise<TabType[]> => {
  const db = await dbPromise;
  const tabs = await db.getAll(STORES.TABS);
  totalTabs = tabs.length;
  const orderedTabs = tabs.sort((a, b) => a.order - b.order);
  return orderedTabs;
};

export const getTabData = async (tabId: string) => {
  const db = await dbPromise;
  return db.get(STORES.TAB_DATA, tabId);
};

export const saveTabData = async (tabId: string, data: string) => {
  const db = await dbPromise;
  await db.put(STORES.TAB_DATA, data, tabId);
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

import { batch, effect, signal } from '@preact/signals-react';
import { findLowestMissingId } from '../utils/utils';
import { selectedPaletteName, Settings } from './settings';
import { customPalette } from './settings';
import { PaletteColors } from '../theme/theme';
import { TabType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { deleteTab, getTabs, newTab, saveTabData, updateTab } from '../storage/storage';
import { convertFromOldFormat } from './migrateData';
// default data
const initialTab: TabType = {
  id: uuidv4(),
  order: 0,
  title: 'To Do',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export type TabUpdateType = {
  content?: string;
  id?: string;
};

// signals
export const tabList = signal<TabType[]>([]);
export const currentTab = signal<string>();
export const loadingTabData = signal<boolean>(true);

const getInitialData = async () => {
  const tabsFound = await getTabs();

  console.log('🐶 fetchedTabs', tabsFound);
  if (tabsFound.length > 0) {
    batch(() => {
      tabList.value = tabsFound;
      currentTab.value = tabsFound[0].id;
    });
  } else {
    convertFromOldFormat();
  }
};

const findClosestTab = (tab: TabType) => {
  const order = tab.order;
  let neighbor = tabList.value.find((t) => t.order === order - 1);
  if (neighbor) return neighbor;
  return tabList.value.find((t) => t.order === order + 1);
};

export const handleDeleteTab = async (tabToDelete: TabType) => {
  const deleteId = tabToDelete.id;
  const deleteOrderNumber = tabToDelete.order;
  // get tab to switch to
  const switchToTab = findClosestTab(tabToDelete);

  // delete the tab
  await deleteTab(deleteId);

  // update the order of the remaining tabs
  for (const tabToOrder of tabList.value) {
    console.log('💖 tabToOrder', tabToOrder);
    if (tabToOrder.order > deleteOrderNumber) {
      tabToOrder.order--;
      console.log('💖 updating tab', tabToOrder);
      await updateTab(tabToOrder);
    }
  }

  batch(() => {
    // remove tab to delete from tabList
    tabList.value = tabList.value.filter((tab) => tab.id !== deleteId);
    console.log('💖 updated tabList', tabList.value);

    // if there are tabs left, set the current tab to the previous tab
    if (tabList.value.length > 0) {
      console.log('💖 switching to tab', switchToTab);
      currentTab.value = switchToTab.id;
    }
  });
};

// get tabs from storage.
getInitialData();

effect(() => {
  if (currentTab.value) {
    loadingTabData.value = true;
  }
});

effect(() => {
  console.log('✅ tabList', tabList.value);
});

export function updateTabDataOnRefocus() {
  loadingTabData.value = true;
  currentTab.value = '';
  getInitialData();
}

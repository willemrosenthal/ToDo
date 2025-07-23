import { batch, effect, signal } from '@preact/signals-react';
import { findLowestMissingId } from '../utils/utils';
import { selectedPaletteName, Settings } from './settings';
import { customPalette } from './settings';
import { PaletteColors } from '../theme/theme';
import { TabType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { getTabs, newTab, saveTabData } from '../storage/storage';
import { StoredData } from './todoData_old';

const convertFromOldFormat = async () => {
  const res = localStorage.getItem(undefined);

  if (res) {
    const parsed: StoredData = JSON.parse(res);
    console.log('👵 old format content:', parsed);
    const keysInTabs = Object.keys(parsed.tabs);
    let index = 0;
    const newTabs: TabType[] = [];
    for (const tabId of keysInTabs) {
      const tab = parsed.tabs[keysInTabs[tabId]];
      console.log('tab:', tab);
      const newConvertedTab: TabType = {
        id: uuidv4(),
        order: index,
        title: tab.name,
        createdAt: parsed.timeStamp.toString(),
        updatedAt: parsed.timeStamp.toString(),
      };
      const newTabData = tab.content;
      await newTab(newConvertedTab);
      await saveTabData(newConvertedTab.id, newTabData);
      newTabs.push(newConvertedTab);
      index++;
    }
    localStorage.removeItem(undefined);
    tabList.value = newTabs;
    currentTab.value = newTabs[0].id;
    return true;
  }
  return false;
};

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
export const currentTab = signal<string>(initialTab.id);
export const loadingTabData = signal<boolean>(true);

const getInitialData = async () => {
  let tabsFound = false;
  getTabs().then((fetchedTabs) => {
    console.log('🐶 fetchedTabs', fetchedTabs);
    if (fetchedTabs.length > 0) {
      tabList.value = fetchedTabs;
      currentTab.value = fetchedTabs[0].id;
      tabsFound = true;
    } else {
      convertFromOldFormat();
    }
  });
  // if (!tabsFound) {
  //   const converted = await convertFromOldFormat();
  //   if (!converted) {
  //     tabList.value = [initialTab];
  //     newTab(initialTab);
  //     currentTab.value = initialTab.id;
  //   }
  // }
};

// get tabs from storage.
getInitialData();
// getTabs().then((fetchedTabs) => {
//   console.log('🐶 fetchedTabs', fetchedTabs);
//   if (fetchedTabs.length > 0) {
//     tabList.value = fetchedTabs;
//     currentTab.value = fetchedTabs[0].id;
//   } else {
//     tabList.value = [initialTab];
//     newTab(initialTab);
//     currentTab.value = initialTab.id;
//   }
// });

effect(() => {
  if (currentTab.value) {
    loadingTabData.value = true;
  }
});

effect(() => {
  console.log('✅ tabList', tabList.value);
});

// const changeTab = (tabId: string) => {
//   currentTab.value = tabId;
//   getTabData(tabId).then((tabData) => {
//     data.value = tabData;
//   });
// };

export function updateTabDataOnRefocus() {
  loadingTabData.value = true;
  currentTab.value = '';
  getInitialData();
}

import { batch, computed, effect, signal } from '@preact/signals-react';
import { selectedPaletteName, Settings } from './settings';
import { customPalette } from './settings';
import { TabContent, TabType, UserData } from '../types';
import {
  deleteTab,
  getAllTabsData,
  getUserData,
  getTabData,
  getTabs,
  isTabDataFormat,
  loadSettings,
  saveUserData,
  saveTabData,
} from '../storage/storage';
import { convertFromOldFormat } from './migrateData';
import { isLoading, loadingState, minLoadTime } from './app';
import { waitFor } from '../utils/utils';

export type TabUpdateType = {
  content?: string;
  id?: string;
};

export type TabToContentMap = Map<string, string>;

// signals
export const tabList = signal<TabType[]>([]);
export const currentTab = signal<string>();
export const settings = signal<Settings>();
export const tabContents = signal<TabToContentMap>(new Map());

export const setLoadedData = ({
  tabsFound,
  contentMap,
  settings,
  userData,
}: {
  tabsFound: TabType[];
  contentMap: TabToContentMap;
  settings: Settings;
  userData: UserData;
}) => {
  batch(() => {
    const startingTabId = userData?.lastTabId ?? tabsFound[0].id;
    tabList.value = tabsFound;
    tabContents.value = contentMap;
    currentTab.value = startingTabId;
    loadingState.value = 'complete';

    // set the settings
    if (settings) {
      if (settings.selectedPalette) selectedPaletteName.value = settings.selectedPalette;
      if (settings.palette) customPalette.value = settings.palette;
    }
  });
};

// fetch all tabs, all tab data, and all settings
const getInitialData = async () => {
  // don't continue if we are already loading
  if (loadingState.value === 'loading') return;
  loadingState.value = 'loading';

  const currentTimeInMS = Date.now();

  const tabsFound = await getTabs();
  const settings: Settings = await loadSettings();
  const tabsData = await getAllTabsData();
  const userData = await getUserData();

  // create map of tab data (if the tab data contains ids)
  const contentMap: TabToContentMap = new Map();
  tabsData.forEach((td) => {
    if (isTabDataFormat(td)) {
      contentMap.set(td.id, td.content);
    }
  });

  // check to see if we are missing any tab data (due to old format)
  for (const tab of tabsFound) {
    if (!contentMap.has(tab.id)) {
      // get data for tab missing it's content
      const dataForTab = await getTabData(tab.id);
      // update the tab in the DB to the new format
      saveTabData(tab.id, dataForTab);
      // add it to the map
      contentMap.set(tab.id, dataForTab);
    }
  }

  // check to see if we are missing any tab data (likely due to old format)
  if (tabsData.length !== contentMap.size) {
    const tabsMissingData = tabsFound.filter((td) => !contentMap.has(td.id));
    console.warn('🐶 missing tab data for: ', tabsMissingData.length, 'tabs.');
    tabsMissingData.forEach((td) => {
      console.warn('🐶 missing tab data for: ', td.id, td.title);
    });
  }

  // wait for min time to elapse
  const timeElapsed = Date.now() - currentTimeInMS;
  const timeToWait = (minLoadTime - timeElapsed) / 1000; // sec
  if (timeToWait > 0) {
    await waitFor(timeToWait);
  }

  if (tabsFound.length > 0) {
    setLoadedData({
      tabsFound,
      contentMap,
      settings,
      userData,
    });
  } else {
    convertFromOldFormat();
  }
};

// get tabs from storage.
effect(() => {
  if (loadingState.value === 'initial') {
    getInitialData();
  }
});

effect(() => {
  // save last tab we visited
  if (currentTab.value && !isLoading.value) {
    saveUserData({ lastTabId: currentTab.value });
  }
});

export function updateTabDataOnRefocus() {
  getInitialData();
}

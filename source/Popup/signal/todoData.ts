import { batch, effect, signal } from "@preact/signals-react";
import { findLowestMissingId } from "../utils/utils";

// default data
const initialTab: Tab = {
  id: 0,
  name: 'To Do',
  content: 'test content',
};
const initialStore: StoredData = {
  tabs: {
    0: initialTab,
  },
  currentTabIndex: 0,
  tabOrder: [0],
};

// types
export type Tab = {
  id: number;
  name: string;
  content: string;
};

export type TabData = {
  [id: string]: Tab;
};

export type StoredData = {
  tabs: TabData;
  currentTabIndex: number;
  tabOrder: number[];
};
export type TabUpdateType = {
  content?: string;
  name?: string;
}

// signals
export const storeData = signal<StoredData>(initialStore);
export const currentTab = signal<Tab>(initialTab);
export const dataLoaded = signal<boolean>(false);

getFromLocal();

// functions
export const getCurrentTabId = () => {
  return storeData.value.tabOrder[storeData.value.currentTabIndex];
};
export const getCurrentTab = (): Tab => {
  const tabId = getCurrentTabId();
  return storeData.value.tabs[tabId];
};

export const getCurrentTabContent = (): string => {
  const tab = getCurrentTab();
  return tab.content;
};

export const setCurrentTab = (index: number) => {
  storeData.value = {
    ...storeData.value,
    currentTabIndex: index,
  };
};

export const saveTab = (update: TabUpdateType) => {
  if (!dataLoaded.value) {
    console.log('dont save on load');
    return;
  }

  console.log('SAVING TAB:', dataLoaded.value);

  const id = getCurrentTabId();
  const existingTab = storeData.value.tabs[id];
  storeData.value = {
    ...storeData.value,
    tabs: {
      ...storeData.value.tabs,
      [id]: {
        ...(existingTab && existingTab),
        ...(update.content && {content: update.content}),
        ...(update.name && {name: update.name}),
      },
    },
  };
};

export function createTab(name = '', defaultContent = ''): Tab {
  const s = storeData.value;
  const newTabId = findLowestMissingId(s.tabOrder);
  const newTab: Tab = {
    id: newTabId,
    name: name || `new-tab-${newTabId}`,
    content: defaultContent,
  };
  storeData.value = {
    tabs: {
      ...s.tabs,
      [newTabId]: newTab,
    },
    currentTabIndex: s.tabOrder.length,
    tabOrder: [...s.tabOrder, newTabId],
  };
  return newTab;
}

// effects
effect(() => {
  console.log('storeData changed:', storeData.value);
  currentTab.value = getCurrentTab();
  // save in local storage
  // ...
  saveInLocal();
});

// SAVING
const todoDataKey = undefined; //'@to-do-data-key';
function saveInLocal() {
  console.log('SAVING');
  localStorage.setItem(todoDataKey, JSON.stringify(storeData.value));
}
function getFromLocal() {
  console.log('LOADING');
  const res = localStorage.getItem(todoDataKey);
  console.log("LOADED:", res);
  if (res) {
    batch(()=> {
      storeData.value = JSON.parse(res);
      dataLoaded.value = true;
      console.log('loaded values from local storage');
    });
    requestAnimationFrame(() => {
      currentTab.value = getCurrentTab();
      console.log('current tab:', currentTab.value);
    });
  } else {
    dataLoaded.value = true;
  }
}

// import React from 'react';
// import {findLowestMissingId} from '../utils/utils';
// import {
//   dataLoaded,
//   loadStoredValue,
//   storeData,
// } from './useAsyncLocalStorage/useAsyncLocalStorage';
// import {useSignalEffect} from '@preact/signals-react';

// export type Tab = {
//   id: number;
//   name: string;
//   content: string;
// };

// export type TabData = {
//   [id: string]: Tab;
// };

// export type StoredData = {
//   tabs: TabData;
//   currentTabIndex: number;
//   tabOrder: number[];
// };

// type TabFunctionsType = {
//   get: (index: number, updateCurrentTabIndex?: boolean) => Tab;
//   getCurrent: () => Tab;
//   getNames: () => string[];
//   create: (name: string, defaultContent?: string) => void;
//   delete: (id: number) => void;
//   update: (id: number, update: Tab) => void;
// };

// export const useStorage = (): TabFunctionsType => {
//   // load data on startup
//   useSignalEffect(() => {
//     if (!dataLoaded.value) {
//       loadStoredValue();
//     }
//   });

//   const setData = (data: StoredData) => {
//     storeData.value = data;
//   };

//   function getTab(index: number, updateCurrentTabIndex = true): Tab {
//     const data = storeData.value;
//     if (data.tabOrder.length <= index)
//       throw new Error(
//         `attempting to get tab #${index} when only ${data.tabOrder.length} tabs exist`
//       );
//     if (updateCurrentTabIndex && data.currentTabIndex !== index) {
//       setData({
//         ...data,
//         currentTabIndex: index,
//       });
//     }
//     return data.tabs[data.tabOrder[index]];
//   }

//   function getCurrentTab(): Tab {
//     const tabId = storeData.value.tabOrder[storeData.value.currentTabIndex];
//     return storeData.value.tabs[tabId];
//   }

//   function getTabNames(): string[] {
//     const data = storeData.value;
//     const tabNames: string[] = [];
//     for (let i = 0; data.tabOrder.length; i += 1) {
//       const tabId = data.tabOrder[i];
//       tabNames.push(data.tabs[tabId].name);
//     }
//     return tabNames;
//   }

//   function createTab(name: string, defaultContent = ''): void {
//     const data = storeData.value;
//     const newTabId = findLowestMissingId(data.tabOrder);
//     const newTab: Tab = {
//       id: newTabId,
//       name,
//       content: defaultContent,
//     };
//     setData({
//       tabs: {
//         ...data.tabs,
//         [newTabId]: newTab,
//       },
//       currentTabIndex: data.tabOrder.length,
//       tabOrder: [...data.tabOrder, newTabId],
//     });
//   }

//   function deleteTab(id: number): void {
//     const data = storeData.value;
//     let newCurrentTabIndex = data.currentTabIndex;
//     // if current tab matches id, and we are on the last tab...
//     if (
//       data.tabOrder[newCurrentTabIndex] === id &&
//       data.tabOrder.length === newCurrentTabIndex
//     ) {
//       newCurrentTabIndex -= 1;
//     }
//     // create data to save:
//     const newTabs = {...data.tabs};
//     delete newTabs[id];
//     // save new tab
//     setData({
//       tabs: newTabs,
//       currentTabIndex: newCurrentTabIndex,
//       tabOrder: data.tabOrder.filter((_id) => _id !== id),
//     });
//   }

//   function updateTab(id: number, update: Tab): void {
//     const data = storeData.value;
//     setData({
//       ...data,
//       tabs: {
//         ...data.tabs,
//         [id]: {
//           ...update,
//         },
//       },
//     });
//   }

//   // for getting and settings saved data
//   const tabs = {
//     get: getTab,
//     getCurrent: getCurrentTab,
//     getNames: getTabNames,
//     create: createTab,
//     update: updateTab,
//     delete: deleteTab,
//   };

//   return tabs;
// };

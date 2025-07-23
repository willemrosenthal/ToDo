import { batch } from '@preact/signals-react';
import { newTab, saveSettings, saveTabData } from '../storage/storage';
import { PaletteColors } from '../theme/theme';
import { TabType } from '../types';
import { customPalette, PaletteName, selectedPaletteName } from './settings';
import { tabList, currentTab } from './todoData';
import { v4 as uuidv4 } from 'uuid';

type Settings = {
  palette: PaletteColors;
  selectedPalette: PaletteName | string;
};

type Tab = {
  id: number;
  name: string;
  content: string;
};

type TabData = {
  [id: string]: Tab;
};

type StoredData = {
  tabs: TabData;
  currentTabIndex: number;
  tabOrder: number[];
  timeStamp?: number;
  settings?: Settings;
};

export const convertFromOldFormat = async () => {
  // don't do this if we already have tabs
  if (tabList.value.length > 0) {
    return false;
  }

  const res = localStorage.getItem(undefined);

  if (res) {
    const parsed: StoredData = JSON.parse(res);
    console.log('👵 old format content:', parsed);
    const keysInTabs = Object.keys(parsed.tabs);
    let index = 0;
    const newTabs: TabType[] = [];

    // convert to new format
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
      // save new tab
      await newTab(newConvertedTab);
      await saveTabData(newConvertedTab.id, newTabData);
      newTabs.push(newConvertedTab);
      index++;
    }
    // convert settings
    const migratedSettings: Partial<Settings> = {};
    if (parsed.settings.palette) {
      migratedSettings.palette = parsed.settings.palette;
    }
    if (parsed.settings.selectedPalette) {
      migratedSettings.selectedPalette = parsed.settings.selectedPalette;
    }
    if (Object.keys(migratedSettings).length > 0) {
      await saveSettings(migratedSettings);
    }
    // remove old format
    localStorage.removeItem(undefined);

    batch(() => {
      // set new format
      tabList.value = newTabs;
      currentTab.value = newTabs[0].id;
      if (parsed.settings) {
        if (parsed.settings.selectedPalette) selectedPaletteName.value = parsed.settings.selectedPalette;
        if (parsed.settings.palette) customPalette.value = parsed.settings.palette;
      }
    });
  }
};

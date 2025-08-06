import { newTab, saveSettings } from '../storage/storage';
import { PaletteColors } from '../theme/theme';
import { TabType } from '../types';
import { PaletteName } from './settings';
import { tabList, setLoadedData, TabToContentMap } from './todoData';
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
    const keysInTabs = Object.keys(parsed.tabs);
    let index = 0;
    const newTabs: TabType[] = [];
    const contentMap: TabToContentMap = new Map();

    // convert to new format
    for (const tabId of keysInTabs) {
      const tab = parsed.tabs[keysInTabs[tabId]];
      const newConvertedTab: TabType = {
        id: uuidv4(),
        order: index,
        title: tab.name,
        createdAt: parsed.timeStamp.toString(),
        updatedAt: parsed.timeStamp.toString(),
      };
      const newTabData = tab.content;
      // save new tab
      await newTab(newConvertedTab, newTabData);
      newTabs.push(newConvertedTab);
      contentMap.set(newConvertedTab.id, newTabData);
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

    setLoadedData({
      tabsFound: newTabs,
      contentMap,
      settings: parsed.settings,
      userData: null,
    });
  }
};

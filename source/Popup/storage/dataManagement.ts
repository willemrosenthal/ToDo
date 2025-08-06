import { batch } from '@preact/signals-react';
import { currentTab, tabContents, tabList } from '../signal/todoData';
import { deleteTab, newTab, updateTab } from './storage';
import { TabType } from '../types';

export const createTab = async (tabToCreate?: Partial<TabType>, goToTab: boolean = true) => {
  const newTabItem = await newTab(tabToCreate);
  batch(() => {
    tabList.value = [...tabList.value, newTabItem];

    const newTabContents = new Map(tabContents.value.entries());
    newTabContents.set(newTabItem.id, '');
    tabContents.value = newTabContents;

    if (goToTab) currentTab.value = newTabItem.id;
  });
  return newTabItem;
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
    if (tabToOrder.order > deleteOrderNumber) {
      tabToOrder.order--;
      await updateTab(tabToOrder);
    }
  }

  batch(() => {
    // remove tab to delete from tabList
    tabList.value = tabList.value.filter((tab) => tab.id !== deleteId);
    const newTabContents = new Map(tabContents.value.entries());
    newTabContents.delete(deleteId);
    tabContents.value = newTabContents;

    // if there are tabs left, set the current tab to the previous tab
    if (tabList.value.length > 0) {
      currentTab.value = switchToTab.id;
    }
  });
};

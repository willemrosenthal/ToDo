import React, {useCallback, useMemo, useState} from 'react';
import './TabBar.scss';
import {useSignalEffect} from '@preact/signals-react';
import Tab from '../Tab/Tab';
import {
  storeData,
  createTab,
  setCurrentTab,
  dataLoaded,
} from '../../signal/todoData';

type TabDisplayType = {
  title: string;
  id: number;
};

const TabBar = () => {
  const [tabs, setTabs] = useState<TabDisplayType[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const getTabs = () => {
    const output: TabDisplayType[] = [];
    storeData.value.tabOrder.forEach((id) => {
      const cTab = storeData.value.tabs[id];
      output.push({
        title: cTab.name,
        id: cTab.id,
      });
    });
    return output;
  };

  useSignalEffect(() => {
    if (dataLoaded.value) {
      setTabs(getTabs());
    }
  });

  // const handleOnTabSequenceChange = useCallback(
  //   ({oldIndex, newIndex}: {oldIndex: number; newIndex: number}) => {
  //     console.log({oldIndex, newIndex});
  //     setTabs((tabs) => helpers.simpleSwitch(tabs, oldIndex, newIndex));
  //     setActiveTab(newIndex);
  //   },
  //   []
  // );

  // const handleOnTabChange = useCallback((i) => {
  //   console.log('select tab', i);
  //   setActiveTab(i);
  //   setCurrentTab(i);
  // }, []);
  const handleOnTabChange = (i) => {
    console.log('select tab', i);
    setActiveTab(i);
    setCurrentTab(i);
  };

  const tabItems = useMemo(() => {
    return tabs.map((tab, index) => {
      console.log('KEY - ', tab.title);
      return (
        <Tab
          title={tab.title}
          key={tab.id}
          id={tab.id}
          index={index}
          chooseTab={handleOnTabChange}
        />
      );
    });
  }, [tabs]);

  const newTab = () => {
    createTab();
    getTabs();
    setActiveTab(tabs.length);
  };

  return (
    <div className="tab-bar">
      <div className='tab-bar-tabs'>
        {tabItems}
      </div>
      <div className='new-tab-button' role="button" onClick={newTab} onKeyDown={newTab} tabIndex={0}>
        +
      </div>
    </div>
  );
};

export default TabBar;

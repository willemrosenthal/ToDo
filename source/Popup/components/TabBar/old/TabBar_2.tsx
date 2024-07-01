import React, {useCallback, useMemo, useState} from 'react';
import 'react-quill/dist/quill.snow.css';
import {
  Tabs,
  DragTabList,
  Tab,
  helpers,
  ExtraButton,
} from '@react-tabtab-next/tabtab';

import '../styles.scss';
import './TabBar.scss';
import { createTab, dataLoaded, setCurrentTab, storeData } from '../../../signal/todoData';
import { useSignalEffect } from '@preact/signals-react';

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

  const tabItems = useMemo(() => {
    return tabs.map((tab, index) => {
      const key = `key_${index}`;
      return <Tab key={key}>{tab.title}</Tab>;
    });
  }, [tabs]);

  const handleOnTabSequenceChange = useCallback(
    ({oldIndex, newIndex}: {oldIndex: number; newIndex: number}) => {
      console.log({oldIndex, newIndex});
      setTabs((tabs) => helpers.simpleSwitch(tabs, oldIndex, newIndex));
      setActiveTab(newIndex);
    },
    []
  );

  const handleOnTabChange = useCallback((i) => {
    console.log('select tab', i);
    setActiveTab(i);
    setCurrentTab(i);
  }, []);

  return (
    <div className="tab-bar">
      <Tabs
        activeIndex={activeTab}
        onTabChange={handleOnTabChange}
        onTabSequenceChange={handleOnTabSequenceChange}
        ExtraButton={
          <ExtraButton
            onClick={() => {
              createTab();
              getTabs();
              setActiveTab(tabs.length);
            }}
          >
            +
          </ExtraButton>
        }
      >
        <DragTabList>{tabItems}</DragTabList>
        {/* <PanelList>
          <Panel>Content1</Panel>
          <Panel>Content2</Panel>
        </PanelList> */}
      </Tabs>
    </div>
  );
};

export default TabBar;

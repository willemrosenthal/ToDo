import React, { useCallback, useMemo, useRef, useState } from 'react';
import './TabBar.scss';
import { useSignalEffect } from '@preact/signals-react';
import Tab from '../Tab/Tab';
import { storeData, createTab, setCurrentTab, dataLoaded } from '../../signal/todoData';
import { useTheme } from '@emotion/react';
import { isStandalone } from '../../signal/popout';
import PopoutButton from '../PopoutButton/PopoutButton';

type TabDisplayType = {
  title: string;
  id: number;
};

const TabBar = () => {
  const tabBarRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();
  const [tabIsNewId, setTabIsNewId] = useState(-1);
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
          newTab={{ tabIsNewId, setTabIsNewId }}
        />
      );
    });
  }, [tabs]);

  const newTab = () => {
    const newTab = createTab();
    getTabs();
    setActiveTab(tabs.length);
    setTabIsNewId(newTab.id);
    setTimeout(() => {
      scrollToRight();
    }, 40);
  };

  const newTabButtonStyle = {
    backgroundColor: 'trasparent',
    // borderBottom: theme.palette.border.main,
    borderTop: `2px dashed ${theme.palette.border.main}`,
    borderLeft: `2px dashed ${theme.palette.border.main}`,
    borderRight: `2px dashed ${theme.palette.border.main}`,
  };

  const scrollToRight = () => {
    if (tabBarRef.current) {
      tabBarRef.current.scrollTo({
        left: tabBarRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='tab-bar'>
      <div className='tab-bar-tabs' ref={tabBarRef}>
        {
          !isStandalone.value && <PopoutButton />
        }
        {tabItems}
        <Tab title={'+'} key={'new-tab-button'} chooseTab={newTab} className='new-tab-button' style={newTabButtonStyle} />
      </div>
    </div>
  );
};

export default TabBar;

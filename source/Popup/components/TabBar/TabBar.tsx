import React, { useMemo, useRef, useState } from 'react';
import './TabBar.scss';
import { useSignalEffect } from '@preact/signals-react';
import Tab from '../Tab/Tab';
import { tabList } from '../../signal/todoData';
import { useTheme } from '@mui/material/styles';
import { isStandalone } from '../../signal/popout';
import PopoutButton from '../PopoutButton/PopoutButton';
import IconButton from '../IconButton/IconButton';
import { paletteDrawerOpen } from '../../signal/settings';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { TabType } from '../../types';
import { getTabs, newTab } from '../../storage/storage';

const TabBar = () => {
  const tabBarRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();

  const [tabs, setTabs] = useState<TabType[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>();

  // get tabs from storage.
  useSignalEffect(() => {
    if (typeof tabList.value !== 'undefined') {
      console.log('🛠️ tabList', tabList.value);
      setTabs(tabList.value);
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

  const handleOnTabChange = (tab: TabType) => {
    console.log('select tab', tab.id);
    setActiveTab(tab);
    // setCurrentTab(id);
  };

  const tabItems = useMemo(() => {
    return tabs.map((tab) => {
      console.log('📄 tab', tab);
      return <Tab tab={tab} key={tab.id} chooseTab={handleOnTabChange} />;
    });
  }, [tabs]);

  const createNewTab = async () => {
    const newTabItem = await newTab();
    const tabs = await getTabs();
    setTabs(tabs);
    setActiveTab(newTabItem);
    // setActiveTab(tabs.length);
    // setTabIsNewId(new.id);
    setTimeout(() => {
      scrollToRight();
    }, 40);
  };

  const newTabButtonStyle = {
    backgroundColor: 'trasparent',
    // borderBottom: theme.palette.border.main,
    // @ts-ignore
    borderTop: `2px dashed ${theme.palette.border.main}`,
    // @ts-ignore
    borderLeft: `2px dashed ${theme.palette.border.main}`,
    // @ts-ignore
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
        <IconButton
          icon={faGear}
          callback={() => {
            paletteDrawerOpen.value = true;
          }}
        />
        {!isStandalone.value && <PopoutButton />}
        {tabItems}
        <button className='new-tab-button-container' onClick={createNewTab} key={'new-tab-button'} style={newTabButtonStyle}>
          +
        </button>
      </div>
    </div>
  );
};

export default TabBar;

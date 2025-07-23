import React, { useMemo, useRef, useState } from 'react';
import './TabBar.scss';
import { useSignalEffect, batch, signal } from '@preact/signals-react';
import Tab from '../Tab/Tab';
import { currentTab, tabList } from '../../signal/todoData';
import { useTheme } from '@mui/material/styles';
import { isStandalone } from '../../signal/popout';
import PopoutButton from '../PopoutButton/PopoutButton';
import IconButton from '../IconButton/IconButton';
import { paletteDrawerOpen } from '../../signal/settings';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { TabType } from '../../types';
import { getTabs, newTab } from '../../storage/storage';

export const newTabId = signal<string>();

const TabBar = () => {
  const tabBarRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();

  const [tabs, setTabs] = useState<TabType[]>([]);

  // get tabs from storage.
  useSignalEffect(() => {
    if (typeof tabList.value !== 'undefined') {
      console.log('🛠️ tabList', tabList.value);
      setTabs(tabList.value);
    }
  });

  const tabItems = useMemo(() => {
    const items = tabs.map((tab) => {
      return <Tab tab={tab} key={tab.id} />;
    });
    return items;
  }, [tabs]);

  const createNewTab = async () => {
    const newTabItem = await newTab();
    const tabs = await getTabs();
    setTabs(tabs);
    newTabId.value = newTabItem.id;
    batch(() => {
      tabList.value = tabs;
      currentTab.value = newTabItem.id;
    });
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

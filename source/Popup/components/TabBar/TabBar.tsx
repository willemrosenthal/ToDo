import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import TabBarButton from './SubComponents/NewTabButton';
import RecentlyDeleted from './SubComponents/RecentlyDeleted';

export const newTabId = signal<string>();
const scrollPosition = signal<number | null>(null);

const TabBar = () => {
  const tabBarRef = useRef<HTMLDivElement>(null);

  // add a listener that saves the scroll position of the tab bar
  useEffect(() => {
    if (tabBarRef.current) {
      tabBarRef.current.addEventListener('scroll', () => {
        scrollPosition.value = tabBarRef.current?.scrollLeft;
      });
    }
    return () => {
      if (tabBarRef.current) {
        tabBarRef.current.removeEventListener('scroll', () => {});
      }
    };
  }, []);

  const [tabs, setTabs] = useState<TabType[]>([]);

  // get tabs from storage.
  useSignalEffect(() => {
    if (typeof tabList.value !== 'undefined') {
      setTabs(tabList.value);
    }
  });

  const tabItems = useMemo(() => {
    const items = tabs.map((tab) => {
      return <Tab tab={tab} key={tab.id} />;
    });
    // jump to the saved scroll position
    const prevScrollPosition = scrollPosition.value;
    setTimeout(() => {
      if (prevScrollPosition !== null) {
        const tabBar = document.getElementById('tab-bar-tabs');
        tabBar?.scrollTo({
          left: prevScrollPosition,
          behavior: 'auto',
        });
      }
    }, 0);
    return items;
  }, [tabs]);

  return (
    <div className='tab-bar'>
      <div className='tab-bar-tabs' ref={tabBarRef} id='tab-bar-tabs'>
        <IconButton
          icon={faGear}
          callback={() => {
            paletteDrawerOpen.value = true;
          }}
        />
        {!isStandalone.value && <PopoutButton />}
        {tabItems}
        <TabBarButton tabBarRef={tabBarRef} />
        <RecentlyDeleted />
      </div>
    </div>
  );
};

export default TabBar;

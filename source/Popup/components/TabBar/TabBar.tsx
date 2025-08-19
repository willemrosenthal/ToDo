import React, { useCallback, useEffect, useRef, useState } from 'react';
import './TabBar.scss';
import { useSignalEffect, signal } from '@preact/signals-react';
import Tab from '../Tab/Tab';
import { tabList } from '../../signal/todoData';
import { isStandalone } from '../../signal/popout';
import PopoutButton from '../PopoutButton/PopoutButton';
import IconButton from '../IconButton/IconButton';

import { paletteDrawerOpen } from '../../signal/settings';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { TabType } from '../../types';
import TabBarButton from './SubComponents/NewTabButton';
import RecentlyDeleted from './SubComponents/RecentlyDeleted';
import { SortableList } from './SortableTabs/SortableList';
import { updateAllTabOrders } from '../../storage/storage';

export const newTabId = signal<string>();
const scrollPosition = signal<number | null>(null);

const TabBar = () => {
  const tabBarRef = useRef<HTMLDivElement>(null);
  const [tabs, setTabs] = useState<TabType[]>([]);

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

  const onTabOrderChange = (tabs: TabType[]) => {
    const newTabOrder = tabs;
    newTabOrder.forEach((tab, index) => (tab.order = index));
    updateAllTabOrders(newTabOrder);
    tabList.value = tabs;
  };

  // get tabs from storage.
  useSignalEffect(() => {
    if (typeof tabList.value !== 'undefined' && !isEqual(tabs, tabList.value)) {
      setTabs(tabList.value);
    }
  });

  const renderItem = useCallback((item: TabType) => {
    return (
      <SortableList.Item id={item.id}>
        {/* {item.id} */}
        <SortableList.DragHandle>
          <Tab tab={item} key={item.id} />
        </SortableList.DragHandle>
      </SortableList.Item>
    );
    // return <Tab tab={item} key={item.id} />;
  }, []);

  return (
    //<div className='tab-bar' style={style}>
    <div className='tab-bar'>
      <div className='tab-bar-tabs' ref={tabBarRef} id='tab-bar-tabs'>
        <IconButton
          icon={faGear}
          callback={() => {
            paletteDrawerOpen.value = true;
          }}
        />
        {!isStandalone.value && <PopoutButton />}
        {/* {tabItems} */}
        <SortableList items={tabs} onChange={onTabOrderChange} renderItem={renderItem} />
        <TabBarButton tabBarRef={tabBarRef} />
        <RecentlyDeleted />
      </div>
    </div>
  );
};

export default TabBar;

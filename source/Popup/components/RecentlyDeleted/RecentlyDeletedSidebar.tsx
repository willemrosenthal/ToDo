import React, { useEffect, useState } from 'react';
import { getRecentlyDeleted, getTabs } from '../../storage/storage';
import { RecentlyDeleted } from '../../types';
import { mode } from '../../signal/app';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createBackup, loadBackupFile, restoreFromBackup } from '../../storage/backup';
import { batch } from '@preact/signals-react';
import { tabList, currentTab } from '../../signal/todoData';

interface RecentlyDeletedSidebarProps {
  setSelected: (recentlyDeleted: RecentlyDeleted) => void;
  selected: RecentlyDeleted;
}

const RecentlyDeletedSidebar = ({ setSelected, selected }: RecentlyDeletedSidebarProps) => {
  const [recentlyDeletedList, setRecentlyDeletedList] = useState<RecentlyDeleted[]>([]);

  useEffect(() => {
    const fetchRecentlyDeleted = async () => {
      const recentlyDeleted = await getRecentlyDeleted();
      setRecentlyDeletedList(recentlyDeleted);
    };
    fetchRecentlyDeleted();
  }, []);

  const recentlyDeletedItems = recentlyDeletedList.map((item) => {
    return <RecentlyDeletedSidebarItem key={item.id} item={item} setSelected={setSelected} />;
  });

  const handleBack = () => {
    mode.value = 'main';
    setSelected(null);
  };

  const handleBackup = () => {
    createBackup();
  };

  const handleRestore = async () => {
    const backupData = await loadBackupFile();
    console.log('backupData', backupData);
    await restoreFromBackup(backupData);
    const allTabs = await getTabs();
    batch(() => {
      tabList.value = allTabs;
      currentTab.value = allTabs[0]?.id;
    });
    handleBack();
  };

  return (
    <div className='recently-deleted-sidebar'>
      <button className='recently-deleted-sidebar-item recently-deleted-back-button' onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> back
      </button>
      {recentlyDeletedItems}
      <button className='recently-deleted-sidebar-item recently-deleted-back-button' onClick={handleBackup}>
        backup all
      </button>
      <button className='recently-deleted-sidebar-item recently-deleted-back-button' onClick={handleRestore}>
        restore backup
      </button>
    </div>
  );
};

const RecentlyDeletedSidebarItem = ({
  item,
  setSelected,
}: {
  item: RecentlyDeleted;
  setSelected: (recentlyDeleted: RecentlyDeleted) => void;
}) => {
  return (
    <button
      className='recently-deleted-sidebar-item'
      onClick={() => {
        setSelected(item);
      }}
    >
      {item.tabName}
    </button>
  );
};

export default RecentlyDeletedSidebar;

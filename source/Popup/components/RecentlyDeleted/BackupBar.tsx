import React, { useEffect, useState } from 'react';
import { getRecentlyDeleted, getTabs } from '../../storage/storage';
import { RecentlyDeleted } from '../../types';
import { mode } from '../../signal/app';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createBackup, loadBackupFile, restoreFromBackup, restoreMostRecentBackup } from '../../storage/backup';
import { batch } from '@preact/signals-react';
import { tabList, currentTab } from '../../signal/todoData';

const BackupBar = () => {
  const [recentlyDeletedList, setRecentlyDeletedList] = useState<RecentlyDeleted[]>([]);

  const handleBack = () => {
    mode.value = 'main';
  };

  const handleBackup = () => {
    createBackup(true);
  };

  const handleRestore = async () => {
    // const backupData = await loadBackupFile();
    // console.log('backupData', backupData);
    // await restoreFromBackup(backupData);
    await restoreMostRecentBackup();
    const allTabs = await getTabs();
    batch(() => {
      tabList.value = allTabs;
      currentTab.value = allTabs[0]?.id;
    });
    handleBack();
  };

  const handleRestoreFromFile = async () => {
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
    <div className='backup-bar'>
      <button
        className='recently-deleted-sidebar-item recently-deleted-back-button'
        onClick={handleBackup}
        style={{ borderRight: '1px solid black' }}
      >
        download backup
      </button>
      <button
        className='recently-deleted-sidebar-item recently-deleted-back-button'
        onClick={handleRestore}
        style={{ borderRight: '1px solid black' }}
      >
        restore from cache
      </button>
      <button className='recently-deleted-sidebar-item recently-deleted-back-button' onClick={handleRestoreFromFile}>
        restore from file
      </button>
    </div>
  );
};

export default BackupBar;

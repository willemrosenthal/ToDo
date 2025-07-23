import { RecentlyDeleted } from '../../types';
import RecentlyDeletedSidebar from './RecentlyDeletedSidebar';
import RecentlyDeletedViewer from './RecentlyDeletedViewer';
import React, { useState } from 'react';
import './recentlyDeleted.css';
import BackupBar from './BackupBar';

const RecentlyDeletedWindow = () => {
  const [recentlyDeleted, setRecentlyDeleted] = useState<RecentlyDeleted>();

  return (
    <div className='recently-deleted'>
      <div className='recently-deleted-container'>
        <RecentlyDeletedSidebar setSelected={setRecentlyDeleted} selected={recentlyDeleted} />
        <RecentlyDeletedViewer selected={recentlyDeleted} />
      </div>
      <BackupBar />
    </div>
  );
};

export default RecentlyDeletedWindow;

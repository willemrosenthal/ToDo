import { RecentlyDeleted } from '../../types';
import RecentlyDeletedSidebar from './RecentlyDeletedSidebar';
import RecentlyDeletedViewer from './RecentlyDeletedViewer';
import React, { useState } from 'react';
import './recentlyDeleted.css';

const RecentlyDeletedWindow = () => {
  const [recentlyDeleted, setRecentlyDeleted] = useState<RecentlyDeleted>();

  return (
    <div className='recently-deleted'>
      <RecentlyDeletedSidebar setSelected={setRecentlyDeleted} selected={recentlyDeleted} />
      <RecentlyDeletedViewer selected={recentlyDeleted} />
    </div>
  );
};

export default RecentlyDeletedWindow;

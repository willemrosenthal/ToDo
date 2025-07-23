import React, { useEffect, useState } from 'react';
import { RecentlyDeleted, TabType } from '../../types';
import { useTheme } from '@mui/material/styles';
import { saveTabData, newTab, deleteRecentlyDeleted, getTabs } from '../../storage/storage';
import { CircularProgress } from '@mui/material';
import { mode } from '../../signal/app';
import { currentTab, tabList } from '../../signal/todoData';
import { batch } from '@preact/signals-react';
interface RecentlyDeletedViewerProps {
  selected: RecentlyDeleted;
}

const RecentlyDeletedViewer = ({ selected }: RecentlyDeletedViewerProps) => {
  const theme = useTheme();
  const [restoringInProgress, setRestoringInProgress] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Example: "July 23, 2025, 2:10 PM"
    const formatted = date.toLocaleString('en-US', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
    return formatted;
  };

  console.log('selected.data', selected?.data);

  const handleRestore = async () => {
    setRestoringInProgress(true);
    const restoredTabPartial: Partial<TabType> = {
      title: selected.tabName,
      createdAt: selected.createdAt,
      updatedAt: selected.deletedAt,
    };
    const restoredTab = await newTab(restoredTabPartial);
    console.log('restoredTab', restoredTab);
    await saveTabData(restoredTab.id, selected.data);
    await deleteRecentlyDeleted(selected.id);
    const allTabs = await getTabs();
    batch(() => {
      tabList.value = allTabs;
      currentTab.value = restoredTab.id;
      mode.value = 'main';
    });
    setRestoringInProgress(false);
  };

  return (
    <div className='recently-deleted-viewer'>
      {restoringInProgress && (
        <div className='recently-deleted-viewer-restoring'>
          <CircularProgress />
        </div>
      )}
      {selected && !restoringInProgress && (
        <>
          <div
            className='recently-deleted-viewer-header'
            style={{
              backgroundColor: theme.palette.background.inactive,
            }}
          >
            <div className='recently-deleted-item-info'>
              <div>{selected.tabName}</div>
              <div>{formatDate(selected.deletedAt)}</div>
            </div>
            <div>
              <button onClick={handleRestore}>Restore</button>
            </div>
          </div>
          <div className='recently-deleted-viewer-body'>
            <div
              className='quill'
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: theme.palette.background.default,
              }}
            >
              <div className='ql-editor'>
                {typeof selected.data === 'string' ? (
                  <div className='content' dangerouslySetInnerHTML={{ __html: selected.data }} />
                ) : (
                  <div style={{ opacity: '50%' }}>empty file</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RecentlyDeletedViewer;

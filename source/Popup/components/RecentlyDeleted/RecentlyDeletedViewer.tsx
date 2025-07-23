import React, { useEffect, useState } from 'react';
import { RecentlyDeleted } from '../../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface RecentlyDeletedViewerProps {
  selected: RecentlyDeleted;
}

const RecentlyDeletedViewer = ({ selected }: RecentlyDeletedViewerProps) => {
  const getDate = (dateString: string) => {
    const date = new Date(dateString);

    // Example: "July 23, 2025, 2:10 PM"
    const formatted = date.toLocaleString('en-US', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
    return formatted;
    // return new Date(date).toLocaleDateString('en-US', {
    //   year: 'numeric',
    //   month: 'long',
    //   day: 'numeric',
    // });
  };

  console.log('selected.data', selected?.data);

  return (
    <div className='recently-deleted-viewer'>
      {selected && (
        <>
          <div className='recently-deleted-viewer-header'>
            <div className='recently-deleted-viewer-header-title'>
              <div>Date: {getDate(selected.deletedAt)}</div>
              <div>Tab: {selected.tabName}</div>
              <div>
                <button>Restore</button>
              </div>
            </div>
          </div>
          <div className='recently-deleted-viewer-body'>
            <div className='quill'>
              <div className='ql-container'>
                <div className='ql-editor'>
                  {typeof selected.data === 'string' ? (
                    <div className='content' dangerouslySetInnerHTML={{ __html: selected.data }} />
                  ) : (
                    <div>empty file</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RecentlyDeletedViewer;

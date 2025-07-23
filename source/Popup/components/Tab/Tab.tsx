import React, { useEffect, useRef, useState } from 'react';
import './Tab.scss';
import { useTheme } from '@mui/material/styles';
import { TabType } from '../../types';
import { currentTab, handleDeleteTab } from '../../signal/todoData';
import { updateTab } from '../../storage/storage';
import { useSignalEffect } from '@preact/signals-react';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import IconButton from '../IconButton/IconButton';
import { newTabId } from '../TabBar/TabBar';

type TabProps = {
  tab: TabType;
};

let isDeleting = false;

const Tab = ({ tab }: TabProps) => {
  const theme = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(tab.title);
  const [isSelected, setIsSelected] = useState(false);
  const renameRef = useRef<HTMLInputElement>(null);

  useSignalEffect(() => {
    if (newTabId.value === tab.id) {
      setEditMode(true);
    }
  });

  const handleClick = () => {
    currentTab.value = tab.id;
  };

  useSignalEffect(() => {
    setIsSelected(currentTab.value === tab.id);
  });

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const exitEditMode = () => {
    setEditMode(false);
    newTabId.value = '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && editMode) {
      exitEditMode();
      updateTab({ ...tab, title });
    }
  };

  // get focus
  useEffect(() => {
    if (editMode) {
      renameRef.current?.focus();
    }
  }, [editMode]);

  const isNewTab = () => newTabId.value === tab.id;

  return (
    <div
      style={{
        backgroundColor: currentTab.value === tab.id ? theme.palette.background.default : theme.palette.background.inactive,
        color: isSelected ? theme.palette.text.primary : theme.palette.text.secondary,
        // borderColor: theme.palette.tertiary.dark,

        // @ts-ignore
        borderLeft: isSelected ? `2px solid ${theme.palette.border.main}` : '2px solid transparent',
        // @ts-ignore
        borderTop: isSelected ? `2px solid ${theme.palette.border.main}` : '2px solid transparent',
        // @ts-ignore
        borderRight: isSelected ? `2px solid ${theme.palette.border.main}` : '2px solid transparent',
        // @ts-ignore
        borderBottom: isSelected ? '2px solid transparent' : `2px solid ${theme.palette.border.main}`,
      }}
      role='button'
      className={`tab ${isSelected ? 'selected' : ''} ${editMode ? 'editing' : ''} ${isNewTab() ? 'new-tab' : ''}`}
      onKeyDown={handleClick}
      onClick={handleClick}
      key={tab.id}
      tabIndex={tab.order}
      onDoubleClick={() => setEditMode(true)}
    >
      {!editMode ? (
        <div className='tab-text-cutoff'>
          <div className='tab-label'>{title}</div>
        </div>
      ) : (
        <div
          className='tab-edit-container'
          onBlur={() => {
            if (title !== tab.title && !isDeleting) {
              updateTab({ ...tab, title });
              newTabId.value = '';
            }
            setTimeout(() => {
              exitEditMode();
            }, 100);
          }}
        >
          <input
            ref={renameRef}
            className='tab-name-input'
            type='text'
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
            // onBlur={() => {
            //   setEditMode(false);
            //   updateTab({ ...tab, title });
            // }}
          />
          {!isNewTab() && (
            <div className='tab-delete-button-container'>
              <IconButton
                icon={faCircleXmark}
                callback={() => {
                  isDeleting = true;
                  exitEditMode();
                  handleDeleteTab(tab);
                }}
              />
            </div>
          )}
        </div>
      )}
      {/* @ts-ignore */}
      <div className='tab-bottom' style={{ backgroundColor: theme.palette.border.main, opacity: isSelected ? '0' : '100' }} />
    </div>
  );
};

export default Tab;

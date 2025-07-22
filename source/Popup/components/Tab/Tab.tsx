import React, { useEffect, useRef, useState } from 'react';
import './Tab.scss';
import { useTheme } from '@mui/material/styles';
import { TabType } from '../../types';
import { currentTab } from '../../signal/todoData';
import { updateTab } from '../../storage/storage';
import { useSignalEffect } from '@preact/signals-react';

type TabProps = {
  tab: TabType;
  chooseTab: (activateTab: TabType) => void;
  isNewTab?: boolean;
};

const Tab = ({ tab, chooseTab, isNewTab }: TabProps) => {
  const theme = useTheme();
  const [editMode, setEditMode] = useState(!!isNewTab);
  const [title, setTitle] = useState(tab.title);
  const [isSelected, setIsSelected] = useState(false);
  const renameRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    currentTab.value = tab.id;
    chooseTab(tab);
  };

  useSignalEffect(() => {
    setIsSelected(currentTab.value === tab.id);
  });

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && editMode) {
      setEditMode(false);
      updateTab({ ...tab, title });
    }
  };

  // get focus
  useEffect(() => {
    if (editMode) {
      renameRef.current?.focus();
    }
  }, [editMode]);

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
      className={`tab ${isSelected ? 'selected' : ''}`}
      onKeyDown={handleClick}
      onClick={handleClick}
      key={tab.id}
      tabIndex={tab.order}
      onDoubleClick={() => setEditMode(true)}
    >
      <div className='tab-text-cutoff'>
        {!editMode ? (
          <div className='tab-label'>{title}</div>
        ) : (
          <input
            ref={renameRef}
            className='tab-name-input'
            type='text'
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setEditMode(false);
              updateTab({ ...tab, title });
            }}
          />
        )}
        {/* @ts-ignore */}
        <div className='tab-bottom' style={{ backgroundColor: theme.palette.border.main, opacity: isSelected ? '0' : '100' }} />
      </div>
    </div>
  );
};

export default Tab;

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import './Tab.scss';
import { deleteTab, getCurrentTabId, saveTab } from '../../signal/todoData';
import { useContextMenu } from '../../hooks/useContextMenu/useContextMenu';
import { Point } from '../../signal/contextMenu';
import { useTheme } from '@mui/material/styles';

type TabProps = {
  title: string;
  chooseTab: (index: number) => void;
  index?: number;
  id?: number;
  className?: string;
  style?: { [key: string]: string };
  newTab?: { tabIsNewId: number; setTabIsNewId: (num: number) => void };
};

const Tab = ({ title, index, chooseTab, id, className = '', style = {}, newTab }: TabProps) => {
  const theme = useTheme();
  const [onContextMenu] = useContextMenu();
  const [editNameMode, setEditNameMode] = useState(false);
  const [tabTitle, setTabTitle] = useState(title);
  const renameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTab && newTab.tabIsNewId === id) {
      setEditNameMode(true);
      newTab.setTabIsNewId(-1);
    }
  }, []);

  const handleOnContextMenu = (e) => {
    if (id === undefined || index === undefined) return;
    e.preventDefault();
    const options = [
      {
        label: 'rename',
        callback: () => {
          setEditNameMode(true);
        },
      },
      {
        label: 'delete',
        callback: () => {
          deleteTab(index);
        },
      },
    ];
    onContextMenu(e, options, id);
  };

  const handleClick = () => {
    chooseTab(index);
  };

  const isSelected = () => getCurrentTabId() === id;

  const selectedClass = () => {
    // console.log(`⭐️⭐️⭐️ ${getCurrentTabId()}`, id);
    return getCurrentTabId() === id ? 'selected' : '';
  };

  const handleTitleChange = (e) => {
    setTabTitle(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setEditNameMode(false);
      saveTab({ name: tabTitle });
    }
  };

  // get focus
  useEffect(() => {
    if (editNameMode) {
      renameRef.current?.focus();
    }
  }, [editNameMode]);

  return (
    <div
      style={{
        backgroundColor: selectedClass() ? theme.palette.background.default : theme.palette.background.inactive,
        color: selectedClass() ? theme.palette.text.primary : theme.palette.text.secondary,
        // borderColor: theme.palette.tertiary.dark,

        // @ts-ignore
        borderLeft: selectedClass() ? `2px solid ${theme.palette.border.main}` : '2px solid transparent',
        // @ts-ignore
        borderTop: selectedClass() ? `2px solid ${theme.palette.border.main}` : '2px solid transparent',
        // @ts-ignore
        borderRight: selectedClass() ? `2px solid ${theme.palette.border.main}` : '2px solid transparent',
        // @ts-ignore
        borderBottom: selectedClass() ? '2px solid transparent' : `2px solid ${theme.palette.border.main}`,
        ...(style && style),
      }}
      role='button'
      className={`tab ${selectedClass()} ${className}`}
      onKeyDown={handleClick}
      onClick={handleClick}
      tabIndex={id}
      onContextMenu={handleOnContextMenu}
    >
      <div className='tab-text-cutoff'>
        {!editNameMode ? (
          <div className='tab-label'>{tabTitle}</div>
        ) : (
          <>
            <input
              ref={renameRef}
              type='text'
              value={tabTitle}
              onChange={handleTitleChange}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                setEditNameMode(false);
                saveTab({ name: tabTitle });
              }}
            />
          </>
        )}
        { /* @ts-ignore */ }
        <div className='tab-bottom' style={{ backgroundColor: theme.palette.border.main, opacity: isSelected() ? '0' : '100' }}/>
      </div>
    </div>
  );
};

export default Tab;

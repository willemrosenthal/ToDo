import React, {ReactNode, useEffect, useRef, useState} from 'react';
import './Tab.scss';
import {deleteTab, getCurrentTabId, saveTab} from '../../signal/todoData';
import {useContextMenu} from '../../hooks/useContextMenu/useContextMenu';
import {Point} from '../../signal/contextMenu';

type TabProps = {
  title: string;
  index: number;
  chooseTab: (index: number) => void;
  id: number;
};

const Tab = ({title, index, chooseTab, id}: TabProps) => {
  const [onContextMenu] = useContextMenu();
  const [editNameMode, setEditNameMode] = useState(false);
  const [tabTitle, setTabTitle] = useState(title);
  const renameRef = useRef<HTMLInputElement>(null);

  const handleOnContextMenu = (e) => {
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
      saveTab({name: tabTitle});
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
      role="button"
      className={`tab ${selectedClass()}`}
      onKeyDown={handleClick}
      onClick={handleClick}
      tabIndex={id}
      onContextMenu={handleOnContextMenu}
    >
      <>
        {!editNameMode ? (
          <div className='tab-label'>{tabTitle}</div>
        ) : (
          <>
            <input
              ref={renameRef}
              type="text"
              value={tabTitle}
              onChange={handleTitleChange}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                setEditNameMode(false);
                saveTab({name: tabTitle});
              }}
            />
          </>
        )}
      </>
    </div>
  );
};

export default Tab;

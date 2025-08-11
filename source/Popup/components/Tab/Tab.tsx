import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Tab.scss';
import { useTheme } from '@mui/material/styles';
import { TabType } from '../../types';
import { currentTab } from '../../signal/todoData';
import { updateTab } from '../../storage/storage';
import { signal, useSignalEffect } from '@preact/signals-react';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import IconButton from '../IconButton/IconButton';
import { newTabId } from '../TabBar/TabBar';
import { handleDeleteTab } from '../../storage/dataManagement';
import { isLoading } from '../../signal/app';

// const isEmoji = (str: string) => {
//   // Match most emoji grapheme clusters
//   const emojiRegex = /^(\p{Emoji}(?:\p{Emoji_Modifier_Base}|\p{Emoji_Component}|\u200D|\uFE0F)*)$/u;
//   // Use Intl.Segmenter to count grapheme clusters
//   const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
//   const segments = Array.from(segmenter.segment(str));
//   return segments.length === 1 && emojiRegex.test(str);
// };

const hasOneToThreeEmojisOnly = (str: string) => {
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  const graphemes = Array.from(segmenter.segment(str), (s) => s.segment);

  // Emoji detection regex
  const emojiRegex = /^(\p{Emoji}(?:\p{Emoji_Modifier_Base}|\p{Emoji_Component}|\u200D|\uFE0F)*)$/u;

  // Filter for emoji graphemes only
  const emojiParts = graphemes.filter((g) => emojiRegex.test(g));

  // Return true if 1–3 graphemes and all of them are emojis
  return emojiParts.length >= 1 && emojiParts.length <= 3 && emojiParts.length === graphemes.length;
};

type TabProps = {
  tab: TabType;
};

let isDeleting = false;

const showDeleteSeconds = 0.05;
const showDeleteTabButton = signal(false);

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
    // if the tab is selected, scroll to it (if it's not fully visible)
    if (currentTab.value === tab.id && !isLoading.value) {
      setTimeout(() => {
        const tabBar = document.getElementById('tab-bar-tabs');
        const tabElement = document.getElementById(tab.id);
        if (tabElement && tabBar) {
          const tabRect = tabElement?.getBoundingClientRect();
          const tabXCenter = tabRect.x + tabRect.width / 2;
          const xDistanceToTab = tabXCenter - window.innerWidth / 2;
          const tabDir = Math.sign(xDistanceToTab);
          const distToTabEdge = tabXCenter + tabRect.width * 0.5 * tabDir - window.innerWidth / 2;
          const offScreenDistance = Math.abs(distToTabEdge) - window.innerWidth / 2;

          if (offScreenDistance > 0) {
            const overShootBy = tabRect.width * 0.5;
            const scrollBy = (offScreenDistance + overShootBy) * tabDir;
            tabBar.scrollBy({
              left: scrollBy,
              behavior: 'smooth',
            });
          }
        }
      }, 0);
    }
  });

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const exitEditMode = () => {
    setEditMode(false);
    showDeleteTabButton.value = false;
    if (isNewTab()) newTabId.value = '';
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

  const isEmojiTab = useMemo(() => hasOneToThreeEmojisOnly(title), [title]);

  const enterEditMode = () => {
    setEditMode(true);
    setTimeout(() => {
      showDeleteTabButton.value = true;
    }, showDeleteSeconds * 1000);
  };

  return (
    <div
      id={tab.id}
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
      onDoubleClick={enterEditMode}
    >
      {!editMode ? (
        <div className={!isEmojiTab && 'tab-text-cutoff'}>
          <div className={`tab-label ${isEmojiTab ? 'emoji-tab' : ''}`}>{title}</div>
        </div>
      ) : (
        <div
          className='tab-edit-container'
          onBlur={() => {
            if (title !== tab.title && !isDeleting) {
              updateTab({ ...tab, title });
              newTabId.value = '';
            }
            if (isNewTab()) {
              exitEditMode();
            } else {
              setTimeout(() => {
                exitEditMode();
              }, 125);
            }
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
            <div className={'tab-delete-button-container' + (showDeleteTabButton.value ? ' visible' : '')}>
              <IconButton
                color={theme.palette.secondary.main} //theme.palette.background.background
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

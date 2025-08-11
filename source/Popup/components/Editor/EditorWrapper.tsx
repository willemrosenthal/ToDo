import React, { useState, useRef, useEffect, useMemo } from 'react';
import { currentTab, tabContents } from '../../signal/todoData';
import { useSignalEffect } from '@preact/signals-react';
import Editor from './Editor';
import { useTabSwitchPerformance } from '../../utils/performance';

// Cache for editor instances
const editorCache = new Map<string, React.ReactElement>();

const EditorWrapper = () => {
  const [currentTabId, setCurrentTabId] = useState<string>('');
  const [cachedEditors, setCachedEditors] = useState<Map<string, React.ReactElement>>(new Map());
  const { startSwitch, endSwitch } = useTabSwitchPerformance();

  // Track tab switching
  useSignalEffect(() => {
    if (currentTab.value && currentTab.value !== currentTabId) {
      startSwitch(currentTab.value);
      setCurrentTabId(currentTab.value);
    }
  });

  // Create cached editor for current tab if it doesn't exist
  const currentEditor = useMemo(() => {
    if (!currentTabId) return null;

    // Check if we already have a cached editor for this tab
    if (!cachedEditors.has(currentTabId)) {
      // Create a new editor instance for this tab
      const newEditor = React.createElement(Editor, { key: currentTabId });
      const newCache = new Map(cachedEditors);
      newCache.set(currentTabId, newEditor);
      setCachedEditors(newCache);
      return newEditor;
    }

    const editor = cachedEditors.get(currentTabId);
    // Measure performance when returning cached editor
    if (editor) {
      endSwitch(currentTabId);
    }
    return editor;
  }, [currentTabId, cachedEditors, endSwitch]);

  // Clean up cache when tabs are deleted
  useEffect(() => {
    const cleanupCache = () => {
      const activeTabIds = Array.from(tabContents.value.keys());
      const newCache = new Map();

      // Only keep editors for tabs that still exist
      cachedEditors.forEach((editor, tabId) => {
        if (activeTabIds.includes(tabId)) {
          newCache.set(tabId, editor);
        }
      });

      if (newCache.size !== cachedEditors.size) {
        setCachedEditors(newCache);
      }
    };

    // Clean up cache when tabContents changes
    const interval = setInterval(cleanupCache, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [cachedEditors]);

  return currentEditor;
};

export default EditorWrapper;

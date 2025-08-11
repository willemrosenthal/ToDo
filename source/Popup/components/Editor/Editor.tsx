import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import {browser, Tabs} from 'webextension-polyfill-ts';

// import '../../styles.scss';
import './Editor.scss';
import { currentTab, tabContents } from '../../signal/todoData';
import { useSignalEffect } from '@preact/signals-react';
import { useTheme } from '@mui/material/styles';
import { useContextMenu } from '../../hooks/useContextMenu/useContextMenu';
import { saveTabData } from '../../storage/storage';

// Memoized modules and formats to prevent recreation on every render
const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'script'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const QUILL_FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'code-block',
  'script',
];

// Debounce function for expensive operations
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const Editor = React.memo(() => {
  const [onContextMenu] = useContextMenu();
  const theme = useTheme();
  const quillRef = useRef<ReactQuill | null>(null);
  const [currentTabId, setCurrentTabId] = useState('');
  const [value, setValue] = useState('');
  const styleElementRef = useRef<HTMLStyleElement | null>(null);

  // Memoize the style object to prevent recreation
  const style = useMemo(
    () => ({
      borderTop: `2px solid ${(theme.palette as any).border?.main || '#ccc'}`,
      backgroundColor: theme.palette.background.default,
    }),
    [(theme.palette as any).border?.main, theme.palette.background.default],
  );

  // Create style element only once and update its content
  useEffect(() => {
    if (!styleElementRef.current) {
      styleElementRef.current = document.createElement('style');
      document.head.appendChild(styleElementRef.current);
    }

    styleElementRef.current.innerHTML = `.quill a { color: ${(theme.palette as any).link?.main || '#007bff'} !important; }`;

    return () => {
      if (styleElementRef.current) {
        document.head.removeChild(styleElementRef.current);
        styleElementRef.current = null;
      }
    };
  }, [(theme.palette as any).link?.main]);

  // Debounced save function to prevent excessive database writes
  const debouncedSaveDataToDb = useCallback(
    debounce((newContent: string) => {
      if (currentTabId && currentTab.value === currentTabId) {
        saveTabData(currentTabId, newContent);
        tabContents.value.set(currentTabId, newContent);
      }
    }, 300),
    [currentTabId],
  );

  const saveDataToDb = useCallback(
    (newContent: string) => {
      debouncedSaveDataToDb(newContent);
    },
    [debouncedSaveDataToDb],
  );

  // Optimized tab switching - only update if content actually changed
  useSignalEffect(() => {
    if (currentTab.value && currentTab.value !== currentTabId) {
      const tabData = tabContents.value.get(currentTab.value) || '';
      // Only update if the content is different to prevent unnecessary re-renders
      if (tabData !== value) {
        setValue(tabData);
      }
      setCurrentTabId(currentTab.value);
    }
  });

  // Memoize the value to prevent unnecessary re-renders
  const memoizedValue = useMemo(() => value, [value]);

  const handleContextMenu = useCallback(
    (e) => {
      if (!e.metaKey) return;
      e.preventDefault();
      const options = [
        {
          label: 'un-format',
          callback: () => {
            pressUiButton('clean');
          },
        },
        {
          label: 'code',
          callback: () => {
            pressUiButton('code-block');
          },
        },
        {
          label: 'snippet',
          callback: () => {
            pressUiButton('script');
          },
        },
        {
          label: 'quote',
          callback: () => {
            pressUiButton('blockquote');
          },
        },
        {
          label: 'strike',
          callback: () => {
            pressUiButton('strike');
          },
        },
      ];
      onContextMenu(e, options, 0, true);
    },
    [onContextMenu],
  );

  const findInlineCodeLength = useCallback((contents: any, offset: number) => {
    let c = 0;
    for (let i = 0; i < contents.ops.length; i++) {
      const op = contents.ops[i];
      const delta = op.insert.length;
      if (op.attributes?.script === 'sub' && c + delta >= offset) {
        return delta;
      }
      if (op.insert) {
        c += delta;
      }
    }
    return 0;
  }, []);

  // Optimized keydown handler with memoization
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const quill = quillRef.current?.getEditor();
      if (!quill) return;

      if (event.key === 'Backspace') {
        const range = quill.getSelection();
        if (range) {
          const [line, offset] = quill.getLine(range.index);
          const contentsBack = quill.getContents(range.index - 1);
          if (contentsBack.ops?.length && contentsBack.ops.length > 1) {
            if (contentsBack.ops[0].attributes?.script === 'sub') {
              event.preventDefault();
              const lineContents = quill.getContents(range.index - offset);
              const inlineCodeLength = findInlineCodeLength(lineContents, offset);
              quill.setSelection(range.index - inlineCodeLength, inlineCodeLength);
              makeInlineCode();
              quill.setSelection(range.index, 0);
            }
          }
        }
      }
    },
    [findInlineCodeLength],
  );

  // Memoized keyboard shortcuts handler
  const handleKeyboardShortcuts = useCallback((event: KeyboardEvent) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const isCtrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

    if (isCtrlOrCmd && event.key === ']') {
      event.preventDefault();
      quill.format('indent', '+1');
    } else if (isCtrlOrCmd && event.key === '[') {
      event.preventDefault();
      quill.format('indent', '-1');
    } else if (isCtrlOrCmd && event.key === 'd') {
      event.preventDefault();
      const range = quill.getSelection();
      if (range) {
        const qFormats = quill.getFormat(range);
        const isStrikethrough = qFormats.strike === true;
        quill.format('strike', !isStrikethrough);
      }
    } else if (isCtrlOrCmd && event.key === 'l') {
      event.preventDefault();
      const range = quill.getSelection();
      if (range) {
        const text = quill.getText(range.index, range.length).trim();
        const qFormats = quill.getFormat(range);
        if (qFormats.link) {
          quill.format('link', false);
        } else {
          let url;
          try {
            url = new URL(text).toString();
          } catch {
            url = `http://${text}`;
          }
          quill.format('link', url);
        }
      }
    } else if (isCtrlOrCmd && event.key === '/') {
      event.preventDefault();
      const range = quill.getSelection();
      if (range) {
        quill.removeFormat(range.index, range.length);
      }
    }
  }, []);

  // Debounced text change handler to reduce expensive operations
  const debouncedTextChangeHandler = useCallback(
    debounce((delta: any, oldDelta: any, source: any) => {
      const quill = quillRef.current?.getEditor();
      if (!quill) return;

      const range = quill.getSelection();
      if (!range) return;

      const [line, offset] = quill.getLine(range.index);
      const lineText = line.domNode.innerText;

      // Handle header formatting
      const headerMatch = lineText.match(/^(#{1,3})\s/);
      if (headerMatch) {
        const headerLevel = headerMatch[1].length;
        const newText = lineText.replace(/^(#{1,3})\s/, '');

        const lineIndex = quill.getIndex(line);
        quill.deleteText(lineIndex, lineText.length);
        quill.insertText(lineIndex, newText);
        quill.formatLine(lineIndex, newText.length, 'header', headerLevel);
        quill.setSelection(lineIndex + newText.length, 0);
      }

      // Handle code block formatting
      const codeBlockMatch = lineText.match(/```([^`]+)```/);
      const inlineCodeMatch = lineText.match(/`([^`]+)`/);

      if (codeBlockMatch) {
        makeCodeBlock(quill, range);
      } else if (inlineCodeMatch) {
        const cursorAtEndOfInlineCode = (line: string, chunk: string, offset: number) => {
          const chunkLength = chunk.length;
          const previousChunk = line.slice(offset - chunkLength, offset);
          return previousChunk === chunk;
        };
        const atEndOfChunk = cursorAtEndOfInlineCode(lineText, inlineCodeMatch[0], offset);
        const inlineCodeText = inlineCodeMatch[1];
        const chunkEndIndex = atEndOfChunk ? range.index : range.index + inlineCodeMatch[1].length + 1;
        quill.deleteText(chunkEndIndex - inlineCodeMatch[0].length, inlineCodeMatch[0].length);
        quill.insertText(chunkEndIndex - inlineCodeMatch[0].length, inlineCodeText + '\u200C');
        quill.setSelection(chunkEndIndex - inlineCodeMatch[0].length, inlineCodeText.length);
        makeInlineCode();
        quill.setSelection(range.index - 1, 0);
      }
    }, 100),
    [],
  );

  // Set up event listeners only once
  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcuts);

    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, [handleKeyboardShortcuts]);

  // Set up text change listener only once
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      quill.on('text-change', debouncedTextChangeHandler);
    }

    return () => {
      if (quill) {
        quill.off('text-change', debouncedTextChangeHandler);
      }
    };
  }, [debouncedTextChangeHandler]);

  const makeCodeBlock = useCallback((_quill = undefined, _range = undefined) => {
    let codeblockButton = document.querySelector('.ql-code-block') as HTMLButtonElement;
    codeblockButton?.click();
  }, []);

  const pressUiButton = useCallback((key: string) => {
    const button = document.querySelector(`.ql-${key}`) as HTMLButtonElement;
    button?.click();
  }, []);

  const makeInlineCode = useCallback(() => {
    let inlineCodeButton = document.querySelector('.ql-script') as HTMLButtonElement;
    inlineCodeButton?.click();
  }, []);

  // Set up context menu only once
  useEffect(() => {
    const setupContextMenu = () => {
      const editorElement = document.querySelector('.ql-editor');
      if (editorElement) {
        editorElement.addEventListener('contextmenu', handleContextMenu);
        editorElement.addEventListener('mousedown', handleContextMenu);
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const timeoutId = setTimeout(setupContextMenu, 0);

    return () => {
      clearTimeout(timeoutId);
      const editorElement = document.querySelector('.ql-editor');
      if (editorElement) {
        editorElement.removeEventListener('contextmenu', handleContextMenu);
        editorElement.removeEventListener('mousedown', handleContextMenu);
      }
    };
  }, [handleContextMenu]);

  return (
    <ReactQuill
      style={style}
      ref={quillRef}
      value={memoizedValue}
      onChange={saveDataToDb}
      onKeyDown={handleKeyDown}
      modules={QUILL_MODULES}
      formats={QUILL_FORMATS}
    />
  );
});

Editor.displayName = 'Editor';

export default Editor;

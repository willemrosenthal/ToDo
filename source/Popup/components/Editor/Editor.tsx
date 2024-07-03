import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import {browser, Tabs} from 'webextension-polyfill-ts';

// import '../../styles.scss';
import './Editor.scss';
import { currentTab, saveTab } from '../../signal/todoData';
import { useSignalEffect } from '@preact/signals-react';
import { useTheme } from '@emotion/react';

const Editor = () => {
  const theme = useTheme();
  const quillRef = useRef<ReactQuill | null>(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    const quillStyleElement = document.createElement('style');
    quillStyleElement.innerHTML = `.quill a { color: ${theme.palette.link.main} !important; }`;
    document.head.appendChild(quillStyleElement);

    return () => {
      document.head.removeChild(quillStyleElement);
    };
  }, [theme]);

  // alert(JSON.stringify(tabData));
  const setVal = (newContent: string) => {
    // setValue(newContent);
    saveTab({ content: newContent });
  };

  useSignalEffect(() => {
    if (currentTab.value.content) {
      setValue(currentTab.value.content);
    }
  });

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  // what does this do?!?
  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image'];

  // handle editor functions
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
        if (range && !range.isCollapsed) {
          const text = quill.getText(range.index, range.length).trim();
          console.log('TEXT:', text);
          const qFormats = quill.getFormat(range);
          if (qFormats.link) {
            // If the selected text is already a link, remove the link
            quill.format('link', false);
          } else {
            // Check if the selected text is a valid URL
            let url;
            try {
              url = new URL(text).toString();
            } catch {
              // If not a valid URL, you might want to handle this case differently
              // For now, we'll just prepend "http://"
              url = `http://${text}`;
            }

            // Make the selected text a link using the selected text as the URL
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
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // // get line changes
  // useEffect(() => {
  //   const handleTextChange = () => {
  //     const quill = quillRef.current?.getEditor();
  //     if (!quill) return;

  //     const range = quill.getSelection();
  //     if (range) {
  //       const [line, offset] = quill.getLine(range.index);
  //       const lineText = line.domNode.innerText;
  //       console.log('Current line text:', lineText);
  //     }
  //   };

  //   const quill = quillRef.current?.getEditor();
  //   quill?.on('text-change', handleTextChange);

  //   return () => {
  //     quill?.off('text-change', handleTextChange);
  //   };
  // }, []);
  useEffect(() => {
    const handleTextChange = (delta: any, oldDelta: any, source: any) => {
      const quill = quillRef.current?.getEditor();
      if (!quill) return;

      const range = quill.getSelection();
      if (!range) return;

      const [line, offset] = quill.getLine(range.index);
      const lineText = line.domNode.innerText;

      const headerMatch = lineText.match(/^(#{1,3})\s/);
      if (headerMatch) {
        const headerLevel = headerMatch[1].length;
        const newText = lineText.replace(/^(#{1,3})\s/, '');

        // Replace the line text without the #
        const lineIndex = quill.getIndex(line);
        quill.deleteText(lineIndex, lineText.length);
        quill.insertText(lineIndex, newText);

        // Apply the header format
        quill.formatLine(lineIndex, newText.length, 'header', headerLevel);

        // Move cursor to the end of the line
        quill.setSelection(lineIndex + newText.length, 0);
      }
    };

    const quill = quillRef.current?.getEditor();
    quill?.on('text-change', handleTextChange);

    return () => {
      quill?.off('text-change', handleTextChange);
    };
  }, []);

  /*
  https://medium.com/@makenakong/how-to-customize-the-quill-toolbar-with-react-and-custom-blots-512a7b465339
  */

  const style = {
    // borderColor: theme.palette.border.main,
    borderTop: `2px solid ${theme.palette.border.main}`,
    backgroundColor: theme.palette.background.default,
  };

  return (
    <>
      <ReactQuill style={style} ref={quillRef} value={value} onChange={setVal} modules={modules} formats={formats} />
    </>
  );
};

export default Editor;

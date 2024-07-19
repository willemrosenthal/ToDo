import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import {browser, Tabs} from 'webextension-polyfill-ts';

// import '../../styles.scss';
import './Editor.scss';
import { currentTab, saveTab } from '../../signal/todoData';
import { useSignalEffect } from '@preact/signals-react';
import { useTheme } from '@emotion/react';
import { useContextMenu } from '../../hooks/useContextMenu/useContextMenu';

const Editor = () => {
  const [onContextMenu] = useContextMenu();
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

  const handleContextMenu = (e) => {
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
  };

  const modules = {
    // syntax: true,
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'script'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  // what does this do?!?
  const formats = [
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

      // Handle header formatting
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

      // Handle code block formatting
      const codeBlockMatch = lineText.match(/```([^`]+)```/s);
      const inlineCodeMatch = lineText.match(/`([^`]+)`/);

      if (codeBlockMatch) {
        // const codeBlockText = codeBlockMatch[1];
        // const codeBlockIndex = lineText.indexOf(codeBlockMatch[0]);
        // quill.deleteText(range.index - lineText.length + codeBlockIndex, codeBlockMatch[0].length);
        // quill.insertEmbed(range.index - lineText.length + codeBlockIndex, 'code-block', codeBlockText);
        // quill.setSelection(range.index - lineText.length + codeBlockIndex + codeBlockText.length, 0);
        makeCodeBlock(quill, range);
      }
      // Handle inline code formatting
      else if (inlineCodeMatch) {
        const inlineCodeText = inlineCodeMatch[1];
        quill.deleteText(range.index - inlineCodeMatch[0].length, inlineCodeMatch[0].length);
        quill.insertText(range.index - inlineCodeMatch[0].length, inlineCodeText); //, 'code', true);
        quill.setSelection(range.index - inlineCodeMatch[0].length, inlineCodeText.length);
        makeInlineCode();
        quill.setSelection(range.index - 2, 0);
      }

      // const horizontalLineMatch = lineText.match(/^---\s*$/);
      // if (horizontalLineMatch) {
      //   const lineIndex = quill.getIndex(line);
      //   quill.deleteText(lineIndex, lineText.length);
      //   quill.insertEmbed(lineIndex, 'hr', true);

      //   // Move cursor to the next line
      //   quill.setSelection(lineIndex + 1, 0);
      // }
    };

    const quill = quillRef.current?.getEditor();
    quill?.on('text-change', handleTextChange);

    return () => {
      quill?.off('text-change', handleTextChange);
    };
  }, []);

  const makeCodeBlock = (_quill = undefined, _range = undefined) => {
    // const quill = _quill || quillRef.current?.getEditor();
    // if (!quill) return;
    // const range = _range || quill.getSelection();
    // if (!range) return;

    // const qFormats = quill.getFormat(range);
    // const isCodeBlock = qFormats['code-block'] === true;
    // // if (isCodeBlock) {
    // //   quill.removeFormat(range.index, range.length);
    // // } else
    // quill.format('code-block', !isCodeBlock);

    // Select the button using querySelector
    let codeblockButton = document.querySelector('.ql-code-block') as HTMLButtonElement; // You can also use a more specific selector
    codeblockButton.click();
  };

  const pressUiButton = useCallback((key) => {
    const button = document.querySelector(`.ql-${key}`) as HTMLButtonElement;
    button.click();
  }, []);

  const makeInlineCode = () => {
    // Select the button using querySelector
    let inlineCodeButton = document.querySelector('.ql-script') as HTMLButtonElement; // You can also use a more specific selector
    inlineCodeButton.click();
  };

  const removeStyleOnLine = () => {
    // Select the button using querySelector
    let cleanLineButton = document.querySelector('.ql-clean') as HTMLButtonElement; // You can also use a more specific selector
    cleanLineButton.click();
  };

  const strikeThrough = () => {
    // Select the button using querySelector
    let strikeThroughButton = document.querySelector('.ql-strike') as HTMLButtonElement; // You can also use a more specific selector
    strikeThroughButton.click();
  };

  /*
  https://medium.com/@makenakong/how-to-customize-the-quill-toolbar-with-react-and-custom-blots-512a7b465339
  */

  // add context menu
  useEffect(() => {
    requestAnimationFrame(() => {
      const editorElement = document.querySelector('.ql-editor');
      if (editorElement) {
        editorElement.addEventListener('contextmenu', handleContextMenu);
        editorElement.addEventListener('mousedown', handleContextMenu);
      }

      return () => {
        if (editorElement) {
          editorElement.removeEventListener('contextmenu', handleContextMenu);
          editorElement.addEventListener('mousedown', handleContextMenu);
        }
      };
    });
  }, []);

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

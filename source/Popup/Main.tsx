import React, { useEffect, useState } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import {browser, Tabs} from 'webextension-polyfill-ts';

import Editor from './components/Editor/Editor';
import TabBar from './components/TabBar/TabBar';
import ContextMenu from './components/ContextMenu/ContextMenu';
import { showContextMenu } from './signal/contextMenu';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';

// function openWebPage(url: string): Promise<Tabs.Tab> {
//   return browser.tabs.create({url});
// }

import './styles.scss';
import PopoutButton from './components/PopoutButton/PopoutButton';
import { popoutSettings } from './settings/settings';
import { isStandalone } from './signal/popout';
import { getFromLocal } from './signal/todoData';
import Settings from './components/Settings/Settings';

const closeWhenFocusIsLost = false;

const Main: React.FC = () => {
  const theme = useTheme();
  // const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    chrome.windows.getCurrent((window) => {
      if (window.type === 'popup' && window.width === popoutSettings.width && window.height === popoutSettings.height) {
        isStandalone.value = true;
        console.log('pop-out');
        // const mainDiv = document.querySelector('.main-container') as HTMLElement;
        // mainDiv.style.width = `100% !important`;
        // mainDiv.style.height = `100% !important`;
      } else {
        isStandalone.value = false;
        console.log('in-extension');
      }
    });
  }, []);

  useEffect(() => {
    const quillStyleElement = document.createElement('style');
    quillStyleElement.innerHTML = `
      body {
        background-color: ${theme.palette.background.background} !important;
      }
    `;
    document.head.appendChild(quillStyleElement);

    return () => {
      document.head.removeChild(quillStyleElement);
    };
  }, [theme]);

  const StyledMainContainer = styled.div`
    ::-webkit-scrollbar {
      width: 7px;
      height: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background: ${theme.palette.scrollbar.thumb};
    }

    ::-webkit-scrollbar-track {
      background: ${theme.palette.scrollbar.track};
    }

    .main-container {
      background-color: ${theme.palette.background.background};
      width: ${isStandalone.value ? '100% !important' : '404px'};
      height: ${isStandalone.value ? '100% !important' : '400px'};
    }

    sub {
      background-color: ${theme.palette.codesnippet.background};
      color: ${theme.palette.codesnippet.text};
    }
  `;

  //      width: 404px;
  //    height: 400px;

  // close popup if it looses focus
  useEffect(() => {
    const handleBlur = () => {
      window.close();
    };

    window.addEventListener('focus', getFromLocal);
    if (closeWhenFocusIsLost) window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('focus', getFromLocal);
      if (closeWhenFocusIsLost) window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <div className={isStandalone.value ? 'standaloneContainer' : ''}>
      <Settings />
      <StyledMainContainer className={'main-container ' + (isStandalone.value ? 'standalone' : '')}>
        {/* <div className='main-container' style={style}> */}
        {/* {showContextMenu.value && <ContextMenu />} */}
        <ContextMenu />
        <TabBar />
        <Editor />
        {/* </div> */}
      </StyledMainContainer>
    </div>
  );
};

export default Main;

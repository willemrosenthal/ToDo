import React, { useEffect } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import {browser, Tabs} from 'webextension-polyfill-ts';

import Editor from './components/Editor/Editor';
import TabBar from './components/TabBar/TabBar';
import ContextMenu from './components/ContextMenu/ContextMenu';
import { showContextMenu } from './signal/contextMenu';
import { useTheme } from '@emotion/react';
import styled from 'styled-components';

// function openWebPage(url: string): Promise<Tabs.Tab> {
//   return browser.tabs.create({url});
// }

import './styles.scss';

const closeWhenFocusIsLost = false;

const Main: React.FC = () => {
  const theme = useTheme();

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
    }
  `;

  // close popup if it looses focus
  useEffect(() => {
    if (closeWhenFocusIsLost) {
      const handleBlur = () => {
        window.close();
      };
      window.addEventListener('blur', handleBlur);
      return () => {
        window.removeEventListener('blur', handleBlur);
      };
    }
  }, []);

  return (
    <StyledMainContainer className='main-container'>
      {/* <div className='main-container' style={style}> */}
      {/* {showContextMenu.value && <ContextMenu />} */}
      <ContextMenu />
      <TabBar />
      <Editor />
      {/* </div> */}
    </StyledMainContainer>
  );
};

export default Main;

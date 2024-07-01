import React from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import {browser, Tabs} from 'webextension-polyfill-ts';

import Editor from './components/Editor/Editor';
import TabBar from './components/TabBar/TabBar';
// import {Tab, useStorage} from './hooks/useStorage';
// import {dataLoaded} from './hooks/useAsyncLocalStorage/useAsyncLocalStorage';
// import {useSignalEffect} from '@preact/signals-react';
// import './styles.scss';

// function openWebPage(url: string): Promise<Tabs.Tab> {
//   return browser.tabs.create({url});
// }

const Main: React.FC = () => {
  // const [value, setValue] = useState('');
  // const tabs = useStorage();
  // const [tab, setTab] = useState({} as Tab);

  return (
    <div className="main-container">
      <TabBar />
      <Editor />
    </div>
  );

  // return (
  //   <section id="popup">
  //     <h2>WEB-EXTENSION-STARTER</h2>
  //     <button
  //       id="options__button"
  //       type="button"
  //       onClick={(): Promise<Tabs.Tab> => {
  //         return openWebPage('options.html');
  //       }}
  //     >
  //       Options Page
  //     </button>
  //     <div className="links__holder">
  //       <ul>
  //         <li>
  //           <button
  //             type="button"
  //             onClick={(): Promise<Tabs.Tab> => {
  //               return openWebPage(
  //                 'https://github.com/abhijithvijayan/web-extension-starter'
  //               );
  //             }}
  //           >
  //             GitHub
  //           </button>
  //         </li>
  //         <li>
  //           <button
  //             type="button"
  //             onClick={(): Promise<Tabs.Tab> => {
  //               return openWebPage(
  //                 'https://www.buymeacoffee.com/abhijithvijayan'
  //               );
  //             }}
  //           >
  //             Buy Me A Coffee
  //           </button>
  //         </li>
  //       </ul>
  //     </div>
  //   </section>
  // );
};

export default Main;

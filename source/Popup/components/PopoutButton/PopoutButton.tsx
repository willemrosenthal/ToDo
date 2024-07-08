import React from 'react';
import { popoutSettings } from '../../settings/settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import './PopoutButton.scss';


const PopoutButton: React.FC = () => {
  const openStandaloneWindow = () => {
    chrome.windows.create({
      url: chrome.runtime.getURL('popup.html'),
      type: 'popup',
      width: popoutSettings.width,
      height: popoutSettings.height,
    });
    window.close();
  };

  return (
    <div className='popout-button'>
      <button onClick={openStandaloneWindow}><FontAwesomeIcon icon={faUpRightFromSquare} /></button>
    </div>
  );
};

export default PopoutButton;


import React from 'react';
import { popoutSettings } from '../../settings/settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import './PopoutButton.scss';
import { useTheme } from '@mui/material/styles';
import IconButton from '../IconButton/IconButton'

const PopoutButton: React.FC = () => {
  const theme = useTheme();

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
    <IconButton icon={faUpRightFromSquare} callback={openStandaloneWindow} />
  )
  return (
    <div className='popout-button'>
      <button onClick={openStandaloneWindow}>
        <FontAwesomeIcon icon={faUpRightFromSquare} style={{ color: theme.palette.background.inactive }} />
      </button>
    </div>
  );
};

export default PopoutButton;

import React from 'react';
import { popoutSettings } from '../../settings/settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import './IconButton.scss';
import { useTheme } from '@mui/material/styles';

type IconButtonProps = {
  icon: IconDefinition;
  callback: Function;
  color?: string;
  style?: React.CSSProperties;
};

const IconButton = ({ icon, callback, color, style }: IconButtonProps) => {
  const theme = useTheme();

  return (
    <div className='icon-button' style={style}>
      <button onClick={() => callback()}>
        <FontAwesomeIcon icon={icon} style={{ color: color || theme.palette.background.inactive }} />
      </button>
    </div>
  );
};

export default IconButton;

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './Spinner.css';

const Spinner = ({ fullScreen = true }: { fullScreen?: boolean }) => {
  return (
    <div className={fullScreen ? 'spinner-container-full-screen' : ''}>
      <div className='spinner'>
        <FontAwesomeIcon icon={faSpinner} />
      </div>
    </div>
  );
};

export default Spinner;

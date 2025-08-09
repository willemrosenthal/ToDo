import React from 'react';
import Spinner from './Spinner';
import './spinner.css';

const SpinnerOverlay = () => {
  return (
    <div className='spinner-overlay'>
      <Spinner />
    </div>
  );
};

export default SpinnerOverlay;

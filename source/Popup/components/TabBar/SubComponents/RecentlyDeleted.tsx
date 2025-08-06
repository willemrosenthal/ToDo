import React from 'react';
import { faTrashArrowUp } from '@fortawesome/free-solid-svg-icons';
import IconButton from '../../IconButton/IconButton';
import { mode } from '../../../signal/app';

const RecentlyDeleted = () => {
  const showRecentlyDeleted = () => {
    mode.value = 'recently-deleted';
  };

  return (
    <IconButton
      icon={faTrashArrowUp}
      callback={() => {
        showRecentlyDeleted();
      }}
      style={{
        margin: '5px 5px',
      }}
    />
  );
};

export default RecentlyDeleted;

import React, {ReactNode} from 'react';
import './Tab.scss';
import { getCurrentTabId } from '../../signal/todoData';

type TabProps = {
  title: string;
  index: number;
  chooseTab: (index: number) => void;
  id: number;
};

const Tab = ({title, index, chooseTab, id}: TabProps) => {
  const handleClick = () => {
    chooseTab(index);
  };

  const selectedClass = () => {
    console.log(`⭐️⭐️⭐️ ${getCurrentTabId()}`, id);
    return getCurrentTabId() === id ? 'selected' : '';
  };

  return (
    <div
      role="button"
      className={`tab ${selectedClass()}`}
      onKeyDown={handleClick}
      onClick={handleClick}
      tabIndex={id}
    >
      {title}
    </div>
  );
};

export default Tab;

import React from 'react';
import '../TabBar.scss';
import { useTheme } from '@mui/material/styles';
import { newTabId } from '../TabBar';
import { createTab } from '../../../storage/dataManagement';

const TabBarButton = ({ tabBarRef }: { tabBarRef: React.MutableRefObject<HTMLDivElement> }) => {
  //React.MutableRefObject<HTMLDivElement>
  const theme = useTheme();

  const createNewTab = async () => {
    const newTabItem = await createTab();
    newTabId.value = newTabItem.id;
    setTimeout(() => {
      scrollToRight();
    }, 40);
  };

  const newTabButtonStyle = {
    backgroundColor: 'trasparent',
    // borderBottom: theme.palette.border.main,
    // @ts-ignore
    borderTop: `2px dashed ${theme.palette.border.main}`,
    // @ts-ignore
    borderLeft: `2px dashed ${theme.palette.border.main}`,
    // @ts-ignore
    borderRight: `2px dashed ${theme.palette.border.main}`,
    // @ts-ignore
    color: theme.palette.border.main,
  };

  const scrollToRight = () => {
    if (tabBarRef.current) {
      tabBarRef.current.scrollTo({
        left: tabBarRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <button className='new-tab-button-container' onClick={createNewTab} key={'new-tab-button'} style={newTabButtonStyle}>
      <b>+</b>
      {/* <FontAwesomeIcon icon={faPlus} /> */}
    </button>
  );
};

export default TabBarButton;

// export function tabRightClick(e) {
//   e.preventDefault();

import {
  ContextOptions,
  Point,
  contextMenuData,
  showContextMenu,
} from '../../signal/contextMenu';

//   if (document.getElementById("contextMenu").style.display == "block") hideRightClickMenu();
//   else{
//       var menu = document.getElementById("contextMenu")
//       inMenu = true;
//       const menuWidth = 100;
//       const contentBounds = content.getBoundingClientRect();
//       const leftPos = e.pageX > contentBounds.width - menuWidth ? contentBounds.width - menuWidth : e.pageX;
//       const topPos = e.pageY < 10 ? 10 : e.pageY;
//       menu.style.display = 'block';
//       menu.style.left = leftPos + "px";
//       menu.style.top = topPos + "px";
//       setTimeout(()=> {
//         menuBounds = menu.getBoundingClientRect();
//       }, 1)
//   }
// }

export const useContextMenu = () => {
  // function

  function onContextMenu(
    e: any,
    options: ContextOptions[],
    id: number,
    className = ''
  ) {
    // if (!showMenu.value) {
    const pos: Point = {x: e.clientX, y: e.clientY};
    showContextMenu.value = true;
    contextMenuData.value = {
      id,
      options,
      pos,
      className,
    };
    // }
  }

  return [onContextMenu];
};

//onContextMenu

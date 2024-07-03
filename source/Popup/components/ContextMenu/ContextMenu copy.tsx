import React, { useEffect, useRef, useState } from 'react';
import './ContextMenu.scss';
import { Point, contextMenuData, showContextMenu } from '../../signal/contextMenu';
import { Button } from '../../../../node_modules/@mui/material/index';

const ContextMenu = () => {
  const { title, id, options, pos, className } = contextMenuData.value;

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const divRef = useRef(null);

  // effect(()=> {
  //   const menuWidth = 100;
  //   const contentBounds = document.documentElement.getBoundingClientRect();
  //   const leftPos = pos.x > contentBounds.width - menuWidth ? contentBounds.width - menuWidth : pos.x;
  //   const topPos = pox.y < 10 ? 10 : pos.y;
  //   setMenuPos({x: leftPos, y: topPos});
  // }, [pos]);

  useEffect(() => {
    const threshold = 10;

    const checkDistance = (cPos: Point | undefined = undefined) => {
      if (divRef.current) {
        const cursorPos: Point = cPos || cursorPosition;
        const rect = divRef.current.getBoundingClientRect();

        let inBox = true;
        if (cursorPos.y > rect.bottom + threshold) inBox = false;
        else if (cursorPos.y < rect.top - threshold) inBox = false;
        else if (cursorPos.x < rect.left - threshold) inBox = false;
        else if (cursorPos.x > rect.right + threshold) inBox = false;

        if (!inBox) {
          showContextMenu.value = false;
        }
      }
    };

    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      checkDistance({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    // window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorPosition]);

  return (
    <div className={`context-menu ${className}`} style={{ top: `${pos.y}px`, left: `${pos.x}px` }} ref={divRef}>
      <>{title}</>
      {options.map((o, i) => {
        const key = `${o.label}_${i}`;
        return (
          <Button
            type='button'
            key={key}
            onClick={() => {
              o.callback(id);
              showContextMenu.value = false;
            }}
          >
            {o.label}
          </Button>
        );
      })}
    </div>
  );
};

export default ContextMenu;

{
  /* <ul>
<li onClick={() => handleMenuItemClick('Action 1')}>Action 1</li>
<li onClick={() => handleMenuItemClick('Action 2')}>Action 2</li>
<li onClick={() => handleMenuItemClick('Action 3')}>Action 3</li>
</ul> */
}

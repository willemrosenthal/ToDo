import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ContextMenu.scss';
import { Point, contextAnchorEl, contextMenuData, showContextMenu } from '../../signal/contextMenu';
import { Button, Fade, Menu, MenuItem, MenuList } from '../../../../node_modules/@mui/material/index';
import styled from 'styled-components';
import { effect, useSignalEffect } from '../../../../node_modules/@preact/signals-react/dist/signals';

const debugDontCloseMenu = true;

const ContextMenu = () => {
  const { options, pos, className, useMousePos } = contextMenuData.value;

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const divRef = useRef(null);

  const positionOnMouse = useCallback(
    (x: number, y: number) => {
      // if (!useMousePos) return;
      requestAnimationFrame(() => {
        const tabMenu = document.querySelector('#tab-menu');
        if (tabMenu) {
          const firstMuiPaperElement = tabMenu.querySelector('.MuiPaper-root') as HTMLElement;
          if (firstMuiPaperElement) {
            console.log('Found element:', firstMuiPaperElement);
            if (useMousePos) {
              const xDiff = x - parseInt(firstMuiPaperElement.style.left, 10);
              const yDiff = y - parseInt(firstMuiPaperElement.style.top, 10);
              firstMuiPaperElement.style.transform = `translate(${xDiff}px, ${yDiff}px)`;
            } else firstMuiPaperElement.style.transform = `translate(${0}px, ${0}px)`;
            // shoudl contrain to window proportions
          } else {
            console.log('No element with class "MuiPaper-root" found inside #tab-menu');
          }
        } else {
          console.log('No element with id "tab-menu" found');
        }
      });
    },
    [pos, useMousePos],
  );

  effect(() => {
    if (showContextMenu.value) positionOnMouse(pos.x, pos.y);
  });

  // useSignalEffect(() => {
  //   if (showContextMenu.value) positionOnMouse(pos.x, pos.y);
  // });

  useEffect(() => {
    const threshold = 10;

    const checkDistance = (cPos: Point | undefined = undefined) => {
      if (divRef.current) {
        const cursorPos: Point = cPos || cursorPosition;
        const rect = divRef.current.querySelctor('ul').getBoundingClientRect();
        alert(divRef.current.querySelctor('ul'));
        alert(rect);

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

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [cursorPosition]);

  const closeMenu = () => {
    if (!debugDontCloseMenu) showContextMenu.value = false;
  };

  // const menuStyle = {
  //   ul: {
  //     top: `${pos.y}px`,
  //     left: `${pos.x}px`,
  //     position: 'absolute',
  //   },
  // };

  // const StyledMenu = styled.div`
  //   .muipaper-root: {
  //     top: ${pos.y}px;
  //     left: ${pos.x}px;
  //     position: 'absolute';
  //     border: 3px solid blue;
  //   }
  // `;

  return (
    // <StyledMenu className='test'>
    <Menu
      ref={divRef}
      id='tab-menu'
      anchorEl={contextAnchorEl.value}
      open={showContextMenu.value}
      // onClose={closeMenu}
      TransitionComponent={Fade}
      className={className}
      onMouseLeave={closeMenu}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
        // horizontal: 'center',
      }}
    >
      <MenuList onMouseLeave={closeMenu}>
        {' '}
        {/* Use MenuList and handle onMouseLeave */}
        {options.map((o, i) => {
          const key = `${o.label}_${i}`;
          return (
            <MenuItem
              key={key}
              onClick={() => {
                o.callback(i); // was id
                showContextMenu.value = false;
              }}
            >
              {o.label}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
    // </StyledMenu>
    // <div className={`context-menu ${className}`} style={{ top: `${pos.y}px`, left: `${pos.x}px` }} ref={divRef}>
    //   <>{title}</>
    // {options.map((o, i) => {
    //   const key = `${o.label}_${i}`;
    //   return (
    //     <Button
    //       type='button'
    //       key={key}
    //       onClick={() => {
    //         o.callback(id);
    //         showContextMenu.value = false;
    //       }}
    //     >
    //       {o.label}
    //     </Button>
    //   );
    // })}
    // </div>
  );
};

export default ContextMenu;

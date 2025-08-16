import React, { useEffect, useRef } from 'react';
import type { PropsWithChildren } from 'react';
import { DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import type { DropAnimation } from '@dnd-kit/core';
import { animationDuration } from './SortableItem';
import { dragPastEdge } from '../../../signal/app';

const dropAnimationConfig: DropAnimation = {
  duration: animationDuration,
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '1',
        // zIndex: '-10000',
      },
    },
  }),
};

interface Props {
  children: React.ReactNode;
}

export function SortableOverlay({ children }: PropsWithChildren<Props>) {
  const overlayRef = useRef<HTMLDivElement>(null);

  if (overlayRef.current) {
    // doesn't need to get this every frame
    const parent = document.getElementById('sortable-list');
    const parentBounds = parent?.getBoundingClientRect();
    const overlayBounds = overlayRef.current.getBoundingClientRect();

    const x = overlayBounds.x;
    const tabWidth = overlayBounds.width;
    const parentWidth = parentBounds!.width;

    const xInParent = x - parentBounds!.x;
    const fromLeft = parentWidth - xInParent;

    if (xInParent <= 0) {
      dragPastEdge.value = true;
    } else if (fromLeft <= tabWidth + 1) {
      dragPastEdge.value = true;
    } else {
      dragPastEdge.value = false;
    }
  }

  return (
    <DragOverlay zIndex={1000} dropAnimation={dropAnimationConfig}>
      <div ref={overlayRef}></div>
      {children}
    </DragOverlay>
  );
}

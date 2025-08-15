import React from 'react';
import type { PropsWithChildren } from 'react';
import { DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import type { DropAnimation } from '@dnd-kit/core';
import { animationDuration } from './SortableItem';

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

interface Props {}

export function SortableOverlay({ children }: PropsWithChildren<Props>) {
  return (
    <DragOverlay zIndex={1000} dropAnimation={dropAnimationConfig}>
      {children}
    </DragOverlay>
  );
}

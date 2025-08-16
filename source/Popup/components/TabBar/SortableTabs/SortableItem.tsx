import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PropsWithChildren } from 'react';
import type { DraggableSyntheticListeners, UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import './sortableList.scss';
import { dragPastEdge } from '../../../signal/app';

interface Props {
  id: UniqueIdentifier;
}

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export const animationDuration = 250;

export function SortableItem({ children, id }: PropsWithChildren<Props>) {
  const { attributes, isDragging, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef],
  );

  const [wasDragging, setWasDragging] = useState(false);

  useEffect(() => {
    if (isDragging && !wasDragging) {
      setWasDragging(true);
    } else if (!isDragging && wasDragging) {
      setTimeout(() => {
        setWasDragging(false);
      }, animationDuration);
    }
  }, [isDragging, wasDragging]);

  const style: CSSProperties = {
    // opacity: isDragging ? 0.4 : undefined,
    // opacity: isDragging || wasDragging ? 0.4 : undefined,
    // zIndex: isDragging ? '1000' : 'unset',
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const el = useRef<HTMLDivElement>(null);

  const releaseWithinDragArea = wasDragging && !dragPastEdge.value;

  return (
    <SortableItemContext.Provider value={context}>
      <li className='SortableItem' ref={setNodeRef} style={style}>
        <div ref={el} className={isDragging || releaseWithinDragArea ? 'sorting-tab-dragging' : ''}>
          {children}
        </div>
      </li>
    </SortableItemContext.Provider>
  );
}

export function DragHandle({ children }: { children: React.ReactNode }) {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <button className='DragHandle' {...attributes} {...listeners} ref={ref}>
      {children}
    </button>
  );
}

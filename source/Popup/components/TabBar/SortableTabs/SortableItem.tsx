import React, { createContext, useContext, useMemo, useRef } from 'react';
import type { CSSProperties, PropsWithChildren } from 'react';
import type { DraggableSyntheticListeners, UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import './sortableList.scss';

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
  const style: CSSProperties = {
    // opacity: isDragging ? 0.4 : undefined,
    zIndex: isDragging ? '1000' : 'unset',
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const el = useRef<HTMLDivElement>(null);

  if (isDragging) {
    debugger;
    setTimeout(() => {
      // console log the html for this element
      console.log('html', el.current?.outerHTML);
      console.log('innerHTML', el.current?.innerHTML);
    }, 10);
    // style.borderStyle = '3px dashed green';
    // style.backgroundColor = 'transparent';
    // style.opacity = '0.25';
  }

  return (
    <SortableItemContext.Provider value={context}>
      <li className={'SortableItem' + (isDragging ? ' dragging' : '')} ref={setNodeRef} style={style}>
        <div ref={el} className={isDragging ? 'sorting-tab-dragging' : ''}>
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

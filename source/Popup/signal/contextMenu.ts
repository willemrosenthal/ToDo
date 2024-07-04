import { signal } from '@preact/signals-react';

export type ContextOptions = {
  label: string;
  callback: (data: number[]) => void;
};
export type Point = {
  x: number;
  y: number;
};
export type ContextMenuData = {
  title?: string;
  data: number[];
  options: ContextOptions[];
  pos: Point;
  className?: string;
  useMousePos?: boolean;
};

const generic: ContextMenuData = {
  title: 'test',
  data: [0],
  options: [],
  pos: { x: 0, y: 0 },
  className: '',
  useMousePos: false,
};

export const contextAnchorEl = signal<HTMLElement | null>(null);
export const showContextMenu = signal<boolean>(false);
export const contextMenuData = signal<ContextMenuData>(generic);

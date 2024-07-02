import { signal } from "@preact/signals-react";

export type ContextOptions = {
  label: string;
  callback: (id: number) => void;
};
export type Point = {
  x: number;
  y: number;
};
export type ContextMenuData = {
  title?: string;
  id: number;
  options: ContextOptions[];
  pos: Point;
  className?: string;
};

const generic: ContextMenuData = {
  title: 'test',
  id: 0,
  options: [],
  pos: {x: 0, y: 0},
  className: '',
};

export const showContextMenu = signal<boolean>(false);
export const contextMenuData = signal<ContextMenuData>(generic);

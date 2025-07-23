import { signal } from '@preact/signals-react';

export const mode = signal<'main' | 'recently-deleted'>('main');

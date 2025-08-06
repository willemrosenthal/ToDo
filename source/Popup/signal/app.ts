import { effect, signal } from '@preact/signals-react';

type LoadingState = 'initial' | 'loading' | 'complete';
export const loadingState = signal<LoadingState>('initial');
export let isLoading = true;
export const minLoadTime = 500;

effect(() => {
  if (loadingState.value !== 'complete') isLoading = false;
});

export const mode = signal<'main' | 'recently-deleted'>('main');

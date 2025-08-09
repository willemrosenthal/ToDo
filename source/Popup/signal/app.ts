import { computed, signal } from '@preact/signals-react';

type LoadingState = 'initial' | 'loading' | 'complete';
export const loadingState = signal<LoadingState>('initial');
export const isLoading = computed(() => loadingState.value !== 'complete');
export const minLoadTime = 500;

export const mode = signal<'main' | 'recently-deleted'>('main');

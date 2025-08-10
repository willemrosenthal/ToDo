import { batch, effect, signal } from '@preact/signals-react';
import { PaletteColors } from '../theme/theme';
import themes from '../theme/theme';
import { Palette } from '@mui/material';
import { createTheme, ThemeOptions } from '@mui/material/styles';

export type PaletteName = 'custom' | 'light' | 'dark' | 'classic';

export type Settings = {
  palette: PaletteColors;
  selectedPalette: PaletteName | string;
};

const loadedSelectedPalette = localStorage.getItem('selectedPalette');
export const selectedPaletteName = signal<PaletteName | string>(loadedSelectedPalette || 'classic');
export const customPalette = signal<PaletteColors | Palette>(themes['dark'].palette);

// store selected palette in local storage
effect(() => {
  localStorage.setItem('selectedPalette', selectedPaletteName.value);
});

// export const currentPallette = signal<PaletteColors | Palette>(themes['classic'].palette);
export const currentTheme = signal<ThemeOptions>(themes['classic']);

export const paletteDrawerOpen = signal(false);

effect(() => {
  currentTheme.value = themes[selectedPaletteName.value];
});

effect(() => {
  // update the custom theme if the `customPalette` changes
  if (selectedPaletteName.value === 'custom') {
    themes['custom'] = createTheme({ palette: customPalette.value });
    currentTheme.value = themes[selectedPaletteName.value];
  }
});

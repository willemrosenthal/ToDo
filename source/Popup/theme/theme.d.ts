// import { PaletteOptions, PaletteColorOptions } from '@mui/material/styles';
interface CustomPalette {
  tertiary?: {
    main: string;
    light: string;
    dark: string;
  };
  scrollbar?: {
    thumb: string;
    track: string;
  };
  codesnippet?: {
    background: string;
    text: string;
  };
  border?: {
    main: string;
  };
  link?: {
    main: string;
  };
}

declare module '@mui/material/styles' {
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}

  // Ensure that 'border', 'link', and other custom properties inherit from PaletteColorOptions if necessary
  interface PaletteColorOptions {
    main: string;
  }

  interface PaletteColor {
    main?: string;
  }
}

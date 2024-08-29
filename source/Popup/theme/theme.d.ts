import { Theme, ThemeOptions } from '@mui/material/styles';

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

interface CustomBackground {
  inactive?: string;
  background?: string;
}

declare module '@mui/material/styles' {
  interface Theme {
    palette: CustomPalette & Theme['palette'];
    background: CustomBackground & Theme['palette']['background'];
  }

  interface ThemeOptions {
    palette?: CustomPalette & ThemeOptions['palette'];
    background?: CustomBackground & ThemeOptions['background'];
  }
}

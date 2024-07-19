// import { PaletteColorOptions } from '@mui/material/styles';
import { PaletteColorOptions, PaletteOptions, TypeBackground } from '@mui/material/styles';

type ScrollColorOptions = {
  thumb?: string;
  track?: string;
};

type CodeSnippetColorOptions = {
  background?: string;
  text?: string;
};

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: PaletteColorOptions;
  }
  interface PaletteOptions {
    tertiary?: PaletteColorOptions;
  }

  interface Palette {
    scrollbar: ScrollColorOptions;
  }
  interface PaletteOptions {
    scrollbar?: ScrollColorOptions;
  }

  interface Palette {
    codesnippet: CodeSnippetColorOptions;
  }
  interface PaletteOptions {
    codesnippet?: CodeSnippetColorOptions;
  }

  interface Palette {
    border: PaletteColorOptions;
  }
  interface PaletteOptions {
    border?: PaletteColorOptions;
  }

  interface TypeBackground {
    inactive?: string;
    background?: string;
  }
}

declare module '@mui/material' {
  interface Palette {
    background: TypeBackground;
  }

  interface PaletteOptions {
    background?: Partial<TypeBackground>;
  }
}

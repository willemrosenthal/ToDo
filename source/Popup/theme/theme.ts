import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    tertiary: {
      main: '#9c27b0', // Tertiary main color
      light: '#d05ce3', // Tertiary light color
      dark: '#6a0080', // Tertiary dark color
    },
  },
});

const light = createTheme({
  palette: {
    primary: {
      main: '#FCFCFC',
      // main: '#ff9100',
      // light: '#ffB144',
    },
    secondary: {
      // main: '#E0C2FF',
      main: '#ba68c8',
      // light: '#fcd674'
    },
    tertiary: {
      main: '#17d2e3',
      // light: '#d05ce3',
      // dark: '#6a0080',
    },
    scrollbar: {
      thumb: '#908d96',
      track: 'rgba(144,141,150, 0.3)',
    },
    border: {
      main: '#999999', //656565  //594c59 main: 'rgba(255, 255, 255, 0.5)',
    },
    error: {
      main: '#ef5350',
    },
    warning: {
      main: '#ff9800',
    },
    background: {
      default: '#f3f3f3',
      inactive: '#484351', //707070
      paper: '#f4f5fd',
      background: '#000', //101010
    },
    link: {
      main: '#f064a3', // Define your custom link color
    },
    text: {
      main: '#333',
      primary: '#333',
      secondary: '#555', // Example of a secondary text color
    },
  },
  // typography: {
  //   fontFamily: 'Arial, sans-serif',
  //   fontSize: 14,
  // },
});

const dark = createTheme({
  palette: {
    primary: {
      main: '#b79df4',
      // main: '#ff9100',
      // light: '#ffB144',
    },
    secondary: {
      // main: '#E0C2FF',
      main: '#f49eec',
      // light: '#fcd674'
    },
    tertiary: {
      main: '#17d2e3',
      // light: '#d05ce3',
      // dark: '#6a0080',
    },
    scrollbar: {
      thumb: '#908d96',
      track: 'rgba(144,141,150, 0.3)',
    },
    border: {
      main: '#484351', //656565  //594c59 main: 'rgba(255, 255, 255, 0.5)',
    },
    error: {
      main: '#ef5350',
    },
    warning: {
      main: '#ff9800',
    },
    background: {
      default: '#292929', //46424f //3f3f3f //505050
      inactive: '#484351', //707070
      paper: '#908d96',
      background: '#000', //101010
    },
    link: {
      main: '#fd69ac', // Define your custom link color
    },
    text: {
      main: '#333',
      primary: '#ebebeb', //ebe6e4
      secondary: '#baafba', // fafafa
    },
  },
  // typography: {
  //   fontFamily: 'Arial, sans-serif',
  //   fontSize: 14,
  // },
});

const themes = {
  light,
  dark,
};

export default themes;

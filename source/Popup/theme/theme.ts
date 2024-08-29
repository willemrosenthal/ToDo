import { createTheme } from '@mui/material/styles';
import './theme.d.ts';

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
    codesnippet: {
      background: '#b5a67f',
      text: '#fff',
    },
    link: {
      main: '#f064a3', // Define your custom link color
    },
    text: {
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
      default: '#292929', // NOTES BG  //46424f //3f3f3f //505050
      inactive: '#484351', //707070
      paper: '#908d96', // NOT USED
      background: '#292929', //101010
    },
    codesnippet: {
      background: '#b5a67f',
      text: '#fff',
    },
    link: {
      main: '#fd69ac', // Define your custom link color
    },
    text: {
      primary: '#ebebeb', //ebe6e4
      secondary: '#baafba', // fafafa
    },
  },
  // typography: {
  //   fontFamily: 'Arial, sans-serif',
  //   fontSize: 14,
  // },
});

const classic = createTheme({
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
      thumb: 'rgba(123, 135, 186, 0.5)', // blue: 'rgba(118, 141, 245, 0.5)', // PURPLE '#a692b3', // brighter blue
      track: 'rgba(123, 135, 186, 0.2)', // blue: 'rgba(118, 141, 245, 0.2)', // PURPLE: 'rgba(188, 175, 196, 0.3)',
    },
    border: {
      main: 'rgb(232 219 177)', // lighter: '#ebdeb5', // DARKER: #cfba8a   // LIGHTER: #ebdeb5
    },
    error: {
      main: '#ef5350',
    },
    warning: {
      main: '#ff9800',
    },
    background: {
      default: 'rgb(255, 255, 214)', //46424f //3f3f3f //505050
      inactive: 'rgb(232 219 177)', // INACTIVE TABS: '#d6c59c'
      paper: '#908d96',
      background: '#7b87ba', // Dull Blue: '#7b87ba' // BEHIND TABS - PURPLE: '#8c74cd', BRIGHT BLUE: '#768df5'
    },
    codesnippet: {
      background: '#b5a67f',
      text: '#fff',
    },
    link: {
      main: '#768df5', // Define your custom link color
    },
    text: {
      primary: '#3e3131', //TEXT
      secondary: '#4d3622', // Inactive tab Text
    },
  },
  // typography: {
  //   fontFamily: 'Arial, sans-serif',
  //   fontSize: 14,
  // },
});

const custom = createTheme({
  palette: {
    primary: {
      main: '#b79df4',
    },
    secondary: {
      main: '#f49eec',
    },
    tertiary: {
      main: '#17d2e3',
    },
    scrollbar: {
      thumb: 'rgba(123, 135, 186, 0.5)', // blue: 'rgba(118, 141, 245, 0.5)', // PURPLE '#a692b3', // brighter blue
      track: 'rgba(123, 135, 186, 0.2)', // blue: 'rgba(118, 141, 245, 0.2)', // PURPLE: 'rgba(188, 175, 196, 0.3)',
    },
    border: {
      main: 'rgb(232 219 177)', // lighter: '#ebdeb5', // DARKER: #cfba8a   // LIGHTER: #ebdeb5
    },
    error: {
      main: '#ef5350',
    },
    warning: {
      main: '#ff9800',
    },
    background: {
      default: 'rgb(255, 255, 214)', //46424f //3f3f3f //505050
      inactive: 'rgb(232 219 177)', // INACTIVE TABS: '#d6c59c'
      paper: '#908d96',
      background: '#7b87ba', // Dull Blue: '#7b87ba' // BEHIND TABS - PURPLE: '#8c74cd', BRIGHT BLUE: '#768df5'
    },
    codesnippet: {
      background: '#b5a67f',
      text: '#fff',
    },
    link: {
      main: '#768df5', // Define your custom link color
    },
    text: {
      primary: '#3e3131', //TEXT
      secondary: '#4d3622', // Inactive tab Text
    },
  },
});

const themes = {
  light,
  dark,
  classic,
};

export default themes;

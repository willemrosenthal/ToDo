import React, { useEffect, useState } from 'react';
import { Theme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import themes from './theme/theme';

import Main from './Main';
import { useSignalEffect } from '@preact/signals-react';
import { currentTheme } from './signal/settings';

export const ThemedApp = () => {
  const [theme, setTheme] = useState(themes['classic']);

  useSignalEffect(()=>{
    setTheme(currentTheme.value as Theme);
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Main />
    </ThemeProvider>
  );
};

export default ThemedApp;

// ReactDOM.render(
//   <ThemeProvider theme={theme}>
//     <CssBaseline />
//     <Main />
//   </ThemeProvider>,
//   document.getElementById('popup-root'),
// );

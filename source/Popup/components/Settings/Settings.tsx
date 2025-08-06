import { Drawer, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import React, { useCallback, useState } from 'react';
import ColorPicker from '../ColorPicker/ColorPicker';
import { customPalette, paletteDrawerOpen, selectedPaletteName, PaletteName } from '../../signal/settings';
import StyledScrollBar from '../StyledWrapper/StyledScrollBar';
import { signal } from '@preact/signals-react';
import { saveSettings } from '../../storage/storage';

export const cat = signal('');
export const subCat = signal('');
export const customPaletteMenuOpen = signal(false);

const Settings = () => {
  const toggleDrawer = (newOpen: boolean) => () => {
    paletteDrawerOpen.value = newOpen;
  };

  const [currentColor, setCurrent] = useState(null);

  // cat and subcat
  // const [cat, setCat] = useState('');
  // const [subCat, setSubCat] = useState('');

  const paletteList = {
    primary: ['main'],
    secondary: ['main'],
    tertiary: ['main'],
    scrollbar: ['thumb', 'track'],
    border: ['main'],
    error: ['main'],
    warning: ['main'],
    background: ['default', 'inactive', 'paper', 'background'],
    codesnippet: ['background', 'text'],
    link: ['main'],
    text: ['primary', 'secondary'],
  };

  const getSubCats = useCallback((key, val) => {
    // console.log('📗'+key, val);
    const subCatArr = val; //Object.keys(val);

    return subCatArr.map((sub) => {
      return (
        <>
          <button
            style={{ margin: '2px', padding: '1px 7px', borderRadius: '3px' }}
            onClick={() => {
              cat.value = key;
              subCat.value = sub;
              setCurrent(customPalette.value[key][sub]);
              // alert(customPalette.value[key][sub]);
            }}
          >
            {sub}
          </button>
          <br />
        </>
      );
    });
  }, []);

  const getCategories = () => {
    return Object.entries(paletteList).map(([key, value]) => (
      <>
        <b>{key}</b>
        <br />
        {getSubCats(key, value)}
      </>
    ));
  };

  customPaletteMenuOpen.value = selectedPaletteName.value === 'custom';

  const handleThemeSelect = (event: SelectChangeEvent) => {
    const newPalette = event.target.value as PaletteName;
    selectedPaletteName.value = newPalette;
    if (newPalette !== 'custom') {
      cat.value = '';
      subCat.value = '';
      customPaletteMenuOpen.value = false;
    } else {
      customPaletteMenuOpen.value = true;
    }
    saveSettings({
      selectedPalette: newPalette,
    });
  };

  return (
    <Drawer
      open={paletteDrawerOpen.value}
      style={{ padding: '10px' }}
      onClose={toggleDrawer(false)}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.0)', // Change opacity here
        },
      }}
    >
      <StyledScrollBar>
        <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vw' }}>
          <div style={{ padding: '13px', minHeight: '100%', borderRight: '2px solid' }}>
            <>
              <Select
                // labelId="theme-select-label"
                id='theme-select'
                value={selectedPaletteName.value}
                // label="Theme"
                onChange={handleThemeSelect}
              >
                <MenuItem value={'custom'}>Custom</MenuItem>
                <MenuItem value={'classic'}>Classic</MenuItem>
                <MenuItem value={'dark'}>Dark</MenuItem>
              </Select>
              <br />
              <br />
            </>
            {selectedPaletteName.value === 'custom' && getCategories()}
          </div>
          <div style={{ height: '100%' }}>
            <ColorPicker currentColor={currentColor || '#FFFFFF'} setter={setCurrent} />
          </div>
        </div>
      </StyledScrollBar>
    </Drawer>
  );
};

export default Settings;

import { Drawer, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import React, { useState } from 'react';
import ColorPicker from '../ColorPicker/ColorPicker'
import { customPalette, paletteDrawerOpen, selectedPaletteName, PaletteName } from '../../signal/settings'
import { saveTab } from '../../signal/todoData';
import StyledScrollBar from '../StyledWrapper/StyledScrollBar';

const Settings = () => {

  const toggleDrawer = (newOpen: boolean) => () => {
    paletteDrawerOpen.value = newOpen;
  };


  const [currentColor, setCurrent] = useState(customPalette.value.primary.main);


  // cat and subcat
  const [cat, setCat] = useState('');
  const [subCat, setSubCat] = useState('');

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
    text: ['primary', 'secondary']
  }


  const getSubCats = (key, val) => {
    // console.log('📗'+key, val);
    const subCatArr = val; //Object.keys(val);

    return subCatArr.map((sub) => {
      return (
      <>
       <button style={{margin: '2px', padding: '1px 7px', borderRadius: '3px'}} onClick={()=>{
          setCat(key);
          setSubCat(sub)
          setCurrent(customPalette.value[key][sub])
          // alert(customPalette.value[key][sub]);
        }}>
          {sub}
        </button>
        <br/>
      </>
      );
    })
  }

  const getCategrories = () => {
    return Object.entries(paletteList).map(([key, value])=>
      <>
        <b>{key}</b><br/>
        { getSubCats(key, value)}
      </>
    );
  }


  const handleThemeSelect = (event: SelectChangeEvent) => {
    selectedPaletteName.value = event.target.value as PaletteName;
    saveTab({});
  };

  return (
    <Drawer 
      open={paletteDrawerOpen.value}
      style={{padding: '10px'}}
      onClose={toggleDrawer(false)}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.0)', // Change opacity here
        },
      }}
    >
      <StyledScrollBar>
        <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vw'}}>
          <div style={{padding: '13px', minHeight: '100%', borderRight: '2px solid'}}>
            <>
              <Select
                // labelId="theme-select-label"
                id="theme-select"
                value={selectedPaletteName.value}
                // label="Theme"
                onChange={handleThemeSelect}
              >
                <MenuItem value={'custom'}>Custom</MenuItem>
                <MenuItem value={'classic'}>Classic</MenuItem>
                <MenuItem value={'dark'}>Dark</MenuItem>
              </Select>
              <br/>
              <br/>
            </>
            { (selectedPaletteName.value === 'custom') &&
              getCategrories()
            }
          </div>
          <div style={{height: '100%'}}>
            <ColorPicker label={cat} sublabel={subCat} currentColor={currentColor} setter={setCurrent}  />
          </div>
        </div>
      </StyledScrollBar>
    </Drawer>
  );
};

export default Settings;

import React, { useCallback, useEffect, useState } from 'react';
import ColorPicker from './Components/ColorPicker';
import { signal } from '@preact/signals-react';

import './styles.scss';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';

const cat = signal('');
const subCat = signal('');
const palette = signal(null);
const selectedPaletteName = signal('');

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

const Options: React.FC = () => {
  const [color, setColor] = useState('#44FF00');
  const [data, setData] = useState(null);

  // get initial data
  useEffect(() => {
    const getInitialData = async () => {
      // get initial data
      const res = localStorage.getItem(undefined);
      const expanded = JSON.parse(res);
      setData(expanded);
      palette.value = expanded?.settings?.palette;
    };
    getInitialData();
  }, []);

  const savePalette = () => {
    const updated = { ...data, settings: { ...data.settings, palette: palette.value } };
    localStorage.setItem(undefined, JSON.stringify(updated));
  };

  // const getSubCats = useCallback((key, val) => {
  //   // console.log('📗'+key, val);
  //   console.log('val', val);
  //   const subCatArr = val; //Object.keys(val);

  //   return subCatArr.map((sub) => {
  //     return (
  //       <>
  //         <button
  //           style={{ margin: '2px', padding: '1px 7px', borderRadius: '3px' }}
  //           onClick={() => {
  //             cat.value = key;
  //             subCat.value = sub;
  //             setColor(palette.value[key][sub].toString());
  //             // alert(customPalette.value[key][sub]);
  //           }}
  //         >
  //           {sub}
  //         </button>
  //         <br />
  //       </>
  //     );
  //   });
  // }, []);

  // const getCategories = () => {
  //   console.log('palette', palette);
  //   console.log('palette number of keys', Object.keys(palette).length);
  //   return Object.entries(paletteList).map(([key, value]) => {
  //     const subCats = Object.keys(value);
  //     console.log('subCats 💖', subCats);
  //     return (
  //       <>
  //         <b>{key}</b>
  //         <br />
  //         {/* {subCats} */}
  //         {/* {getSubCats(key, value)} */}
  //         {subCats.map((sub) => {
  //           console.log('sub', sub);
  //           return (
  //             <>
  //               <button
  //                 style={{ margin: '2px', padding: '1px 7px', borderRadius: '3px' }}
  //                 onClick={() => {
  //                   cat.value = key;
  //                   subCat.value = sub;
  //                   setColor(palette.value[key][sub].toString());
  //                   // alert(customPalette.value[key][sub]);
  //                 }}
  //               >
  //                 {sub}
  //               </button>
  //               <br />
  //             </>
  //           );
  //         })}
  //       </>
  //     );
  //   });
  // };

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
              // console.log('key', key);
              // console.log('sub', sub);
              // console.log('palette', JSON.stringify(palette.value));
              console.log('palette[key][sub]', palette.value[key][sub]);
              const selectedColor = palette.value[key][sub];
              setColor(selectedColor);
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
      <div className='palette-category-container'>
        <b>{key}</b>
        <br />
        {getSubCats(key, value)}
      </div>
    ));
  };

  const handleThemeSelect = (event: SelectChangeEvent) => {
    selectedPaletteName.value = event.target.value;
    if (selectedPaletteName.value !== 'custom') {
      cat.value = '';
      subCat.value = '';
    }
    // SAVE
  };

  useEffect(() => {
    // save color to palette
    console.log('changed to color', color);
  }, [color]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vw', width: '100vw', justifyContent: 'flex-start' }}>
      {/* left menu */}
      <div style={{ padding: '13px', minHeight: '100%', borderRight: '2px solid', width: '160px' }}>
        {/* <>
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
        </> */}
        {/* {selectedPaletteName.value === 'custom' && getCategories()} */}
        {palette && getCategories()}
      </div>

      {/* {`${JSON.stringify(palette.value)}`} */}
      <div className='options-color-picker'>
        <h2 className='color-picker-label'>{cat}</h2>
        <h3 className='color-picker-sublabel'>{subCat}</h3>
        <ColorPicker label='text color' color={color} setColor={setColor} />
        {`${color}`}
      </div>

      {/* {color} */}
      {/* <form>
        <p>
          <label htmlFor='username'>Your Name</label>
          <br />
          <input type='text' id='username' name='username' spellCheck='false' autoComplete='off' required />
        </p>
        <p>
          <label htmlFor='logging'>
            <input type='checkbox' name='logging' />
            Show the features enabled on each page in the console
          </label>

          <p>cool cool cool</p>
        </p>
      </form> */}
    </div>
  );
};

export default Options;

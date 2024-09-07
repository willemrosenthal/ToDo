import React, { useEffect, useState } from 'react';
import { HexAlphaColorPicker, HexColorInput } from 'react-colorful';
import { customPalette } from '../../signal/settings'
import { PaletteColors } from '../../theme/theme';
import { useSignalEffect } from '@preact/signals-react';
import { saveTab } from '../../signal/todoData';
// import styles from './ColorPicker.module.css';
import './ColorPicker.css'

type ColorPickerProps = {
  label: string;
  sublabel?: string;
  currentColor?: string;
  setter: (color: string) => void;
  
};

const ColorPicker = ({ label, sublabel = '', currentColor = '#FFFFFF', setter }: ColorPickerProps) => {
  
  const current = label + '_' + sublabel;
  const [loadedColorTag, setLoadedColorTag] = useState(current);

  // const [currentColorTag, setCurrentColorTag] = useState('');

  const [color, setColor] = useState(currentColor);
  const [iniitalColorSetting, setInitialColorSetting] = useState(false);

  
  useEffect(()=>{
    if (loadedColorTag !== current) {
      setLoadedColorTag(current);
      setColor(currentColor);
      setInitialColorSetting(true);
    }
  }, [currentColor])

  useEffect(() => {
    if (currentColor !== color) setter(color);

    // dont continue if it was just the initial state getting set
    if (iniitalColorSetting) {
      setInitialColorSetting(false)
      return;
    }
    
    if (label && sublabel) {
      const newPalette = JSON.parse(JSON.stringify(customPalette.value));
      newPalette[label][sublabel] = color;
    
      customPalette.value = newPalette as PaletteColors;
      saveTab({});
    }

  }, [color]);

  useSignalEffect(()=>{
    console.log('🥰',customPalette.value);
  })

  return (
    // <div className={styles.colorPicker}></div>
    <>
      {
        (label && sublabel) &&
        <div style={{ width: '170px' }}>
          <div style={{ padding: '16px 16px', width: 'fit-content', position: 'fixed'}}>
            <div style={{marginBottom: '16px'}}>
              <label>{label}</label>
              <span style={{margin: '6px'}}>-</span>
              {sublabel && <label>{sublabel}</label>}
            </div>
            <section className='small'>
              <HexAlphaColorPicker color={color} onChange={setColor} />
              <HexColorInput color={color} onChange={setColor} />
            </section>
          </div>
        </div>
      }
    </>
  );
};

export default ColorPicker;

// style={{ border: '1px solid #DADADA', padding: '16px 30px', borderRadius: '5px', width: 'fit-content' }}

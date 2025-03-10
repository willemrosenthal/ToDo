import React, { useEffect, useState } from 'react';
import { HexAlphaColorPicker, HexColorInput } from 'react-colorful';
import { customPalette } from '../../signal/settings';
import { PaletteColors } from '../../theme/theme';
import { signal, useSignalEffect } from '@preact/signals-react';
import { saveTab } from '../../signal/todoData';
// import styles from './ColorPicker.module.css';
import './ColorPicker.css';

import { cat, customPaletteMenuOpen, subCat } from '../Settings/Settings';

type ColorPickerProps = {
  currentColor?: string;
  setter: (color: string) => void;
};

const isOpen = signal(false);
const ColorPicker = ({ currentColor = '#FFFFFF', setter }: ColorPickerProps) => {
  const [label, setLabel] = useState('');
  const [sublabel, setSublabel] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useSignalEffect(() => {
    setLabel(cat.value);
    setSublabel(subCat.value);
  });
  useSignalEffect(() => {
    if (customPaletteMenuOpen.value && !isOpen.value) {
      isOpen.value = true;
      const mainContainer = document.querySelector('.main-container');
      if (mainContainer) {
        (mainContainer as HTMLElement).style.marginLeft = '300px';
      }
    }
    if (!customPaletteMenuOpen.value && isOpen.value) {
      isOpen.value = false;
      const mainContainer = document.querySelector('.main-container');
      if (mainContainer) {
        (mainContainer as HTMLElement).style.marginLeft = '0px';
      }
    }
  });
  useEffect(() => {
    return () => {
      const mainContainer = document.querySelector('.main-container');
      if (mainContainer) {
        isOpen.value = false;
        (mainContainer as HTMLElement).style.marginLeft = '0px';
      }
    };
  }, []);

  const current = label + '_' + sublabel;
  const [loadedColorTag, setLoadedColorTag] = useState(current);

  // const [currentColorTag, setCurrentColorTag] = useState('');
  const [color, setColor] = useState(currentColor);
  const [initialColorSetting, setInitialColorSetting] = useState(false);

  useEffect(() => {
    if (loadedColorTag !== current) {
      setLoadedColorTag(current);
      setColor(currentColor);
      setInitialColorSetting(true);
    }
  }, [currentColor]);

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging && currentColor !== color) {
        setter(color);

        if (!initialColorSetting && label && sublabel) {
          const newPalette = JSON.parse(JSON.stringify(customPalette.value));
          newPalette[label][sublabel] = color;
          customPalette.value = newPalette as PaletteColors;
          saveTab({});
        }
      }
      setIsDragging(false);
      setInitialColorSetting(false);
    };

    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [color, isDragging, initialColorSetting, label, sublabel]);

  return (
    // <div className={styles.colorPicker}></div>
    <>
      <div style={{ width: label && sublabel ? '170px' : '0px' }} className='theme-color-picker'>
        {/* {label && sublabel && ( */}
        <div style={{ padding: '16px 16px', width: 'fit-content' }}>
          <div style={{ marginBottom: '16px' }}>
            <label>{label}</label>
            <span style={{ margin: '6px' }}>-</span>
            {sublabel && <label>{sublabel}</label>}
          </div>
          <section className='small' onMouseDown={() => setIsDragging(true)}>
            <HexAlphaColorPicker color={color} onChange={setColor} />
            <HexColorInput
              color={color}
              onChange={(newColor) => {
                setColor(newColor);
                setter(newColor);
                if (label && sublabel) {
                  const newPalette = JSON.parse(JSON.stringify(customPalette.value));
                  newPalette[label][sublabel] = newColor;
                  customPalette.value = newPalette as PaletteColors;
                  saveTab({});
                }
              }}
            />
          </section>
        </div>
        {/* )} */}
      </div>
    </>
  );
};

export default ColorPicker;

// style={{ border: '1px solid #DADADA', padding: '16px 30px', borderRadius: '5px', width: 'fit-content' }}

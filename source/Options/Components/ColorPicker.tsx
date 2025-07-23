import React, { useEffect, useState } from 'react';
import { HexAlphaColorPicker, HexColorInput } from 'react-colorful';
// import styles from './ColorPicker.module.css';

type ColorPickerProps = {
  label: string;
  color?: string;
  setColor: (color: string) => void;
};

const ColorPicker = ({ label, color = '#FFFFFF', setColor }: ColorPickerProps) => {
  return (
    // <div className={styles.colorPicker}></div>
    // <div style={{ border: '1px solid #DADADA', padding: '16px 30px', borderRadius: '5px', width: 'fit-content' }}>
    <>
      <label>{label}</label>
      <div className='color-picker-container'>
        <HexAlphaColorPicker color={color} onChange={setColor} />
      </div>
      <div className='color-picker-hex-container'>
        <HexColorInput color={color} onChange={setColor} />
      </div>
    </>
  );
};

export default ColorPicker;

// style={{ border: '1px solid #DADADA', padding: '16px 30px', borderRadius: '5px', width: 'fit-content' }}

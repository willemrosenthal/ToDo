import React, { useEffect, useState } from 'react';
import { HexAlphaColorPicker } from 'react-colorful';

type ColorPickerProps = {
  label: string;
  currentColor?: string;
  setter: (color: string) => void;
};

const ColorPicker = ({ label, currentColor = '#FFFFFF', setter }: ColorPickerProps) => {
  const [color, setColor] = useState(currentColor);
  useEffect(() => {
    if (currentColor !== color) setter(color);
  }, [color]);
  return (
    <div style={{ border: '1px solid #DADADA', padding: '16px 30px', borderRadius: '5px', width: 'fit-content' }}>
      <label>{label}</label>
      <HexAlphaColorPicker color={color} onChange={setColor} />
    </div>
  );
};

export default ColorPicker;

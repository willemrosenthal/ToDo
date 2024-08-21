import React, { useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

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
    <div style={{ display: 'flex' }}>
      {label}
      <HexColorPicker color={color} onChange={setColor} />
    </div>
  );
};

export default ColorPicker;

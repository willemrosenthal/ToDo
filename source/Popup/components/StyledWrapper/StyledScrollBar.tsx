import React, { ReactNode } from "react";
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';

type StyledScrollBarProps = {
  children: ReactNode;
}

const StyledScrollBar = ({children} : StyledScrollBarProps) => {
  const theme = useTheme();
  const StyledScrollbarContainer = styled.div`
      ::-webkit-scrollbar {
        width: 7px !important;
        height: 10px !important;
      }
  
      ::-webkit-scrollbar-thumb {
        background: ${theme.palette.scrollbar.thumb} !important;
      }
  
      ::-webkit-scrollbar-track {
        background: ${theme.palette.scrollbar.track} !important;
      }
    `;

  return (
    <StyledScrollbarContainer className="TEST">
      {children}
    </StyledScrollbarContainer>
  )
}

export default StyledScrollBar;
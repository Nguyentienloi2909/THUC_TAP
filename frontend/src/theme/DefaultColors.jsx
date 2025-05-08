import { createTheme } from "@mui/material/styles";
import typography from "./Typography";
import { shadows } from "./Shadows";

const baselightTheme = createTheme({
  direction: 'ltr',
  palette: {
    primary: {
      main: '#5D87FF',
      light: '#ECF2FF',
      dark: '#4570EA',
    },
    secondary: {
      main: '#49BEFF',
      light: '#E8F7FF',
      dark: '#23afdb',
    },
    success: {
      main: '#13DEB9',
      light: '#E6FFFA',
      dark: '#02b3a9',
      contrastText: '#ffffff',
    },
    info: {
      main: '#539BFF',
      light: '#EBF3FE',
      dark: '#1682d4',
      contrastText: '#ffffff',
    },
    error: {
      main: '#FA896B',
      light: '#FDEDE8',
      dark: '#f3704d',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FFAE1F',
      light: '#FEF5E5',
      dark: '#ae8e59',
      contrastText: '#ffffff',
    },
    purple: {
      A50: '#EBF3FE',
      A100: '#6610f2',
      A200: '#557fb9',
    },
    grey: {
      100: '#F2F6FA',
      200: '#EAEFF4',
      300: '#DFE5EF',
      400: '#7C8FAC',
      500: '#5A6A85',
      600: '#2A3547',

    },
    text: {
      primary: '#2A3547',
      secondary: '#5A6A85',
    },
    action: {
      disabledBackground: 'rgba(73,82,88,0.12)',
      hoverOpacity: 0.02,
      hover: '#f6f9fc',
    },
    divider: '#e5eaef',
  },
  typography,
  shadows
},

);

const basedarkTheme = createTheme({
  direction: 'ltr',
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C9EFF',
      light: '#9DB5FF',
      dark: '#5D87FF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#69CAFF',
      light: '#8CD5FF',
      dark: '#49BEFF',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#4DEBB0',
      light: '#7AEFCA',
      dark: '#13DEB9',
      contrastText: '#ffffff',
    },
    info: {
      main: '#74AEFF',
      light: '#99C5FF',
      dark: '#539BFF',
      contrastText: '#ffffff',
    },
    error: {
      main: '#FF9E85',
      light: '#FFB8A7',
      dark: '#FA896B',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FFBE4D',
      light: '#FFD07F',
      dark: '#FFAE1F',
      contrastText: '#ffffff',
    },
    purple: {
      A50: '#484B61',
      A100: '#8242f4',
      A200: '#7599CC',
    },
    grey: {
      50: '#484B61',
      100: '#4F5267',
      200: '#575A70',
      300: '#666980',
      400: '#9FAABE',
      500: '#CBD3E0',
      600: '#F0F4F8',
      A100: '#4F5267',
      A200: '#575A70',
      A400: '#9FAABE',
      A700: '#F0F4F8',
    },
    text: {
      primary: '#F0F4F8',
      secondary: '#CBD3E0',
      disabled: '#9FAABE',
    },
    action: {
      active: '#F0F4F8',
      hover: 'rgba(240, 244, 248, 0.08)',
      selected: 'rgba(240, 244, 248, 0.16)',
      disabled: 'rgba(240, 244, 248, 0.3)',
      disabledBackground: 'rgba(240, 244, 248, 0.12)',
      focus: 'rgba(240, 244, 248, 0.12)',
    },
    background: {
      default: '#333747',
      dark: '#2D3142',
      paper: '#3A3E4F',
    },
    divider: 'rgba(240, 244, 248, 0.12)',
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(240, 244, 248, 0.12)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(240, 244, 248, 0.03)',
          },
          '&:hover': {
            backgroundColor: 'rgba(240, 244, 248, 0.08) !important',
          },
        },
      },
    },
  },
  typography,
  shadows
});

export { baselightTheme, basedarkTheme };

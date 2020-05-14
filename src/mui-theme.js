import { createMuiTheme } from '@material-ui/core/styles';

const COLORS = {
  PRIMARY: '#43a047',
  SECONDARY: '#f44336',
  INFO: '#00b0ff',
  WARNING: '#ffee58',
};

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'DroidSans',
      // 'FuturaLT',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: {
      main: COLORS.PRIMARY,
      contrastText: '#fff',
    },
    secondary: {
      main: COLORS.SECONDARY,
    },
    warning: {
      main: COLORS.WARNING,
    },
  },
  overrides: {
    MuiButton: {
      label: {
        fontWeight: 600,
      },
      startIcon: {
        marginRight: '2px',
      },
    },
    MuiSnackbarContent: {
      root: {
        '$&.Snackbar-Success': {
          backgroundColor: 'black',
        },
      },
    },
    MuiTypography: {
      root: {
        '&.MuiPickersClockNumber-clockNumber': {
          position: 'fixed',
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        backgroundColor: '#fff',
      },
    },
  },
});

export const notistackStyles = {
  snack: {
    marginTop: '50px',
  },
  info: {
    backgroundColor: COLORS.INFO,
  },
  error: {
    backgroundColor: COLORS.SECONDARY,
  },
};

export default theme;

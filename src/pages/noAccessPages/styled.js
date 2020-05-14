import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.grey['300'],
    height: '100vh',
  },
  homeBtn: {
    textTransform: 'none',
    padding: theme.spacing(0, 0.5),
    fontSize: '1rem',
  },
}));

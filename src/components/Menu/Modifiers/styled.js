import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(0),
  },
  card: {
    marginBottom: theme.spacing(2),
  },
  modifiersAmount: {
    fontWeight: 300,
    // color: theme.palette.primary.dark,
  },
  optionsAmount: {
    fontWeight: 600,
  },
  modifierName: {
    color: theme.palette.primary.dark,
  },
}));

import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  cardHeader: {
    backgroundColor: theme.palette.grey['200'],
  },
  card: {
    marginTop: theme.spacing(3),
  },
}));

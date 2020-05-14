import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  visibleOverflow: {
    overflow: 'visible',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

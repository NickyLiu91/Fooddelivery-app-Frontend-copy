import { makeStyles } from '@material-ui/core';

export const listStyles = theme => ({
  cardHeader: {
    backgroundColor: '#eeeeee',
  },
  progressContainer: {
    marginTop: theme.spacing(5),
    textAlign: 'center',
  },
  editor: {
    boxSizing: 'border-box',
    border: '1px solid #ddd',
    cursor: 'text',
    padding: '16px',
    borderRadius: '2px',
    marginBottom: '2em',
    boxShadow: 'inset 0px 1px 8px -3px #ababab',
    background: '#fefefe',
  },
});

export const useStyles = makeStyles(theme => ({
  formButton: {
    margin: theme.spacing(2),
  },
}));

import { makeStyles } from '@material-ui/core';

export const listStyles = theme => ({
  root: {
    marginTop: theme.spacing(5),
  },
  formButton: {
    margin: theme.spacing(2),
  },
  progressContainer: {
    marginTop: theme.spacing(5),
    textAlign: 'center',
  },
  inputTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  saveButton: {
    marginBottom: theme.spacing(3),
  },
  media: {
    height: 200,
    backgroundSize: 'auto',
  },
  mediaInfo: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  mediaLabel: {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.6,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: '0 15px 5px',
    textTransform: 'uppercase',
    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
    borderRadius: '4px',
  },
  helperText: {
    color: theme.palette.error.main,
  },
  dialogTitle: {
    marginTop: theme.spacing(2),
  },
  answer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
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
  orderManagementItem: {
    marginBottom: theme.spacing(2),
  },
});

export const useStyles = makeStyles(theme => ({
  cardHeader: {
    backgroundColor: theme.palette.grey['200'],
  },
  additionalInformation: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  formButton: {
    margin: theme.spacing(2),
  },
  managementTitle: {
    marginTop: theme.spacing(2),
  },
  dialogTitle: {
    marginTop: theme.spacing(2),
  },
  answer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  helperText: {
    color: theme.palette.error.main,
  },
  addButton: {
    marginBottom: theme.spacing(2),
  },
  media: {
    height: 200,
    backgroundSize: 'auto',
  },
}));

export const backgroundStyles = () => ({
  media: {
    height: 200,
  },
  autoBackgoundSize: {
    backgroundSize: 'auto',
  },
});

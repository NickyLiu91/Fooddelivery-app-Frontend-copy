import { makeStyles } from '@material-ui/core';

export const listStyles = theme => ({
  select: {
    minWidth: 110,
  },
  picker: {
    maxWidth: 165,
  },
  dateColumn: {
    fontWeight: '600',
    minWidth: theme.spacing(14),
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200],
  },
  progressContainer: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    textAlign: 'center',
  },
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  divider: {
    border: '1px solid rgba(224, 224, 224, 1)',
    height: 0,
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  titleDate: {
    fontWeight: '600',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(3),
  },
  buttonApply: {
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(2),
  },
});

export const useStyles = makeStyles(theme => ({
  titleTotalNumber: {
    fontWeight: '600',
    margin: theme.spacing(1),
  },
  totalNumber: {
    fontWeight: '600',
    margin: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

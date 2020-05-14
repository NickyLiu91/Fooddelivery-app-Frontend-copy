import { makeStyles } from '@material-ui/core';

export const listStyles = theme => ({
  progressContainer: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    textAlign: 'center',
  },
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  contentReview: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  headerReview: {
    backgroundColor: theme.palette.grey['200'],
    width: '100%',
  },
  pagination: {
    backgroundColor: theme.palette.common.white,
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    marginBottom: '3px',
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
  },
  reviewText: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  button: {
    marginRight: theme.spacing(3),
  },
});

export const useStyles = makeStyles(theme => ({
  headerOrder: {
    backgroundColor: theme.palette.grey['200'],
    width: '100%',
  },
  headerTitle: {
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  title: {
    fontWeight: 600,
  },
  orderButton: {
    margin: theme.spacing(2),
  },
  orderNumber: {
    color: theme.palette.primary.light,
    fontWeight: '600',
    marginBottom: theme.spacing(1),
  },
  receivedTime: {
    fontWeight: 600,
    marginRight: theme.spacing(1),
  },
  editIcon: {
    margin: theme.spacing(1),
  },
  itemsContainer: {
    '& > .MuiGrid-root:nth-child(odd)': {
      backgroundColor: theme.palette.grey['200'],
    },
  },
  titleCountItem: {
    fontWeight: 600,
    marginLeft: theme.spacing(5),
    boxSizing: 'border-box',
  },
  countPrice: {
    textAlign: 'end',
  },
  price: {
    textAlign: 'end',
    fontWeight: 600,
  },
}));

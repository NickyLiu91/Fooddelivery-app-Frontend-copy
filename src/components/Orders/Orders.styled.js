import { makeStyles } from '@material-ui/core';

export const listStyles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  pagination: {
    backgroundColor: theme.palette.common.white,
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    marginBottom: '3px',
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
  },
  applyItemButton: {
    marginLeft: theme.spacing(2),
  },
  formControl: {
    minWidth: 100,
  },
  status: {
    fontSize: '1rem',
    fontWeight: '600',
    marginRight: theme.spacing(2),
  },
  search: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '260px',
    position: 'relative',
    top: '-132px',
  },
  iconButton: {
    padding: 10,
  },
  progressContainer: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    textAlign: 'center',
  },
  titleDate: {
    fontWeight: '600',
    margin: theme.spacing(1),
  },
  fieldDate: {
    width: '170px',
  },
});

export const printStyles = theme => ({
  printHeader: {
    backgroundColor: theme.palette.grey['200'],
    width: '100%',
    padding: theme.spacing(2),
  },
  printContainer: {
    maxWidth: '960px',
    display: 'flex',
    flexDirection: 'column',
  },
  printContentWrapper: {
    flex: '1 1 auto',
    padding: '8px 24px',
  },
  headerTitle: {
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  title: {
    fontWeight: 600,
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
  titleCountItem: {
    fontWeight: 600,
    marginLeft: theme.spacing(5),
    boxSizing: 'border-box',
  },
  itemsContainer: {
    '& > .MuiGrid-root:nth-child(odd)': {
      backgroundColor: theme.palette.grey['200'],
    },
  },
  price: {
    textAlign: 'end',
    fontWeight: 600,
  },
});

export const useStyles = makeStyles(theme => ({
  orderTab: {
    [theme.breakpoints.up('sm')]: {
      minWidth: '140px',
    },
  },
  orderNumberHover: {
    width: 'fit-content',
    color: theme.palette.primary.light,
    fontWeight: '600',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  contentOrder: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  orderInfo: {
    maxWidth: '50%',
  },
  itemInfo: {
    marginRight: '16px',
  },
  headerOrder: {
    backgroundColor: theme.palette.grey['200'],
    width: '100%',
  },
  printHeader: {
    backgroundColor: theme.palette.grey['200'],
    width: '100%',
    padding: theme.spacing(2),
  },
  printContainer: {
    maxWidth: '960px',
    display: 'flex',
    flexDirection: 'column',
  },
  printContentWrapper: {
    flex: '1 1 auto',
    padding: '8px 24px',
  },
  headerTitle: {
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  title: {
    fontWeight: 600,
  },
  orderButton: {
    margin: theme.spacing(0.5),
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
  dialogActions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

import { makeStyles } from '@material-ui/core';

export const listStyles = theme => ({
  root: {
    width: 'calc(100% - 300px)',
  },
  sectionList: {
    padding: 0,
  },
  sectionItem: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
  },
  sectionsSubheader: {
    border: '1px solid rgba(0, 0, 0, 0.12)',
    borderRadius: '5px',
    backgroundColor: theme.palette.common.white,
  },
  sectionsBadge: {
    margin: theme.spacing(3),
  },
  available: {
    backgroundColor: theme.palette.primary.main,
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    color: theme.palette.primary.contrastText,
  },
  sold: {
    backgroundColor: '#ffa000',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
  archived: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
  price: {
    marginRight: theme.spacing(9),
  },
  formControl: {
    margin: theme.spacing(0.75, 1, 1, 0),
    minWidth: 220,
  },
  sectionActions: {
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
  },
  addSectionButton: {
    margin: theme.spacing(1, 0, 1, 1),
  },
  applyItemButton: {
    margin: '8px',
  },
  search: {
    minWidth: '250px',
  },
});

export const useStyles = makeStyles(theme => ({
  sectionsBadge: {
    margin: '24px',
  },
  sectionItem: {
    border: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: '#fff',
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  sectionList: {
    padding: 0,
  },
  listIcon: {
    minWidth: theme.spacing(5.5),
  },
  itemText: {
    alignItems: 'center',
    marginRight: '60px',
    display: 'flex',
    flexWrap: 'wrap',
  },
  itemName: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: theme.spacing(25),
    whiteSpace: 'nowrap',
  },
  soldOut: {
    backgroundColor: theme.palette.warning.main,
    marginRight: '10px',
  },
  available: {
    backgroundColor: theme.palette.primary.main,
    marginRight: '10px',
    color: theme.palette.primary.contrastText,
  },
  archived: {
    marginRight: '10px',
  },
  itemPrice: {
    display: 'flex',
    justifyContent: 'space-between',
    minWidth: '55px',
  },
}));

import { makeStyles } from '@material-ui/core';

export const listStyles = theme => ({
  root: {
    width: '300px',
  },
  sectionHeader: {
    padding: 0,
    borderRadius: '5px',
    overflow: 'hidden',
    border: '1px solid rgba(0, 0, 0, 0.012)',
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
    color: theme.palette.primary.contrastText,
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
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
  addSectionButton: {
    marginTop: theme.spacing(0.75),
    marginBottom: theme.spacing(0.75),
  },
  setionsActions: {
    padding: theme.spacing(1, 0),
  },
});

export const useStyles = makeStyles(theme => ({
  sectionItem: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid rgba(0, 0, 0, 0.12)',
    listStyle: 'none',
  },
  sectionText: {
    marginRight: '110px',
  },
  sectionName: {
    overflow: 'hidden',
    display: 'block',
    maxWidth: '168px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  sectionsBadge: {
    margin: '24px',
  },
  sectionList: {
    padding: 0,
  },
  dragHandle: {
    minWidth: '24px',
    marginRight: '10px',
  },
}));

export const useSectionDialogStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('lg')]: {
      marginTop: theme.spacing(-20),
    },
    overflow: 'visible',
  },
  visibleOverflow: {
    overflow: 'visible',
  },
}));

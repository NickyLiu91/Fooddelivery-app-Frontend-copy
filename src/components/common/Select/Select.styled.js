import { emphasize, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minWidth: 290,
    '& .indicatorContainer': {
      cursor: 'pointer',
    },
    paddingTop: '11px',
  },
  input: {
    display: 'flex',
    padding: 0,
    height: 'auto',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    bottom: 6,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 10,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing(2),
  },
}));

export const selectStyles = theme => ({
  input: base => ({
    ...base,
    color: theme.palette.text.primary,
    '& input': {
      font: 'inherit',
    },
  }),
  indicatorsContainer: base => ({
    ...base,
    cursor: 'pointer',
  }),
  menuList: base => ({
    ...base,
    maxHeight: '260px',
  }),
});

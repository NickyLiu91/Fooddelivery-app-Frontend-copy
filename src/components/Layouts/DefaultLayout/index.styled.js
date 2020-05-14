export const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: '#fafafa',
    },
  },
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3, 3, 1),
  },
  toolbar: theme.mixins.toolbar,
  logoutIcon: {
    marginRight: theme.spacing(1),
  },
  logoutBtn: {
    color: 'inherit',
    textTransform: 'none',
    fontSize: '17px',
  },
  headerText: {
    fontFamily: 'FuturaLT',
    flexGrow: 1,
    fontSize: '1.8rem',
  },
});

export const headerHeight = 64;

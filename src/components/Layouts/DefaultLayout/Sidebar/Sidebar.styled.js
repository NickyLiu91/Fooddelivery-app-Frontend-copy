import { headerHeight } from '../index.styled';

const drawerWidth = 220;

export const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    marginTop: headerHeight,
    '& .MuiDrawer-paper': {
      justifyContent: 'space-between',
    },
  },
  drawerPaper: {
    width: drawerWidth,
    // backgroundColor: theme.palette.background.default,
    marginTop: headerHeight + 1,
    height: `calc(100% - ${headerHeight}px)`,
  },
  toolbar: {
    marginLeft: -8,
  },
  link: {
    textDecoration: 'none',
    color: '#424242',
  },
  active: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    display: 'block',
  },
  bottomBlock: {
    width: '100%',
    backgroundColor: theme.palette.common.white,
    paddingBottom: theme.spacing(2),
  },
  menuList: {
    padding: 0,
    backgroundColor: theme.palette.common.white,
  },
});

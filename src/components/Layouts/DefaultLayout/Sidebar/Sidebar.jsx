import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Drawer, MenuItem, MenuList, Box, Badge, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { styles } from './Sidebar.styled';
import { materialClassesType } from 'types';
import RestaurantBlock from './RestaurantBlock/RestaurantBlock';
import UserInfo from './UserInfo/UserInfo';
import { USER_ROLES } from 'constants/auth';
import { getMenu } from 'routes/menu';
import StopTakingOrders from './StopTakingOrders/StopTakingOrders';

function Sidebar({ classes, user, ...props }) {
  return (
    <React.Fragment>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <MenuList className={classes.menuList}>
          {getMenu(user).map(({
            label,
            exact = true,
            path,
            notifyKey = null,
          }) => (
            <NavLink
              exact={exact}
              key={label}
              className={classes.link}
              activeClassName={classes.active}
              to={path}
            >
              <MenuItem button>
                {label}
                {notifyKey && props[notifyKey] &&
                  <Box component="span" ml={3}>
                    <Badge badgeContent="new" color="secondary" />
                  </Box>
                }
              </MenuItem>
            </NavLink>
          ))}
        </MenuList>
        <Box className={classes.bottomBlock}>
          {
            user.restaurant && user.restaurant.id &&
            <StopTakingOrders />
          }
          <Divider />
          <UserInfo />
          { user.role === USER_ROLES.ROOT &&
            <RestaurantBlock />
          }
        </Box>
      </Drawer>
    </React.Fragment>
  );
}

Sidebar.propTypes = {
  classes: materialClassesType.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,
    restaurant: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  messages: state.chat.unreadMessagesFlag,
  orders: state.orders.newOrdersFlag,
});

export default connect(mapStateToProps, null)(withStyles(styles)(Sidebar));

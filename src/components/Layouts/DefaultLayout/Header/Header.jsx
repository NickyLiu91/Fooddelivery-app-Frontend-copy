import React from 'react';
import { withRouter } from 'react-router-dom';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { materialClassesType } from 'types';
import { AuthService } from 'services';
import { headerHeight } from '../index.styled';

function Header({ classes }) {
  function logout() {
    AuthService.logout();
  }

  return (
    <AppBar style={{ height: headerHeight }} position="fixed">
      <Toolbar>
        <Typography variant="h5" className={classes.headerText}>
          Cafe Greenpoint
        </Typography>
        <Button
          className={classes.logoutBtn}
          color="inherit"
          onClick={logout}
        >
          <PowerSettingsNewIcon className={classes.logoutIcon} />
          {/* <Typography> */}
            Logout
          {/* </Typography> */}
        </Button>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  classes: materialClassesType.isRequired,
};

export default withRouter(Header);

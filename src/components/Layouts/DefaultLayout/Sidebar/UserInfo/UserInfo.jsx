import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Box, Typography, Grid, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import PersonIcon from '@material-ui/icons/Person';

import { authType, routerHistoryType } from 'types';
import ROUTES from 'constants/routes';


function UserInfo({ auth, history }) {
  return (
    <Box m={2} mb={1.5}>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <PersonIcon />
        </Grid>
        <Grid item xs={6}>
          <Typography>
            {auth.user.first_name}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography align="right">
            <IconButton
              onClick={() => { history.push(ROUTES.EDIT_PROFILE); }}
              variant="contained"
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Typography>
        </Grid>
      </Grid>
      <Box>
        <Typography variant="body2">
          {auth.user.email}
        </Typography>
      </Box>
    </Box>
  );
}

UserInfo.propTypes = {
  auth: authType.isRequired,
  history: routerHistoryType.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(UserInfo));


import React from 'react';
import { Container, Grid, Typography, Button } from '@material-ui/core';
import { useStyles } from './styled';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getDefaultRoute } from 'routes';
import { authType } from 'types';

function NotFound({ auth }) {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      component="main"
      className={classes.root}
    >
      <Container maxWidth="sm">
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Typography variant="h1">
              404
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h4">
              Page not found
            </Typography>
            <Typography>
              {"That page doesn't exist"}
            </Typography>
            <Typography>
              You can go back to
              <Button
                className={classes.homeBtn}
                color="primary"
                onClick={() => history.replace(getDefaultRoute(auth.user))}
              >
                Home Page
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
}

NotFound.propTypes = {
  auth: authType.isRequired,
};

export default connect(state => ({
  auth: state.auth,
}))(NotFound);

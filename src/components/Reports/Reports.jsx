import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Route, Switch } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';

import { Box, Container, Grid, Paper, Tab, Tabs, Typography } from '@material-ui/core';

import DefaultLayout from '../Layouts/DefaultLayout';
import ROUTES from 'constants/routes';
import TotalValuesOrdersTab from './TotalValuesOrdersTab';
import StopTakingOrdersTab from './StopTakingOrdersTab';
import ReportsPanel from './ReportsPanel';
import { USER_ROLES } from 'constants/auth';

const tabs = [
  ROUTES.REPORTS,
  ROUTES.STOP_TAKING_ORDERS,
];

function Reports({ restaurant, isSuperAdmin }) {
  const [period, setPeriod] = useState({
    startDate: moment(),
    endDate: moment(),
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurant);

  return (
    <DefaultLayout>
      <Container>
        <Route
          path="/"
          render={({ location }) => (
            <Fragment>
              <Box mb={3}>
                <Grid container direction="column">
                  <Grid item>
                    <Box mb={1}>
                      <Typography variant="h4" xs={12}>
                        Reports
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <ReportsPanel
                      onPeriodChange={setPeriod}
                      selectedRestaurant={selectedRestaurant}
                      onRestaurantChange={setSelectedRestaurant}
                      period={period}
                      location={location}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Paper square>
                      <Tabs
                        value={tabs.indexOf(location.pathname)}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                      >
                        <Tab label="Global report" component={Link} to={ROUTES.REPORTS} />
                        <Tab label="Stop taking orders statistics" component={Link} to={ROUTES.STOP_TAKING_ORDERS} />
                      </Tabs>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
              <Switch>
                <Route
                  path={ROUTES.REPORTS}
                  exact
                  render={rest => (
                    <TotalValuesOrdersTab
                      selectedRestaurant={isSuperAdmin ? selectedRestaurant : null}
                      period={period}
                      {...rest}
                    />
                  )}
                />
                <Route
                  path={ROUTES.STOP_TAKING_ORDERS}
                  render={rest => (
                    <StopTakingOrdersTab
                      period={period}
                      selectedRestaurant={isSuperAdmin ? selectedRestaurant : null}
                      {...rest}
                    />
                  )}
                />
              </Switch>
            </Fragment>
          )}
        />
      </Container>
    </DefaultLayout>
  );
}

Reports.propTypes = {
  restaurant: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  restaurant: state.auth.user.restaurant,
  isSuperAdmin: state.auth.user.role === USER_ROLES.ROOT,
});

export default connect(mapStateToProps, null)(Reports);

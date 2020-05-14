import React, { Fragment } from 'react';
import { Box, Container, Grid, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import DefaultLayout from '../Layouts/DefaultLayout';
import PropTypes from 'prop-types';
import { Link, Route, Switch } from 'react-router-dom';
import ROUTES from 'constants/routes';
import OrdersTab from './OrdersTab/OrdersTab';
import OrdersSearch from './OrdersSearch/OrdersSearch';
import { useStyles } from './Orders.styled';

const OrdersNew = () => <OrdersTab tab="pending" />;
const OrdersConfirmed = () => <OrdersTab tab="confirmed" />;
const OrdersScheduled = () => <OrdersTab tab="scheduled" />;
const OrdersHistory = () => <OrdersTab tab="history" />;

const tabs = [
  ROUTES.ORDERS_CONFIRMED,
  ROUTES.ORDERS_SCHEDULED,
  ROUTES.ORDERS_HISTORY,
  ROUTES.ORDERS_SEARCH,
];

const getTabValue = pathName => {
  if (pathName === ROUTES.ORDERS) return 0;
  return tabs.findIndex(tab => pathName.includes(tab)) + 1;
};

function Orders(props) {
  const classes = useStyles();
  const {
    orders,
  } = props;
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
                      <Typography variant="h4">
                        Orders
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Paper square>
                      <Tabs
                        value={getTabValue(location.pathname)}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                      >
                        <Tab
                          className={classes.orderTab}
                          label={`New (${orders.pending})`}
                          component={Link}
                          to={ROUTES.ORDERS}
                        />
                        <Tab
                          className={classes.orderTab}
                          label={`Confirmed (${orders.confirmed})`}
                          component={Link}
                          to={ROUTES.ORDERS_CONFIRMED}
                        />
                        <Tab
                          className={classes.orderTab}
                          label={`Scheduled (${orders.scheduled})`}
                          component={Link}
                          to={ROUTES.ORDERS_SCHEDULED}
                        />
                        <Tab
                          className={classes.orderTab}
                          label={`History (${orders.history})`}
                          component={Link}
                          to={ROUTES.ORDERS_HISTORY}
                        />
                        <Tab
                          className={classes.orderTab}
                          label="Search"
                          component={Link}
                          to={ROUTES.ORDERS_SEARCH}
                        />
                      </Tabs>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
              <Switch>
                <Route path={ROUTES.ORDERS} exact render={() => <OrdersNew />} />
                <Route path={ROUTES.ORDERS_CONFIRMED} render={() => <OrdersConfirmed />} />
                <Route path={ROUTES.ORDERS_SCHEDULED} render={() => <OrdersScheduled />} />
                <Route path={ROUTES.ORDERS_HISTORY} render={() => <OrdersHistory />} />
                <Route path={`${ROUTES.ORDERS_SEARCH}/:id?`} render={() => <OrdersSearch />} />
              </Switch>
            </Fragment>
          )}
        />
      </Container>
    </DefaultLayout>
  );
}

Orders.propTypes = {
  restaurant: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  orders: PropTypes.shape({
    pending: PropTypes.number,
    confirmed: PropTypes.number,
    scheduled: PropTypes.number,
    history: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = state => ({
  restaurant: state.auth.user.restaurant,
  orders: state.orders,
});

export default connect(mapStateToProps, null)(Orders);

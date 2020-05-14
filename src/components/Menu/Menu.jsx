import React, { Fragment } from 'react';
import { Box, Container, Tab, Tabs, Paper } from '@material-ui/core';
import { connect } from 'react-redux';
import DefaultLayout from '../Layouts/DefaultLayout';
import PropTypes from 'prop-types';
import { Link, Route, Switch } from 'react-router-dom';
import MenuItems from './MenuItems/MenuItems';
import ModifiersList from './Modifiers/ModifiersList';
import MenuSchedules from './MenuSchedule/Schedule';
import LabelsList from './Labels/LabelsList';
import ROUTES from 'constants/routes';

const tabs = [ROUTES.MENU_ITEMS, ROUTES.MODIFIERS, ROUTES.MENU_SCHEDULE, ROUTES.MENU_LABELS];

function EditWeeklyModal() {
  return (
    <DefaultLayout>
      <Container>
        <Route
          path="/"
          render={({ location }) => (
            <Fragment>
              <Box mb={3}>
                <Paper square>
                  <Tabs
                    value={tabs.indexOf(location.pathname)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                  >
                    <Tab label="Items" component={Link} to={ROUTES.MENU_ITEMS} />
                    <Tab label="Modifiers" component={Link} to={ROUTES.MODIFIERS} />
                    <Tab label="Schedules" component={Link} to={ROUTES.MENU_SCHEDULE} />
                    <Tab label="Labels" component={Link} to={ROUTES.MENU_LABELS} />
                  </Tabs>
                </Paper>
              </Box>
              <Switch>
                <Route path={ROUTES.MENU_ITEMS} exact render={() => <MenuItems />} />
                <Route path={ROUTES.MODIFIERS} render={() => <ModifiersList />} />
                <Route path={ROUTES.MENU_SCHEDULE} render={() => <MenuSchedules />} />
                <Route path={ROUTES.MENU_LABELS} render={() => <LabelsList />} />
              </Switch>
            </Fragment>
            )}
        />
      </Container>
    </DefaultLayout>
  );
}

EditWeeklyModal.propTypes = {
  restaurant: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  restaurant: state.auth.user.restaurant,
});

export default connect(mapStateToProps, null)(EditWeeklyModal);

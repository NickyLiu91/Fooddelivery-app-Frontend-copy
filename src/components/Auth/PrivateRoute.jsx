import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { defaultRoutes } from 'routes';
import ROUTES from 'constants/routes';
import { routerLocationType, authType } from 'types';


class PrivateRoute extends React.Component {
  state = {

  }

  render() {
    const {
      auth,
      permissions,
    } = this.props;
    if (!auth.authenticated) {
      return <Redirect to={{ pathname: ROUTES.LOGIN, state: { from: this.props.location } }} />;
    }

    if (permissions && permissions.indexOf(auth.user.permissions.role) === -1) {
      // TODO: check do we need to show 403 page
      return <Redirect to={{ pathname: defaultRoutes[auth.user.permissions.role] }} />;
    }

    if (this.props.path === '/') {
      return <Redirect to={{ pathname: defaultRoutes[auth.user.permissions.role] }} />;
    }

    return <Route {...this.props} />;
  }
}

PrivateRoute.propTypes = {
  permissions: PropTypes.arrayOf(PropTypes.string),
  auth: authType.isRequired,
  location: routerLocationType,
  path: PropTypes.string.isRequired,
};

PrivateRoute.defaultProps = {
  permissions: null,
  location: {},
};


const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(PrivateRoute);
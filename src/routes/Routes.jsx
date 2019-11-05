import React from 'react';
import {
  shape, arrayOf, string, bool, any,
} from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from 'components/Auth/PrivateRoute';

const Routes = ({ routes, ...propsFromWrapper }) => (
  <Switch>
    {routes.map((route) => {
      const {
        isProtected = true, component: Component = null, name, ...rest
      } = route;

      return (isProtected
        ? (
          <PrivateRoute
            component={Component}
            key={name}
            name={name}
            {...rest}
            {...propsFromWrapper}
          />
        )
        : (
          <Route
            render={props => <Component {...props} {...propsFromWrapper} />}
            key={name}
            {...rest}
          />
        ));
    })}
  </Switch>
);

Routes.propTypes = {
  routes: arrayOf(shape({
    path: string,
    exact: bool,
    name: string.isRequired,
    component: any,
    permissions: arrayOf(string),
  })).isRequired,
};

export default Routes;

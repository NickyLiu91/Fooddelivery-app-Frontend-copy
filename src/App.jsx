import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Router } from 'react-router-dom';
import { ThemeProvider, withStyles } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import { store, persistor } from './reducers/store';
import theme, { notistackStyles } from './mui-theme';

import Routes from 'routes/Routes';
import routes from 'routes';
import { Notifier, Listeners } from 'components/common/';
import history from './browserHistory';
import { materialClassesType } from 'types';

function App({ classes }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <SnackbarProvider
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                classes={{
                  root: classes.snack,
                  variantError: classes.error,
                  variantInfo: classes.info,
                }}
              >
                <Listeners />
                <Notifier />
                <Routes routes={routes} />
              </SnackbarProvider>
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        </Router>
      </PersistGate>
    </Provider>
  );
}

App.propTypes = {
  classes: materialClassesType.isRequired,
};

export default withStyles(notistackStyles)(App);

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';

import { store, persistor } from './reducers/store';
import theme from './mui-theme';

import Routes from 'routes/Routes';
import routes from 'routes';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <Routes routes={routes} />
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;

import React from 'react';
// import './App.css';

import Header from '@/components/Header/Header';
import store from '@/redux/store';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import DetailPlayer from './components/DetailPlayer/DetailPlayer';
import HeaderBarContainer from './components/HeaderBar/HeaderBar';
import Player from './components/Player/Player';
import { createRouteWithHook, routes } from './router';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2ca2f9',
      light: '#74d3ff',
      dark: '#0074c6'
    }
  }
});

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <Router>
          <MuiThemeProvider theme={theme}>
            <div className="app">
              <Header/>
              <HeaderBarContainer />
              <Switch>
                {/* { routes.map((route, i) => routeWithSubRoutes(route, i)) } */}
                { routes.map((route, i) => createRouteWithHook(route, i)) }
              </Switch>
              <Player/>
              <DetailPlayer/>
            </div>
          </MuiThemeProvider>
        </Router>  
      </Provider>
    );
  }
}

export default App;

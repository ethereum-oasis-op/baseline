import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Partners from './pages/Partners';

const App = () => (
  <Switch>
    <Route exact path="/" component={Dashboard} />
    <Route exact path="/partners" component={Partners} />
  </Switch>
);

export default App;

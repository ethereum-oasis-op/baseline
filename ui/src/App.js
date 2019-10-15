import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Partner from './pages/Partner';
import RFQ from './pages/RFQ';
import Invoice from './pages/Invoice';
import NoMatch from './pages/NoMatch';
import Who from './pages/Who';
import What from './pages/What';
import How from './pages/How';
import PurchaseOrder from './pages/PurchaseOrder';
import { useUser } from './contexts/user-context';

const App = () => (
  <div>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/who" component={Who} />
      <Route exact path="/what" component={What} />
      <Route exact path="/how" component={How} />
      <AuthenticatedRoute path="/rfq" component={RFQ} />
      <AuthenticatedRoute exact path="/partner" component={Partner} />
      <AuthenticatedRoute exact path="/invoice" component={Invoice} />
      <AuthenticatedRoute exact path="/purchaseorder" component={PurchaseOrder} />
      <Route component={NoMatch} />
    </Switch>
  </div>
);

const AuthenticatedRoute = ({ component: Component, ...rest }) => {
  const { user } = useUser();

  return (
    <Route {...rest} render={props => (user ? <Component {...props} /> : <Redirect to="/" />)} />
  );
};

AuthenticatedRoute.propTypes = {
  component: PropTypes.node.isRequired,
};

export default App;

import React, { useContext, useMemo } from 'react';
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
import Installation from './installation';
import Loading from './components/Loading';
import { useUser } from './contexts/user-context';
import { ServerSettingsContext } from './contexts/server-settings-context';

const App = () => {
  const { state, loading } = useContext(ServerSettingsContext);

  return useMemo(() => {
    if (loading && !state) { return <Loading /> }

    if (state !== 'ready') {
      return (
        <Installation state={state} />
      );
    } else {
      return (
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/who" component={Who} />
            <Route exact path="/what" component={What} />
            <Route exact path="/how" component={How} />
            <Route path="/rfq" component={RFQ} />
            <AuthenticatedRoute exact path="/partner" component={Partner} />
            <AuthenticatedRoute exact path="/invoice" component={Invoice} />
            <AuthenticatedRoute exact path="/purchaseorder" component={PurchaseOrder} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      )
    }
  }, [state, loading])
};

const AuthenticatedRoute = ({ component: Component, ...rest }) => {
  const { user } = useUser();

  return (
    <Route {...rest} render={props => (user ? <Component {...props} /> : <Redirect to="/" />)} />
  );
};

AuthenticatedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default App;

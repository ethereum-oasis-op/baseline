import React, { useContext, useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';
import Partner from './pages/Partner';
import RFQ from './pages/RFQ';
import Invoice from './pages/Invoice';
import NoMatch from './pages/NoMatch';
import Who from './pages/Who';
import What from './pages/What';
import How from './pages/How';
import MessagesList from './pages/MessagesList';
import PurchaseOrder from './pages/PurchaseOrder';
import Installation from './installation';
import Loading from './components/Loading';
import { ServerSettingsContext } from './contexts/server-settings-context';

const App = () => {
  const { state, loading } = useContext(ServerSettingsContext);

  return useMemo(() => {
    if (loading && !state) {
      return <Loading />;
    }

    if (state !== 'ready') {
      return <Installation state={state} />;
    }
    return (
      <div>
        <Switch>
          <Route exact path="/" component={MessagesList} />
          <Route exact path="/who" component={Who} />
          <Route exact path="/what" component={What} />
          <Route exact path="/how" component={How} />
          <Route path="/rfq" component={RFQ} />
          <Route exact path="/partner" component={Partner} />
          <Route exact path="/invoice" component={Invoice} />
          <Route exact path="/purchaseorder" component={PurchaseOrder} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    );
  }, [state, loading]);
};

export default App;

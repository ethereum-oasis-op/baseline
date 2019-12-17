import React, { useContext, useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';
import Partner from './pages/Partner';
import NoMatch from './pages/NoMatch';
import Who from './pages/Who';
import What from './pages/What';
import How from './pages/How';

import MessagesList from './pages/MessagesList';
import PurchaseOrder from './pages/PurchaseOrder';
import RFQ from './pages/RFQ';
import Invoice from './pages/Invoice';
import MSA from './pages/MSA';
import CreateRFQ from './pages/CreateRFQ';
import CreateQuote from './pages/CreateQuote';

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
          <Route exact path="/messages/:category" component={MessagesList} />
          <Route exact path="/who" component={Who} />
          <Route exact path="/what" component={What} />
          <Route exact path="/how" component={How} />
          <Route exact path="/partner" component={Partner} />
          <Route path="/quote/:rfqId/create/" component={CreateQuote} />
          <Route path="/rfq/create" component={CreateRFQ} />
          <Route path="/rfq/:id" component={RFQ} />
          <Route path="/invoice/:id" component={Invoice} />
          <Route path="/purchaseorder/:id" component={PurchaseOrder} />
          <Route path="/msa/:id" component={MSA} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    );
  }, [state, loading]);
};

export default App;

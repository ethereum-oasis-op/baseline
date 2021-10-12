import React, { useContext, useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';
import Partner from './pages/Partner';
import NoMatch from './pages/NoMatch';
import Who from './pages/Who';
import What from './pages/What';
import How from './pages/How';

import NoticesList from './pages/NoticesList';
import PurchaseOrder from './pages/PurchaseOrder';
import RFP from './pages/RFP';
import Invoice from './pages/Invoice';
import MSA from './pages/MSA';
import CreateRFP from './pages/CreateRFP';
import ProposalDetail from './pages/ProposalDetail';
import CreatePurchaseOrder from './pages/CreatePurchaseOrder';

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
          <Route exact path="/" component={NoticesList} />
          <Route exact path="/notices/:category" component={NoticesList} />
          <Route exact path="/who" component={Who} />
          <Route exact path="/what" component={What} />
          <Route exact path="/how" component={How} />
          <Route exact path="/partners" component={Partner} />
          <Route path="/rfp/create" component={CreateRFP} />
          <Route path="/rfp/:id" component={RFP} />
          <Route path="/proposal/:id" component={ProposalDetail} />
          <Route path="/invoice/:id" component={Invoice} />
          <Route path="/purchase-order/create" component={CreatePurchaseOrder} />
          <Route path="/purchase-order/:id" component={PurchaseOrder} />
          <Route path="/contracts/:id" component={MSA} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    );
  }, [state, loading]);
};

export default App;

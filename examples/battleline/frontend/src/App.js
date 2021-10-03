import { Router } from "react-router-dom";
import Routes from "./Routes";
import { createBrowserHistory } from "history";

function App() {
  const history = createBrowserHistory();
  return (
    <Router history={history}>
      <Routes />
    </Router>
  );
}

export default App;

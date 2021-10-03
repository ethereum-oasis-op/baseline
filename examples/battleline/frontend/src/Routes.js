import { Route, Switch } from "react-router-dom";
import { BattlelineLocation, RootLocation } from "./Locations";
import Home from "./views/Home";
import Game from "./views/Game";

const ROUTES = [
  {
    component: Home,
    exact: true,
    path: RootLocation,
  },
  {
    component: Game,
    exact: true,
    path: BattlelineLocation,
  },
];

export default function Routes() {
  return (
    <Switch>
      {ROUTES.map(({ component, exact, path }) => (
        <Route component={component} exact={exact} path={path} />
      ))}
    </Switch>
  );
}

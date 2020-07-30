import { hot } from "react-hot-loader/root";
import React from "react";
import ReactDOM from "react-dom";
import { store } from "./store";
import { Provider as ReduxProvider } from "react-redux";
import { IndexRoute, UnknownRoute } from "common-controls/Core/index";
import { compose, WithRedux, ah } from "common-data/datahelper";
import { Router, globalHistory } from "@reach/router";
import { SnackbarProvider } from "notistack";

import "./SplitPane.css";

import { ParseDemo } from "common-views/ParseDemo/ParseDemo";
import { GenerateDemo } from "common-views/GenerateDemo/GenerateDemo";

class MainPlain extends React.Component {
  onRouteChanged = (history) => {
    const { RouterSetNewLocation } = this.props;
    RouterSetNewLocation(
      history.location.pathname,
      history.location.search,
      history.location.hash
    );
  };

  componentDidMount() {
    this.historyUnsubscribe = globalHistory.listen(this.onRouteChanged);
    this.onRouteChanged(window);
  }

  componentWillUnmount() {
    this.historyUnsubscribe();
  }

  render() {
    return (
      <Router>
        <IndexRoute path="/" to="Demo/Parse" />
        <ParseDemo path="Demo/Parse" />
        <GenerateDemo path="Demo/Generate" />
        <UnknownRoute default />
      </Router>
    );
  }
}

const Main = compose(hot, WithRedux([], [ah.Router.SetNewLocation]))(MainPlain);

ReactDOM.render(
  <ReduxProvider store={store}>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Main />
    </SnackbarProvider>
  </ReduxProvider>,
  document.getElementById("content")
);

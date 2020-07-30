import React from "react";
import { Redirect } from "@reach/router";

export class IndexRoute extends React.Component {
  render() {
    const { to, path } = this.props;

    return <Redirect noThrow to={to} from={path} />;
  }
}

export default IndexRoute;

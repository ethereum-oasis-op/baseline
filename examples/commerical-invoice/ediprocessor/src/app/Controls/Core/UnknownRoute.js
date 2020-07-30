import React from "react";

export class UnknownRoute extends React.Component {
  render() {
    const { location, uri, children } = this.props;

    return (
      <div>
        {children || (
          <div>
            <h2>Hmm... well that {"didn't"} work</h2>
            <p>It seems the location you are looking for is not available</p>
            <h4>
              <b>Path: </b>
              {location.pathname}
            </h4>
            <h4>
              <b>Match: </b>
              {uri}
            </h4>
          </div>
        )}
      </div>
    );
  }
}

export default UnknownRoute;

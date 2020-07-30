import React from "react";
import _ from "lodash";
import { comparePaths } from "common-tools/index";

export class OutputViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      renderLines: [],
    };
  }

  componentDidMount() {
    const { edi = "" } = this.props;
    this.setState({
      renderLines: _.split(edi, "~"),
    });
  }

  componentDidUpdate(prevProps) {
    const edi = comparePaths("edi", this.props, prevProps, "");

    if (edi.HasChanged) {
      this.setState({
        renderLines: _.split(edi.Current, "~"),
      });
    }
  }

  render() {
    const { renderLines } = this.state;

    return (
      <ul>
        {_.map(renderLines, (rl) => (
          <li>{rl}~</li>
        ))}
      </ul>
    );
  }
}

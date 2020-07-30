import React from "react";

export class OutputViewer extends React.Component {
  render() {
    const { html = "" } = this.props;

    return (
      <div>
        {html.indexOf("</") !== -1 ? (
          <div
            style={{ overflow: "auto" }}
            dangerouslySetInnerHTML={{
              __html: html.replace(/(<? *script)/gi, "illegalscript"),
            }}
          ></div>
        ) : (
          html
        )}
      </div>
    );
  }
}

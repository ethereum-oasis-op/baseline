import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { compose } from "redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SplitPane from "react-split-pane";
import { WithMessageBus, WithQuery } from "common-tools/index";
import { OutputViewer } from "./OutputViewer";
import { TemplateEditor, TemplateEditorChannels } from "./TemplateEditor";
import { DataEditor, DataEditorChannels } from "./DataEditor";

const styles = (theme) => ({
  root: {
    display: "grid",
    height: "100vh",
    width: "100vw",
    gridTemplateRows: "max-content 1fr",
    gridAutoColumns: "1fr",
    gridTemplateAreas: '"topBar" "body"',
    position: "relative",
    boxSizing: "border-box",
  },
  topBar: {
    gridArea: "topBar",
    position: "relative",
  },
  body: {
    gridArea: "body",
    position: "relative",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});

export class GenerateDemoPlain extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Template: "",
      Data: "",
      VSplit: 0,
      HSplit: 0,
      Output: "",
    };
  }

  onNewMessage = (message) => {
    // eslint-disable-next-line default-case
    switch (message.Name) {
      case DataEditorChannels.DataUpdate:
      case TemplateEditorChannels.TemplateUpdate:
        this.updateOuptputPreview();
        break;
    }
  };

  updateOuptputPreview = () => {
    const { GenearteEDI } = this.props;
    const { Data, Template } = this.state;
    try {
      GenearteEDI({ Script: Template, Data: JSON.parse(Data) }).then(
        ({ data }) => {
          try {
            this.setState({
              Output: data,
            });
          } catch (jerr) {
            this.setState({
              Output: jerr.message,
            });
          }
        }
      );
    } catch (err) {
      this.setState({
        Output: err.message,
      });
    }
  };

  onSplitResize = (name, newSize) => {
    this.setState({
      [`${name}Split`]: newSize || 0,
    });
  };

  render() {
    const { classes } = this.props;
    const { Template, VSplit = 0, HSplit = 0, Data, Output } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.topBar}>
          <AppBar position="relative">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                (X12POC) React/Node EDI Generator
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
        <div className={classes.body}>
          <SplitPane
            split="vertical"
            onDragFinished={this.onSplitResize.bind(this, "V")}
            minSize={"100px"}
            defaultSize={"50%"}
          >
            <OutputViewer edi={Output} />
            <SplitPane
              split="horizontal"
              onDragFinished={this.onSplitResize.bind(this, "H")}
              minSize={"100px"}
              defaultSize={"50%"}
            >
              <TemplateEditor
                value={Template}
                splitSize={VSplit + HSplit}
                onChange={(val) => {
                  this.setState({ Template: val });
                }}
              />
              <DataEditor
                value={Data}
                splitSize={VSplit + HSplit}
                onChange={(val) => {
                  this.setState({ Data: val });
                }}
              />
            </SplitPane>
          </SplitPane>
        </div>
      </div>
    );
  }
}

export const GenerateDemo = compose(
  withStyles(styles),
  WithQuery({
    stateKey: "GenerateDemo",
    actions: [
      {
        url: "/Services/EDI/Generate",
        prop: "GenearteEDI",
      },
    ],
  }),
  WithMessageBus({
    channels: [
      DataEditorChannels.DataUpdate,
      TemplateEditorChannels.TemplateUpdate,
    ],
  })
)(GenerateDemoPlain);

export default GenerateDemoPlain;

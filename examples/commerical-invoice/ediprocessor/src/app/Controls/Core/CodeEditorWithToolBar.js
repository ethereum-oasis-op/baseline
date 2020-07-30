import React from "react";
import { CodeEditor } from "./CodeEditor";
import { TopBarAndBody } from "../Styles/TopBarAndBody";
import { withStyles } from "@material-ui/core/styles";
import { compose } from "redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import _ from "lodash";
import { Typography } from "@material-ui/core";

const styles = (theme) => ({
  ...TopBarAndBody,
  menuButton: {
    marginRight: theme.spacing(2),
    padding: "5px",
  },
  appBar: {
    backgroundColor: "#CDCDCD",
    minHeight: "35px",
  },
  appToolBar: {
    minHeight: "35px",
    paddingLeft: "10px",
    paddingRight: "10px",
    justifyContent: "space-between",
  },
  codeWindowWrapper: {
    height: "100%",
    width: "100%",
    position: "relative",
  },
  middle: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

class CodeEditorWithToolBarPlain extends React.Component {
  render() {
    const { title, actions = [], className, ...rest } = this.props;

    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.topBar}>
          <AppBar className={classes.appBar} position="relative">
            <Toolbar variant="dense" className={classes.appToolBar}>
              <Typography varient="h6">{title}</Typography>
              <div>
                {_.map(actions, (a, i) => (
                  <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                  >
                    {a}
                  </IconButton>
                ))}
              </div>
            </Toolbar>
          </AppBar>
        </div>
        <div className={classes.body}>
          <CodeEditor {...rest} className={classes.codeWindowWrapper} />
        </div>
      </div>
    );
  }
}

export const CodeEditorWithToolBar = compose(withStyles(styles))(
  CodeEditorWithToolBarPlain
);

export default CodeEditorWithToolBar;

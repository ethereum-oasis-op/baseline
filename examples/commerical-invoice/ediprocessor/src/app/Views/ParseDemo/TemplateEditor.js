import React from "react";
import CodeEditor from "common-controls/Core/CodeEditorWithToolBar";
import SaveIcon from "@material-ui/icons/Save";
import {
  BuildMessageBusChannels,
  SendBusMessage,
} from "common-tools/MessageBusHelper";

export const TemplateEditorChannels = BuildMessageBusChannels(
  "ParseTemplateEditor",
  ["TemplateUpdate"]
);

export class TemplateEditor extends React.Component {
  onSave = () => {
    SendBusMessage(TemplateEditorChannels.NewTemplateUpdate());
  };

  renderActions = () => {
    return [<SaveIcon key="save" onClick={this.onSave} />];
  };

  render() {
    const { onChange, splitSize, value } = this.props;
    return (
      <CodeEditor
        title="Script"
        onChange={onChange}
        value={value}
        mode="javascript"
        splitSize={splitSize}
        actions={this.renderActions()}
      />
    );
  }
}

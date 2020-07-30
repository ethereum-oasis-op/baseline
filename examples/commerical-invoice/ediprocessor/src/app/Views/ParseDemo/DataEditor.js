import React from "react";
import CodeEditor from "common-controls/Core/CodeEditorWithToolBar";
import SaveIcon from "@material-ui/icons/Save";
import {
  BuildMessageBusChannels,
  SendBusMessage,
} from "common-tools/MessageBusHelper";

export const DataEditorChannels = BuildMessageBusChannels("ParseDataEditor", [
  "DataUpdate",
]);

export class DataEditor extends React.Component {
  onSave = () => {
    SendBusMessage(DataEditorChannels.NewDataUpdate());
  };

  renderActions = () => {
    return [<SaveIcon key="save" onClick={this.onSave} />];
  };

  render() {
    const { onChange, splitSize, value } = this.props;
    return (
      <CodeEditor
        title="EDI Data"
        onChange={onChange}
        value={value}
        splitSize={splitSize}
        actions={this.renderActions()}
      />
    );
  }
}

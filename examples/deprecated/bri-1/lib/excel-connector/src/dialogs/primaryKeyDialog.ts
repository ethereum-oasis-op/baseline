import { alerts } from "../common/alerts";
import { closeCanceledDialog, closeSuccessDialog, getDialogData } from "./dialogs";
import { PrimaryKeyDialogUrl } from "./dialogs-helpers";
import { PrimaryKeyInputData } from "./models/primary-key-input-data";
import * as $ from "jquery";

import "bootstrap/dist/css/bootstrap.min.css";
import "../taskpane/taskpane.css";

// eslint-disable-next-line no-unused-vars
/* global Excel, OfficeExtension, Office */

Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    $(function () {
      $("#ok-btn").on("click", onOkClick);
      $("#close-btn").on("click", onCancelClick);

      const data = getDialogData(PrimaryKeyDialogUrl);
      if (data && data.data) {
        $("#primary-key-txt").val(data.data);
      }

      $("#primary-key-input-dialog").show();
    });
  }
});

function onOkClick() {
  const $form = $("form");
  const formData = new PrimaryKeyInputData($form);
  const isValid = formData.isValid();
  if (isValid === true) {
    closeSuccessDialog(formData);
    formData.clean();
  } else {
    alerts.error(<string>isValid);
  }
}

function onCancelClick() {
  closeCanceledDialog();
}

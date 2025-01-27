// NOTE: Common functions and structs of dialogs

import { alerts } from "../common/alerts";

/* global Office */
export enum DialogEvent {
  // eslint-disable-next-line no-unused-vars
  Ok,
  // eslint-disable-next-line no-unused-vars
  Cancel,
}

export function closeCanceledDialog() {
  Office.context.ui.messageParent(
    JSON.stringify({
      result: DialogEvent.Cancel,
    })
  );
}

export function closeSuccessDialog(data: any) {
  Office.context.ui.messageParent(
    JSON.stringify({
      result: DialogEvent.Ok,
      data: data,
    })
  );
}

export function getDialogData(key: string): any {
  try {
    const dataStr = localStorage.getItem(key);
    if (dataStr) {
      localStorage.removeItem(key);
      const data = JSON.parse(dataStr);
      return data;
    }
  } catch (e) {
    alerts.error(e);
  }
}

interface DialogOptions {
  height?: number;
  width?: number;
}

export function showDialog<TOutputData>(url: string, opts: DialogOptions, data?: any): Promise<TOutputData> {
  const dialogOpts = Object.assign(
    {
      displayInIframe: true,
    },
    opts
  );

  // NOTE: Use localStorage to transfer data to dialog (messageChild doesn't work in desktop Excel)
  localStorage.setItem(url, JSON.stringify(data));

  return new Promise((resolve, reject) => {
    Office.context.ui.displayDialogAsync(url, dialogOpts, (result: Office.AsyncResult<Office.Dialog>) => {
      const dialog = result.value;
      dialog.addEventHandler(
        Office.EventType.DialogMessageReceived,
        (args: { message: string | boolean } | { error: number }) => {
          try {
            const dialogResult = JSON.parse(args + "");
            switch (dialogResult.result) {
              case DialogEvent.Ok: {
                dialog.close();
                const jwtInput = dialogResult.data as TOutputData;
                resolve(jwtInput);
                break;
              }

              case DialogEvent.Cancel: {
                dialog.close();
                reject();
                break;
              }
            }
          } catch (e) {
            alerts.error(e);
          }
        }
      );
      dialog.addEventHandler(Office.EventType.DialogEventReceived, (args: { error: number }) => {
        if (args.error === 12006 /*(dialog closed by user)*/) {
          return;
        }

        if (args.error) {
          alerts.error("Dialog error - " + (args.error + ""));
          reject();
        }
      });
    });
  });
}

export function showPKDialog<TOutputData>(url: string, opts: DialogOptions, data?: any): Promise<TOutputData> {
  const dialogOpts = Object.assign(
    {
      displayInIframe: true,
    },
    opts
  );

  // NOTE: Use localStorage to transfer data to dialog (messageChild doesn't work in desktop Excel)
  localStorage.setItem(url, JSON.stringify(data));

  return new Promise((resolve, reject) => {
    Office.context.ui.displayDialogAsync(url, dialogOpts, (result: Office.AsyncResult<Office.Dialog>) => {
      const dialog = result.value;
      dialog.addEventHandler(
        Office.EventType.DialogMessageReceived,
        (args: { message: string | boolean } | { error: number }) => {
          try {
            const dialogResult = JSON.parse(args + "");
            switch (dialogResult.result) {
              case DialogEvent.Ok: {
                dialog.close();
                const primaryKeyInput = dialogResult.data as TOutputData;
                resolve(primaryKeyInput);
                break;
              }

              case DialogEvent.Cancel: {
                dialog.close();
                reject();
                break;
              }
            }
          } catch (e) {
            alerts.error(e);
          }
        }
      );
      dialog.addEventHandler(Office.EventType.DialogEventReceived, (args: { error: number }) => {
        if (args.error === 12006 /*(dialog closed by user)*/) {
          return;
        }

        if (args.error) {
          alerts.error("Dialog error - " + (args.error + ""));
          reject();
        }
      });
    });
  });
}

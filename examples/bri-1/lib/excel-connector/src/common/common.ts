import { alerts, spinnerOff } from "./alerts";

export function onError(reason: any) {
  let message = reason.toString();
  console.log(message);
  if (message.indexOf("Error: ") == 0) {
    message = message.substring("Error: ".length);
  }

  alerts.error(message);
  spinnerOff();
}

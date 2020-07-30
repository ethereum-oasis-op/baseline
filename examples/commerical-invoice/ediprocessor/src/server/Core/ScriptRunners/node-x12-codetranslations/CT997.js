// Translate TA1 Code
export const TranslateTA1Code = (code) => {
  let statuscode;
  switch (code) {
    case "A":
      statuscode = "Interchange accepted with no errors.";
      break;
    case "R":
      statuscode =
        "Interchange rejected because of errors. Sender must resubmit file.";
      break;
    case "E":
      statuscode =
        "Interchange accepted, but errors are noted. Sender must not resubmit file.";
      break;
  }
  return statuscode;
};

// Translate Code
export const TranslateAKCode = (code) => {
  let statuscode;
  switch (code) {
    case "A":
      statuscode = "Accepted";
      break;
    case "E":
      statuscode = "Accepted but errors were notes";
      break;
    case "M":
      statuscode = "Rejected, Message Authentication Code (MAC) failed";
      break;
    case "R":
      statuscode = "Rejected";
      break;
    case "W":
      statuscode = "Rejected, assurance failed validity tests";
      break;
    case "X":
      statuscode = "Rejected, content after decryption could not be analyzed";
      break;
  }
  return statuscode;
};

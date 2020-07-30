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

// Translate AK Code
export const TranslateAKCode = (code) => {
  let statuscode;
  switch (code) {
    case "A":
      statuscode = "Accepted";
      break;
    case "E":
      statuscode = "Accepted but errors were noted";
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

// Translate IK304 Code
export const TranslateIK304Code = (code) => {
  let statuscode;
  switch (code) {
    case "1":
      statuscode = "Unrecognized segment ID";
      break;
    case "2":
      statuscode = "Unexpected segment";
      break;
    case "3":
      statuscode = "Required Segment Missing";
      break;
    case "4":
      statuscode = "Loop Occurs Over Maximum Times";
      break;
    case "5":
      statuscode = "Segment Exceeds Maximum Use";
      break;
    case "6":
      statuscode = "Segment Not in Defined Transaction Set";
      break;
    case "7":
      statuscode = "Segment Not in Proper Sequence";
      break;
    case "8":
      statuscode = "Segment Has Data Element Errors";
      break;
    case "I4":
      statuscode = "Implementation 'Not Used' Segment Present";
      break;
    case "I6":
      statuscode = "Implementation Dependent Segment Missing";
      break;
    case "I7":
      statuscode = "Implementation Loop Occurs Under Minimum Times";
      break;
    case "I8":
      statuscode = "Implementation Segment Below Minimum Use";
      break;
    case "I9":
      statuscode = "Implementation Dependent 'Not Used' Segment Present";
      break;
  }
  return statuscode;
};

// Translate IK403 Code
export const TranslateIK403Code = (code) => {
  let statuscode;
  switch (code) {
    case "1":
      statuscode =
        "Required Data Element Missing 999-X231 (005010X231A1) 15 August 12, 2011";
      break;
    case "2":
      statuscode = "Conditional Required Data Element Missing";
      break;
    case "3":
      statuscode = "Too Many Data Elements";
      break;
    case "4":
      statuscode = "Data Element Too Short";
      break;
    case "5":
      statuscode = "Data Element Too Long";
      break;
    case "6":
      statuscode = "Invalid Character In Data Element";
      break;
    case "7":
      statuscode = "Invalid Code Value";
      break;
    case "8":
      statuscode = "Invalid Date";
      break;
    case "9":
      statuscode = "Invalid Time";
      break;
    case "10":
      statuscode = "Exclusion Condition Violated";
      break;
    case "12":
      statuscode = "Too Many Repetitions";
      break;
    case "13":
      statuscode = "Too Many Components";
      break;
    case "I10":
      statuscode = "Implementation 'Not Used' Data Element Present";
      break;
    case "I11":
      statuscode = "Implementation Too Few Repetitions";
      break;
    case "I12":
      statuscode = "Implementation Pattern Match Failure";
      break;
    case "I13":
      statuscode = "Implementation Dependent 'Not Used' Data Element Present";
      break;
    case "I6":
      statuscode = "Code Value Not Used in Implementation";
      break;
    case "I9":
      statuscode = "Implementation Dependent Data Element Missing";
      break;
  }
  return statuscode;
};

// Translate IK501 Code
export const TranslateIK501Code = (code) => {
  let statuscode;
  switch (code) {
    case "A":
      statuscode = "Accepted";
      break;
    case "E":
      statuscode = "Accepted but errors were noted";
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

// Translate IK502-06 Code
export const TranslateIK502Range06Code = (code) => {
  let statuscode;
  switch (code) {
    case "1":
      statuscode = "Transaction Set Not Supported";
      break;
    case "2":
      statuscode = "Transaction Set Trailer Missing";
      break;
    case "3":
      statuscode =
        "Transaction Set Control Number in Header and Trailer Do Not Match";
      break;
    case "4":
      statuscode = "Number of Included Segments Does Not Match Actual Count";
      break;
    case "5":
      statuscode = "One or More Segments in Error";
      break;
    case "6":
      statuscode = "Missing or Invalid Transaction Set Identifier";
      break;
    case "7":
      statuscode = "Missing or Invalid Transaction Set Control Number";
      break;
    case "8":
      statuscode = "Authentication Key Name Unknown";
      break;
    case "9":
      statuscode =
        "Encryption Key Name Unknown10 Requested Service (Authentication or Encrypted) Not Available";
      break;
    case "11":
      statuscode = "Unknown Security Recipient";
      break;
    case "12":
      statuscode = "Incorrect Message Length (Encryption Only)";
      break;
    case "13":
      statuscode = "Message Authentication Code Failed";
      break;
    case "15":
      statuscode = "Unknown Security Originator";
      break;
    case "16":
      statuscode = "Syntax Error in Decrypted Text";
      break;
    case "17":
      statuscode = "Security Not Supported";
      break;
    case "18":
      statuscode =
        "Transaction Set not in Functional Group 999-X231 (005010X231A1) 19 August 12, 2011";
      break;
    case "19":
      statuscode =
        "Invalid Transaction Set Implementation Convention Reference";
      break;
    case "23":
      statuscode =
        "Transaction Set Control Number Not Unique within the Functional Group";
      break;
    case "24":
      statuscode =
        "S3E Security End Segment Missing for S3S Security Start Segment";
      break;
    case "25":
      statuscode =
        "S3S Security Start Segment Missing for S3E Security End Segment";
      break;
    case "26":
      statuscode =
        "S4E Security End Segment Missing for S4S Security Start Segment";
      break;
    case "27":
      statuscode =
        "S4S Security Start Segment Missing for S4E Security End Segment";
      break;
    case "I5":
      statuscode = "Implemenation One or More Segments in Error";
      break;
    case "I6":
      statuscode = "Implementation Convention Not Supported";
      break;
  }
  return statuscode;
};

// Translate AK9 Code
export const TranslateAK9Code = (code) => {
  let statuscode;
  switch (code) {
    case "1":
      statuscode = "Functional Group Not Supported";
      break;
    case "2":
      statuscode = "Functional Group Version Not Supported";
      break;
    case "3":
      statuscode = "Functional Group Trailer Missing";
      break;
    case "4":
      statuscode =
        "Group Control Number in the Functional Group Header and Trailer Do Not Agree";
      break;
    case "5":
      statuscode =
        "Number of Included Transaction Sets Does Not Match Actual Count 999-X231 (005010X231A1) 23 August 12, 2011";
      break;
    case "6":
      statuscode = "Group Control Number Violates Syntax";
      break;
    case "10":
      statuscode = "Authentication Key Name Unknown";
      break;
    case "11":
      statuscode = "Encryption Key Name Unknown";
      break;
    case "12":
      statuscode =
        "Requested Service (Authentication or Encryption) Not Available";
      break;
    case "13":
      statuscode = "Unknown Security Recipient";
      break;
    case "14":
      statuscode = "Unknown Security Originator";
      break;
    case "15":
      statuscode = "Syntax Error in Decrypted Text";
      break;
    case "16":
      statuscode = "Security Not Supported";
      break;
    case "17":
      statuscode = "Incorrect Message Length (Encryption Only)";
      break;
    case "18":
      statuscode = "Message Authentication Code Failed";
      break;
    case "19":
      statuscode =
        "Functional Group Control Number not Unique within Interchange";
      break;
    case "23":
      statuscode =
        "S3E Security End Segment Missing for S3S Security Start Segment";
      break;
    case "24":
      statuscode = "S3S Security Start Segment Missing for S3E End Segment";
      break;
    case "25":
      statuscode =
        "S4E Security End Segment Missing for S4S Security Start Segment";
      break;
    case "26":
      statuscode =
        "S4S Security Start Segment Missing for S4E Security End Segment";
      break;
  }
  return statuscode;
};

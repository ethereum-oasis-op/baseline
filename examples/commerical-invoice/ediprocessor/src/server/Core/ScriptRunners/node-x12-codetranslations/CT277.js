// Translate Status Category Code
export const TranslateStatusCode = (code) => {
  let statuscode;
  switch (code) {
    case "A0":
      statuscode =
        "Acknowledgement/Forwarded-The claim/encounter has been forwarded to another entity.";
      break;
    case "A1":
      statuscode =
        "Acknowledgement/Receipt-The claim/encounter has been received. This does not mean that the claim has been accepted for adjudication.";
      break;
    case "A2":
      statuscode =
        "Acknowledgement/Acceptance into adjudication system-The claim/encounter has been accepted into the adjudication system.";
      break;
    case "A3":
      statuscode =
        "Acknowledgement/Returned as unprocessable claim-The claim/encounter has been rejected and has not been entered into the adjudication system.";
      break;
    case "A4":
      statuscode =
        "Acknowledgement/Not Found-The claim/encounter can not be found in the adjudication system.";
      break;
    case "A5":
      statuscode =
        "Acknowledgement/Split Claim-The claim/encounter has been split upon acceptance into the adjudication system.";
      break;
    case "A6":
      statuscode =
        "Acknowledgement/Rejected for Missing Information - The claim/encounter is missing the information specified in the Status details and has been rejected.";
      break;
    case "A7":
      statuscode =
        "Acknowledgement/Rejected for Invalid Information - The claim/encounter has invalid information as specified in the Status details and has been rejected.";
      break;
    case "A8":
      statuscode = "Acknowledgement / Rejected for relational field in error.";
      break;
    case "D0":
      statuscode =
        "Data Search Unsuccessful - The payer is unable to return status on the requested claim(s) based on the submitted search criteria.";
      break;
    case "E0":
      statuscode = "Response not possible - error on submitted request data";
      break;
    case "E1":
      statuscode = "Response not possible - System Status";
      break;
    case "E2":
      statuscode =
        "Information Holder is not responding; resubmit at a later time.";
      break;
    case "E3":
      statuscode = "Correction required - relational fields in error.";
      break;
    case "E4":
      statuscode =
        "Trading partner agreement specific requirement not met: Data correction required. (Note: A status code identifying the type of information requested must be sent)";
      break;
    case "F0":
      statuscode =
        "Finalized-The claim/encounter has completed the adjudication cycle and no more action will be taken.";
      break;
    case "F1":
      statuscode = "Finalized/Payment-The claim/line has been paid.";
      break;
    case "F2":
      statuscode = "Finalized/Denial-The claim/line has been denied.";
      break;
    case "F3":
      statuscode =
        "Finalized/Revised - Adjudication information has been changed";
      break;
    case "F3F":
      statuscode =
        "Finalized/Forwarded-The claim/encounter processing has been completed. Any applicable payment has been made and the claim/encounter has been forwarded to a subsequent entity as identified on the original claim or in this payer's records.";
      break;
    case "F3N":
      statuscode =
        "Finalized/Not Forwarded-The claim/encounter processing has been completed. Any applicable payment has been made. The claim/encounter has NOT been forwarded to any subsequent entity identified on the original claim.";
      break;
    case "F4":
      statuscode =
        "Finalized/Adjudication Complete - No payment forthcoming-The claim/encounter has been adjudicated and no further payment is forthcoming.";
      break;
    case "F5":
      statuscode = "Finalized/Cannot Process";
      break;
    case "P0":
      statuscode =
        "Pending: Adjudication/Details-This is a generic message about a pended claim. A pended claim is one for which no remittance advice has been issued, or only part of the claim has been paid.";
      break;
    case "P1":
      statuscode =
        "Pending/In Process-The claim or encounter is in the adjudication system.";
      break;
    case "P2":
      statuscode =
        "Pending/Payer Review-The claim/encounter is suspended and is pending review (e.g. medical review, repricing, Third Party Administrator processing).";
      break;
    case "P3":
      statuscode =
        "Pending/Provider Requested Information - The claim or encounter is waiting for information that has already been requested from the provider. (Note: A Claim Status Code identifying the type of information requested, must be reported)";
      break;
    case "P4":
      statuscode =
        "Pending/Patient Requested Information - The claim or encounter is waiting for information that has already been requested from the patient. (Note: A status code identifying the type of information requested must be sent)";
      break;
    case "P5":
      statuscode = "Pending/Payer Administrative/System hold";
      break;
    case "R0":
      statuscode =
        "Requests for additional Information/General Requests-Requests that don't fall into other R-type categories.";
      break;
    case "R1":
      statuscode =
        "Requests for additional Information/Entity Requests-Requests for information about specific entities (subscribers, patients, various providers).";
      break;
    case "R10":
      statuscode =
        "Requests for additional information – Support a filed grievance or appeal";
      break;
    case "R11":
      statuscode =
        "Requests for additional information – Pre-payment review of claims";
      break;
    case "R12":
      statuscode =
        "Requests for additional information – Clarification or justification of use for specified procedure code";
      break;
    case "R13":
      statuscode =
        "Requests for additional information – Original documents submitted are not readable. Used only for subsequent request(s).";
      break;
    case "R14":
      statuscode =
        "Requests for additional information – Original documents received are not what was requested. Used only for subsequent request(s).";
      break;
    case "R15":
      statuscode =
        "Requests for additional information – Workers Compensation coverage determination.";
      break;
    case "R16":
      statuscode =
        "Requests for additional information – Eligibility determination";
      break;
    case "R3":
      statuscode =
        "Requests for additional Information/Claim/Line-Requests for information that could normally be submitted on a claim.";
      break;
    case "R4":
      statuscode =
        "Requests for additional Information/Documentation-Requests for additional supporting documentation. Examples: certification, x-ray, notes.";
      break;
    case "R5":
      statuscode =
        "Request for additional information/more specific detail-Additional information as a follow up to a previous request is needed. The original information was received but is inadequate. More specific/detailed information is requested.";
      break;
    case "R6":
      statuscode =
        "Requests for additional information – Regulatory requirements";
      break;
    case "R7":
      statuscode =
        "Requests for additional information – Confirm care is consistent with Health Plan policy coverage";
      break;
    case "R8":
      statuscode =
        "Requests for additional information – Confirm care is consistent with health plan coverage exceptions";
      break;
    case "R9":
      statuscode =
        "Requests for additional information – Determination of medical necessity";
      break;
    case "RQ":
      statuscode =
        "General Questions (Yes/No Responses)-Questions that may be answered by a simple 'yes' or 'no'.";
      break;
  }
  return statuscode;
};

// Translate Status Code
export const TranslateStatusDescriptionCode = (code) => {
  let statuscode;
  switch (code) {
    case "0":
      statuscode = "Cannot provide further status electronically.";
      break;
    case "1":
      statuscode = "For more detailed information, see remittance advice.";
      break;
    case "2":
      statuscode = "More detailed information in letter.";
      break;
    case "3":
      statuscode = "Claim has been adjudicated and is awaiting payment cycle.";
      break;
    case "4":
      statuscode =
        "This is a subsequent request for information from the original request.";
      break;
    case "5":
      statuscode = "This is a final request for information.";
      break;
    case "6":
      statuscode = "Balance due from the subscriber.";
      break;
    case "7":
      statuscode = "Claim may be reconsidered at a future date.";
      break;
    case "8":
      statuscode = "No payment due to contract/plan provisions.";
      break;
    case "9":
      statuscode = "No payment will be made for this claim.";
      break;
    case "10":
      statuscode =
        "All originally submitted procedure codes have been combined.";
      break;
    case "11":
      statuscode =
        "Some originally submitted procedure codes have been combined.";
      break;
    case "12":
      statuscode =
        "One or more originally submitted procedure codes have been combined.";
      break;
    case "13":
      statuscode =
        "All originally submitted procedure codes have been modified.";
      break;
    case "14":
      statuscode =
        "Some all originally submitted procedure codes have been modified.";
      break;
    case "15":
      statuscode =
        "One or more originally submitted procedure code have been modified.";
      break;
    case "16":
      statuscode =
        "Claim/encounter has been forwarded to entity. Note: This code requires use of an Entity Code.";
      break;
    case "17":
      statuscode =
        "Claim/encounter has been forwarded by third party entity to entity. Note: This code requires use of an Entity Code.";
      break;
    case "18":
      statuscode =
        "Entity received claim/encounter, but returned invalid status. Note: This code requires use of an Entity Code.";
      break;
    case "19":
      statuscode =
        "Entity acknowledges receipt of claim/encounter. Note: This code requires use of an Entity Code.";
      break;
    case "20":
      statuscode = "Accepted for processing.";
      break;
    case "21":
      statuscode =
        "Missing or invalid information. Note: At least one other status code is required to identify the missing or invalid information.";
      break;
    case "22":
      statuscode = "... before entering the adjudication system.";
      break;
    case "23":
      statuscode =
        "Returned to Entity. Note: This code requires use of an Entity Code.";
      break;
    case "24":
      statuscode =
        "Entity not approved as an electronic submitter. Note: This code requires use of an Entity Code.";
      break;
    case "25":
      statuscode =
        "Entity not approved. Note: This code requires use of an Entity Code.";
      break;
    case "26":
      statuscode =
        "Entity not found. Note: This code requires use of an Entity Code.";
      break;
    case "27":
      statuscode = "Policy canceled.";
      break;
    case "28":
      statuscode = "Claim submitted to wrong payer.";
      break;
    case "29":
      statuscode = "Subscriber and policy number/contract number mismatched.";
      break;
    case "30":
      statuscode = "Subscriber and subscriber id mismatched.";
      break;
    case "31":
      statuscode = "Subscriber and policyholder name mismatched.";
      break;
    case "32":
      statuscode = "Subscriber and policy number/contract number not found.";
      break;
    case "33":
      statuscode = "Subscriber and subscriber id not found.";
      break;
    case "34":
      statuscode = "Subscriber and policyholder name not found.";
      break;
    case "35":
      statuscode = "Claim/encounter not found.";
      break;
    case "37":
      statuscode =
        "Predetermination is on file, awaiting completion of services.";
      break;
    case "38":
      statuscode = "Awaiting next periodic adjudication cycle.";
      break;
    case "39":
      statuscode = "Charges for pregnancy deferred until delivery.";
      break;
    case "40":
      statuscode = "Waiting for final approval.";
      break;
    case "41":
      statuscode = "Special handling required at payer site.";
      break;
    case "42":
      statuscode = "Awaiting related charges.";
      break;
    case "44":
      statuscode = "Charges pending provider audit.";
      break;
    case "45":
      statuscode = "Awaiting benefit determination.";
      break;
    case "46":
      statuscode = "Internal review/audit.";
      break;
    case "47":
      statuscode = "Internal review/audit - partial payment made.";
      break;
    case "48":
      statuscode = "Referral/authorization.";
      break;
    case "49":
      statuscode = "Pending provider accreditation review.";
      break;
    case "50":
      statuscode = "Claim waiting for internal provider verification.";
      break;
    case "51":
      statuscode = "Investigating occupational illness/accident.";
      break;
    case "52":
      statuscode = "Investigating existence of other insurance coverage.";
      break;
    case "53":
      statuscode =
        "Claim being researched for Insured ID/Group Policy Number error.";
      break;
    case "54":
      statuscode = "Duplicate of a previously processed claim/line.";
      break;
    case "55":
      statuscode = "Claim assigned to an approver/analyst.";
      break;
    case "56":
      statuscode = "Awaiting eligibility determination.";
      break;
    case "57":
      statuscode = "Pending COBRA information requested.";
      break;
    case "59":
      statuscode =
        "Information was requested by a non-electronic method. Note: At least one other status code is required to identify the requested information.";
      break;
    case "60":
      statuscode =
        "Information was requested by an electronic method. Note: At least one other status code is required to identify the requested information.";
      break;
    case "61":
      statuscode = "Eligibility for extended benefits.";
      break;
    case "64":
      statuscode = "Re-pricing information.";
      break;
    case "65":
      statuscode = "Claim/line has been paid.";
      break;
    case "66":
      statuscode = "Payment reflects usual and customary charges.";
      break;
    case "67":
      statuscode = "Payment made in full.";
      break;
    case "68":
      statuscode = "Partial payment made for this claim.";
      break;
    case "69":
      statuscode = "Payment reflects plan provisions.";
      break;
    case "70":
      statuscode = "Payment reflects contract provisions.";
      break;
    case "71":
      statuscode = "Periodic installment released.";
      break;
    case "72":
      statuscode = "Claim contains split payment.";
      break;
    case "73":
      statuscode =
        "Payment made to entity, assignment of benefits not on file. Note: This code requires use of an Entity Code.";
      break;
    case "78":
      statuscode = "Duplicate of an existing claim/line, awaiting processing.";
      break;
    case "81":
      statuscode = "Contract/plan does not cover pre-existing conditions.";
      break;
    case "83":
      statuscode = "No coverage for newborns.";
      break;
    case "84":
      statuscode = "Service not authorized.";
      break;
    case "85":
      statuscode =
        "Entity not primary. Note: This code requires use of an Entity Code.";
      break;
    case "86":
      statuscode = "Diagnosis and patient gender mismatch.";
      break;
    case "87":
      statuscode =
        "Denied: Entity not found. (Use code 26 with appropriate Claim Status category Code)";
      break;
    case "88":
      statuscode =
        "Entity not eligible for benefits for submitted dates of service. Note: This code requires use of an Entity Code.";
      break;
    case "89":
      statuscode =
        "Entity not eligible for dental benefits for submitted dates of service. Note: This code requires use of an Entity Code.";
      break;
    case "90":
      statuscode =
        "Entity not eligible for medical benefits for submitted dates of service. Note: This code requires use of an Entity Code.";
      break;
    case "91":
      statuscode =
        "Entity not eligible/not approved for dates of service. Note: This code requires use of an Entity Code.";
      break;
    case "92":
      statuscode =
        "Entity does not meet dependent or student qualification. Note: This code requires use of an Entity Code.";
      break;
    case "93":
      statuscode =
        "Entity is not selected primary care provider. Note: This code requires use of an Entity Code.";
      break;
    case "94":
      statuscode =
        "Entity not referred by selected primary care provider. Note: This code requires use of an Entity Code.";
      break;
    case "95":
      statuscode = "Requested additional information not received.";
      break;
    case "96":
      statuscode =
        "No agreement with entity. Note: This code requires use of an Entity Code.";
      break;
    case "97":
      statuscode =
        "Patient eligibility not found with entity. Note: This code requires use of an Entity Code.";
      break;
    case "98":
      statuscode = "Charges applied to deductible.";
      break;
    case "99":
      statuscode = "Pre-treatment review.";
      break;
    case "100":
      statuscode = "Pre-certification penalty taken.";
      break;
    case "101":
      statuscode = "Claim was processed as adjustment to previous claim.";
      break;
    case "102":
      statuscode = "Newborn's charges processed on mother's claim.";
      break;
    case "103":
      statuscode = "Claim combined with other claim(s).";
      break;
    case "104":
      statuscode =
        "Processed according to plan provisions (Plan refers to provisions that exist between the Health Plan and the Consumer or Patient)";
      break;
    case "105":
      statuscode = "Claim/line is capitated.";
      break;
    case "106":
      statuscode =
        "This amount is not entity's responsibility. Note: This code requires use of an Entity Code.";
      break;
    case "107":
      statuscode =
        "Processed according to contract provisions (Contract refers to provisions that exist between the Health Plan and a Provider of Health Care Services)";
      break;
    case "108":
      statuscode = "Coverage has been canceled for this entity. (Use code 27)";
      break;
    case "109":
      statuscode =
        "Entity not eligible. Note: This code requires use of an Entity Code.";
      break;
    case "110":
      statuscode = "Claim requires pricing information.";
      break;
    case "111":
      statuscode =
        "At the policyholder's request these claims cannot be submitted electronically.";
      break;
    case "112":
      statuscode = "Policyholder processes their own claims.";
      break;
    case "113":
      statuscode = "Cannot process individual insurance policy claims.";
      break;
    case "114":
      statuscode =
        "Claim/service should be processed by entity. Note: This code requires use of an Entity Code.";
      break;
    case "115":
      statuscode = "Cannot process HMO claims";
      break;
    case "116":
      statuscode = "Claim submitted to incorrect payer.";
      break;
    case "117":
      statuscode = "Claim requires signature-on-file indicator.";
      break;
    case "118":
      statuscode =
        "TPO rejected claim/line because payer name is missing. (Use status code 21 and status code 125 with entity code IN)";
      break;
    case "119":
      statuscode =
        "TPO rejected claim/line because certification information is missing. (Use status code 21 and status code 252)";
      break;
    case "120":
      statuscode =
        "TPO rejected claim/line because claim does not contain enough information. (Use status code 21)";
      break;
    case "121":
      statuscode =
        "Service line number greater than maximum allowable for payer.";
      break;
    case "122":
      statuscode =
        "Missing/invalid data prevents payer from processing claim. (Use CSC Code 21)";
      break;
    case "123":
      statuscode =
        "Additional information requested from entity. Note: This code requires use of an Entity Code.";
      break;
    case "124":
      statuscode =
        "Entity's name, address, phone and id number. Note: This code requires use of an Entity Code.";
      break;
    case "125":
      statuscode =
        "Entity's name. Note: This code requires use of an Entity Code.";
      break;
    case "126":
      statuscode =
        "Entity's address. Note: This code requires use of an Entity Code.";
      break;
    case "127":
      statuscode =
        "Entity's Communication Number. Note: This code requires use of an Entity Code.";
      break;
    case "128":
      statuscode =
        "Entity's tax id. Note: This code requires use of an Entity Code.";
      break;
    case "129":
      statuscode =
        "Entity's Blue Cross provider id. Note: This code requires use of an Entity Code.";
      break;
    case "130":
      statuscode =
        "Entity's Blue Shield provider id. Note: This code requires use of an Entity Code.";
      break;
    case "131":
      statuscode =
        "Entity's Medicare provider id. Note: This code requires use of an Entity Code.";
      break;
    case "132":
      statuscode =
        "Entity's Medicaid provider id. Note: This code requires use of an Entity Code.";
      break;
    case "133":
      statuscode =
        "Entity's UPIN. Note: This code requires use of an Entity Code.";
      break;
    case "134":
      statuscode =
        "Entity's CHAMPUS provider id. Note: This code requires use of an Entity Code.";
      break;
    case "135":
      statuscode =
        "Entity's commercial provider id. Note: This code requires use of an Entity Code.";
      break;
    case "136":
      statuscode =
        "Entity's health industry id number. Note: This code requires use of an Entity Code.";
      break;
    case "137":
      statuscode =
        "Entity's plan network id. Note: This code requires use of an Entity Code.";
      break;
    case "138":
      statuscode =
        "Entity's site id . Note: This code requires use of an Entity Code.";
      break;
    case "139":
      statuscode =
        "Entity's health maintenance provider id (HMO). Note: This code requires use of an Entity Code.";
      break;
    case "140":
      statuscode =
        "Entity's preferred provider organization id (PPO). Note: This code requires use of an Entity Code.";
      break;
    case "141":
      statuscode =
        "Entity's administrative services organization id (ASO). Note: This code requires use of an Entity Code.";
      break;
    case "142":
      statuscode =
        "Entity's license/certification number. Note: This code requires use of an Entity Code.";
      break;
    case "143":
      statuscode =
        "Entity's state license number. Note: This code requires use of an Entity Code.";
      break;
    case "144":
      statuscode =
        "Entity's specialty license number. Note: This code requires use of an Entity Code.";
      break;
    case "145":
      statuscode =
        "Entity's specialty/taxonomy code. Note: This code requires use of an Entity Code.";
      break;
    case "146":
      statuscode =
        "Entity's anesthesia license number. Note: This code requires use of an Entity Code.";
      break;
    case "147":
      statuscode =
        "Entity's qualification degree/designation (e.g. RN,PhD,MD). Note: This code requires use of an Entity Code.";
      break;
    case "148":
      statuscode =
        "Entity's social security number. Note: This code requires use of an Entity Code.";
      break;
    case "149":
      statuscode =
        "Entity's employer id. Note: This code requires use of an Entity Code.";
      break;
    case "150":
      statuscode =
        "Entity's drug enforcement agency (DEA) number. Note: This code requires use of an Entity Code.";
      break;
    case "152":
      statuscode = "Pharmacy processor number.";
      break;
    case "153":
      statuscode =
        "Entity's id number. Note: This code requires use of an Entity Code.";
      break;
    case "154":
      statuscode = "Relationship of surgeon & assistant surgeon.";
      break;
    case "155":
      statuscode =
        "Entity's relationship to patient. Note: This code requires use of an Entity Code.";
      break;
    case "156":
      statuscode = "Patient relationship to subscriber";
      break;
    case "157":
      statuscode =
        "Entity's Gender. Note: This code requires use of an Entity Code.";
      break;
    case "158":
      statuscode =
        "Entity's date of birth. Note: This code requires use of an Entity Code.";
      break;
    case "159":
      statuscode =
        "Entity's date of death. Note: This code requires use of an Entity Code.";
      break;
    case "160":
      statuscode =
        "Entity's marital status. Note: This code requires use of an Entity Code.";
      break;
    case "161":
      statuscode =
        "Entity's employment status. Note: This code requires use of an Entity Code.";
      break;
    case "162":
      statuscode =
        "Entity's health insurance claim number (HICN). Note: This code requires use of an Entity Code.";
      break;
    case "163":
      statuscode =
        "Entity's policy number. Note: This code requires use of an Entity Code.";
      break;
    case "164":
      statuscode =
        "Entity's contract/member number. Note: This code requires use of an Entity Code.";
      break;
    case "165":
      statuscode =
        "Entity's employer name, address and phone. Note: This code requires use of an Entity Code.";
      break;
    case "166":
      statuscode =
        "Entity's employer name. Note: This code requires use of an Entity Code.";
      break;
    case "167":
      statuscode =
        "Entity's employer address. Note: This code requires use of an Entity Code.";
      break;
    case "168":
      statuscode =
        "Entity's employer phone number. Note: This code requires use of an Entity Code.";
      break;
    case "169":
      statuscode = "Entity's employer id.";
      break;
    case "170":
      statuscode =
        "Entity's employee id. Note: This code requires use of an Entity Code.";
      break;
    case "171":
      statuscode =
        "Other insurance coverage information (health, liability, auto, etc.).";
      break;
    case "172":
      statuscode = "Other employer name, address and telephone number.";
      break;
    case "173":
      statuscode =
        "Entity's name, address, phone, gender, DOB, marital status, employment status and relation to subscriber. Note: This code requires use of an Entity Code.";
      break;
    case "174":
      statuscode =
        "Entity's student status. Note: This code requires use of an Entity Code.";
      break;
    case "175":
      statuscode =
        "Entity's school name. Note: This code requires use of an Entity Code.";
      break;
    case "176":
      statuscode =
        "Entity's school address. Note: This code requires use of an Entity Code.";
      break;
    case "177":
      statuscode =
        "Transplant recipient's name, date of birth, gender, relationship to insured.";
      break;
    case "178":
      statuscode = "Submitted charges.";
      break;
    case "179":
      statuscode = "Outside lab charges.";
      break;
    case "180":
      statuscode = "Hospital s semi-private room rate.";
      break;
    case "181":
      statuscode = "Hospital s room rate.";
      break;
    case "182":
      statuscode =
        "Allowable/paid from other entities coverage NOTE: This code requires the use of an entity code.";
      break;
    case "183":
      statuscode =
        "Amount entity has paid. Note: This code requires use of an Entity Code.";
      break;
    case "184":
      statuscode = "Purchase price for the rented durable medical equipment.";
      break;
    case "185":
      statuscode = "Rental price for durable medical equipment.";
      break;
    case "186":
      statuscode = "Purchase and rental price of durable medical equipment.";
      break;
    case "187":
      statuscode = "Date(s) of service.";
      break;
    case "188":
      statuscode = "Statement from-through dates.";
      break;
    case "189":
      statuscode = "Facility admission date";
      break;
    case "190":
      statuscode = "Facility discharge date";
      break;
    case "191":
      statuscode = "Date of Last Menstrual Period (LMP)";
      break;
    case "192":
      statuscode = "Date of first service for current series/symptom/illness.";
      break;
    case "193":
      statuscode = "First consultation/evaluation date.";
      break;
    case "194":
      statuscode = "Confinement dates.";
      break;
    case "195":
      statuscode = "Unable to work dates/Disability Dates.";
      break;
    case "196":
      statuscode = "Return to work dates.";
      break;
    case "197":
      statuscode = "Effective coverage date(s).";
      break;
    case "198":
      statuscode = "Medicare effective date.";
      break;
    case "199":
      statuscode = "Date of conception and expected date of delivery.";
      break;
    case "200":
      statuscode = "Date of equipment return.";
      break;
    case "201":
      statuscode = "Date of dental appliance prior placement.";
      break;
    case "202":
      statuscode = "Date of dental prior replacement/reason for replacement.";
      break;
    case "203":
      statuscode = "Date of dental appliance placed.";
      break;
    case "204":
      statuscode = "Date dental canal(s) opened and date service completed.";
      break;
    case "205":
      statuscode = "Date(s) dental root canal therapy previously performed.";
      break;
    case "206":
      statuscode =
        "Most recent date of curettage, root planing, or periodontal surgery.";
      break;
    case "207":
      statuscode = "Dental impression and seating date.";
      break;
    case "208":
      statuscode = "Most recent date pacemaker was implanted.";
      break;
    case "209":
      statuscode = "Most recent pacemaker battery change date.";
      break;
    case "210":
      statuscode = "Date of the last x-ray.";
      break;
    case "211":
      statuscode = "Date(s) of dialysis training provided to patient.";
      break;
    case "212":
      statuscode = "Date of last routine dialysis.";
      break;
    case "213":
      statuscode = "Date of first routine dialysis.";
      break;
    case "214":
      statuscode = "Original date of prescription/orders/referral.";
      break;
    case "215":
      statuscode = "Date of tooth extraction/evolution.";
      break;
    case "216":
      statuscode = "Drug information.";
      break;
    case "217":
      statuscode = "Drug name, strength and dosage form.";
      break;
    case "218":
      statuscode = "NDC number.";
      break;
    case "219":
      statuscode = "Prescription number.";
      break;
    case "220":
      statuscode = "Drug product id number. (Use code 218)";
      break;
    case "221":
      statuscode = "Drug days supply and dosage.";
      break;
    case "222":
      statuscode = "Drug dispensing units and average wholesale price (AWP).";
      break;
    case "223":
      statuscode = "Route of drug/myelogram administration.";
      break;
    case "224":
      statuscode = "Anatomical location for joint injection.";
      break;
    case "225":
      statuscode = "Anatomical location.";
      break;
    case "226":
      statuscode = "Joint injection site.";
      break;
    case "227":
      statuscode = "Hospital information.";
      break;
    case "228":
      statuscode = "Type of bill for UB claim";
      break;
    case "229":
      statuscode = "Hospital admission source.";
      break;
    case "230":
      statuscode = "Hospital admission hour.";
      break;
    case "231":
      statuscode = "Hospital admission type.";
      break;
    case "232":
      statuscode = "Admitting diagnosis.";
      break;
    case "233":
      statuscode = "Hospital discharge hour.";
      break;
    case "234":
      statuscode = "Patient discharge status.";
      break;
    case "235":
      statuscode = "Units of blood furnished.";
      break;
    case "236":
      statuscode = "Units of blood replaced.";
      break;
    case "237":
      statuscode = "Units of deductible blood.";
      break;
    case "238":
      statuscode = "Separate claim for mother/baby charges.";
      break;
    case "239":
      statuscode = "Dental information.";
      break;
    case "240":
      statuscode = "Tooth surface(s) involved.";
      break;
    case "241":
      statuscode = "List of all missing teeth (upper and lower).";
      break;
    case "242":
      statuscode = "Tooth numbers, surfaces, and/or quadrants involved.";
      break;
    case "243":
      statuscode = "Months of dental treatment remaining.";
      break;
    case "244":
      statuscode = "Tooth number or letter.";
      break;
    case "245":
      statuscode = "Dental quadrant/arch.";
      break;
    case "246":
      statuscode =
        "Total orthodontic service fee, initial appliance fee, monthly fee, length of service.";
      break;
    case "247":
      statuscode = "Line information.";
      break;
    case "248":
      statuscode = "Accident date, state, description and cause.";
      break;
    case "249":
      statuscode = "Place of service.";
      break;
    case "250":
      statuscode = "Type of service.";
      break;
    case "251":
      statuscode = "Total anesthesia minutes.";
      break;
    case "252":
      statuscode =
        "Authorization/certification number. This change effective 11/1/2011: Entity's authorization/certification number. Note: This code requires the use of an Entity Code.";
      break;
    case "253":
      statuscode =
        "Procedure/revenue code for service(s) rendered. Use codes 454 or 455.";
      break;
    case "254":
      statuscode =
        "Primary diagnosis code. This change effective 11/1/2011: Principal doagnosis code.";
      break;
    case "255":
      statuscode = "Diagnosis code.";
      break;
    case "256":
      statuscode = "DRG code(s).";
      break;
    case "257":
      statuscode = "ADSM-III-R code for services rendered.";
      break;
    case "258":
      statuscode = "Days/units for procedure/revenue code.";
      break;
    case "259":
      statuscode = "Frequency of service.";
      break;
    case "260":
      statuscode = "Length of medical necessity, including begin date.";
      break;
    case "261":
      statuscode = "Obesity measurements.";
      break;
    case "262":
      statuscode =
        "Type of surgery/service for which anesthesia was administered.";
      break;
    case "263":
      statuscode = "Length of time for services rendered.";
      break;
    case "264":
      statuscode =
        "Number of liters/minute & total hours/day for respiratory support.";
      break;
    case "265":
      statuscode = "Number of lesions excised.";
      break;
    case "266":
      statuscode = "Facility point of origin and destination - ambulance.";
      break;
    case "267":
      statuscode = "Number of miles patient was transported.";
      break;
    case "268":
      statuscode = "Location of durable medical equipment use.";
      break;
    case "269":
      statuscode = "Length/size of laceration/tumor.";
      break;
    case "270":
      statuscode = "Subluxation location.";
      break;
    case "271":
      statuscode = "Number of spine segments.";
      break;
    case "272":
      statuscode = "Oxygen contents for oxygen system rental.";
      break;
    case "273":
      statuscode = "Weight.";
      break;
    case "274":
      statuscode = "Height.";
      break;
    case "275":
      statuscode = "Claim.";
      break;
    case "276":
      statuscode = "UB04/HCFA-1450/1500 claim form";
      break;
    case "277":
      statuscode = "Paper claim.";
      break;
    case "278":
      statuscode = "Signed claim form.";
      break;
    case "279":
      statuscode = "Claim/service must be itemized";
      break;
    case "280":
      statuscode = "Itemized claim by provider.";
      break;
    case "281":
      statuscode = "Related confinement claim.";
      break;
    case "282":
      statuscode = "Copy of prescription.";
      break;
    case "283":
      statuscode =
        "Medicare entitlement information is required to determine primary coverage";
      break;
    case "284":
      statuscode = "Copy of Medicare ID card.";
      break;
    case "285":
      statuscode = "Vouchers/explanation of benefits (EOB).";
      break;
    case "286":
      statuscode = "Other payer's Explanation of Benefits/payment information.";
      break;
    case "287":
      statuscode = "Medical necessity for service.";
      break;
    case "288":
      statuscode = "Hospital late charges";
      break;
    case "289":
      statuscode = "Reason for late discharge.";
      break;
    case "290":
      statuscode = "Pre-existing information.";
      break;
    case "291":
      statuscode = "Reason for termination of pregnancy.";
      break;
    case "292":
      statuscode = "Purpose of family conference/therapy.";
      break;
    case "293":
      statuscode = "Reason for physical therapy.";
      break;
    case "294":
      statuscode =
        "Supporting documentation. Note: At least one other status code is required to identify the supporting documentation.";
      break;
    case "295":
      statuscode = "Attending physician report.";
      break;
    case "296":
      statuscode = "Nurse's notes.";
      break;
    case "297":
      statuscode = "Medical notes/report.";
      break;
    case "298":
      statuscode = "Operative report.";
      break;
    case "299":
      statuscode = "Emergency room notes/report.";
      break;
    case "300":
      statuscode = "Lab/test report/notes/results.";
      break;
    case "301":
      statuscode = "MRI report.";
      break;
    case "302":
      statuscode =
        "Refer to codes 300 for lab notes and 311 for pathology notes";
      break;
    case "303":
      statuscode =
        "Physical therapy notes. Use code 297:6O (6 'OH' - not zero)";
      break;
    case "304":
      statuscode = "Reports for service.";
      break;
    case "305":
      statuscode = "Radiology/x-ray reports and/or interpretation";
      break;
    case "306":
      statuscode = "Detailed description of service.";
      break;
    case "307":
      statuscode = "Narrative with pocket depth chart.";
      break;
    case "308":
      statuscode = "Discharge summary.";
      break;
    case "309":
      statuscode = "Code was duplicate of code 299";
      break;
    case "310":
      statuscode = "Progress notes for the six months prior to statement date.";
      break;
    case "311":
      statuscode = "Pathology notes/report.";
      break;
    case "312":
      statuscode = "Dental charting.";
      break;
    case "313":
      statuscode = "Bridgework information.";
      break;
    case "314":
      statuscode = "Dental records for this service.";
      break;
    case "315":
      statuscode = "Past perio treatment history.";
      break;
    case "316":
      statuscode = "Complete medical history.";
      break;
    case "317":
      statuscode = "Patient's medical records.";
      break;
    case "318":
      statuscode = "X-rays/radiology films";
      break;
    case "319":
      statuscode = "Pre/post-operative x-rays/photographs.";
      break;
    case "320":
      statuscode = "Study models.";
      break;
    case "321":
      statuscode = "Radiographs or models. (Use codes 318 and/or 320)";
      break;
    case "322":
      statuscode = "Recent Full Mouth X-rays";
      break;
    case "323":
      statuscode = "Study models, x-rays, and/or narrative.";
      break;
    case "324":
      statuscode = "Recent x-ray of treatment area and/or narrative.";
      break;
    case "325":
      statuscode = "Recent fm x-rays and/or narrative.";
      break;
    case "326":
      statuscode = "Copy of transplant acquisition invoice.";
      break;
    case "327":
      statuscode =
        "Periodontal case type diagnosis and recent pocket depth chart with narrative.";
      break;
    case "328":
      statuscode = "Speech therapy notes. Use code 297:6R";
      break;
    case "329":
      statuscode = "Exercise notes.";
      break;
    case "330":
      statuscode = "Occupational notes.";
      break;
    case "331":
      statuscode = "History and physical.";
      break;
    case "332":
      statuscode =
        "Authorization/certification (include period covered). (Use code 252)";
      break;
    case "333":
      statuscode = "Patient release of information authorization.";
      break;
    case "334":
      statuscode = "Oxygen certification.";
      break;
    case "335":
      statuscode = "Durable medical equipment certification.";
      break;
    case "336":
      statuscode = "Chiropractic certification.";
      break;
    case "337":
      statuscode = "Ambulance certification/documentation.";
      break;
    case "338":
      statuscode = "Home health certification. Use code 332:4Y";
      break;
    case "339":
      statuscode = "Enteral/parenteral certification.";
      break;
    case "340":
      statuscode = "Pacemaker certification.";
      break;
    case "341":
      statuscode = "Private duty nursing certification.";
      break;
    case "342":
      statuscode = "Podiatric certification.";
      break;
    case "343":
      statuscode =
        "Documentation that facility is state licensed and Medicare approved as a surgical facility.";
      break;
    case "344":
      statuscode =
        "Documentation that provider of physical therapy is Medicare Part B approved.";
      break;
    case "345":
      statuscode = "Treatment plan for service/diagnosis";
      break;
    case "346":
      statuscode = "Proposed treatment plan for next 6 months.";
      break;
    case "347":
      statuscode =
        "Refer to code 345 for treatment plan and code 282 for prescription";
      break;
    case "348":
      statuscode = "Chiropractic treatment plan. (Use 345:QL)";
      break;
    case "349":
      statuscode =
        "Psychiatric treatment plan. Use codes 345:5I, 5J, 5K, 5L, 5M, 5N, 5O (5 'OH' - not zero), 5P";
      break;
    case "350":
      statuscode = "Speech pathology treatment plan. Use code 345:6R";
      break;
    case "351":
      statuscode =
        "Physical/occupational therapy treatment plan. Use codes 345:6O (6 'OH' - not zero), 6N";
      break;
    case "352":
      statuscode = "Duration of treatment plan.";
      break;
    case "353":
      statuscode = "Orthodontics treatment plan.";
      break;
    case "354":
      statuscode = "Treatment plan for replacement of remaining missing teeth.";
      break;
    case "355":
      statuscode = "Has claim been paid?";
      break;
    case "356":
      statuscode = "Was blood furnished?";
      break;
    case "357":
      statuscode = "Has or will blood be replaced?";
      break;
    case "358":
      statuscode =
        "Does provider accept assignment of benefits? (Use code 589)";
      break;
    case "359":
      statuscode =
        "Is there a release of information signature on file? (Use code 333)";
      break;
    case "360":
      statuscode = "Benefits Assignment Certification Indicator";
      break;
    case "361":
      statuscode = "Is there other insurance?";
      break;
    case "362":
      statuscode = "Is the dental patient covered by medical insurance?";
      break;
    case "363":
      statuscode = "Possible Workers' Compensation";
      break;
    case "364":
      statuscode = "Is accident/illness/condition employment related?";
      break;
    case "365":
      statuscode = "Is service the result of an accident?";
      break;
    case "366":
      statuscode = "Is injury due to auto accident?";
      break;
    case "367":
      statuscode =
        "Is service performed for a recurring condition or new condition?";
      break;
    case "368":
      statuscode =
        "Is medical doctor (MD) or doctor of osteopath (DO) on staff of this facility?";
      break;
    case "369":
      statuscode = "Does patient condition preclude use of ordinary bed?";
      break;
    case "370":
      statuscode = "Can patient operate controls of bed?";
      break;
    case "371":
      statuscode = "Is patient confined to room?";
      break;
    case "372":
      statuscode = "Is patient confined to bed?";
      break;
    case "373":
      statuscode = "Is patient an insulin diabetic?";
      break;
    case "374":
      statuscode = "Is prescribed lenses a result of cataract surgery?";
      break;
    case "375":
      statuscode = "Was refraction performed?";
      break;
    case "376":
      statuscode = "Was charge for ambulance for a round-trip?";
      break;
    case "377":
      statuscode = "Was durable medical equipment purchased new or used?";
      break;
    case "378":
      statuscode = "Is pacemaker temporary or permanent?";
      break;
    case "379":
      statuscode = "Were services performed supervised by a physician?";
      break;
    case "380":
      statuscode = "CRNA supervision/medical direction.";
      break;
    case "381":
      statuscode = "Is drug generic?";
      break;
    case "382":
      statuscode = "Did provider authorize generic or brand name dispensing?";
      break;
    case "383":
      statuscode = "Nerve block use (surgery vs. pain management)";
      break;
    case "384":
      statuscode =
        "Is prosthesis/crown/inlay placement an initial placement or a replacement?";
      break;
    case "385":
      statuscode =
        "Is appliance upper or lower arch & is appliance fixed or removable?";
      break;
    case "386":
      statuscode = "Orthodontic Treatment/Purpose Indicator";
      break;
    case "387":
      statuscode =
        "Date patient last examined by entity. Note: This code requires use of an Entity Code.";
      break;
    case "388":
      statuscode = "Date post-operative care assumed";
      break;
    case "389":
      statuscode = "Date post-operative care relinquished";
      break;
    case "390":
      statuscode = "Date of most recent medical event necessitating service(s)";
      break;
    case "391":
      statuscode = "Date(s) dialysis conducted";
      break;
    case "392":
      statuscode = "Date(s) of blood transfusion(s)";
      break;
    case "393":
      statuscode = "Date of previous pacemaker check";
      break;
    case "394":
      statuscode = "Date(s) of most recent hospitalization related to service";
      break;
    case "395":
      statuscode =
        "Date entity signed certification/recertification Note: This code requires use of an Entity Code.";
      break;
    case "396":
      statuscode = "Date home dialysis began";
      break;
    case "397":
      statuscode = "Date of onset/exacerbation of illness/condition";
      break;
    case "398":
      statuscode = "Visual field test results";
      break;
    case "399":
      statuscode =
        "Report of prior testing related to this service, including dates";
      break;
    case "400":
      statuscode = "Claim is out of balance";
      break;
    case "401":
      statuscode = "Source of payment is not valid";
      break;
    case "402":
      statuscode =
        "Amount must be greater than zero. Note: At least one other status code is required to identify which amount element is in error.";
      break;
    case "403":
      statuscode = "Entity referral notes/orders/prescription";
      break;
    case "404":
      statuscode =
        "Specific findings, complaints, or symptoms necessitating service";
      break;
    case "405":
      statuscode = "Summary of services";
      break;
    case "406":
      statuscode = "Brief medical history as related to service(s)";
      break;
    case "407":
      statuscode = "Complications/mitigating circumstances";
      break;
    case "408":
      statuscode = "Initial certification";
      break;
    case "409":
      statuscode = "Medication logs/records (including medication therapy)";
      break;
    case "410":
      statuscode =
        "Explain differences between treatment plan and patient's condition";
      break;
    case "411":
      statuscode = "Medical necessity for non-routine service(s)";
      break;
    case "412":
      statuscode = "Medical records to substantiate decision of non-coverage";
      break;
    case "413":
      statuscode =
        "Explain/justify differences between treatment plan and services rendered.";
      break;
    case "414":
      statuscode =
        "Necessity for concurrent care (more than one physician treating the patient)";
      break;
    case "415":
      statuscode = "Justify services outside composite rate";
      break;
    case "416":
      statuscode =
        "Verification of patient's ability to retain and use information";
      break;
    case "417":
      statuscode =
        "Prior testing, including result(s) and date(s) as related to service(s)";
      break;
    case "418":
      statuscode = "Indicating why medications cannot be taken orally";
      break;
    case "419":
      statuscode =
        "Individual test(s) comprising the panel and the charges for each test";
      break;
    case "420":
      statuscode =
        "Name, dosage and medical justification of contrast material used for radiology procedure";
      break;
    case "421":
      statuscode = "Medical review attachment/information for service(s)";
      break;
    case "422":
      statuscode = "Homebound status";
      break;
    case "423":
      statuscode = "Prognosis";
      break;
    case "424":
      statuscode = "Statement of non-coverage including itemized bill";
      break;
    case "425":
      statuscode = "Itemize non-covered services";
      break;
    case "426":
      statuscode = "All current diagnoses";
      break;
    case "427":
      statuscode = "Emergency care provided during transport";
      break;
    case "428":
      statuscode = "Reason for transport by ambulance";
      break;
    case "429":
      statuscode =
        "Loaded miles and charges for transport to nearest facility with appropriate services";
      break;
    case "430":
      statuscode = "Nearest appropriate facility";
      break;
    case "431":
      statuscode = "Patient's condition/functional status at time of service.";
      break;
    case "432":
      statuscode = "Date benefits exhausted";
      break;
    case "433":
      statuscode = "Copy of patient revocation of hospice benefits";
      break;
    case "434":
      statuscode = "Reasons for more than one transfer per entitlement period";
      break;
    case "435":
      statuscode = "Notice of Admission";
      break;
    case "436":
      statuscode = "Short term goals";
      break;
    case "437":
      statuscode = "Long term goals";
      break;
    case "438":
      statuscode = "Number of patients attending session";
      break;
    case "439":
      statuscode = "Size, depth, amount, and type of drainage wounds";
      break;
    case "440":
      statuscode = "why non-skilled caregiver has not been taught procedure";
      break;
    case "441":
      statuscode = "Entity professional qualification for service(s)";
      break;
    case "442":
      statuscode = "Modalities of service";
      break;
    case "443":
      statuscode = "Initial evaluation report";
      break;
    case "444":
      statuscode = "Method used to obtain test sample";
      break;
    case "445":
      statuscode = "Explain why hearing loss not correctable by hearing aid";
      break;
    case "446":
      statuscode = "Documentation from prior claim(s) related to service(s)";
      break;
    case "447":
      statuscode = "Plan of teaching";
      break;
    case "448":
      statuscode =
        "Invalid billing combination. See STC12 for details. This code should only be used to indicate an inconsistency between two or more data elements on the claim. A detailed explanation is required in STC12 when this code is used.";
      break;
    case "449":
      statuscode = "Projected date to discontinue service(s)";
      break;
    case "450":
      statuscode = "Awaiting spend down determination";
      break;
    case "451":
      statuscode = "Preoperative and post-operative diagnosis";
      break;
    case "452":
      statuscode =
        "Total visits in total number of hours/day and total number of hours/week";
      break;
    case "453":
      statuscode = "Procedure Code Modifier(s) for Service(s) Rendered";
      break;
    case "454":
      statuscode = "Procedure code for services rendered.";
      break;
    case "455":
      statuscode = "Revenue code for services rendered.";
      break;
    case "456":
      statuscode = "Covered Day(s)";
      break;
    case "457":
      statuscode = "Non-Covered Day(s)";
      break;
    case "458":
      statuscode = "Coinsurance Day(s)";
      break;
    case "459":
      statuscode = "Lifetime Reserve Day(s)";
      break;
    case "460":
      statuscode = "NUBC Condition Code(s)";
      break;
    case "461":
      statuscode = "NUBC Occurrence Code(s) and Date(s)";
      break;
    case "462":
      statuscode = "NUBC Occurrence Span Code(s) and Date(s)";
      break;
    case "463":
      statuscode = "NUBC Value Code(s) and/or Amount(s)";
      break;
    case "464":
      statuscode = "Payer Assigned Claim Control Number";
      break;
    case "465":
      statuscode = "Principal Procedure Code for Service(s) Rendered";
      break;
    case "466":
      statuscode =
        "Entities Original Signature. Note: This code requires use of an Entity Code. This change effective 11/1/2011: Entity's Original Signature. Note: This code requires use of an Entity Code.";
      break;
    case "467":
      statuscode =
        "Entity Signature Date. Note: This code requires use of an Entity Code.";
      break;
    case "468":
      statuscode = "Patient Signature Source";
      break;
    case "469":
      statuscode = "Purchase Service Charge";
      break;
    case "470":
      statuscode =
        "Was service purchased from another entity? Note: This code requires use of an Entity Code.";
      break;
    case "471":
      statuscode = "Were services related to an emergency?";
      break;
    case "472":
      statuscode = "Ambulance Run Sheet";
      break;
    case "473":
      statuscode = "Missing or invalid lab indicator";
      break;
    case "474":
      statuscode = "Procedure code and patient gender mismatch";
      break;
    case "475":
      statuscode = "Procedure code not valid for patient age";
      break;
    case "476":
      statuscode = "Missing or invalid units of service";
      break;
    case "477":
      statuscode = "Diagnosis code pointer is missing or invalid";
      break;
    case "478":
      statuscode = "Claim submitter's identifier";
      break;
    case "479":
      statuscode = "Other Carrier payer ID is missing or invalid";
      break;
    case "480":
      statuscode =
        "Entity's claim filing indicator. Note: This code requires use of an Entity Code.";
      break;
    case "481":
      statuscode = "Claim/submission format is invalid.";
      break;
    case "482":
      statuscode = "Date Error, Century Missing";
      break;
    case "483":
      statuscode =
        "Maximum coverage amount met or exceeded for benefit period.";
      break;
    case "484":
      statuscode = "Business Application Currently Not Available";
      break;
    case "485":
      statuscode =
        "More information available than can be returned in real time mode. Narrow your current search criteria.";
      break;
    case "486":
      statuscode = "Principal Procedure Date";
      break;
    case "487":
      statuscode =
        "Claim not found, claim should have been submitted to/through 'entity'. Note: This code requires use of an Entity Code.";
      break;
    case "488":
      statuscode = "Diagnosis code(s) for the services rendered.";
      break;
    case "489":
      statuscode = "Attachment Control Number";
      break;
    case "490":
      statuscode = "Other Procedure Code for Service(s) Rendered";
      break;
    case "491":
      statuscode =
        "Entity not eligible for encounter submission. Note: This code requires use of an Entity Code.";
      break;
    case "492":
      statuscode = "Other Procedure Date";
      break;
    case "493":
      statuscode =
        "Version/Release/Industry ID code not currently supported by information holder";
      break;
    case "494":
      statuscode =
        "Real-Time requests not supported by the information holder, resubmit as batch request";
      break;
    case "495":
      statuscode =
        "Requests for re-adjudication must reference the newly assigned payer claim control number for this previously adjusted claim. Correct the payer claim control number and re-submit.";
      break;
    case "496":
      statuscode =
        "Submitter not approved for electronic claim submissions on behalf of this entity. Note: This code requires use of an Entity Code.";
      break;
    case "497":
      statuscode = "Sales tax not paid";
      break;
    case "498":
      statuscode = "Maximum leave days exhausted";
      break;
    case "499":
      statuscode =
        "No rate on file with the payer for this service for this entity Note: This code requires use of an Entity Code.";
      break;
    case "500":
      statuscode =
        "Entity's Postal/Zip Code. Note: This code requires use of an Entity Code.";
      break;
    case "501":
      statuscode =
        "Entity's State/Province. Note: This code requires use of an Entity Code.";
      break;
    case "502":
      statuscode =
        "Entity's City. Note: This code requires use of an Entity Code.";
      break;
    case "503":
      statuscode =
        "Entity's Street Address. Note: This code requires use of an Entity Code.";
      break;
    case "504":
      statuscode =
        "Entity's Last Name. Note: This code requires use of an Entity Code.";
      break;
    case "505":
      statuscode =
        "Entity's First Name. Note: This code requires use of an Entity Code.";
      break;
    case "506":
      statuscode =
        "Entity is changing processor/clearinghouse. This claim must be submitted to the new processor/clearinghouse. Note: This code requires use of an Entity Code.";
      break;
    case "507":
      statuscode = "HCPCS";
      break;
    case "508":
      statuscode =
        "ICD9 NOTE: At least one other status code is required to identify the related procedure code or diagnosis code.";
      break;
    case "509":
      statuscode =
        "E-Code. This change effective 11/1/2011: External Cause of Injury Code (E-code).";
      break;
    case "510":
      statuscode =
        "Future date. Note: At least one other status code is required to identify the data element in error.";
      break;
    case "511":
      statuscode =
        "Invalid character. Note: At least one other status code is required to identify the data element in error.";
      break;
    case "512":
      statuscode =
        "Length invalid for receiver's application system. Note: At least one other status code is required to identify the data element in error.";
      break;
    case "513":
      statuscode = "HIPPS Rate Code for services Rendered";
      break;
    case "514":
      statuscode =
        "Entities Middle Name Note: This code requires use of an Entity Code. This change effective 11/1/2011: Entity's Middle Name Note: This code requires use of an Entity Code.";
      break;
    case "515":
      statuscode = "Managed Care review";
      break;
    case "516":
      statuscode =
        "Other Entity's Adjudication or Payment/Remittance Date. Note: An Entity code is required to identify the Other Payer Entity, i.e. primary, secondary.";
      break;
    case "517":
      statuscode = "Adjusted Repriced Claim Reference Number";
      break;
    case "518":
      statuscode = "Adjusted Repriced Line item Reference Number";
      break;
    case "519":
      statuscode = "Adjustment Amount";
      break;
    case "520":
      statuscode = "Adjustment Quantity";
      break;
    case "521":
      statuscode = "Adjustment Reason Code";
      break;
    case "522":
      statuscode = "Anesthesia Modifying Units";
      break;
    case "523":
      statuscode = "Anesthesia Unit Count";
      break;
    case "524":
      statuscode = "Arterial Blood Gas Quantity";
      break;
    case "525":
      statuscode = "Begin Therapy Date";
      break;
    case "526":
      statuscode = "Bundled or Unbundled Line Number";
      break;
    case "527":
      statuscode = "Certification Condition Indicator";
      break;
    case "528":
      statuscode = "Certification Period Projected Visit Count";
      break;
    case "529":
      statuscode = "Certification Revision Date";
      break;
    case "530":
      statuscode = "Claim Adjustment Indicator";
      break;
    case "531":
      statuscode = "Claim Disproportinate Share Amount";
      break;
    case "532":
      statuscode = "Claim DRG Amount";
      break;
    case "533":
      statuscode = "Claim DRG Outlier Amount";
      break;
    case "534":
      statuscode = "Claim ESRD Payment Amount";
      break;
    case "535":
      statuscode = "Claim Frequency Code";
      break;
    case "536":
      statuscode = "Claim Indirect Teaching Amount";
      break;
    case "537":
      statuscode = "Claim MSP Pass-through Amount";
      break;
    case "538":
      statuscode = "Claim or Encounter Identifier";
      break;
    case "539":
      statuscode = "Claim PPS Capital Amount";
      break;
    case "540":
      statuscode = "Claim PPS Capital Outlier Amount";
      break;
    case "541":
      statuscode = "Claim Submission Reason Code";
      break;
    case "542":
      statuscode = "Claim Total Denied Charge Amount";
      break;
    case "543":
      statuscode = "Clearinghouse or Value Added Network Trace";
      break;
    case "544":
      statuscode = "Clinical Laboratory Improvement Amendment";
      break;
    case "545":
      statuscode = "Contract Amount";
      break;
    case "546":
      statuscode = "Contract Code";
      break;
    case "547":
      statuscode = "Contract Percentage";
      break;
    case "548":
      statuscode = "Contract Type Code";
      break;
    case "549":
      statuscode = "Contract Version Identifier";
      break;
    case "550":
      statuscode = "Coordination of Benefits Code";
      break;
    case "551":
      statuscode = "Coordination of Benefits Total Submitted Charge";
      break;
    case "552":
      statuscode = "Cost Report Day Count";
      break;
    case "553":
      statuscode = "Covered Amount";
      break;
    case "554":
      statuscode = "Date Claim Paid";
      break;
    case "555":
      statuscode = "Delay Reason Code";
      break;
    case "556":
      statuscode = "Demonstration Project Identifier";
      break;
    case "557":
      statuscode = "Diagnosis Date";
      break;
    case "558":
      statuscode = "Discount Amount";
      break;
    case "559":
      statuscode = "Document Control Identifier";
      break;
    case "560":
      statuscode =
        "Entity's Additional/Secondary Identifier. Note: This code requires use of an Entity Code.";
      break;
    case "561":
      statuscode =
        "Entity's Contact Name. Note: This code requires use of an Entity Code.";
      break;
    case "562":
      statuscode =
        "Entity's National Provider Identifier (NPI). Note: This code requires use of an Entity Code.";
      break;
    case "563":
      statuscode =
        "Entity's Tax Amount. Note: This code requires use of an Entity Code.";
      break;
    case "564":
      statuscode = "EPSDT Indicator";
      break;
    case "565":
      statuscode = "Estimated Claim Due Amount";
      break;
    case "566":
      statuscode = "Exception Code";
      break;
    case "567":
      statuscode = "Facility Code Qualifier";
      break;
    case "568":
      statuscode = "Family Planning Indicator";
      break;
    case "569":
      statuscode = "Fixed Format Information";
      break;
    case "570":
      statuscode = "Free Form Message Text";
      break;
    case "571":
      statuscode = "Frequency Count";
      break;
    case "572":
      statuscode = "Frequency Period";
      break;
    case "573":
      statuscode = "Functional Limitation Code";
      break;
    case "574":
      statuscode = "HCPCS Payable Amount Home Health";
      break;
    case "575":
      statuscode = "Homebound Indicator";
      break;
    case "576":
      statuscode = "Immunization Batch Number";
      break;
    case "577":
      statuscode = "Industry Code";
      break;
    case "578":
      statuscode = "Insurance Type Code";
      break;
    case "579":
      statuscode = "Investigational Device Exemption Identifier";
      break;
    case "580":
      statuscode = "Last Certification Date";
      break;
    case "581":
      statuscode = "Last Worked Date";
      break;
    case "582":
      statuscode = "Lifetime Psychiatric Days Count";
      break;
    case "583":
      statuscode = "Line Item Charge Amount";
      break;
    case "584":
      statuscode = "Line Item Control Number";
      break;
    case "585":
      statuscode = "Denied Charge or Non-covered Charge";
      break;
    case "586":
      statuscode = "Line Note Text";
      break;
    case "587":
      statuscode = "Measurement Reference Identification Code";
      break;
    case "588":
      statuscode = "Medical Record Number";
      break;
    case "589":
      statuscode = "Provider Accept Assignment Code";
      break;
    case "590":
      statuscode = "Medicare Coverage Indicator";
      break;
    case "591":
      statuscode = "Medicare Paid at 100% Amount";
      break;
    case "592":
      statuscode = "Medicare Paid at 80% Amount";
      break;
    case "593":
      statuscode = "Medicare Section 4081 Indicator";
      break;
    case "594":
      statuscode = "Mental Status Code";
      break;
    case "595":
      statuscode = "Monthly Treatment Count";
      break;
    case "596":
      statuscode = "Non-covered Charge Amount";
      break;
    case "597":
      statuscode = "Non-payable Professional Component Amount";
      break;
    case "598":
      statuscode = "Non-payable Professional Component Billed Amount";
      break;
    case "599":
      statuscode = "Note Reference Code";
      break;
    case "600":
      statuscode = "Oxygen Saturation Qty";
      break;
    case "601":
      statuscode = "Oxygen Test Condition Code";
      break;
    case "602":
      statuscode = "Oxygen Test Date";
      break;
    case "603":
      statuscode = "Old Capital Amount";
      break;
    case "604":
      statuscode = "Originator Application Transaction Identifier";
      break;
    case "605":
      statuscode = "Orthodontic Treatment Months Count";
      break;
    case "606":
      statuscode = "Paid From Part A Medicare Trust Fund Amount";
      break;
    case "607":
      statuscode = "Paid From Part B Medicare Trust Fund Amount";
      break;
    case "608":
      statuscode = "Paid Service Unit Count";
      break;
    case "609":
      statuscode = "Participation Agreement";
      break;
    case "610":
      statuscode = "Patient Discharge Facility Type Code";
      break;
    case "611":
      statuscode = "Peer Review Authorization Number";
      break;
    case "612":
      statuscode = "Per Day Limit Amount";
      break;
    case "613":
      statuscode = "Physician Contact Date";
      break;
    case "614":
      statuscode = "Physician Order Date";
      break;
    case "615":
      statuscode = "Policy Compliance Code";
      break;
    case "616":
      statuscode = "Policy Name";
      break;
    case "617":
      statuscode = "Postage Claimed Amount";
      break;
    case "618":
      statuscode = "PPS-Capital DSH DRG Amount";
      break;
    case "619":
      statuscode = "PPS-Capital Exception Amount";
      break;
    case "620":
      statuscode = "PPS-Capital FSP DRG Amount";
      break;
    case "621":
      statuscode = "PPS-Capital HSP DRG Amount";
      break;
    case "622":
      statuscode = "PPS-Capital IME Amount";
      break;
    case "623":
      statuscode = "PPS-Operating Federal Specific DRG Amount";
      break;
    case "624":
      statuscode = "PPS-Operating Hospital Specific DRG Amount";
      break;
    case "625":
      statuscode = "Predetermination of Benefits Identifier";
      break;
    case "626":
      statuscode = "Pregnancy Indicator";
      break;
    case "627":
      statuscode = "Pre-Tax Claim Amount";
      break;
    case "628":
      statuscode = "Pricing Methodology";
      break;
    case "629":
      statuscode = "Property Casualty Claim Number";
      break;
    case "630":
      statuscode = "Referring CLIA Number";
      break;
    case "631":
      statuscode = "Reimbursement Rate";
      break;
    case "632":
      statuscode = "Reject Reason Code";
      break;
    case "633":
      statuscode = "Related Causes Code (Accident, auto accident, employment)";
      break;
    case "634":
      statuscode = "Remark Code";
      break;
    case "635":
      statuscode = "Repriced Ambulatory Patient Group Code";
      break;
    case "636":
      statuscode = "Repriced Line Item Reference Number";
      break;
    case "637":
      statuscode = "Repriced Saving Amount";
      break;
    case "638":
      statuscode = "Repricing Per Diem or Flat Rate Amount";
      break;
    case "639":
      statuscode = "Responsibility Amount";
      break;
    case "640":
      statuscode = "Sales Tax Amount";
      break;
    case "641":
      statuscode = "Service Adjudication or Payment Date. Note: Use code 516.";
      break;
    case "642":
      statuscode = "Service Authorization Exception Code";
      break;
    case "643":
      statuscode = "Service Line Paid Amount";
      break;
    case "644":
      statuscode = "Service Line Rate";
      break;
    case "645":
      statuscode = "Service Tax Amount";
      break;
    case "646":
      statuscode = "Ship, Delivery or Calendar Pattern Code";
      break;
    case "647":
      statuscode = "Shipped Date";
      break;
    case "648":
      statuscode = "Similar Illness or Symptom Date";
      break;
    case "649":
      statuscode = "Skilled Nursing Facility Indicator";
      break;
    case "650":
      statuscode = "Special Program Indicator";
      break;
    case "651":
      statuscode = "State Industrial Accident Provider Number";
      break;
    case "652":
      statuscode = "Terms Discount Percentage";
      break;
    case "653":
      statuscode = "Test Performed Date";
      break;
    case "654":
      statuscode = "Total Denied Charge Amount";
      break;
    case "655":
      statuscode = "Total Medicare Paid Amount";
      break;
    case "656":
      statuscode = "Total Visits Projected This Certification Count";
      break;
    case "657":
      statuscode = "Total Visits Rendered Count";
      break;
    case "658":
      statuscode = "Treatment Code";
      break;
    case "659":
      statuscode = "Unit or Basis for Measurement Code";
      break;
    case "660":
      statuscode = "Universal Product Number";
      break;
    case "661":
      statuscode = "Visits Prior to Recertification Date Count CR702";
      break;
    case "662":
      statuscode = "X-ray Availability Indicator";
      break;
    case "663":
      statuscode =
        "Entity's Group Name. Note: This code requires use of an Entity Code.";
      break;
    case "664":
      statuscode = "Orthodontic Banding Date";
      break;
    case "665":
      statuscode = "Surgery Date";
      break;
    case "666":
      statuscode = "Surgical Procedure Code";
      break;
    case "667":
      statuscode =
        "Real-Time requests not supported by the information holder, do not resubmit";
      break;
    case "668":
      statuscode = "Missing Endodontics treatment history and prognosis";
      break;
    case "669":
      statuscode = "Dental service narrative needed.";
      break;
    case "670":
      statuscode =
        "Funds applied from a consumer spending account such as consumer directed/driven health plan (CDHP), Health savings account (H S A) and or other similar accounts";
      break;
    case "671":
      statuscode =
        "Funds may be available from a consumer spending account such as consumer directed/driven health plan (CDHP), Health savings account (H S A) and or other similar accounts";
      break;
    case "672":
      statuscode = "Other Payer's payment information is out of balance";
      break;
    case "673":
      statuscode = "Patient Reason for Visit";
      break;
    case "674":
      statuscode = "Authorization exceeded";
      break;
    case "675":
      statuscode = "Facility admission through discharge dates";
      break;
    case "676":
      statuscode =
        "Entity possibly compensated by facility. Note: This code requires use of an Entity Code.";
      break;
    case "677":
      statuscode =
        "Entity not affiliated. Note: This code requires use of an Entity Code.";
      break;
    case "678":
      statuscode = "Revenue code and patient gender mismatch";
      break;
    case "679":
      statuscode = "Submit newborn services on mother's claim";
      break;
    case "680":
      statuscode =
        "Entity's Country. Note: This code requires use of an Entity Code.";
      break;
    case "681":
      statuscode = "Claim currency not supported";
      break;
    case "682":
      statuscode = "Cosmetic procedure";
      break;
    case "683":
      statuscode = "Awaiting Associated Hospital Claims";
      break;
    case "684":
      statuscode =
        "Rejected. Syntax error noted for this claim/service/inquiry. See Functional or Implementation Acknowledgement for details. (Note: Only for use to reject claims or status requests in transactions that were 'accepted with errors' on a 997 or 999 Acknowledgement.)";
      break;
    case "685":
      statuscode =
        "Claim could not complete adjudication in real time. Claim will continue processing in a batch mode. Do not resubmit.";
      break;
    case "686":
      statuscode =
        "The claim/ encounter has completed the adjudication cycle and the entire claim has been voided";
      break;
    case "687":
      statuscode =
        "Claim estimation can not be completed in real time. Do not resubmit.";
      break;
    case "688":
      statuscode =
        "Present on Admission Indicator for reported diagnosis code(s).";
      break;
    case "689":
      statuscode =
        "Entity was unable to respond within the expected time frame. Note: This code requires use of an Entity Code.";
      break;
    case "690":
      statuscode =
        "Multiple claims or estimate requests cannot be processed in real time.";
      break;
    case "691":
      statuscode =
        "Multiple claim status requests cannot be processed in real time.";
      break;
    case "692":
      statuscode =
        "Contracted funding agreement-Subscriber is employed by the provider of services";
      break;
    case "693":
      statuscode =
        "Amount must be greater than or equal to zero. Note: At least one other status code is required to identify which amount element is in error.";
      break;
    case "694":
      statuscode =
        "Amount must not be equal to zero. Note: At least one other status code is required to identify which amount element is in error.";
      break;
    case "695":
      statuscode =
        "Entity's Country Subdivision Code. Note: This code requires use of an Entity Code.";
      break;
    case "696":
      statuscode = "Claim Adjustment Group Code.";
      break;
    case "697":
      statuscode =
        "Invalid Decimal Precision. Note: At least one other status code is required to identify the data element in error.";
      break;
    case "698":
      statuscode = "Form Type Identification";
      break;
    case "699":
      statuscode = "Question/Response from Supporting Documentation Form";
      break;
    case "700":
      statuscode =
        "ICD10. Note: At least one other status code is required to identify the related procedure code or diagnosis code.";
      break;
    case "701":
      statuscode = "Initial Treatment Date";
      break;
    case "702":
      statuscode = "Repriced Claim Reference Number";
      break;
    case "703":
      statuscode = "Advanced Billing Concepts (ABC) code";
      break;
    case "704":
      statuscode = "Claim Note Text";
      break;
    case "705":
      statuscode = "Repriced Allowed Amount";
      break;
    case "706":
      statuscode = "Repriced Approved Amount";
      break;
    case "707":
      statuscode = "Repriced Approved Ambulatory Patient Group Amount";
      break;
    case "708":
      statuscode = "Repriced Approved Revenue Code";
      break;
    case "709":
      statuscode = "Repriced Approved Service Unit Count";
      break;
    case "710":
      statuscode =
        "Line Adjudication Information. Note: At least one other status code is required to identify the data element in error.";
      break;
    case "711":
      statuscode = "Stretcher purpose";
      break;
    case "712":
      statuscode = "Obstetric Additional Units";
      break;
    case "713":
      statuscode = "Patient Condition Description";
      break;
    case "714":
      statuscode = "Care Plan Oversight Number";
      break;
    case "715":
      statuscode = "Acute Manifestation Date";
      break;
    case "716":
      statuscode = "Repriced Approved DRG Code";
      break;
    case "717":
      statuscode = "This claim has been split for processing.";
      break;
    case "718":
      statuscode =
        "Claim/service not submitted within the required timeframe (timely filing).";
      break;
    case "719":
      statuscode = "NUBC Occurrence Code(s)";
      break;
    case "720":
      statuscode = "NUBC Occurrence Code Date(s)";
      break;
    case "721":
      statuscode = "NUBC Occurrence Span Code(s)";
      break;
    case "722":
      statuscode = "NUBC Occurrence Span Code Date(s)";
      break;
    case "723":
      statuscode = "Drug days supply";
      break;
    case "724":
      statuscode = "Drug dosage";
      break;
    case "725":
      statuscode = "NUBC Value Code(s)";
      break;
    case "726":
      statuscode = "NUBC Value Code Amount(s)";
      break;
    case "727":
      statuscode = "Accident date";
      break;
    case "728":
      statuscode = "Accident state";
      break;
    case "729":
      statuscode = "Accident description";
      break;
    case "730":
      statuscode = "Accident cause";
      break;
    case "731":
      statuscode = "Measurement value/test result";
      break;
    case "732":
      statuscode =
        "Information submitted inconsistent with billing guidelines. Note: At least one other status code is required to identify the inconsistent information.";
      break;
    case "733":
      statuscode = "Prefix for entity's contract/member number.";
      break;
    case "734":
      statuscode = "Verifying premium payment";
      break;
    case "735":
      statuscode =
        "This service/claim is included in the allowance for another service or claim.";
      break;
    case "736":
      statuscode =
        "A related or qualifying service/claim has not been received/adjudicated.";
      break;
    case "737":
      statuscode = "Current Dental Terminology (CDT) Code";
      break;
    case "738":
      statuscode = "Home Infusion EDI Coalition (HEIC) Product/Service Code";
      break;
    case "739":
      statuscode = "Jurisdiction Specific Procedure or Supply Code";
      break;
    case "740":
      statuscode = "Drop-Off Location";
      break;
    case "741":
      statuscode =
        "Entity must be a person. Note: This code requires use of an Entity Code.";
      break;
    case "742":
      statuscode = "Payer Responsibility Sequence Number Code";
      break;
    case "743":
      statuscode =
        "Entity's credential/enrollment information. Note: This code requires use of an Entity Code.";
      break;
    case "744":
      statuscode =
        "Services/charges related to the treatment of a hospital-acquired condition or preventable medical error.";
      break;
    case "745":
      statuscode =
        "Identifier Qualifier Note: At least one other status code is required to identify the specific identifier qualifier in error.";
      break;
    case "746":
      statuscode =
        "Duplicate Submission Note: use only at the information receiver level in the Health Care Claim Acknowledgement transaction.";
      break;
    case "747":
      statuscode = "Hospice Employee Indicator";
      break;
    case "748":
      statuscode =
        "Corrected Data Note: Requires a second status code to identify the corrected data.";
      break;
    case "749":
      statuscode = "Date of Injury/Illness";
      break;
    case "750":
      statuscode =
        "Invalid Auto Accident State or Province Code. This change effective 11/1/2011: Auto Accident State or Province Code";
      break;
    case "751":
      statuscode =
        "Invalid Ambulance Pick-up State or Province Code. This change effective 11/1/2011: Ambulance Pick-up State or Province Code";
      break;
    case "752":
      statuscode =
        "Invalid Ambulance Drop-off State or Province Code. This change effective 11/1/2011: Ambulance Drop-off State or Province Code";
      break;
    case "753":
      statuscode = "Co-pay status code.";
      break;
    case "754":
      statuscode =
        "Entity Name Suffix. Note: This code requires the use of an Entity Code.";
      break;
    case "755":
      statuscode =
        "Entity's primary identifier. Note: This code requires the use of an Entity Code.";
      break;
    case "756":
      statuscode =
        "Entity's Received Date. Note: This code requires the use of an Entity Code.";
      break;
    case "757":
      statuscode = "Last seen date.";
      break;
    case "758":
      statuscode = "Repriced approved HCPCS code.";
      break;
    case "759":
      statuscode = "Round trip purpose description.";
      break;
    case "760":
      statuscode = "Tooth status code.";
      break;
    case "761":
      statuscode =
        "Entity's referral number. Note: This code requires the use of an Entity Code.";
      break;
  }
  return statuscode;
};

// Translate STC01-3 Code
// eslint-disable-next-line camelcase
export const TranslateSTC01_3Code = (code) => {
  let statuscode;
  switch (code) {
    case "36":
      statuscode = "Employer";
      break;
    case "40":
      statuscode = "Receiver";
      break;
    case "41":
      statuscode = "Submitter";
      break;
    case "77":
      statuscode = "Service Location";
      break;
    case "82":
      statuscode = "Rendering Provider";
      break;
    case "85":
      statuscode = "Billing Provider";
      break;
    case "87":
      statuscode = "Pay-to Provider";
      break;
    case "AY":
      statuscode = "Clearinghouse";
      break;
    case "PR":
      statuscode = "Payer";
      break;
  }
  return statuscode;
};

// claimStatusText
export const TranslateClaimStatusTextCode = (code) => {
  let statuscodeText;
  switch (code) {
    case "A0": // "Acknowledgement/Forwarded-The claim/encounter has been forwarded to another entity.";
      statuscodeText = "Rejected";
      break;
    case "A1": // "Acknowledgement/Receipt-The claim/encounter has been received. This does not mean that the claim has been accepted for adjudication.";
    case "A2": // "Acknowledgement/Acceptance into adjudication system-The claim/encounter has been accepted into the adjudication system.";
      statuscodeText = "Suspended";
      break;
    case "A3": // "Acknowledgement/Returned as unprocessable claim-The claim/encounter has been rejected and has not been entered into the adjudication system.";
      statuscodeText = "T Status";
      break;
    case "A4": // "Acknowledgement/Not Found-The claim/encounter can not be found in the adjudication system.";
      statuscodeText = "Not Found";
      break;
    case "A5": // "Acknowledgement/Split Claim-The claim/encounter has been split upon acceptance into the adjudication system.";
      statuscodeText = "Paid/Partial Pay";
      break;
    case "A6": // "Acknowledgement/Rejected for Missing Information - The claim/encounter is missing the information specified in the Status details and has been rejected.";
    case "A7": // "Acknowledgement/Rejected for Invalid Information - The claim/encounter has invalid information as specified in the Status details and has been rejected.";
    case "A8": // "Acknowledgement / Rejected for relational field in error.";
      statuscodeText = "Rejected";
      break;
    case "D0": // "Data Search Unsuccessful - The payer is unable to return status on the requested claim(s) based on the submitted search criteria.";
    case "E0": // "Response not possible - error on submitted request data";
    case "E1": // "Response not possible - System Status";
    case "E2": // "Information Holder is not responding; resubmit at a later time."
    case "E3": // "Correction required - relational fields in error."
    case "E4": // "Trading partner agreement specific requirement not met: Data correction required. (Note: A status code identifying the type of information requested must be sent)"
      statuscodeText = "Error";
      break;
    case "F0": // "Finalized-The claim/encounter has completed the adjudication cycle and no more action will be taken.";
    case "F1": // "Finalized/Payment-The claim/line has been paid.";
      statuscodeText = "Paid";
      break;
    case "F2": // "Finalized/Denial-The claim/line has been denied.";
      statuscodeText = "Denied";
      break;
    case "F3": // "Finalized/Revised - Adjudication information has been changed";
    case "F3F": // "Finalized/Forwarded-The claim/encounter processing has been completed. Any applicable payment has been made and the claim/encounter has been forwarded to a subsequent entity as identified on the original claim or in this payer's records.";
    case "F3N": // "Finalized/Not Forwarded-The claim/encounter processing has been completed. Any applicable payment has been made. The claim/encounter has NOT been forwarded to any subsequent entity identified on the original claim.";
    case "F4": // "Finalized/Adjudication Complete - No payment forthcoming-The claim/encounter has been adjudicated and no further payment is forthcoming.";
    case "F5": // "Finalized/Cannot Process";
      statuscodeText = "Rejected";
      break;
    case "P0": // "Pending: Adjudication/Details-This is a generic message about a pended claim. A pended claim is one for which no remittance advice has been issued, or only part of the claim has been paid.";
    case "P1": // "Pending/In Process-The claim or encounter is in the adjudication system.";
    case "P2": // "Pending/Payer Review-The claim/encounter is suspended and is pending review (e.g. medical review, repricing, Third Party Administrator processing).";
    case "P5": // "Pending/Payer Administrative/System hold";
      statuscodeText = "Pending";
      break;
    case "P3": // "Pending/Provider Requested Information - The claim or encounter is waiting for information that has already been requested from the provider. (Note: A Claim Status Code identifying the type of information requested, must be reported)";
    case "P4": // "Pending/Patient Requested Information - The claim or encounter is waiting for information that has already been requested from the patient. (Note: A status code identifying the type of information requested must be sent)";
      statuscodeText = "T Status";
      break;
    case "R0": // "Requests for additional Information/General Requests-Requests that don't fall into other R-type categories.";
    case "R1": // "Requests for additional Information/Entity Requests-Requests for information about specific entities (subscribers, patients, various providers).";
    case "R10": // "Requests for additional information – Support a filed grievance or appeal";
    case "R11": // "Requests for additional information – Pre-payment review of claims";
    case "R12": // "Requests for additional information – Clarification or justification of use for specified procedure code";
    case "R13": // "Requests for additional information – Original documents submitted are not readable. Used only for subsequent request(s).";
    case "R14": // "Requests for additional information – Original documents received are not what was requested. Used only for subsequent request(s).";
    case "R15": // "Requests for additional information – Workers Compensation coverage determination.";
    case "R16": // "Requests for additional information – Eligibility determination";
    case "R3": // "Requests for additional Information/Claim/Line-Requests for information that could normally be submitted on a claim.";
    case "R4": // "Requests for additional Information/Documentation-Requests for additional supporting documentation. Examples: certification, x-ray, notes.";
    case "R5": // "Request for additional information/more specific detail-Additional information as a follow up to a previous request is needed. The original information was received but is inadequate. More specific/detailed information is requested.";
    case "R6": // "Requests for additional information – Regulatory requirements";
    case "R7": // "Requests for additional information – Confirm care is consistent with Health Plan policy coverage";
    case "R8": // "Requests for additional information – Confirm care is consistent with health plan coverage exceptions";
    case "R9": // "Requests for additional information – Determination of medical necessity";
    case "RQ": // "General Questions (Yes/No Responses)-Questions that may be answered by a simple 'yes' or 'no'.";
      statuscodeText = "Suspended";
      break;
  }

  return statuscodeText;
};

// Translate STC03 Code
export const TranslateSTC03code = (code) => {
  let statuscode;
  switch (code) {
    case "U":
      statuscode = "REJECTED";
      break;
    case "WQ":
      statuscode = "ACCEPTED";
      break;
  }
  return statuscode;
};

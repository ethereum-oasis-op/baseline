// Translate EB01 ELIGIBILITY BENEFIT Code
export const TranslateEB01Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "1":
      returnvalue = "Active Coverage";
      break;
    case "2":
      returnvalue = "Active - Full Risk Capitation";
      break;
    case "3":
      returnvalue = "Active - Services Capitated";
      break;
    case "4":
      returnvalue = "Active - Services Capitated to Primary Care Physician";
      break;
    case "5":
      returnvalue = "Active - Pending Investigation";
      break;
    case "6":
      returnvalue = "Inactive";
      break;
    case "7":
      returnvalue = "Inactive - Pending Eligibility Update";
      break;
    case "8":
      returnvalue = "Inactive - Pending Investigation";
      break;
    case "A":
      returnvalue = "Co-Insurance";
      break;
    case "B":
      returnvalue = "Co-Payment";
      break;
    case "C":
      returnvalue = "Deductible";
      break;
    case "CB":
      returnvalue = "Coverage Basis";
      break;
    case "D":
      returnvalue = "Benefit Description";
      break;
    case "E":
      returnvalue = "Exclusions";
      break;
    case "F":
      returnvalue = "Limitations";
      break;
    case "G":
      returnvalue = "Out of Pocket (Stop Loss)";
      break;
    case "H":
      returnvalue = "Unlimited";
      break;
    case "I":
      returnvalue = "Non-Covered";
      break;
    case "J":
      returnvalue = "Cost Containment";
      break;
    case "K":
      returnvalue = "Reserve";
      break;
    case "L":
      returnvalue = "Primary Care Provider";
      break;
    case "M":
      returnvalue = "Pre-existing Condition";
      break;
    case "MC":
      returnvalue = "Managed Care Coordinator";
      break;
    case "N":
      returnvalue = "Services Restricted to Following Provider";
      break;
    case "O":
      returnvalue = "Not Deemed a Medical Necessity";
      break;
    case "P":
      returnvalue = "Benefit Disclaimer";
      break;
    case "Q":
      returnvalue = "Second Surgical Opinion Required";
      break;
    case "R":
      returnvalue = "Other or Additional Payor";
      break;
    case "S":
      returnvalue = "Prior Year(s) History";
      break;
    case "T":
      returnvalue = "Card(s) Reported Lost/Stolen";
      break;
    case "U":
      returnvalue =
        "Contact Following Entity for Eligibility or Benefit Information";
      break;
    case "V":
      returnvalue = "Cannot Process";
      break;
    case "W":
      returnvalue = "Other Source of Data";
      break;
    case "X":
      returnvalue = "Health Care Facility";
      break;
    case "Y":
      returnvalue = "Spend Down";
      break;
  }
  return returnvalue;
};

// Translate EB02 ELIGIBILITY BENEFIT Code
export const TranslateEB02Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "CHD":
      returnvalue = "Children Only";
      break;
    case "DEP":
      returnvalue = "Dependents Only";
      break;
    case "ECH":
      returnvalue = "Employee and Children";
      break;
    case "EMP":
      returnvalue = "Employee Only";
      break;
    case "ESP":
      returnvalue = "Employee and Spouse";
      break;
    case "FAM":
      returnvalue = "Family";
      break;
    case "IND":
      returnvalue = "Individual";
      break;
    case "SPC":
      returnvalue = "Spouse and Children";
      break;
    case "SPO":
      returnvalue = "Spouse Only";
      break;
  }
  return returnvalue;
};

// Translate EB03 ELIGIBILITY BENEFIT Code
export const TranslateEB03Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "1":
      returnvalue = "Medical Care";
      break;
    case "2":
      returnvalue = "Surgical";
      break;
    case "3":
      returnvalue = "Consultation";
      break;
    case "4":
      returnvalue = "Diagnostic X-Ray";
      break;
    case "5":
      returnvalue = "Diagnostic Lab";
      break;
    case "6":
      returnvalue = "Radiation Therapy";
      break;
    case "7":
      returnvalue = "Anesthesia";
      break;
    case "8":
      returnvalue = "Surgical Assistance";
      break;
    case "9":
      returnvalue = "Other Medical";
      break;
    case "10":
      returnvalue = "Blood Charges";
      break;
    case "11":
      returnvalue = "Used Durable Medical Equipment";
      break;
    case "12":
      returnvalue = "Durable Medical Equipment Purchase";
      break;
    case "13":
      returnvalue = "Ambulatory Service Center Facility";
      break;
    case "14":
      returnvalue = "Renal Supplies in the Home";
      break;
    case "15":
      returnvalue = "Alternate Method Dialysis";
      break;
    case "16":
      returnvalue = "Chronic Renal Disease (CRD) Equipment";
      break;
    case "17":
      returnvalue = "Pre-Admission Testing";
      break;
    case "18":
      returnvalue = "Durable Medical Equipment Rental";
      break;
    case "19":
      returnvalue = "Pneumonia Vaccine";
      break;
    case "20":
      returnvalue = "Second Surgical Opinion";
      break;
    case "21":
      returnvalue = "Third Surgical Opinion";
      break;
    case "22":
      returnvalue = "Social Work";
      break;
    case "23":
      returnvalue = "Diagnostic Dental";
      break;
    case "24":
      returnvalue = "Periodontics";
      break;
    case "25":
      returnvalue = "Restorative";
      break;
    case "26":
      returnvalue = "Endodontics";
      break;
    case "27":
      returnvalue = "Maxillofacial Prosthetics";
      break;
    case "28":
      returnvalue = "Adjunctive Dental Services";
      break;
    case "30":
      returnvalue = "Health Benefit Plan Coverage";
      break;
    case "32":
      returnvalue = "Plan Waiting Period";
      break;
    case "33":
      returnvalue = "Chiropractic";
      break;
    case "34":
      returnvalue = "Chiropractic Office Visits";
      break;
    case "35":
      returnvalue = "Dental Care";
      break;
    case "36":
      returnvalue = "Dental Crowns";
      break;
    case "37":
      returnvalue = "Dental Accident";
      break;
    case "38":
      returnvalue = "Orthodontics";
      break;
    case "39":
      returnvalue = "Prosthodontics";
      break;
    case "40":
      returnvalue = "Oral Surgery";
      break;
    case "41":
      returnvalue = "Routine (Preventive) Dental";
      break;
    case "42":
      returnvalue = "Home Health Care";
      break;
    case "43":
      returnvalue = "Home Health Prescriptions";
      break;
    case "44":
      returnvalue = "Home Health Visits";
      break;
    case "45":
      returnvalue = "Hospice";
      break;
    case "46":
      returnvalue = "Respite Care";
      break;
    case "47":
      returnvalue = "Hospital";
      break;
    case "48":
      returnvalue = "Hospital - Inpatient";
      break;
    case "49":
      returnvalue = "Hospital - Room and Board";
      break;
    case "50":
      returnvalue = "Hospital - Outpatient";
      break;
    case "51":
      returnvalue = "Hospital - Emergency Accident";
      break;
    case "52":
      returnvalue = "Hospital - Emergency Medical";
      break;
    case "53":
      returnvalue = "Hospital - Ambulatory Surgical";
      break;
    case "54":
      returnvalue = "Long Term Care";
      break;
    case "55":
      returnvalue = "Major Medical";
      break;
    case "56":
      returnvalue = "Medically Related Transportation";
      break;
    case "57":
      returnvalue = "Air Transportation";
      break;
    case "58":
      returnvalue = "Cabulance";
      break;
    case "59":
      returnvalue = "Licensed Ambulance";
      break;
    case "60":
      returnvalue = "General Benefits";
      break;
    case "61":
      returnvalue = "In-vitro Fertilization";
      break;
    case "62":
      returnvalue = "MRI/CAT Scan";
      break;
    case "63":
      returnvalue = "Donor Procedures";
      break;
    case "64":
      returnvalue = "Acupuncture";
      break;
    case "65":
      returnvalue = "Newborn Care";
      break;
    case "66":
      returnvalue = "Pathology";
      break;
    case "67":
      returnvalue = "Smoking Cessation";
      break;
    case "68":
      returnvalue = "Well Baby Care";
      break;
    case "69":
      returnvalue = "Maternity";
      break;
    case "70":
      returnvalue = "Transplants";
      break;
    case "71":
      returnvalue = "Audiology Exam";
      break;
    case "72":
      returnvalue = "Inhalation Therapy";
      break;
    case "73":
      returnvalue = "Diagnostic Medical";
      break;
    case "74":
      returnvalue = "Private Duty Nursing";
      break;
    case "75":
      returnvalue = "Prosthetic Device";
      break;
    case "76":
      returnvalue = "Dialysis";
      break;
    case "77":
      returnvalue = "Otological Exam";
      break;
    case "78":
      returnvalue = "Chemotherapy";
      break;
    case "79":
      returnvalue = "Allergy Testing";
      break;
    case "80":
      returnvalue = "Immunizations";
      break;
    case "81":
      returnvalue = "Routine Physical";
      break;
    case "82":
      returnvalue = "Family Planning";
      break;
    case "83":
      returnvalue = "Infertility";
      break;
    case "84":
      returnvalue = "Abortion";
      break;
    case "85":
      returnvalue = "AIDS";
      break;
    case "86":
      returnvalue = "Emergency Services";
      break;
    case "87":
      returnvalue = "Cancer";
      break;
    case "88":
      returnvalue = "Pharmacy";
      break;
    case "89":
      returnvalue = "Free Standing Prescription Drug";
      break;
    case "90":
      returnvalue = "Mail Order Prescription Drug";
      break;
    case "91":
      returnvalue = "Brand Name Prescription Drug";
      break;
    case "92":
      returnvalue = "Generic Prescription Drug";
      break;
    case "93":
      returnvalue = "Podiatry";
      break;
    case "94":
      returnvalue = "Podiatry - Office Visits";
      break;
    case "95":
      returnvalue = "Podiatry - Nursing Home Visits";
      break;
    case "96":
      returnvalue = "Professional (Physician)";
      break;
    case "97":
      returnvalue = "Anesthesiologist";
      break;
    case "98":
      returnvalue = "Professional (Physician) Visit - Office";
      break;
    case "99":
      returnvalue = "Professional (Physician) Visit - Inpatient";
      break;
    case "A0":
      returnvalue = "Professional (Physician) Visit - Outpatient";
      break;
    case "A1":
      returnvalue = "Professional (Physician) Visit - Nursing Home";
      break;
    case "A2":
      returnvalue = "Professional (Physician) Visit - Skilled Nursing Facility";
      break;
    case "A3":
      returnvalue = "Professional (Physician) Visit - Home";
      break;
    case "A4":
      returnvalue = "Psychiatric";
      break;
    case "A5":
      returnvalue = "Psychiatric - Room and Board";
      break;
    case "A6":
      returnvalue = "Psychotherapy";
      break;
    case "A7":
      returnvalue = "Psychiatric - Inpatient";
      break;
    case "A8":
      returnvalue = "Psychiatric - Outpatient";
      break;
    case "A9":
      returnvalue = "Rehabilitation";
      break;
    case "AA":
      returnvalue = "Rehabilitation - Room and Board";
      break;
    case "AB":
      returnvalue = "Rehabilitation - Inpatient";
      break;
    case "AC":
      returnvalue = "Rehabilitation - Outpatient";
      break;
    case "AD":
      returnvalue = "Occupational Therapy";
      break;
    case "AE":
      returnvalue = "Physical Medicine";
      break;
    case "AF":
      returnvalue = "Speech Therapy";
      break;
    case "AG":
      returnvalue = "Skilled Nursing Care";
      break;
    case "AH":
      returnvalue = "Skilled Nursing Care - Room and Board";
      break;
    case "AI":
      returnvalue = "Substance Abuse";
      break;
    case "AJ":
      returnvalue = "Alcoholism";
      break;
    case "AK":
      returnvalue = "Drug Addiction";
      break;
    case "AL":
      returnvalue = "Vision (Optometry)";
      break;
    case "AM":
      returnvalue = "Frames";
      break;
    case "AN":
      returnvalue = "Routine Exam";
      break;
    case "AO":
      returnvalue = "Lenses";
      break;
    case "AQ":
      returnvalue = "Nonmedically Necessary Physical";
      break;
    case "AR":
      returnvalue = "Experimental Drug Therapy";
      break;
    case "BA":
      returnvalue = "Independent Medical Evaluation";
      break;
    case "BB":
      returnvalue = "Partial Hospitalization (Psychiatric)";
      break;
    case "BC":
      returnvalue = "Day Care (Psychiatric)";
      break;
    case "BD":
      returnvalue = "Cognitive Therapy";
      break;
    case "BE":
      returnvalue = "Massage Therapy";
      break;
    case "BF":
      returnvalue = "Pulmonary Rehabilitation";
      break;
    case "BG":
      returnvalue = "Cardiac Rehabilitation";
      break;
    case "BH":
      returnvalue = "Pediatric";
      break;
    case "BI":
      returnvalue = "Nursery";
      break;
    case "BJ":
      returnvalue = "Skin";
      break;
    case "BK":
      returnvalue = "Orthopedic";
      break;
    case "BL":
      returnvalue = "Cardiac";
      break;
    case "BM":
      returnvalue = "Lymphatic";
      break;
    case "BN":
      returnvalue = "Gastrointestinal";
      break;
    case "BP":
      returnvalue = "Endocrine";
      break;
    case "BQ":
      returnvalue = "Neurology";
      break;
    case "BR":
      returnvalue = "Eye";
      break;
    case "BS":
      returnvalue = "Invasive Procedures";
      break;
  }
  return returnvalue;
};

// Translate EB04 ELIGIBILITY BENEFIT Code
export const TranslateEB04Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "12":
      returnvalue =
        "Medicare Secondary Working Aged Beneficiary or Spouse with Employer Group Health Plan";
      break;
    case "13":
      returnvalue =
        "Medicare Secondary End-Stage Renal Disease Beneficiary in the 12 month coordination period with an employer's group health plan";
      break;
    case "14":
      returnvalue =
        "Medicare Secondary, No-fault Insurance including Auto is Primary";
      break;
    case "15":
      returnvalue = "Medicare Secondary Worker's Compensation";
      break;
    case "16":
      returnvalue =
        "Medicare Secondary Public Health Service (PHS)or Other Federal Agency";
      break;
    case "41":
      returnvalue = "Medicare Secondary Black Lung";
      break;
    case "42":
      returnvalue = "Medicare Secondary Veteran's Administration";
      break;
    case "43":
      returnvalue =
        "Medicare Secondary Disabled Beneficiary Under Age 65 with Large Group Health Plan (LGHP)";
      break;
    case "47":
      returnvalue = "Medicare Secondary, Other Liability Insurance is Primary";
      break;
    case "AP":
      returnvalue = "Auto Insurance Policy";
      break;
    case "C1":
      returnvalue = "Commercial";
      break;
    case "CO":
      returnvalue = "Consolidated Omnibus Budget Reconciliation Act (COBRA)";
      break;
    case "CP":
      returnvalue = "Medicare Conditionally Primary";
      break;
    case "D":
      returnvalue = "Disability";
      break;
    case "DB":
      returnvalue = "Disability Benefits";
      break;
    case "EP":
      returnvalue = "Exclusive Provider Organization";
      break;
    case "FF":
      returnvalue = "Family or Friends";
      break;
    case "GP":
      returnvalue = "Group Policy";
      break;
    case "HM":
      returnvalue = "Health Maintenance Organization (HMO)";
      break;
    case "HN":
      returnvalue = "Health Maintenance Organization (HMO) - Medicare Risk";
      break;
    case "HS":
      returnvalue = "Special Low Income Medicare Beneficiary";
      break;
    case "IN":
      returnvalue = "Indemnity";
      break;
    case "IP":
      returnvalue = "Individual Policy";
      break;
    case "LC":
      returnvalue = "Long Term Care";
      break;
    case "LD":
      returnvalue = "Long Term Policy";
      break;
    case "LI":
      returnvalue = "Life Insurance";
      break;
    case "LT":
      returnvalue = "Litigation";
      break;
    case "MA":
      returnvalue = "Medicare Part A";
      break;
    case "MB":
      returnvalue = "Medicare Part B";
      break;
    case "MC":
      returnvalue = "Medicaid";
      break;
    case "MH":
      returnvalue = "Medigap Part A";
      break;
    case "MI":
      returnvalue = "Medigap Part B";
      break;
    case "MP":
      returnvalue = "Medicare Primary";
      break;
    case "OT":
      returnvalue = "Other";
      break;
    case "PE":
      returnvalue = "Property Insurance - Personal";
      break;
    case "PL":
      returnvalue = "Personal";
      break;
    case "PP":
      returnvalue = "Personal Payment (Cash - No Insurance)";
      break;
    case "PR":
      returnvalue = "Preferred Provider Organization (PPO)";
      break;
    case "PS":
      returnvalue = "Point of Service (POS)";
      break;
    case "QM":
      returnvalue = "Qualified Medicare Beneficiary";
      break;
    case "RP":
      returnvalue = "Property Insurance - Real";
      break;
    case "SP":
      returnvalue = "Supplemental Policy";
      break;
    case "TF":
      returnvalue = "Tax Equity Fiscal Responsibility Act (TEFRA)";
      break;
    case "WC":
      returnvalue = "Workers Compensation";
      break;
    case "WU":
      returnvalue = "Wrap Up Policy";
      break;
  }
  return returnvalue;
};

// Translate EB06 ELIGIBILITY BENEFIT Code
export const TranslateEB06Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "7":
      returnvalue = "Day";
      break;
    case "13":
      returnvalue = "24 Hours";
      break;
    case "21":
      returnvalue = "Years";
      break;
    case "23":
      returnvalue = "Calendar Year";
      break;
    case "24":
      returnvalue = "Year to Date";
      break;
    case "25":
      returnvalue = "Contract";
      break;
    case "26":
      returnvalue = "Episode";
      break;
    case "27":
      returnvalue = "Visit";
      break;
    case "28":
      returnvalue = "Outlier";
      break;
    case "29":
      returnvalue = "Remaining";
      break;
    case "30":
      returnvalue = "Exceeded";
      break;
    case "31":
      returnvalue = "Not Exceeded";
      break;
    case "32":
      returnvalue = "Lifetime";
      break;
    case "33":
      returnvalue = "Lifetime Remaining";
      break;
    case "34":
      returnvalue = "Month";
      break;
    case "35":
      returnvalue = "Week";
      break;
    case "36":
      returnvalue = "Admission";
      break;
  }
  return returnvalue;
};

// Translate EB09 ELIGIBILITY BENEFIT Code
export const TranslateEB09Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "CA":
      returnvalue = "Covered - Actual";
      break;
    case "CE":
      returnvalue = "Covered - Estimated";
      break;
    case "DB":
      returnvalue = "Deductible Blood Units";
      break;
    case "DY":
      returnvalue = "Days";
      break;
    case "HS":
      returnvalue = "Hours";
      break;
    case "LA":
      returnvalue = "Life-time Reserve - Actual";
      break;
    case "LE":
      returnvalue = "Life-time Reserve - Estimated";
      break;
    case "MN":
      returnvalue = "Month";
      break;
    case "P6":
      returnvalue = "Number of Services or Procedures";
      break;
    case "QA":
      returnvalue = "Quantity Approved";
      break;
    case "S7":
      returnvalue = "Age, High Value";
      break;
    case "S8":
      returnvalue = "Age, Low Value";
      break;
    case "VS":
      returnvalue = "Visits";
      break;
    case "YY":
      returnvalue = "Years";
      break;
  }
  return returnvalue;
};

// Translate EB011 ELIGIBILITY BENEFIT Code
export const TranslateEB11Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "N":
      returnvalue = "No";
      break;
    case "U":
      returnvalue = "Unknown";
      break;
    case "Y":
      returnvalue = "Yes";
      break;
  }
  return returnvalue;
};

// Translate EB012 ELIGIBILITY BENEFIT Code
export const TranslateEB12Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "N":
      returnvalue = "No";
      break;
    case "U":
      returnvalue = "Unknown";
      break;
    case "Y":
      returnvalue = "Yes";
      break;
  }
  return returnvalue;
};

// Translate EB013 ELIGIBILITY BENEFIT Code
export const TranslateEB13Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "AD":
      returnvalue = "American Dental Association Codes";
      break;
    case "CJ":
      returnvalue = "Current Procedural Terminology (CPT) Codes";
      break;
    case "HC":
      returnvalue =
        "Health Care Financing Administration Common Procedural Coding System (HCPCS) Codes";
      break;
  }
  return returnvalue;
};

// Translate HSD01 ELIGIBILITY BENEFIT Code
export const TranslateHSD01Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "DY":
      returnvalue = "Days";
      break;
    case "FL":
      returnvalue = "Units";
      break;
    case "HS":
      returnvalue = "Hours";
      break;
    case "MN":
      returnvalue = "Month";
      break;
    case "VS":
      returnvalue = "Visits";
      break;
  }
  return returnvalue;
};

// Translate HSD03 HEALTH CARE SERVICES DELIVERY (HSD) Code
export const TranslateHSD03Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "DA":
      returnvalue = "Days";
      break;
    case "MO":
      returnvalue = "Months";
      break;
    case "VS":
      returnvalue = "Visit";
      break;
    case "WK":
      returnvalue = "Week";
      break;
    case "YR":
      returnvalue = "Years";
      break;
  }
  return returnvalue;
};

// Translate HSD05 HEALTH CARE SERVICES DELIVERY (HSD) Code
export const TranslateHSD05Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "6":
      returnvalue = "Hour";
      break;
    case "7":
      returnvalue = "Day";
      break;
    case "21":
      returnvalue = "Years";
      break;
    case "22":
      returnvalue = "Service Year";
      break;
    case "23":
      returnvalue = "Calendar Year";
      break;
    case "24":
      returnvalue = "Year to Date";
      break;
    case "25":
      returnvalue = "Contract";
      break;
    case "26":
      returnvalue = "Episode";
      break;
    case "27":
      returnvalue = "Visit";
      break;
    case "28":
      returnvalue = "Outlier";
      break;
    case "29":
      returnvalue = "Remaining";
      break;
    case "30":
      returnvalue = "Exceeded";
      break;
    case "31":
      returnvalue = "Not Exceeded";
      break;
    case "32":
      returnvalue = "Lifetime";
      break;
    case "33":
      returnvalue = "Lifetime Remaining";
      break;
    case "34":
      returnvalue = "Month";
      break;
    case "35":
      returnvalue = "Week";
      break;
  }
  return returnvalue;
};

// Translate HSD07 HEALTH CARE SERVICES DELIVERY (HSD) Code
export const TranslateHSD07Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "1":
      returnvalue = "1st Week of the Month";
      break;
    case "2":
      returnvalue = "2nd Week of the Month";
      break;
    case "3":
      returnvalue = "3rd Week of the Month";
      break;
    case "4":
      returnvalue = "4th Week of the Month";
      break;
    case "5":
      returnvalue = "5th Week of the Month";
      break;
    case "6":
      returnvalue = "1st & 3rd Weeks of the Month";
      break;
    case "7":
      returnvalue = "2nd & 4th Weeks of the Month";
      break;
    case "8":
      returnvalue = "1st Working Day of Period";
      break;
    case "9":
      returnvalue = "Last Working Day of Period";
      break;
    case "A":
      returnvalue = "Monday through Friday";
      break;
    case "B":
      returnvalue = "Monday through Saturday";
      break;
    case "C":
      returnvalue = "Monday through Sunday";
      break;
    case "D":
      returnvalue = "Monday";
      break;
    case "E":
      returnvalue = "Tuesday";
      break;
    case "F":
      returnvalue = "Wednesday";
      break;
    case "G":
      returnvalue = "Thursday";
      break;
    case "H":
      returnvalue = "Friday";
      break;
    case "J":
      returnvalue = "Saturday";
      break;
    case "K":
      returnvalue = "Sunday";
      break;
    case "L":
      returnvalue = "Monday through Thursday";
      break;
    case "M":
      returnvalue = "Immediately";
      break;
    case "N":
      returnvalue = "As Directed";
      break;
    case "O":
      returnvalue = "Daily Mon. through Fri.";
      break;
    case "P":
      returnvalue = "1/2 Mon. & 1/2 Thurs.";
      break;
    case "Q":
      returnvalue = "1/2 Tues. & 1/2 Thurs.";
      break;
    case "R":
      returnvalue = "1/2 Wed. & 1/2 Fri.";
      break;
    case "S":
      returnvalue = "Once Anytime Mon. through Fri.";
      break;
    case "SG":
      returnvalue = "Tuesday through Friday";
      break;
    case "SL":
      returnvalue = "Monday, Tuesday and Thursday";
      break;
    case "SP":
      returnvalue = "Monday, Tuesday and Friday";
      break;
    case "SX":
      returnvalue = "Wednesday and Thursday";
      break;
    case "SY":
      returnvalue = "Monday, Wednesday and Thursday";
      break;
    case "SZ":
      returnvalue = "Tuesday, Thursday and Friday";
      break;
    case "T":
      returnvalue = "1/2 Tue. & 1/2 Fri.";
      break;
    case "U":
      returnvalue = "1/2 Mon. & 1/2 Wed.";
      break;
    case "V":
      returnvalue = "1/3 Mon., 1/3 Wed., 1/3 Fri.";
      break;
    case "W":
      returnvalue = "Whenever Necessary";
      break;
    case "X":
      returnvalue = "1/2 By Wed., Bal. By Fri.";
      break;
    case "Y":
      returnvalue = "None (Also Used to Cancel or Override a Previous Pattern)";
      break;
  }
  return returnvalue;
};

// Translate HSD08 HEALTH CARE SERVICES DELIVERY (HSD) Code
export const TranslateHSD08Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "A":
      returnvalue = "1st Shift (Normal Working Hours";
      break;
    case "B":
      returnvalue = "2nd Shift";
      break;
    case "C":
      returnvalue = "3rd Shift";
      break;
    case "D":
      returnvalue = "A.M.";
      break;
    case "E":
      returnvalue = "P.M.";
      break;
    case "F":
      returnvalue = "As Directed";
      break;
    case "G":
      returnvalue = "Any Shift";
      break;
    case "Y":
      returnvalue = "None (Also Used to Cancel or Override a Previous Pattern)";
      break;
  }
  return returnvalue;
};

// Translate AAA03 Reject Reason Code
export const TranslateAAA03Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "15":
      returnvalue = "Required application data missing";
      break;
    case "42":
      returnvalue = "Unable to Respond at Current Time ";
      break;
    case "43":
      returnvalue = "Invalid/Missing Provider Identification";
      break;
    case "45":
      returnvalue = "Invalid/Missing Provider Specialty";
      break;
    case "47":
      returnvalue = "Invalid/Missing Provider State";
      break;
    case "48":
      returnvalue = "Invalid/Missing Referring Provider Identification Number";
      break;
    case "49":
      returnvalue = "Provider is Not Primary Care Physician";
      break;
    case "51":
      returnvalue = "Provider Not on File";
      break;
    case "52":
      returnvalue = "Service Dates Not Within Provider Plan Enrollment";
      break;
    case "53":
      returnvalue = "Inquired Benefit Inconsistent with Provider Type";
      break;
    case "54":
      returnvalue = "Inappropriate Product/Service ID Qualifier";
      break;
    case "55":
      returnvalue = "Inappropriate Product/Service ID";
      break;
    case "56":
      returnvalue = "Inappropriate Date";
      break;
    case "57":
      returnvalue = "Invalid/Missing Date(s) of Service";
      break;
    case "58":
      returnvalue = "Invalid/Missing Date-of-Birth";
      break;
    case "60":
      returnvalue = "Date of Birth Follows Date(s) of Service";
      break;
    case "61":
      returnvalue = "Date of Death Precedes Date(s) of Service";
      break;
    case "62":
      returnvalue = "Date of Service Not Within Allowable Inquiry Period";
      break;
    case "63":
      returnvalue = "Date of Service in Future";
      break;
    case "64":
      returnvalue = "Invalid/Missing Patient ID";
      break;
    case "65":
      returnvalue = "Invalid/Missing Patient Name";
      break;
    case "66":
      returnvalue = "Invalid/Missing Patient Gender Code";
      break;
    case "67":
      returnvalue = "Patient Not Found";
      break;
    case "68":
      returnvalue = "Duplicate Patient ID Number";
      break;
    case "69":
      returnvalue = "Inconsistent with Patient's Age";
      break;
    case "71":
      returnvalue =
        "Patient Birth Date Does Not Match That for the Patient on the Database";
      break;
    case "72":
      returnvalue = "Invalid/Missing Subscriber/Insured ID";
      break;
    case "73":
      returnvalue = "Invalid/Missing Subscriber/Insured Name";
      break;
    case "75":
      returnvalue = "Subscriber/Insured Not Found";
      break;
    case "76":
      returnvalue = "Duplicate Subscriber/Insured ID Number";
      break;
    case "77":
      returnvalue = "Subscriber Found, Patient Not Found";
      break;
  }
  return returnvalue;
};

// Translate AAA04 Follow-up Action Code
export const TranslateAAA04Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "C":
      returnvalue = "Please Correct and Resubmit";
      break;
    case "N":
      returnvalue = "Resubmission Not Allowed";
      break;
    case "R":
      returnvalue = "Resubmission Allowed Use only when AAA03 is 42.";
      break;
    case "S":
      returnvalue = "Do Not Resubmit; Inquiry Initiated to a Third Party";
      break;
    case "W":
      returnvalue = "Please Wait 30 Days and Resubmit";
      break;
    case "X":
      returnvalue = "Please Wait 10 Days and Resubmit";
      break;
    case "Y":
      returnvalue =
        "Do Not Resubmit; We Will Hold Your Request and Respond Again Shortly";
      break;
  }
  return returnvalue;
};

// Translate NM101 SUBSCRIBER BENEFIT RELATED ENTITY NAME (NM1) NM101 98 M ID 2/3 Code
export const TranslateNM101Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "1P":
      returnvalue = "Provider";
      break;
    case "2B":
      returnvalue = "Third-Party Administrator";
      break;
    case "36":
      returnvalue = "Employer";
      break;
    case "73":
      returnvalue = "Other Physician";
      break;
    case "FA":
      returnvalue = "Facility";
      break;
    case "GP":
      returnvalue = "Gateway Provider";
      break;
    case "IL":
      returnvalue = "Insured or Subscriber";
      break;
    case "LR":
      returnvalue = "Legal Representative";
      break;
    case "P3":
      returnvalue = "Primary Care Provider";
      break;
    case "P4":
      returnvalue = "Prior Insurance Carrier";
      break;
    case "P5":
      returnvalue = "Plan Sponsor";
      break;
    case "PR":
      returnvalue = "Payer";
      break;
    case "PRP":
      returnvalue = "Primary Payer";
      break;
    case "SEP":
      returnvalue = "Secondary Payer";
      break;
    case "TTP":
      returnvalue = "Tertiary Payer";
      break;
    case "VN":
      returnvalue = "Vendor";
      break;
    case "X3":
      returnvalue = "Utilization Management Organization";
      break;
  }
  return returnvalue;
};

// Translate NM102 NM101- Entity Type Qualifier
export const TranslateNM102Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "1":
      returnvalue = "Person";
      break;
    case "2":
      returnvalue = "Non-Person Entity";
      break;
  }
  return returnvalue;
};

// Translate NM108 NM101- Identification Code Qualifier
export const TranslateNM108Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "24":
      returnvalue = "Employer's Identification Number";
      break;
    case "34":
      returnvalue = "Social Security Number";
      break;
    case "46":
      returnvalue = "Electronic Transmitter Identification Number (ETIN)";
      break;
    case "FA":
      returnvalue = "Facility Identification";
      break;
    case "FI":
      returnvalue = "Federal Taxpayer's Identification Number";
      break;
    case "MI":
      returnvalue = "Member Identification Number";
      break;
    case "NI":
      returnvalue =
        "National Association of Insurance Commissioners (NAIC) Identification";
      break;
    case "PI":
      returnvalue = "Payor Identification";
      break;
    case "PP":
      returnvalue = "Pharmacy Processor Number";
      break;
    case "SV":
      returnvalue = "Service Provider Number";
      break;
    case "XV":
      returnvalue = "Health Care Financing Administration National PlanID";
      break;
    case "XX":
      returnvalue =
        "Health Care Financing Administration National Provider Identifier";
      break;
    case "ZZ":
      returnvalue = "Mutually Defined";
      break;
  }
  return returnvalue;
};

// Translate PER03/PER07 NM101- Communication Number Qualifier Code
export const TranslatePER03Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "ED":
      returnvalue = "Electronic Data Interchange Access Number";
      break;
    case "EM":
      returnvalue = "Electronic Mail";
      break;
    case "EX":
      returnvalue = "Telephone Extension";
      break;
    case "FX":
      returnvalue = "Facsimile";
      break;
    case "TE":
      returnvalue = "Telephone";
      break;
    case "WP":
      returnvalue = "Work Phone Number";
      break;
  }
  return returnvalue;
};

// Translate PRV01 NM101- Provider Code
export const TranslatePRV01Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "AD":
      returnvalue = "Admitting";
      break;
    case "AT":
      returnvalue = "Attending";
      break;
    case "BI":
      returnvalue = "Billing";
      break;
    case "CO":
      returnvalue = "Consulting";
      break;
    case "CV":
      returnvalue = "Covering";
      break;
    case "H":
      returnvalue = "Hospital";
      break;
    case "HH":
      returnvalue = "Home Health Care";
      break;
    case "LA":
      returnvalue = "Laboratory";
      break;
    case "OT":
      returnvalue = "Other Physician";
      break;
    case "P1":
      returnvalue = "Pharmacist";
      break;
    case "P2":
      returnvalue = "Pharmacy";
      break;
    case "PC":
      returnvalue = "Primary Care Physician";
      break;
    case "PE":
      returnvalue = "Performing";
      break;
    case "R":
      returnvalue = "Rural Health Clinic";
      break;
    case "RF":
      returnvalue = "Referring";
      break;
    case "SB":
      returnvalue = "Submitting";
      break;
    case "SK":
      returnvalue = "Skilled Nursing Facility";
      break;
    case "SU":
      returnvalue = "Supervising";
      break;
  }
  return returnvalue;
};

// Translate INS01 Insured Indicator
export const TranslateINS01Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "Y":
      returnvalue = "Yes";
      break;
    case "N":
      returnvalue = "No";
      break;
  }
  return returnvalue;
};

// Translate INS02 Individual Relationship Code
export const TranslateINS02Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "1":
      returnvalue = "Spouse";
      break;
    case "18":
      returnvalue = "Self";
      break;
    case "19":
      returnvalue = "Child";
      break;
    case "21":
      returnvalue = "Unknown";
      break;
    case "34":
      returnvalue = "Other Adult";
      break;
  }
  return returnvalue;
};

// Translate INS03 Maintenance Type Code
export const TranslateINS03Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "001":
      returnvalue = "Change";
      break;
  }
  return returnvalue;
};

// Translate INS04 Change in Identifying Elements: FirstName, LastName, dob, hic# .....
export const TranslateINS04Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "25":
      returnvalue = "Change in Identifying Elements";
      break;
  }
  return returnvalue;
};

// Translate INS09 Student Status Code
export const TranslateINS09Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "F":
      returnvalue = "Full-time";
      break;
    case "N":
      returnvalue = "Not a Student";
      break;
    case "P":
      returnvalue = "Part-time";
      break;
  }
  return returnvalue;
};

// Translate DTP01 Date/Time Qualifier Code
export const TranslateDTP01Code = (typecode) => {
  // '290': returnvalue = 'Coordination of Benefits' = COB
  // Consolidated Omnibus Budget Reconciliation Act = (COBRA)
  let returnvalue = typecode;
  switch (typecode) {
    case "102":
      returnvalue = "Issue";
      break;
    case "152":
      returnvalue = "Effective Date of Change";
      break;
    case "193":
      returnvalue = "Period Start Date";
      break;
    case "194":
      returnvalue = "Period End Date";
      break;
    case "198":
      returnvalue = "Completion Date";
      break;
    case "290":
      returnvalue = "COB Date";
      break;
    case "291":
      returnvalue = "Plan Date";
      break;
    case "292":
      returnvalue = "Benefit Date";
      break;
    case "295":
      returnvalue = "Primary Care Provider";
      break;
    case "304":
      returnvalue = "Latest Visit or Consultation";
      break;
    case "307":
      returnvalue = "Eligibility Date";
      break;
    case "318":
      returnvalue = "Added Date";
      break;
    case "340":
      returnvalue = "COBRA Begin Date";
      break;
    case "341":
      returnvalue = "COBRA End Date";
      break;
    case "342":
      returnvalue = "Premium Paid to Date Begin";
      break;
    case "343":
      returnvalue = "Premium Paid to Date End";
      break;
    case "346":
      returnvalue = "Plan Begin Date";
      break;
    case "347":
      returnvalue = "Plan End Date";
      break;
    case "348":
      returnvalue = "Benefit Begin";
      break;
    case "349":
      returnvalue = "Benefit End Date";
      break;
    case "356":
      returnvalue = "Eligibility Begin Date";
      break;
    case "357":
      returnvalue = "Eligibility End Date";
      break;
    case "382":
      returnvalue = "Enrollment Date";
      break;
    case "435":
      returnvalue = "Admission Date";
      break;
    case "442":
      returnvalue = "Date of Death";
      break;
    case "458":
      returnvalue = "Certification Date";
      break;
    case "472":
      returnvalue = "Service Date";
      break;
    case "539":
      returnvalue = "Policy Effective Date";
      break;
    case "540":
      returnvalue = "Policy Expiration Date";
      break;
    case "636":
      returnvalue = "Date of Last Update";
      break;
    case "771":
      returnvalue = "Status Date";
      break;
  }
  return returnvalue;
};

// Translate PRV02 Reference Identification Qualifier Code
export const TranslatePRV02Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "9K":
      returnvalue = "Servicer";
      break;
    case "D3":
      returnvalue = "National Association of Boards of Pharmacy Number  ";
      break;
    case "EI":
      returnvalue = "Employer's Identification Number";
      break;
    case "HPI":
      returnvalue =
        "Health Care Financing Administration National Provider Identifier ";
      break;
    case "SY":
      returnvalue = "Social Security Number";
      break;
    case "TJ":
      returnvalue = "Federal Taxpayer's Identification Number";
      break;
    case "ZZ":
      returnvalue = "Mutually Defined";
      break;
  }
  return returnvalue;
};

// Translate III01 Code List Qualifier Code
export const TranslateIII01Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "BF":
      returnvalue = "Diagnosis";
      break;
    case "BK":
      returnvalue = "Principal Diagnosis";
      break;
    case "ZZ":
      returnvalue = "Mutually Defined";
      break;
    case "ABF":
      returnvalue = "Diagnosis";
      break;
    case "ABK":
      returnvalue = "Principal Diagnosis";
      break;
  }
  return returnvalue;
};

// Translate EQ01 SUBSCRIBER ELIGIBILITY OR BENEFIT INQUIRY Code
export const TranslateEQ01Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "1":
      returnvalue = "Medical Care";
      break;
    case "2":
      returnvalue = "Surgical";
      break;
    case "3":
      returnvalue = "Consultation";
      break;
    case "4":
      returnvalue = "Diagnostic X-Ray";
      break;
    case "5":
      returnvalue = "Diagnostic Lab";
      break;
    case "6":
      returnvalue = "Radiation Therapy";
      break;
    case "7":
      returnvalue = "Anesthesia";
      break;
    case "8":
      returnvalue = "Surgical Assistance";
      break;
    case "9":
      returnvalue = "Other Medical ";
      break;
    case "10":
      returnvalue = "Blood Charges ";
      break;
    case "11":
      returnvalue = "Used Durable Medical Equipment";
      break;
    case "12":
      returnvalue = "Durable Medical Equipment Purchase";
      break;
    case "13":
      returnvalue = "Ambulatory Service Center Facility";
      break;
    case "14":
      returnvalue = "Renal Supplies in the Home ";
      break;
    case "15":
      returnvalue = "Alternate Method Dialysis";
      break;
    case "16":
      returnvalue = "Chronic Renal Disease (CRD) Equipment";
      break;
    case "17":
      returnvalue = "Pre-Admission Testing";
      break;
    case "18":
      returnvalue = "Durable Medical Equipment Rental";
      break;
    case "19":
      returnvalue = "Pneumonia Vaccine";
      break;
    case "20":
      returnvalue = "Second Surgical Opinion";
      break;
    case "21":
      returnvalue = "Third Surgical Opinion";
      break;
    case "22":
      returnvalue = "Social Work";
      break;
    case "23":
      returnvalue = "Diagnostic Dental";
      break;
    case "24":
      returnvalue = "Periodontics";
      break;
    case "25":
      returnvalue = "Restorative";
      break;
    case "26":
      returnvalue = "Endodontics";
      break;
    case "27":
      returnvalue = "Maxillofacial Prosthetics";
      break;
    case "28":
      returnvalue = "Adjunctive Dental Services";
      break;
    case "30":
      returnvalue = "Health Benefit Plan Coverage";
      break;
    case "32":
      returnvalue = "Plan Waiting Period";
      break;
    case "33":
      returnvalue = "Chiropractic";
      break;
    case "34":
      returnvalue = "Chiropractic Office Visits";
      break;
    case "35":
      returnvalue = "Dental Care";
      break;
    case "36":
      returnvalue = "Dental Crowns";
      break;
    case "37":
      returnvalue = "Dental Accident";
      break;
    case "38":
      returnvalue = "Orthodontics";
      break;
    case "39":
      returnvalue = "Prosthodontics";
      break;
    case "40":
      returnvalue = "Oral Surgery";
      break;
    case "41":
      returnvalue = "Routine (Preventive) Dental";
      break;
    case "42":
      returnvalue = "Home Health Care";
      break;
    case "43":
      returnvalue = "Home Health Prescriptions";
      break;
    case "44":
      returnvalue = "Home Health Visit ";
      break;
    case "45":
      returnvalue = "Hospice";
      break;
    case "46":
      returnvalue = "Respite Care";
      break;
    case "47":
      returnvalue = "Hospital";
      break;
    case "48":
      returnvalue = "Hospital - Inpatient";
      break;
    case "49":
      returnvalue = "Hospital - Room and Board";
      break;
    case "50":
      returnvalue = "Hospital - Outpatient ";
      break;
    case "51":
      returnvalue = "Hospital - Emergency Accident";
      break;
    case "52":
      returnvalue = "Hospital - Emergency Medical ";
      break;
    case "53":
      returnvalue = "Hospital - Ambulatory Surgical";
      break;
    case "54":
      returnvalue = "Long Term Car ";
      break;
    case "55":
      returnvalue = "Major Medical";
      break;
    case "56":
      returnvalue = "Medically Related Transportation";
      break;
    case "57":
      returnvalue = "Air Transportation";
      break;
    case "58":
      returnvalue = "Cabulance";
      break;
    case "59":
      returnvalue = "Licensed Ambulance";
      break;
    case "60":
      returnvalue = "General Benefits";
      break;
    case "61":
      returnvalue = "In-vitro Fertilization";
      break;
    case "62":
      returnvalue = "MRI/CAT Scan";
      break;
    case "63":
      returnvalue = "Donor Procedures";
      break;
    case "64":
      returnvalue = "Acupuncture";
      break;
    case "65":
      returnvalue = "Newborn Car ";
      break;
    case "66":
      returnvalue = "Pathology";
      break;
    case "67":
      returnvalue = "Smoking Cessation";
      break;
    case "68":
      returnvalue = "Well Baby Care";
      break;
    case "69":
      returnvalue = "Maternity";
      break;
    case "70":
      returnvalue = "Transplant";
      break;
    case "71":
      returnvalue = "Audiology Exam";
      break;
    case "72":
      returnvalue = "Inhalation Therapy";
      break;
    case "73":
      returnvalue = "Diagnostic Medical";
      break;
    case "74":
      returnvalue = "Private Duty Nursing";
      break;
    case "75":
      returnvalue = "Prosthetic Device";
      break;
    case "76":
      returnvalue = "Dialysis";
      break;
    case "77":
      returnvalue = "Otological Exam";
      break;
    case "78":
      returnvalue = "Chemotherapy";
      break;
    case "79":
      returnvalue = "Allergy Testing";
      break;
    case "80":
      returnvalue = "Immunizations";
      break;
    case "81":
      returnvalue = "Routine Physical";
      break;
    case "82":
      returnvalue = "Family Planning";
      break;
    case "83":
      returnvalue = "Infertility";
      break;
    case "84":
      returnvalue = "Abortion";
      break;
    case "85":
      returnvalue = "AIDS";
      break;
    case "86":
      returnvalue = "Emergency Services";
      break;
    case "87":
      returnvalue = "Cancer";
      break;
    case "88":
      returnvalue = "Pharmacy";
      break;
    case "89":
      returnvalue = "Free Standing Prescription Drug";
      break;
    case "90":
      returnvalue = "Mail Order Prescription Drug";
      break;
    case "91":
      returnvalue = "Brand Name Prescription Drug";
      break;
    case "92":
      returnvalue = "Generic Prescription Drug";
      break;
    case "93":
      returnvalue = "Podiatry";
      break;
    case "94":
      returnvalue = "Podiatry - Office Visits";
      break;
    case "95":
      returnvalue = "Podiatry - Nursing Home Visits";
      break;
    case "96":
      returnvalue = "Professional (Physician)";
      break;
    case "97":
      returnvalue = "Anesthesiologist";
      break;
    case "98":
      returnvalue = "Professional (Physician) Visit - Office";
      break;
    case "99":
      returnvalue = "Professional (Physician) Visit - Inpatient";
      break;
    case "A0":
      returnvalue = "Professional (Physician) Visit - Outpatient";
      break;
    case "A1":
      returnvalue = "Professional (Physician) Visit - Nursing Home";
      break;
    case "A2":
      returnvalue = "Professional (Physician) Visit - Skilled Nursing Facility";
      break;
    case "A3":
      returnvalue = "Professional (Physician) Visit - Home";
      break;
    case "A4":
      returnvalue = "Psychiatric";
      break;
    case "A5":
      returnvalue = "Psychiatric - Room and Board";
      break;
    case "A6":
      returnvalue = "Psychotherapy";
      break;
    case "A7":
      returnvalue = "Psychiatric – Inpatient";
      break;
    case "A8":
      returnvalue = "Psychiatric - Outpatient";
      break;
    case "A9":
      returnvalue = "Rehabilitation";
      break;
    case "AA":
      returnvalue = "Rehabilitation - Room and Board";
      break;
    case "AB":
      returnvalue = "Rehabilitation - Inpatient";
      break;
    case "AC":
      returnvalue = "Rehabilitation - Outpatient";
      break;
    case "AD":
      returnvalue = "Occupational Therapy";
      break;
    case "AE":
      returnvalue = "Physical Medicine";
      break;
    case "AF":
      returnvalue = "Speech Therapy";
      break;
    case "AG":
      returnvalue = "Skilled Nursing Care";
      break;
    case "AH":
      returnvalue = "Skilled Nursing Care - Room and Board";
      break;
    case "AI":
      returnvalue = "Substance Abuse";
      break;
    case "AJ":
      returnvalue = "Alcoholism";
      break;
    case "AK":
      returnvalue = "Drug Addiction";
      break;
    case "AL":
      returnvalue = "Vision (Optometry)";
      break;
    case "AM":
      returnvalue = "Frames";
      break;
    case "AN":
      returnvalue = "Routine Exam";
      break;
    case "AO":
      returnvalue = "Lenses";
      break;
    case "AQ":
      returnvalue = "Nonmedically Necessary Physical";
      break;
    case "AR":
      returnvalue = "Experimental Drug Therapy";
      break;
    case "BA":
      returnvalue = "Independent Medical Evaluation";
      break;
    case "BB":
      returnvalue = "Partial Hospitalization (Psychiatric)";
      break;
    case "BC":
      returnvalue = "Day Care (Psychiatric) ";
      break;
    case "BD":
      returnvalue = "Cognitive Therapy";
      break;
    case "BE":
      returnvalue = "Massage Therapy";
      break;
    case "BF":
      returnvalue = "Pulmonary Rehabilitation";
      break;
    case "BG":
      returnvalue = "Cardiac Rehabilitation ";
      break;
    case "BH":
      returnvalue = "Pediatric";
      break;
    case "BI":
      returnvalue = "Nursery";
      break;
    case "BJ":
      returnvalue = "Skin";
      break;
    case "BK":
      returnvalue = "Orthopedic";
      break;
    case "BL":
      returnvalue = "Cardiac";
      break;
    case "BM":
      returnvalue = "Lymphatic";
      break;
    case "BN":
      returnvalue = "Gastrointestinal";
      break;
    case "BP":
      returnvalue = "Endocrine";
      break;
    case "BQ":
      returnvalue = "Neurology";
      break;
    case "BR":
      returnvalue = "Eye";
      break;
    case "BS":
      returnvalue = "Invasive Procedures";
      break;
  }
  return returnvalue;
};

// Translate EQ02 SUBSCRIBER ELIGIBILITY OR BENEFIT INQUIRY Code
export const TranslateEQ02Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "AD":
      returnvalue = "American Dental Association Codes";
      break;
    case "CJ":
      returnvalue = "Current Procedural Terminology (CPT) Codes";
      break;
    case "HC":
      returnvalue =
        "Health Care Financing Administration Common Procedural Coding System (HCPCS) Codes";
      break;
    case "ID":
      returnvalue =
        "International Classification of Diseases Clinical Modification (ICD-9-CM) - Procedure";
      break;
    case "IV":
      returnvalue = "Home Infusion EDI Coalition (HIEC) Product/Service Code";
      break;
    case "ND":
      returnvalue = "National Drug Code (NDC)";
      break;
    case "ZZ":
      returnvalue = "Mutually Defined";
      break;
    default:
      returnvalue = "NOT ADVISED";
      break;
  }
  return returnvalue;
};

// Translate EQ03 SUBSCRIBER ELIGIBILITY OR BENEFIT INQUIRY Code
export const TranslateEQ03Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "CHD":
      returnvalue = "Children Only";
      break;
    case "DEP":
      returnvalue = "Dependents Only";
      break;
    case "ECH":
      returnvalue = "Employee and Children";
      break;
    case "EMP":
      returnvalue = "Employee Only";
      break;
    case "ESP":
      returnvalue = "Employee and Spouse";
      break;
    case "FAM":
      returnvalue = "Family";
      break;
    case "IND":
      returnvalue = "Individual";
      break;
    case "SPC":
      returnvalue = "Spouse and Children";
      break;
    case "SPO":
      returnvalue = "Spouse Only";
      break;
  }
  return returnvalue;
};

// Translate EQ04 SUBSCRIBER ELIGIBILITY OR BENEFIT INQUIRY Code
export const TranslateEQ04Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "AP":
      returnvalue = "Auto Insurance Policy";
      break;
    case "CO":
      returnvalue = "Consolidated Omnibus Budget Reconciliation Act (COBRA)";
      break;
    case "GP":
      returnvalue = "Group Policy";
      break;
    case "HM":
      returnvalue = "Health Maintenance Organization (HMO)";
      break;
    case "HN":
      returnvalue = "Health Maintenance Organization (HMO) - Medicare Risk";
      break;
    case "IP":
      returnvalue = "Individual Policy";
      break;
    case "MA":
      returnvalue = "Medicare Part A";
      break;
    case "MB":
      returnvalue = "Medicare Part B";
      break;
    case "MC":
      returnvalue = "Medicaid";
      break;
    case "PR":
      returnvalue = "Preferred Provider Organization (PPO)";
      break;
    case "PS":
      returnvalue = "Point of Service (POS)";
      break;
    case "SP":
      returnvalue = "Supplemental Policy";
      break;
    case "WC":
      returnvalue = "Workers Compensation";
      break;
  }
  return returnvalue;
};

// Translate REF01 - REFERENCE QUALIFIER Code
export const TranslateREF01Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "EL":
      returnvalue = "Electronic device pin number";
      break;
    case "A6":
      returnvalue = "Employee Identification Number";
      break;
    case "1J":
      returnvalue = "Facility ID Number";
      break;
    case "N7":
      returnvalue = "Facility Network Identification Number";
      break;
    case "49":
      returnvalue = "Family Unit Number";
      break;
    case "6P":
      returnvalue = "Group Number";
      break;
    case "1L":
      returnvalue = "Group or Policy Number";
      break;
    case "HPI":
      returnvalue =
        "Health Care Financing Administration National Provider Identifier The Health Care Financing Administration National Provider Identifier may be used in this segment prior to being mandated for use";
      break;
    case "F6":
      returnvalue = "Health Insurance Claim (HIC) Number";
      break;
    case "GH":
      returnvalue = "Identification Card Serial Number";
      break;
    case "HJ":
      returnvalue = "Identity Card Number";
      break;
    case "IG":
      returnvalue = "Insurance Policy Number";
      break;
    case "IF":
      returnvalue = "Issue Number";
      break;
    case "NQ":
      returnvalue = "Medicaid Recipient Identification Number";
      break;
    case "M7":
      returnvalue = "Medical Assistance Category";
      break;
    case "EA":
      returnvalue = "Medical Record Identification Number";
      break;
    case "1C":
      returnvalue = "Medicare Provider Number";
      break;
    case "1W":
      returnvalue = "Member Identification Number";
      break;
    case "EJ":
      returnvalue = "Patient Account Number";
      break;
    case "4A":
      returnvalue = "Personal Identification Number (PIN)";
      break;
    case "N6":
      returnvalue = "Plan Network Identification Number";
      break;
    case "18":
      returnvalue = "Plan Number";
      break;
    case "G1":
      returnvalue = "Prior Authorization Number";
      break;
    case "Q4":
      returnvalue = "Prior Identifier Number";
      break;
    case "N5":
      returnvalue = "Provider Plan Network Identification Number";
      break;
    case "9F":
      returnvalue = "Referral Number";
      break;
    case "SY":
      returnvalue = "Social Security Number";
      break;
    case "0B":
      returnvalue = "State License Number";
      break;
    case "EO":
      returnvalue = "Submitter Identification Number";
      break;
    case "JD":
      returnvalue = "User Identification";
      break;
  }
  return returnvalue;
};

// Translate EB013 ELIGIBILITY HCPCS Code
export const TranslateHCPCSCode = (typecode) => {
  let returnvalue;
  switch (typecode) {
    case "A1":
      returnvalue = "DRESSING FOR ONE WOUND";
      break;
    case "A2":
      returnvalue = "DRESSING FOR TWO WOUNDS";
      break;
    case "A3":
      returnvalue = "DRESSING FOR THREE WOUNDS";
      break;
    case "A4":
      returnvalue = "DRESSING FOR FOUR WOUNDS";
      break;
    case "A5":
      returnvalue = "DRESSING FOR FIVE WOUNDS";
      break;
    case "A6":
      returnvalue = "DRESSING FOR SIX WOUNDS";
      break;
    case "A7":
      returnvalue = "DRESSING FOR SEVEN WOUNDS";
      break;
    case "A8":
      returnvalue = "DRESSING FOR EIGHT WOUNDS";
      break;
    case "A9":
      returnvalue = "DRESSING FOR 9 OR MORE WOUND";
      break;
    case "AA":
      returnvalue = "ANESTHESIA PERF BY ANESGST";
      break;
    case "AD":
      returnvalue = "MD SUPERVISION, >4 ANES PROC";
      break;
    case "AE":
      returnvalue = "REGISTERED DIETICIAN";
      break;
    case "AF":
      returnvalue = "SPECIALTY PHYSICIAN";
      break;
    case "AG":
      returnvalue = "PRIMARY PHYSICIAN";
      break;
    case "AH":
      returnvalue = "CLINICAL PSYCHOLOGIST";
      break;
    case "AI":
      returnvalue = "PRINCIPAL PHYSICIAN OF REC";
      break;
    case "AJ":
      returnvalue = "CLINICAL SOCIAL WORKER";
      break;
    case "AK":
      returnvalue = "NON PARTICIPATING PHYSICIAN";
      break;
    case "AM":
      returnvalue = "PHYSICIAN, TEAM MEMBER SVC";
      break;
    case "AP":
      returnvalue = "NO DTMN OF REFRACTIVE STATE";
      break;
    case "AQ":
      returnvalue = "PHYSICIAN SERVICE HPSA AREA";
      break;
    case "AR":
      returnvalue = "PHYSICIAN SCARCITY AREA";
      break;
    case "AS":
      returnvalue = "ASSISTANT AT SURGERY SERVICE";
      break;
    case "AT":
      returnvalue = "ACUTE TREATMENT";
      break;
    case "AU":
      returnvalue = "URO, OSTOMY OR TRACH ITEM";
      break;
    case "AV":
      returnvalue = "ITEM W PROSTHETIC/ORTHOTIC";
      break;
    case "AW":
      returnvalue = "ITEM W A SURGICAL DRESSING";
      break;
    case "AX":
      returnvalue = "ITEM W DIALYSIS SERVICES";
      break;
    case "BA":
      returnvalue = "ITEM W PEN SERVICES";
      break;
    case "BL":
      returnvalue = "SPEC ACQUISITION BLOOD PRODS";
      break;
    case "BO":
      returnvalue = "NUTRITION ORAL ADMIN NO TUBE";
      break;
    case "BP":
      returnvalue = "BENE ELECTD TO PURCHASE ITEM";
      break;
    case "BR":
      returnvalue = "BENE ELECTED TO RENT ITEM";
      break;
    case "BU":
      returnvalue = "BENE UNDECIDED ON PURCH/RENT";
      break;
    case "CA":
      returnvalue = "PROCEDURE PAYABLE INPATIENT";
      break;
    case "CB":
      returnvalue = "ESRD BENE PART A SNF-SEP PAY";
      break;
    case "CC":
      returnvalue = "PROCEDURE CODE CHANGE";
      break;
    case "CD":
      returnvalue = "AMCC TEST FOR ESRD OR MCP MD";
      break;
    case "CE":
      returnvalue = "MED NECES AMCC TST SEP REIMB";
      break;
    case "CF":
      returnvalue = "AMCC TST NOT COMPOSITE RATE";
      break;
    case "CG":
      returnvalue = "POLICY CRITERIA APPLIED";
      break;
    case "CR":
      returnvalue = "CATASTROPHE/DISASTER RELATED";
      break;
    case "E1":
      returnvalue = "UPPER LEFT EYELID";
      break;
    case "E2":
      returnvalue = "LOWER LEFT EYELID";
      break;
    case "E3":
      returnvalue = "UPPER RIGHT EYELID";
      break;
    case "E4":
      returnvalue = "LOWER RIGHT EYELID";
      break;
    case "EA":
      returnvalue = "ESA, ANEMIA, CHEMO-INDUCED";
      break;
    case "EB":
      returnvalue = "ESA, ANEMIA, RADIO-INDUCED";
      break;
    case "EC":
      returnvalue = "ESA, ANEMIA, NON-CHEMO/RADIO";
      break;
    case "ED":
      returnvalue = "HCT>39% OR HGB>13G>=3 CYCLE";
      break;
    case "EE":
      returnvalue = "HCT>39% OR HGB>13G<3 CYCLE";
      break;
    case "EJ":
      returnvalue = "SUBSEQUENT CLAIM";
      break;
    case "EM":
      returnvalue = "EMER RESERVE SUPPLY (ESRD)";
      break;
    case "EP":
      returnvalue = "MEDICAID EPSDT PROGRAM SVC";
      break;
    case "ET":
      returnvalue = "EMERGENCY SERVICES";
      break;
    case "EY":
      returnvalue = "NO MD ORDER FOR ITEM/SERVICE";
      break;
    case "F1":
      returnvalue = "LEFT HAND, SECOND DIGIT";
      break;
    case "F2":
      returnvalue = "LEFT HAND, THIRD DIGIT";
      break;
    case "F3":
      returnvalue = "LEFT HAND, FOURTH DIGIT";
      break;
    case "F4":
      returnvalue = "LEFT HAND, FIFTH DIGIT";
      break;
    case "F5":
      returnvalue = "RIGHT HAND, THUMB";
      break;
    case "F6":
      returnvalue = "RIGHT HAND, SECOND DIGIT";
      break;
    case "F7":
      returnvalue = "RIGHT HAND, THIRD DIGIT";
      break;
    case "F8":
      returnvalue = "RIGHT HAND, FOURTH DIGIT";
      break;
    case "F9":
      returnvalue = "RIGHT HAND, FIFTH DIGIT";
      break;
    case "FA":
      returnvalue = "LEFT HAND, THUMB";
      break;
    case "FB":
      returnvalue = "ITEM PROVIDED WITHOUT COST";
      break;
    case "FC":
      returnvalue = "PART CREDIT, REPLACED DEVICE";
      break;
    case "FP":
      returnvalue = "SVC PART OF FAMILY PLAN PGM";
      break;
    case "G1":
      returnvalue = "URR READING OF LESS THAN 60";
      break;
    case "G2":
      returnvalue = "URR READING OF 60 TO 64.9";
      break;
    case "G3":
      returnvalue = "URR  READING OF 65 TO 69.9";
      break;
    case "G4":
      returnvalue = "URR READING OF 70 TO 74.9";
      break;
    case "G5":
      returnvalue = "URR READING OF 75 OR GREATER";
      break;
    case "G6":
      returnvalue = "ESRD PATIENT <6 DIALYSIS/MTH";
      break;
    case "G7":
      returnvalue = "PAYMENT LIMITS DO NOT APPLY";
      break;
    case "G8":
      returnvalue = "MONITORED ANESTHESIA CARE";
      break;
    case "G9":
      returnvalue = "MAC FOR AT RISK PATIENT";
      break;
    case "GA":
      returnvalue = "WAIVER OF LIABILITY ON FILE";
      break;
    case "GB":
      returnvalue = "CLAIM RESUBMITTED";
      break;
    case "GC":
      returnvalue = "RESIDENT/TEACHING PHYS SERV";
      break;
    case "GD":
      returnvalue = "UNIT OF SERVICE > MUE VALUE";
      break;
    case "GE":
      returnvalue = "RESIDENT PRIM CARE EXCEPTION";
      break;
    case "GF":
      returnvalue = "NONPHYSICIAN SERV C A HOSP";
      break;
    case "GG":
      returnvalue = "PAYMENT SCREEN MAM + DIAGMAM";
      break;
    case "GH":
      returnvalue = "DIAG MAMMO TO SCREENING MAMO";
      break;
    case "GJ":
      returnvalue = "OPT OUT PROVIDER OF ER SRVC";
      break;
    case "GK":
      returnvalue = "ACTUAL ITEM/SERVICE ORDERED";
      break;
    case "GL":
      returnvalue = "UPGRADED ITEM, NO CHARGE";
      break;
    case "GM":
      returnvalue = "MULTIPLE TRANSPORTS";
      break;
    case "GN":
      returnvalue = "OP SPEECH LANGUAGE SERVICE";
      break;
    case "GO":
      returnvalue = "OP OCCUPATIONAL THERAPY SERV";
      break;
    case "GP":
      returnvalue = "OP PT SERVICES";
      break;
    case "GQ":
      returnvalue = "TELEHEALTH STORE AND FORWARD";
      break;
    case "GR":
      returnvalue = "SERVICE BY VA RESIDENT";
      break;
    case "GS":
      returnvalue = "EPO/DARBEPOIETIN REDUCED 25%";
      break;
    case "GT":
      returnvalue = "INTERACTIVETELECOMMUNICATION";
      break;
    case "GV":
      returnvalue = "ATTENDING PHYS NOT HOSPICE";
      break;
    case "GW":
      returnvalue = "SERVICE UNRELATED TO TERM CO";
      break;
    case "GY":
      returnvalue = "STATUTORILY EXCLUDED";
      break;
    case "GZ":
      returnvalue = "NOT REASONABLE AND NECESSARY";
      break;
    case "H9":
      returnvalue = "COURT-ORDERED";
      break;
    case "HA":
      returnvalue = "CHILD/ADOLESCENT PROGRAM";
      break;
    case "HB":
      returnvalue = "ADULT PROGRAM NON-GERIATRIC";
      break;
    case "HC":
      returnvalue = "ADULT PROGRAM GERIATRIC";
      break;
    case "HD":
      returnvalue = "PREGNANT/PARENTING PROGRAM";
      break;
    case "HE":
      returnvalue = "MENTAL HEALTH PROGRAM";
      break;
    case "HF":
      returnvalue = "SUBSTANCE ABUSE PROGRAM";
      break;
    case "HG":
      returnvalue = "OPIOID ADDICTION TX PROGRAM";
      break;
    case "HH":
      returnvalue = "MENTAL HLTH/SUBSTANCE ABS PR";
      break;
    case "HI":
      returnvalue = "M HLTH/M RETRDTN/DEV DIS PRO";
      break;
    case "HJ":
      returnvalue = "EMPLOYEE ASSISTANCE PROGRAM";
      break;
    case "HK":
      returnvalue = "SPEC HGH RSK MNTL HLTH POP P";
      break;
    case "HL":
      returnvalue = "INTERN";
      break;
    case "HM":
      returnvalue = "LESS THAN BACHELOR DEGREE LV";
      break;
    case "HN":
      returnvalue = "BACHELORS DEGREE LEVEL";
      break;
    case "HO":
      returnvalue = "MASTERS DEGREE LEVEL";
      break;
    case "HP":
      returnvalue = "DOCTORAL LEVEL";
      break;
    case "HQ":
      returnvalue = "GROUP SETTING";
      break;
    case "HR":
      returnvalue = "FAMILY/COUPLE W CLIENT PRSNT";
      break;
    case "HS":
      returnvalue = "FAMILY/COUPLE W/O CLIENT PRS";
      break;
    case "HT":
      returnvalue = "MULTI-DISCIPLINARY TEAM";
      break;
    case "HU":
      returnvalue = "CHILD WELFARE AGENCY FUNDED";
      break;
    case "HV":
      returnvalue = "FUNDED STATE ADDICTION AGNCY";
      break;
    case "HW":
      returnvalue = "STATE MNTL HLTH AGNCY FUNDED";
      break;
    case "HX":
      returnvalue = "COUNTY/LOCAL AGENCY FUNDED";
      break;
    case "HY":
      returnvalue = "FUNDED BY JUVENILE JUSTICE";
      break;
    case "HZ":
      returnvalue = "CRIMINAL JUSTICE AGNCY FUND";
      break;
    case "J1":
      returnvalue = "CAP NO-PAY FOR PRESCRIPT NUM";
      break;
    case "J2":
      returnvalue = "CAP RESTOCK OF EMERG DRUGS";
      break;
    case "J3":
      returnvalue = "CAP DRUG UNAVAIL THRU CAP";
      break;
    case "J4":
      returnvalue = "DMEPOS COMP BID FURN BY HOSP";
      break;
    case "JA":
      returnvalue = "ADMINISTERED INTRAVENOUSLY";
      break;
    case "JB":
      returnvalue = "ADMINISTERED SUBCUTANEOUSLY";
      break;
    case "JC":
      returnvalue = "SKIN SUBSTITUTE GRAFT";
      break;
    case "JD":
      returnvalue = "SKIN SUB NOT USED AS A GRAFT";
      break;
    case "JW":
      returnvalue = "DISCARDED DRUG NOT ADMINISTE";
      break;
    case "K0":
      returnvalue = "LWR EXT PROST FUNCTNL LVL 0";
      break;
    case "K1":
      returnvalue = "LWR EXT PROST FUNCTNL LVL 1";
      break;
    case "K2":
      returnvalue = "LWR EXT PROST FUNCTNL LVL 2";
      break;
    case "K3":
      returnvalue = "LWR EXT PROST FUNCTNL LVL 3";
      break;
    case "K4":
      returnvalue = "LWR EXT PROST FUNCTNL LVL 4";
      break;
    case "KA":
      returnvalue = "WHEELCHAIR ADD-ON OPTION/ACC";
      break;
    case "KB":
      returnvalue = ">4 MODIFIERS ON CLAIM";
      break;
    case "KC":
      returnvalue = "REPL SPECIAL PWR WC INTRFACE";
      break;
    case "KD":
      returnvalue = "DRUG/BIOLOGICAL DME INFUSED";
      break;
    case "KE":
      returnvalue = "BID UNDER ROUND 1 DMEPOS CB";
      break;
    case "KF":
      returnvalue = "FDA CLASS III DEVICE";
      break;
    case "KG":
      returnvalue = "DMEPOS COMP BID PRGM NO 1";
      break;
    case "KH":
      returnvalue = "DMEPOS INI CLM, PUR/1 MO RNT";
      break;
    case "KI":
      returnvalue = "DMEPOS 2ND OR 3RD MO RENTAL";
      break;
    case "KJ":
      returnvalue = "DMEPOS PEN PMP OR 4-15MO RNT";
      break;
    case "KK":
      returnvalue = "DMEPOS COMP BID PRGM NO 2";
      break;
    case "KL":
      returnvalue = "DMEPOS MAILORDER COMP BID";
      break;
    case "KM":
      returnvalue = "RPLC FACIAL PROSTH NEW IMP";
      break;
    case "KN":
      returnvalue = "RPLC FACIAL PROSTH OLD MOD";
      break;
    case "KO":
      returnvalue = "SINGLE DRUG UNIT DOSE FORM";
      break;
    case "KP":
      returnvalue = "FIRST DRUG OF MULTI DRUG U D";
      break;
    case "KQ":
      returnvalue = "2ND/SUBSQNT DRG MULTI DRG UD";
      break;
    case "KR":
      returnvalue = "RENTAL ITEM PARTIAL MONTH";
      break;
    case "KS":
      returnvalue = "GLUCOSE MONITOR SUPPLY";
      break;
    case "KT":
      returnvalue = "ITEM FROM NONCONTRACT SUPPLY";
      break;
    case "KU":
      returnvalue = "DMEPOS COMP BID PRGM NO 3";
      break;
    case "KV":
      returnvalue = "DMEPOS ITEM, PROFESSION SERV";
      break;
    case "KW":
      returnvalue = "DMEPOS COMP BID PRGM NO 4";
      break;
    case "KX":
      returnvalue = "DOCUMENTATION ON FILE";
      break;
    case "KY":
      returnvalue = "DMEPOS COMP BID PRGM NO 5";
      break;
    case "KZ":
      returnvalue = "NEW COV NOT IMPLEMENT BY M+C";
      break;
    case "LC":
      returnvalue = "LFT CIRCUM CORONARY ARTERY";
      break;
    case "LD":
      returnvalue = "LEFT ANT DES CORONARY ARTERY";
      break;
    case "LL":
      returnvalue = "LEASE/RENTAL (APPLD TO PUR)";
      break;
    case "LR":
      returnvalue = "LABORATORY ROUND TRIP";
      break;
    case "LS":
      returnvalue = "FDA-MONITORED IOL IMPLANT";
      break;
    case "LT":
      returnvalue = "LEFT SIDE";
      break;
    case "M2":
      returnvalue = "MEDICARE SECONDARY PAYER";
      break;
    case "MS":
      returnvalue = "6-MO MAINT/SVC FEE PARTS/LBR";
      break;
    case "NR":
      returnvalue = "NEW WHEN RENTED";
      break;
    case "NU":
      returnvalue = "NEW EQUIPMENT";
      break;
    case "P1":
      returnvalue = "NORMAL HEALTHY PATIENT";
      break;
    case "P2":
      returnvalue = "PATIENT W/MILD SYST DISEASE";
      break;
    case "P3":
      returnvalue = "PATIENT W/SEVERE SYS DISEASE";
      break;
    case "P4":
      returnvalue = "PT W/SEV SYS DIS THREAT LIFE";
      break;
    case "P5":
      returnvalue = "PT NOT EXPECT SURV W/O OPER";
      break;
    case "P6":
      returnvalue = "BRAIN-DEAD PT ORGANS REMOVED";
      break;
    case "PA":
      returnvalue = "SURGERY, WRONG BODY PART";
      break;
    case "PB":
      returnvalue = "SURGERY, WRONG PATIENT";
      break;
    case "PC":
      returnvalue = "WRONG SURGERY ON PATIENT";
      break;
    case "PI":
      returnvalue = "PET TUMOR INIT TX STRAT";
      break;
    case "PL":
      returnvalue = "PROGRESSIVE ADDITION LENSES";
      break;
    case "PS":
      returnvalue = "PET TUMOR SUBSQ TX STRATEGY";
      break;
    case "Q0":
      returnvalue = "INVEST CLINICAL RESEARCH";
      break;
    case "Q1":
      returnvalue = "ROUTINE CLINICAL RESEARCH";
      break;
    case "Q2":
      returnvalue = "HCFA/ORD DEMO PROCEDURE/SVC";
      break;
    case "Q3":
      returnvalue = "LIVER DONOR SURGERY/SERVICES";
      break;
    case "Q4":
      returnvalue = "SVC EXEMPT - ORDRG/RFRNG MD";
      break;
    case "Q5":
      returnvalue = "SUBST MD SVC, RECIP BILL ARR";
      break;
    case "Q6":
      returnvalue = "LOCUM TENENS MD SERVICE";
      break;
    case "Q7":
      returnvalue = "ONE CLASS A FINDING";
      break;
    case "Q8":
      returnvalue = "TWO CLASS B FINDINGS";
      break;
    case "Q9":
      returnvalue = "1 CLASS B & 2 CLASS C FNDNGS";
      break;
    case "QA":
      returnvalue = "FDA INVESTIGATIONAL DEVICE";
      break;
    case "QC":
      returnvalue = "SINGLE CHANNEL MONITORING";
      break;
    case "QD":
      returnvalue = "RCRDG/STRG IN SLD ST MEMORY";
      break;
    case "QE":
      returnvalue = "PRESCRIBED OXYGEN < 1 LPM";
      break;
    case "QF":
      returnvalue = "PRSCRBD OXYGEN >4 LPM & PORT";
      break;
    case "QG":
      returnvalue = "PRESCRIBED OXYGEN > 4 LPM";
      break;
    case "QH":
      returnvalue = "OXYGEN CNSRVG DVC W DEL SYS";
      break;
    case "QJ":
      returnvalue = "PATIENT IN STATE/LOCL CUSTOD";
      break;
    case "QK":
      returnvalue = "MED DIR 2-4 CNCRNT ANES PROC";
      break;
    case "QL":
      returnvalue = "PATIENT DIED AFTER AMB CALL";
      break;
    case "QM":
      returnvalue = "AMBULANCE ARR BY PROVIDER";
      break;
    case "QN":
      returnvalue = "AMBULANCE FURN BY PROVIDER";
      break;
    case "QP":
      returnvalue = "INDIVIDUALLY ORDERED LAB TST";
      break;
    case "QR":
      returnvalue = "ITEM/SERV IN MEDICARE STUDY";
      break;
    case "QS":
      returnvalue = "MONITORED ANESTHESIA CARE";
      break;
    case "QT":
      returnvalue = "RCRDG/STRG TAPE ANALOG RECDR";
      break;
    case "QV":
      returnvalue = "ITEM OR SERVICE PROVIDED";
      break;
    case "QW":
      returnvalue = "CLIA WAIVED TEST";
      break;
    case "QX":
      returnvalue = "CRNA SVC W/ MD MED DIRECTION";
      break;
    case "QY":
      returnvalue = "MEDICALLY DIRECTED CRNA";
      break;
    case "QZ":
      returnvalue = "CRNA SVC W/O MED DIR BY MD";
      break;
    case "RA":
      returnvalue = "REPLACEMENT OF DME ITEM";
      break;
    case "RB":
      returnvalue = "REPLACEMENT PART, DME ITEM";
      break;
    case "RC":
      returnvalue = "RIGHT CORONARY ARTERY";
      break;
    case "RD":
      returnvalue = "DRUG ADMIN NOT INCIDENT-TO";
      break;
    case "RE":
      returnvalue = "FURNISH FULL COMPLIANCE REMS";
      break;
    case "RP":
      returnvalue = "REPLACEMENT & REPAIR(DMEPOS)";
      break;
    case "RR":
      returnvalue = "RENTAL (DME)";
      break;
    case "RT":
      returnvalue = "RIGHT SIDE";
      break;
    case "SA":
      returnvalue = "NURSE PRACTITIONER W PHYSICI";
      break;
    case "SB":
      returnvalue = "NURSE MIDWIFE";
      break;
    case "SC":
      returnvalue = "MEDICALLY NECESSARY SERV/SUP";
      break;
    case "SD":
      returnvalue = "SERV BY HOME INFUSION RN";
      break;
    case "SE":
      returnvalue = "STATE/FED FUNDED PROGRAM/SER";
      break;
    case "SF":
      returnvalue = "2ND OPINION ORDERED BY PRO";
      break;
    case "SG":
      returnvalue = "ASC FACILITY SERVICE";
      break;
    case "SH":
      returnvalue = "2ND CONCURRENT INFUSION THER";
      break;
    case "SJ":
      returnvalue = "3RD CONCURRENT INFUSION THER";
      break;
    case "SK":
      returnvalue = "HIGH RISK POPULATION";
      break;
    case "SL":
      returnvalue = "STATE SUPPLIED VACCINE";
      break;
    case "SM":
      returnvalue = "SECOND OPINION";
      break;
    case "SN":
      returnvalue = "THIRD OPINION";
      break;
    case "SQ":
      returnvalue = "ITEM ORDERED BY HOME HEALTH";
      break;
    case "SS":
      returnvalue = "HIT IN INFUSION SUITE";
      break;
    case "ST":
      returnvalue = "RELATED TO TRAUMA OR INJURY";
      break;
    case "SU":
      returnvalue = "PERFORMED IN PHYS OFFICE";
      break;
    case "SV":
      returnvalue = "DRUGS DELIVERED NOT USED";
      break;
    case "SW":
      returnvalue = "SERV BY CERT DIAB EDUCATOR";
      break;
    case "SY":
      returnvalue = "CONTACT W/HIGH-RISK POP";
      break;
    case "T1":
      returnvalue = "LEFT FOOT, SECOND DIGIT";
      break;
    case "T2":
      returnvalue = "LEFT FOOT, THIRD DIGIT";
      break;
    case "T3":
      returnvalue = "LEFT FOOT, FOURTH DIGIT";
      break;
    case "T4":
      returnvalue = "LEFT FOOT, FIFTH DIGIT";
      break;
    case "T5":
      returnvalue = "RIGHT FOOT, GREAT TOE";
      break;
    case "T6":
      returnvalue = "RIGHT FOOT, SECOND DIGIT";
      break;
    case "T7":
      returnvalue = "RIGHT FOOT, THIRD DIGIT";
      break;
    case "T8":
      returnvalue = "RIGHT FOOT, FOURTH DIGIT";
      break;
    case "T9":
      returnvalue = "RIGHT FOOT, FIFTH DIGIT";
      break;
    case "TA":
      returnvalue = "LEFT FOOT, GREAT TOE";
      break;
    case "TC":
      returnvalue = "TECHNICAL COMPONENT";
      break;
    case "TD":
      returnvalue = "RN";
      break;
    case "TE":
      returnvalue = "LPN/LVN";
      break;
    case "TF":
      returnvalue = "INTERMEDIATE LEVEL OF CARE";
      break;
    case "TG":
      returnvalue = "COMPLEX/HIGH TECH LEVEL CARE";
      break;
    case "TH":
      returnvalue = "OB TX/SRVCS PRENATL/POSTPART";
      break;
    case "TJ":
      returnvalue = "CHILD/ADOLESCENT PROGRAM GP";
      break;
    case "TK":
      returnvalue = "EXTRA PATIENT OR PASSENGER";
      break;
    case "TL":
      returnvalue = "EARLY INTERVENTION IFSP";
      break;
    case "TM":
      returnvalue = "INDIVIDUALIZED ED PRGRM(IEP)";
      break;
    case "TN":
      returnvalue = "RURAL/OUT OF SERVICE AREA";
      break;
    case "TP":
      returnvalue = "MED TRANSPRT UNLOADED VEHICL";
      break;
    case "TQ":
      returnvalue = "BLS BY VOLUNTEER AMB PROVIDR";
      break;
    case "TR":
      returnvalue = "SCHOOL-BASED IEP OUT OF DIST";
      break;
    case "TS":
      returnvalue = "FOLLOW-UP SERVICE";
      break;
    case "TT":
      returnvalue = "ADDITIONAL PATIENT";
      break;
    case "TU":
      returnvalue = "OVERTIME PAYMENT RATE";
      break;
    case "TV":
      returnvalue = "HOLIDAY/WEEKEND PAYMENT RATE";
      break;
    case "TW":
      returnvalue = "BACK-UP EQUIPMENT";
      break;
    case "U1":
      returnvalue = "M/CAID CARE LEV 1 STATE DEF";
      break;
    case "U2":
      returnvalue = "M/CAID CARE LEV 2 STATE DEF";
      break;
    case "U3":
      returnvalue = "M/CAID CARE LEV 3 STATE DEF";
      break;
    case "U4":
      returnvalue = "M/CAID CARE LEV 4 STATE DEF";
      break;
    case "U5":
      returnvalue = "M/CAID CARE LEV 5 STATE DEF";
      break;
    case "U6":
      returnvalue = "M/CAID CARE LEV 6 STATE DEF";
      break;
    case "U7":
      returnvalue = "M/CAID CARE LEV 7 STATE DEF";
      break;
    case "U8":
      returnvalue = "M/CAID CARE LEV 8 STATE DEF";
      break;
    case "U9":
      returnvalue = "M/CAID CARE LEV 9 STATE DEF";
      break;
    case "UA":
      returnvalue = "M/CAID CARE LEV 10 STATE DEF";
      break;
    case "UB":
      returnvalue = "M/CAID CARE LEV 11 STATE DEF";
      break;
    case "UC":
      returnvalue = "M/CAID CARE LEV 12 STATE DEF";
      break;
    case "UD":
      returnvalue = "M/CAID CARE LEV 13 STATE DEF";
      break;
    case "UE":
      returnvalue = "USED DURABLE MED EQUIPMENT";
      break;
    case "UF":
      returnvalue = "SERVICES PROVIDED, MORNING";
      break;
    case "UG":
      returnvalue = "SERVICES PROVIDED, AFTERNOON";
      break;
    case "UH":
      returnvalue = "SERVICES PROVIDED, EVENING";
      break;
    case "UJ":
      returnvalue = "SERVICES PROVIDED, NIGHT";
      break;
    case "UK":
      returnvalue = "SVC ON BEHALF CLIENT-COLLAT";
      break;
    case "UN":
      returnvalue = "TWO PATIENTS SERVED";
      break;
    case "UP":
      returnvalue = "THREE PATIENTS SERVED";
      break;
    case "UQ":
      returnvalue = "FOUR PATIENTS SERVED";
      break;
    case "UR":
      returnvalue = "FIVE PATIENTS SERVED";
      break;
    case "US":
      returnvalue = "SIX OR MORE PATIENTS SERVED";
      break;
    case "V5":
      returnvalue = "VASCULAR CATHETER";
      break;
    case "V6":
      returnvalue = "ARTERIOVENOUS GRAFT";
      break;
    case "V7":
      returnvalue = "ARTERIOVENOUS FISTULA";
      break;
    case "V8":
      returnvalue = "INFECTION PRESENT";
      break;
    case "V9":
      returnvalue = "NO INFECTION PRESENT";
      break;
    case "VP":
      returnvalue = "APHAKIC PATIENT";
      break;
    case "A0021":
      returnvalue = "OUTSIDE STATE AMBULANCE SERV";
      break;
    case "A0080":
      returnvalue = "NONINTEREST ESCORT IN NON ER";
      break;
    case "A0090":
      returnvalue = "INTEREST ESCORT IN NON ER";
      break;
    case "A0100":
      returnvalue = "NONEMERGENCY TRANSPORT TAXI";
      break;
    case "A0110":
      returnvalue = "NONEMERGENCY TRANSPORT BUS";
      break;
    case "A0120":
      returnvalue = "NONER TRANSPORT MINI-BUS";
      break;
    case "A0130":
      returnvalue = "NONER TRANSPORT WHEELCH VAN";
      break;
    case "A0140":
      returnvalue = "NONEMERGENCY TRANSPORT AIR";
      break;
    case "A0160":
      returnvalue = "NONER TRANSPORT CASE WORKER";
      break;
    case "A0170":
      returnvalue = "TRANSPORT PARKING FEES/TOLLS";
      break;
    case "A0180":
      returnvalue = "NONER TRANSPORT LODGNG RECIP";
      break;
    case "A0190":
      returnvalue = "NONER TRANSPORT MEALS RECIP";
      break;
    case "A0200":
      returnvalue = "NONER TRANSPORT LODGNG ESCRT";
      break;
    case "A0210":
      returnvalue = "NONER TRANSPORT MEALS ESCORT";
      break;
    case "A0225":
      returnvalue = "NEONATAL EMERGENCY TRANSPORT";
      break;
    case "A0380":
      returnvalue = "BASIC LIFE SUPPORT MILEAGE";
      break;
    case "A0382":
      returnvalue = "BASIC SUPPORT ROUTINE SUPPLS";
      break;
    case "A0384":
      returnvalue = "BLS DEFIBRILLATION SUPPLIES";
      break;
    case "A0390":
      returnvalue = "ADVANCED LIFE SUPPORT MILEAG";
      break;
    case "A0392":
      returnvalue = "ALS DEFIBRILLATION SUPPLIES";
      break;
    case "A0394":
      returnvalue = "ALS IV DRUG THERAPY SUPPLIES";
      break;
    case "A0396":
      returnvalue = "ALS ESOPHAGEAL INTUB SUPPLS";
      break;
    case "A0398":
      returnvalue = "ALS ROUTINE DISPOSBLE SUPPLS";
      break;
    case "A0420":
      returnvalue = "AMBULANCE WAITING 1/2 HR";
      break;
    case "A0422":
      returnvalue = "AMBULANCE 02 LIFE SUSTAINING";
      break;
    case "A0424":
      returnvalue = "EXTRA AMBULANCE ATTENDANT";
      break;
    case "A0425":
      returnvalue = "GROUND MILEAGE";
      break;
    case "A0426":
      returnvalue = "ALS 1";
      break;
    case "A0427":
      returnvalue = "ALS1-EMERGENCY";
      break;
    case "A0428":
      returnvalue = "BLS";
      break;
    case "A0429":
      returnvalue = "BLS-EMERGENCY";
      break;
    case "A0430":
      returnvalue = "FIXED WING AIR TRANSPORT";
      break;
    case "A0431":
      returnvalue = "ROTARY WING AIR TRANSPORT";
      break;
    case "A0432":
      returnvalue = "PI VOLUNTEER AMBULANCE CO";
      break;
    case "A0433":
      returnvalue = "ALS 2";
      break;
    case "A0434":
      returnvalue = "SPECIALTY CARE TRANSPORT";
      break;
    case "A0435":
      returnvalue = "FIXED WING AIR MILEAGE";
      break;
    case "A0436":
      returnvalue = "ROTARY WING AIR MILEAGE";
      break;
    case "A0800":
      returnvalue = "AMB TRANS 7PM-7AM";
      break;
    case "A0888":
      returnvalue = "NONCOVERED AMBULANCE MILEAGE";
      break;
    case "A0998":
      returnvalue = "AMBULANCE RESPONSE/TREATMENT";
      break;
    case "A0999":
      returnvalue = "UNLISTED AMBULANCE SERVICE";
      break;
    case "A4206":
      returnvalue = "1 CC STERILE SYRINGE&NEEDLE";
      break;
    case "A4207":
      returnvalue = "2 CC STERILE SYRINGE&NEEDLE";
      break;
    case "A4208":
      returnvalue = "3 CC STERILE SYRINGE&NEEDLE";
      break;
    case "A4209":
      returnvalue = "5+ CC STERILE SYRINGE&NEEDLE";
      break;
    case "A4210":
      returnvalue = "NONNEEDLE INJECTION DEVICE";
      break;
    case "A4211":
      returnvalue = "SUPP FOR SELF-ADM INJECTIONS";
      break;
    case "A4212":
      returnvalue = "NON CORING NEEDLE OR STYLET";
      break;
    case "A4213":
      returnvalue = "20+ CC SYRINGE ONLY";
      break;
    case "A4215":
      returnvalue = "STERILE NEEDLE";
      break;
    case "A4216":
      returnvalue = "STERILE WATER/SALINE, 10 ML";
      break;
    case "A4217":
      returnvalue = "STERILE WATER/SALINE, 500 ML";
      break;
    case "A4218":
      returnvalue = "STERILE SALINE OR WATER";
      break;
    case "A4220":
      returnvalue = "INFUSION PUMP REFILL KIT";
      break;
    case "A4221":
      returnvalue = "MAINT DRUG INFUS CATH PER WK";
      break;
    case "A4222":
      returnvalue = "INFUSION SUPPLIES WITH PUMP";
      break;
    case "A4223":
      returnvalue = "INFUSION SUPPLIES W/O PUMP";
      break;
    case "A4230":
      returnvalue = "INFUS INSULIN PUMP NON NEEDL";
      break;
    case "A4231":
      returnvalue = "INFUSION INSULIN PUMP NEEDLE";
      break;
    case "A4232":
      returnvalue = "SYRINGE W/NEEDLE INSULIN 3CC";
      break;
    case "A4233":
      returnvalue = "ALKALIN BATT FOR GLUCOSE MON";
      break;
    case "A4234":
      returnvalue = "J-CELL BATT FOR GLUCOSE MON";
      break;
    case "A4235":
      returnvalue = "LITHIUM BATT FOR GLUCOSE MON";
      break;
    case "A4236":
      returnvalue = "SILVR OXIDE BATT GLUCOSE MON";
      break;
    case "A4244":
      returnvalue = "ALCOHOL OR PEROXIDE PER PINT";
      break;
    case "A4245":
      returnvalue = "ALCOHOL WIPES PER BOX";
      break;
    case "A4246":
      returnvalue = "BETADINE/PHISOHEX SOLUTION";
      break;
    case "A4247":
      returnvalue = "BETADINE/IODINE SWABS/WIPES";
      break;
    case "A4248":
      returnvalue = "CHLORHEXIDINE ANTISEPT";
      break;
    case "A4250":
      returnvalue = "URINE REAGENT STRIPS/TABLETS";
      break;
    case "A4252":
      returnvalue = "BLOOD KETONE TEST OR STRIP";
      break;
    case "A4253":
      returnvalue = "BLOOD GLUCOSE/REAGENT STRIPS";
      break;
    case "A4255":
      returnvalue = "GLUCOSE MONITOR PLATFORMS";
      break;
    case "A4256":
      returnvalue = "CALIBRATOR SOLUTION/CHIPS";
      break;
    case "A4257":
      returnvalue = "REPLACE LENSSHIELD CARTRIDGE";
      break;
    case "A4258":
      returnvalue = "LANCET DEVICE EACH";
      break;
    case "A4259":
      returnvalue = "LANCETS PER BOX";
      break;
    case "A4261":
      returnvalue = "CERVICAL CAP CONTRACEPTIVE";
      break;
    case "A4262":
      returnvalue = "TEMPORARY TEAR DUCT PLUG";
      break;
    case "A4263":
      returnvalue = "PERMANENT TEAR DUCT PLUG";
      break;
    case "A4264":
      returnvalue = "INTRATUBAL OCCLUSION DEVICE";
      break;
    case "A4265":
      returnvalue = "PARAFFIN";
      break;
    case "A4266":
      returnvalue = "DIAPHRAGM";
      break;
    case "A4267":
      returnvalue = "MALE CONDOM";
      break;
    case "A4268":
      returnvalue = "FEMALE CONDOM";
      break;
    case "A4269":
      returnvalue = "SPERMICIDE";
      break;
    case "A4270":
      returnvalue = "DISPOSABLE ENDOSCOPE SHEATH";
      break;
    case "A4280":
      returnvalue = "BRST PRSTHS ADHSV ATTCHMNT";
      break;
    case "A4281":
      returnvalue = "REPLACEMENT BREASTPUMP TUBE";
      break;
    case "A4282":
      returnvalue = "REPLACEMENT BREASTPUMP ADPT";
      break;
    case "A4283":
      returnvalue = "REPLACEMENT BREASTPUMP CAP";
      break;
    case "A4284":
      returnvalue = "REPLCMNT BREAST PUMP SHIELD";
      break;
    case "A4285":
      returnvalue = "REPLCMNT BREAST PUMP BOTTLE";
      break;
    case "A4286":
      returnvalue = "REPLCMNT BREASTPUMP LOK RING";
      break;
    case "A4290":
      returnvalue = "SACRAL NERVE STIM TEST LEAD";
      break;
    case "A4300":
      returnvalue = "CATH IMPL VASC ACCESS PORTAL";
      break;
    case "A4301":
      returnvalue = "IMPLANTABLE ACCESS SYST PERC";
      break;
    case "A4305":
      returnvalue = "DRUG DELIVERY SYSTEM >=50 ML";
      break;
    case "A4306":
      returnvalue = "DRUG DELIVERY SYSTEM <=50 ML";
      break;
    case "A4310":
      returnvalue = "INSERT TRAY W/O BAG/CATH";
      break;
    case "A4311":
      returnvalue = "CATHETER W/O BAG 2-WAY LATEX";
      break;
    case "A4312":
      returnvalue = "CATH W/O BAG 2-WAY SILICONE";
      break;
    case "A4313":
      returnvalue = "CATHETER W/BAG 3-WAY";
      break;
    case "A4314":
      returnvalue = "CATH W/DRAINAGE 2-WAY LATEX";
      break;
    case "A4315":
      returnvalue = "CATH W/DRAINAGE 2-WAY SILCNE";
      break;
    case "A4316":
      returnvalue = "CATH W/DRAINAGE 3-WAY";
      break;
    case "A4320":
      returnvalue = "IRRIGATION TRAY";
      break;
    case "A4321":
      returnvalue = "CATH THERAPEUTIC IRRIG AGENT";
      break;
    case "A4322":
      returnvalue = "IRRIGATION SYRINGE";
      break;
    case "A4326":
      returnvalue = "MALE EXTERNAL CATHETER";
      break;
    case "A4327":
      returnvalue = "FEM URINARY COLLECT DEV CUP";
      break;
    case "A4328":
      returnvalue = "FEM URINARY COLLECT POUCH";
      break;
    case "A4330":
      returnvalue = "STOOL COLLECTION POUCH";
      break;
    case "A4331":
      returnvalue = "EXTENSION DRAINAGE TUBING";
      break;
    case "A4332":
      returnvalue = "LUBE STERILE PACKET";
      break;
    case "A4333":
      returnvalue = "URINARY CATH ANCHOR DEVICE";
      break;
    case "A4334":
      returnvalue = "URINARY CATH LEG STRAP";
      break;
    case "A4335":
      returnvalue = "INCONTINENCE SUPPLY";
      break;
    case "A4336":
      returnvalue = "URETHRAL INSERT";
      break;
    case "A4338":
      returnvalue = "INDWELLING CATHETER LATEX";
      break;
    case "A4340":
      returnvalue = "INDWELLING CATHETER SPECIAL";
      break;
    case "A4344":
      returnvalue = "CATH INDW FOLEY 2 WAY SILICN";
      break;
    case "A4346":
      returnvalue = "CATH INDW FOLEY 3 WAY";
      break;
    case "A4348":
      returnvalue = "MALE EXT CATH EXTENDED WEAR";
      break;
    case "A4349":
      returnvalue = "DISPOSABLE MALE EXTERNAL CAT";
      break;
    case "A4351":
      returnvalue = "STRAIGHT TIP URINE CATHETER";
      break;
    case "A4352":
      returnvalue = "COUDE TIP URINARY CATHETER";
      break;
    case "A4353":
      returnvalue = "INTERMITTENT URINARY CATH";
      break;
    case "A4354":
      returnvalue = "CATH INSERTION TRAY W/BAG";
      break;
    case "A4355":
      returnvalue = "BLADDER IRRIGATION TUBING";
      break;
    case "A4356":
      returnvalue = "EXT URETH CLMP OR COMPR DVC";
      break;
    case "A4357":
      returnvalue = "BEDSIDE DRAINAGE BAG";
      break;
    case "A4358":
      returnvalue = "URINARY LEG OR ABDOMEN BAG";
      break;
    case "A4359":
      returnvalue = "URINARY SUSPENSORY W/O LEG B";
      break;
    case "A4360":
      returnvalue = "DISPOSABLE EXT URETHRAL DEV";
      break;
    case "A4361":
      returnvalue = "OSTOMY FACE PLATE";
      break;
    case "A4362":
      returnvalue = "SOLID SKIN BARRIER";
      break;
    case "A4363":
      returnvalue = "OSTOMY CLAMP, REPLACEMENT";
      break;
    case "A4364":
      returnvalue = "ADHESIVE, LIQUID OR EQUAL";
      break;
    case "A4365":
      returnvalue = "ADHESIVE REMOVER WIPES";
      break;
    case "A4366":
      returnvalue = "OSTOMY VENT";
      break;
    case "A4367":
      returnvalue = "OSTOMY BELT";
      break;
    case "A4368":
      returnvalue = "OSTOMY FILTER";
      break;
    case "A4369":
      returnvalue = "SKIN BARRIER LIQUID PER OZ";
      break;
    case "A4371":
      returnvalue = "SKIN BARRIER POWDER PER OZ";
      break;
    case "A4372":
      returnvalue = "SKIN BARRIER SOLID 4X4 EQUIV";
      break;
    case "A4373":
      returnvalue = "SKIN BARRIER WITH FLANGE";
      break;
    case "A4375":
      returnvalue = "DRAINABLE PLASTIC PCH W FCPL";
      break;
    case "A4376":
      returnvalue = "DRAINABLE RUBBER PCH W FCPLT";
      break;
    case "A4377":
      returnvalue = "DRAINABLE PLSTIC PCH W/O FP";
      break;
    case "A4378":
      returnvalue = "DRAINABLE RUBBER PCH W/O FP";
      break;
    case "A4379":
      returnvalue = "URINARY PLASTIC POUCH W FCPL";
      break;
    case "A4380":
      returnvalue = "URINARY RUBBER POUCH W FCPLT";
      break;
    case "A4381":
      returnvalue = "URINARY PLASTIC POUCH W/O FP";
      break;
    case "A4382":
      returnvalue = "URINARY HVY PLSTC PCH W/O FP";
      break;
    case "A4383":
      returnvalue = "URINARY RUBBER POUCH W/O FP";
      break;
    case "A4384":
      returnvalue = "OSTOMY FACEPLT/SILICONE RING";
      break;
    case "A4385":
      returnvalue = "OST SKN BARRIER SLD EXT WEAR";
      break;
    case "A4387":
      returnvalue = "OST CLSD POUCH W ATT ST BARR";
      break;
    case "A4388":
      returnvalue = "DRAINABLE PCH W EX WEAR BARR";
      break;
    case "A4389":
      returnvalue = "DRAINABLE PCH W ST WEAR BARR";
      break;
    case "A4390":
      returnvalue = "DRAINABLE PCH EX WEAR CONVEX";
      break;
    case "A4391":
      returnvalue = "URINARY POUCH W EX WEAR BARR";
      break;
    case "A4392":
      returnvalue = "URINARY POUCH W ST WEAR BARR";
      break;
    case "A4393":
      returnvalue = "URINE PCH W EX WEAR BAR CONV";
      break;
    case "A4394":
      returnvalue = "OSTOMY POUCH LIQ DEODORANT";
      break;
    case "A4395":
      returnvalue = "OSTOMY POUCH SOLID DEODORANT";
      break;
    case "A4396":
      returnvalue = "PERISTOMAL HERNIA SUPPRT BLT";
      break;
    case "A4397":
      returnvalue = "IRRIGATION SUPPLY SLEEVE";
      break;
    case "A4398":
      returnvalue = "OSTOMY IRRIGATION BAG";
      break;
    case "A4399":
      returnvalue = "OSTOMY IRRIG CONE/CATH W BRS";
      break;
    case "A4400":
      returnvalue = "OSTOMY IRRIGATION SET";
      break;
    case "A4402":
      returnvalue = "LUBRICANT PER OUNCE";
      break;
    case "A4404":
      returnvalue = "OSTOMY RING EACH";
      break;
    case "A4405":
      returnvalue = "NONPECTIN BASED OSTOMY PASTE";
      break;
    case "A4406":
      returnvalue = "PECTIN BASED OSTOMY PASTE";
      break;
    case "A4407":
      returnvalue = "EXT WEAR OST SKN BARR <=4SQ?";
      break;
    case "A4408":
      returnvalue = "EXT WEAR OST SKN BARR >4SQ?";
      break;
    case "A4409":
      returnvalue = "OST SKN BARR CONVEX <=4 SQ I";
      break;
    case "A4410":
      returnvalue = "OST SKN BARR EXTND >4 SQ";
      break;
    case "A4411":
      returnvalue = "OST SKN BARR EXTND =4SQ";
      break;
    case "A4412":
      returnvalue = "OST POUCH DRAIN HIGH OUTPUT";
      break;
    case "A4413":
      returnvalue = "2 PC DRAINABLE OST POUCH";
      break;
    case "A4414":
      returnvalue = "OST SKNBAR W/O CONV<=4 SQ IN";
      break;
    case "A4415":
      returnvalue = "OST SKN BARR W/O CONV >4 SQI";
      break;
    case "A4416":
      returnvalue = "OST PCH CLSD W BARRIER/FILTR";
      break;
    case "A4417":
      returnvalue = "OST PCH W BAR/BLTINCONV/FLTR";
      break;
    case "A4418":
      returnvalue = "OST PCH CLSD W/O BAR W FILTR";
      break;
    case "A4419":
      returnvalue = "OST PCH FOR BAR W FLANGE/FLT";
      break;
    case "A4420":
      returnvalue = "OST PCH CLSD FOR BAR W LK FL";
      break;
    case "A4421":
      returnvalue = "OSTOMY SUPPLY MISC";
      break;
    case "A4422":
      returnvalue = "OST POUCH ABSORBENT MATERIAL";
      break;
    case "A4423":
      returnvalue = "OST PCH FOR BAR W LK FL/FLTR";
      break;
    case "A4424":
      returnvalue = "OST PCH DRAIN W BAR & FILTER";
      break;
    case "A4425":
      returnvalue = "OST PCH DRAIN FOR BARRIER FL";
      break;
    case "A4426":
      returnvalue = "OST PCH DRAIN 2 PIECE SYSTEM";
      break;
    case "A4427":
      returnvalue = "OST PCH DRAIN/BARR LK FLNG/F";
      break;
    case "A4428":
      returnvalue = "URINE OST POUCH W FAUCET/TAP";
      break;
    case "A4429":
      returnvalue = "URINE OST POUCH W BLTINCONV";
      break;
    case "A4430":
      returnvalue = "OST URINE PCH W B/BLTIN CONV";
      break;
    case "A4431":
      returnvalue = "OST PCH URINE W BARRIER/TAPV";
      break;
    case "A4432":
      returnvalue = "OS PCH URINE W BAR/FANGE/TAP";
      break;
    case "A4433":
      returnvalue = "URINE OST PCH BAR W LOCK FLN";
      break;
    case "A4434":
      returnvalue = "OST PCH URINE W LOCK FLNG/FT";
      break;
    case "A4450":
      returnvalue = "NON-WATERPROOF TAPE";
      break;
    case "A4452":
      returnvalue = "WATERPROOF TAPE";
      break;
    case "A4455":
      returnvalue = "ADHESIVE REMOVER PER OUNCE";
      break;
    case "A4456":
      returnvalue = "ADHESIVE REMOVER, WIPES";
      break;
    case "A4458":
      returnvalue = "REUSABLE ENEMA BAG";
      break;
    case "A4461":
      returnvalue = "SURGICL DRESS HOLD NON-REUSE";
      break;
    case "A4462":
      returnvalue = "ABDMNL DRSSNG HOLDER/BINDER";
      break;
    case "A4463":
      returnvalue = "SURGICAL DRESS HOLDER REUSE";
      break;
    case "A4465":
      returnvalue = "NON-ELASTIC EXTREMITY BINDER";
      break;
    case "A4466":
      returnvalue = "ELASTIC GARMENT/COVERING";
      break;
    case "A4470":
      returnvalue = "GRAVLEE JET WASHER";
      break;
    case "A4480":
      returnvalue = "VABRA ASPIRATOR";
      break;
    case "A4481":
      returnvalue = "TRACHEOSTOMA FILTER";
      break;
    case "A4483":
      returnvalue = "MOISTURE EXCHANGER";
      break;
    case "A4490":
      returnvalue = "ABOVE KNEE SURGICAL STOCKING";
      break;
    case "A4495":
      returnvalue = "THIGH LENGTH SURG STOCKING";
      break;
    case "A4500":
      returnvalue = "BELOW KNEE SURGICAL STOCKING";
      break;
    case "A4510":
      returnvalue = "FULL LENGTH SURG STOCKING";
      break;
    case "A4520":
      returnvalue = "INCONTINENCE GARMENT ANYTYPE";
      break;
    case "A4550":
      returnvalue = "SURGICAL TRAYS";
      break;
    case "A4554":
      returnvalue = "DISPOSABLE UNDERPADS";
      break;
    case "A4556":
      returnvalue = "ELECTRODES, PAIR";
      break;
    case "A4557":
      returnvalue = "LEAD WIRES, PAIR";
      break;
    case "A4558":
      returnvalue = "CONDUCTIVE GEL OR PASTE";
      break;
    case "A4559":
      returnvalue = "COUPLING GEL OR PASTE";
      break;
    case "A4561":
      returnvalue = "PESSARY RUBBER, ANY TYPE";
      break;
    case "A4562":
      returnvalue = "PESSARY, NON RUBBER,ANY TYPE";
      break;
    case "A4565":
      returnvalue = "SLINGS";
      break;
    case "A4570":
      returnvalue = "SPLINT";
      break;
    case "A4575":
      returnvalue = "HYPERBARIC O2 CHAMBER DISPS";
      break;
    case "A4580":
      returnvalue = "CAST SUPPLIES (PLASTER)";
      break;
    case "A4590":
      returnvalue = "SPECIAL CASTING MATERIAL";
      break;
    case "A4595":
      returnvalue = "TENS SUPPL 2 LEAD PER MONTH";
      break;
    case "A4600":
      returnvalue = "SLEEVE, INTER LIMB COMP DEV";
      break;
    case "A4601":
      returnvalue = "LITH ION BATT, NON-PROS USE";
      break;
    case "A4604":
      returnvalue = "TUBING WITH HEATING ELEMENT";
      break;
    case "A4605":
      returnvalue = "TRACH SUCTION CATH CLOSE SYS";
      break;
    case "A4606":
      returnvalue = "OXYGEN PROBE USED W OXIMETER";
      break;
    case "A4608":
      returnvalue = "TRANSTRACHEAL OXYGEN CATH";
      break;
    case "A4611":
      returnvalue = "HEAVY DUTY BATTERY";
      break;
    case "A4612":
      returnvalue = "BATTERY CABLES";
      break;
    case "A4613":
      returnvalue = "BATTERY CHARGER";
      break;
    case "A4614":
      returnvalue = "HAND-HELD PEFR METER";
      break;
    case "A4615":
      returnvalue = "CANNULA NASAL";
      break;
    case "A4616":
      returnvalue = "TUBING (OXYGEN) PER FOOT";
      break;
    case "A4617":
      returnvalue = "MOUTH PIECE";
      break;
    case "A4618":
      returnvalue = "BREATHING CIRCUITS";
      break;
    case "A4619":
      returnvalue = "FACE TENT";
      break;
    case "A4620":
      returnvalue = "VARIABLE CONCENTRATION MASK";
      break;
    case "A4623":
      returnvalue = "TRACHEOSTOMY INNER CANNULA";
      break;
    case "A4624":
      returnvalue = "TRACHEAL SUCTION TUBE";
      break;
    case "A4625":
      returnvalue = "TRACH CARE KIT FOR NEW TRACH";
      break;
    case "A4626":
      returnvalue = "TRACHEOSTOMY CLEANING BRUSH";
      break;
    case "A4627":
      returnvalue = "SPACER BAG/RESERVOIR";
      break;
    case "A4628":
      returnvalue = "OROPHARYNGEAL SUCTION CATH";
      break;
    case "A4629":
      returnvalue = "TRACHEOSTOMY CARE KIT";
      break;
    case "A4630":
      returnvalue = "REPL BAT T.E.N.S. OWN BY PT";
      break;
    case "A4632":
      returnvalue = "INFUS PUMP RPLCEMNT BATTERY";
      break;
    case "A4633":
      returnvalue = "UVL REPLACEMENT BULB";
      break;
    case "A4634":
      returnvalue = "REPLACEMENT BULB TH LIGHTBOX";
      break;
    case "A4635":
      returnvalue = "UNDERARM CRUTCH PAD";
      break;
    case "A4636":
      returnvalue = "HANDGRIP FOR CANE ETC";
      break;
    case "A4637":
      returnvalue = "REPL TIP CANE/CRUTCH/WALKER";
      break;
    case "A4638":
      returnvalue = "REPL BATT PULSE GEN SYS";
      break;
    case "A4639":
      returnvalue = "INFRARED HT SYS REPLCMNT PAD";
      break;
    case "A4640":
      returnvalue = "ALTERNATING PRESSURE PAD";
      break;
    case "A4641":
      returnvalue = "RADIOPHARM DX AGENT NOC";
      break;
    case "A4642":
      returnvalue = "IN111 SATUMOMAB";
      break;
    case "A4648":
      returnvalue = "IMPLANTABLE TISSUE MARKER";
      break;
    case "A4649":
      returnvalue = "SURGICAL SUPPLIES";
      break;
    case "A4650":
      returnvalue = "IMPLANT RADIATION DOSIMETER";
      break;
    case "A4651":
      returnvalue = "CALIBRATED MICROCAP TUBE";
      break;
    case "A4652":
      returnvalue = "MICROCAPILLARY TUBE SEALANT";
      break;
    case "A4653":
      returnvalue = "PD CATHETER ANCHOR BELT";
      break;
    case "A4657":
      returnvalue = "SYRINGE W/WO NEEDLE";
      break;
    case "A4660":
      returnvalue = "SPHYG/BP APP W CUFF AND STET";
      break;
    case "A4663":
      returnvalue = "DIALYSIS BLOOD PRESSURE CUFF";
      break;
    case "A4670":
      returnvalue = "AUTOMATIC BP MONITOR, DIAL";
      break;
    case "A4671":
      returnvalue = "DISPOSABLE CYCLER SET";
      break;
    case "A4672":
      returnvalue = "DRAINAGE EXT LINE, DIALYSIS";
      break;
    case "A4673":
      returnvalue = "EXT LINE W EASY LOCK CONNECT";
      break;
    case "A4674":
      returnvalue = "CHEM/ANTISEPT SOLUTION, 8OZ";
      break;
    case "A4680":
      returnvalue = "ACTIVATED CARBON FILTER, EA";
      break;
    case "A4690":
      returnvalue = "DIALYZER, EACH";
      break;
    case "A4706":
      returnvalue = "BICARBONATE CONC SOL PER GAL";
      break;
    case "A4707":
      returnvalue = "BICARBONATE CONC POW PER PAC";
      break;
    case "A4708":
      returnvalue = "ACETATE CONC SOL PER GALLON";
      break;
    case "A4709":
      returnvalue = "ACID CONC SOL PER GALLON";
      break;
    case "A4714":
      returnvalue = "TREATED WATER PER GALLON";
      break;
    case "A4719":
      returnvalue = "Y SET TUBING";
      break;
    case "A4720":
      returnvalue = "DIALYSAT SOL FLD VOL > 249CC";
      break;
    case "A4721":
      returnvalue = "DIALYSAT SOL FLD VOL > 999CC";
      break;
    case "A4722":
      returnvalue = "DIALYS SOL FLD VOL > 1999CC";
      break;
    case "A4723":
      returnvalue = "DIALYS SOL FLD VOL > 2999CC";
      break;
    case "A4724":
      returnvalue = "DIALYS SOL FLD VOL > 3999CC";
      break;
    case "A4725":
      returnvalue = "DIALYS SOL FLD VOL > 4999CC";
      break;
    case "A4726":
      returnvalue = "DIALYS SOL FLD VOL > 5999CC";
      break;
    case "A4728":
      returnvalue = "DIALYSATE SOLUTION, NON-DEX";
      break;
    case "A4730":
      returnvalue = "FISTULA CANNULATION SET, EA";
      break;
    case "A4736":
      returnvalue = "TOPICAL ANESTHETIC, PER GRAM";
      break;
    case "A4737":
      returnvalue = "INJ ANESTHETIC PER 10 ML";
      break;
    case "A4740":
      returnvalue = "SHUNT ACCESSORY";
      break;
    case "A4750":
      returnvalue = "ART OR VENOUS BLOOD TUBING";
      break;
    case "A4755":
      returnvalue = "COMB ART/VENOUS BLOOD TUBING";
      break;
    case "A4760":
      returnvalue = "DIALYSATE SOL TEST KIT, EACH";
      break;
    case "A4765":
      returnvalue = "DIALYSATE CONC POW PER PACK";
      break;
    case "A4766":
      returnvalue = "DIALYSATE CONC SOL ADD 10 ML";
      break;
    case "A4770":
      returnvalue = "BLOOD COLLECTION TUBE/VACUUM";
      break;
    case "A4771":
      returnvalue = "SERUM CLOTTING TIME TUBE";
      break;
    case "A4772":
      returnvalue = "BLOOD GLUCOSE TEST STRIPS";
      break;
    case "A4773":
      returnvalue = "OCCULT BLOOD TEST STRIPS";
      break;
    case "A4774":
      returnvalue = "AMMONIA TEST STRIPS";
      break;
    case "A4802":
      returnvalue = "PROTAMINE SULFATE PER 50 MG";
      break;
    case "A4860":
      returnvalue = "DISPOSABLE CATHETER TIPS";
      break;
    case "A4870":
      returnvalue = "PLUMB/ELEC WK HM HEMO EQUIP";
      break;
    case "A4890":
      returnvalue = "REPAIR/MAINT CONT HEMO EQUIP";
      break;
    case "A4911":
      returnvalue = "DRAIN BAG/BOTTLE";
      break;
    case "A4913":
      returnvalue = "MISC DIALYSIS SUPPLIES NOC";
      break;
    case "A4918":
      returnvalue = "VENOUS PRESSURE CLAMP";
      break;
    case "A4927":
      returnvalue = "NON-STERILE GLOVES";
      break;
    case "A4928":
      returnvalue = "SURGICAL MASK";
      break;
    case "A4929":
      returnvalue = "TOURNIQUET FOR DIALYSIS, EA";
      break;
    case "A4930":
      returnvalue = "STERILE, GLOVES PER PAIR";
      break;
    case "A4931":
      returnvalue = "REUSABLE ORAL THERMOMETER";
      break;
    case "A4932":
      returnvalue = "REUSABLE RECTAL THERMOMETER";
      break;
    case "A5051":
      returnvalue = "POUCH CLSD W BARR ATTACHED";
      break;
    case "A5052":
      returnvalue = "CLSD OSTOMY POUCH W/O BARR";
      break;
    case "A5053":
      returnvalue = "CLSD OSTOMY POUCH FACEPLATE";
      break;
    case "A5054":
      returnvalue = "CLSD OSTOMY POUCH W/FLANGE";
      break;
    case "A5055":
      returnvalue = "STOMA CAP";
      break;
    case "A5061":
      returnvalue = "POUCH DRAINABLE W BARRIER AT";
      break;
    case "A5062":
      returnvalue = "DRNBLE OSTOMY POUCH W/O BARR";
      break;
    case "A5063":
      returnvalue = "DRAIN OSTOMY POUCH W/FLANGE";
      break;
    case "A5071":
      returnvalue = "URINARY POUCH W/BARRIER";
      break;
    case "A5072":
      returnvalue = "URINARY POUCH W/O BARRIER";
      break;
    case "A5073":
      returnvalue = "URINARY POUCH ON BARR W/FLNG";
      break;
    case "A5081":
      returnvalue = "CONTINENT STOMA PLUG";
      break;
    case "A5082":
      returnvalue = "CONTINENT STOMA CATHETER";
      break;
    case "A5083":
      returnvalue = "STOMA ABSORPTIVE COVER";
      break;
    case "A5093":
      returnvalue = "OSTOMY ACCESSORY CONVEX INSE";
      break;
    case "A5102":
      returnvalue = "BEDSIDE DRAIN BTL W/WO TUBE";
      break;
    case "A5105":
      returnvalue = "URINARY SUSPENSORY";
      break;
    case "A5112":
      returnvalue = "URINARY LEG BAG";
      break;
    case "A5113":
      returnvalue = "LATEX LEG STRAP";
      break;
    case "A5114":
      returnvalue = "FOAM/FABRIC LEG STRAP";
      break;
    case "A5120":
      returnvalue = "SKIN BARRIER, WIPE OR SWAB";
      break;
    case "A5121":
      returnvalue = "SOLID SKIN BARRIER 6X6";
      break;
    case "A5122":
      returnvalue = "SOLID SKIN BARRIER 8X8";
      break;
    case "A5126":
      returnvalue = "DISK/FOAM PAD +OR- ADHESIVE";
      break;
    case "A5131":
      returnvalue = "APPLIANCE CLEANER";
      break;
    case "A5200":
      returnvalue = "PERCUTANEOUS CATHETER ANCHOR";
      break;
    case "A5500":
      returnvalue = "DIAB SHOE FOR DENSITY INSERT";
      break;
    case "A5501":
      returnvalue = "DIABETIC CUSTOM MOLDED SHOE";
      break;
    case "A5503":
      returnvalue = "DIABETIC SHOE W/ROLLER/ROCKR";
      break;
    case "A5504":
      returnvalue = "DIABETIC SHOE WITH WEDGE";
      break;
    case "A5505":
      returnvalue = "DIAB SHOE W/METATARSAL BAR";
      break;
    case "A5506":
      returnvalue = "DIABETIC SHOE W/OFF SET HEEL";
      break;
    case "A5507":
      returnvalue = "MODIFICATION DIABETIC SHOE";
      break;
    case "A5508":
      returnvalue = "DIABETIC DELUXE SHOE";
      break;
    case "A5510":
      returnvalue = "COMPRESSION FORM SHOE INSERT";
      break;
    case "A5512":
      returnvalue = "MULTI DEN INSERT DIRECT FORM";
      break;
    case "A5513":
      returnvalue = "MULTI DEN INSERT CUSTOM MOLD";
      break;
    case "A6000":
      returnvalue = "WOUND WARMING WOUND COVER";
      break;
    case "A6010":
      returnvalue = "COLLAGEN BASED WOUND FILLER";
      break;
    case "A6011":
      returnvalue = "COLLAGEN GEL/PASTE WOUND FIL";
      break;
    case "A6021":
      returnvalue = "COLLAGEN DRESSING <=16 SQ IN";
      break;
    case "A6022":
      returnvalue = "COLLAGEN DRSG>16<=48 SQ IN";
      break;
    case "A6023":
      returnvalue = "COLLAGEN DRESSING >48 SQ IN";
      break;
    case "A6024":
      returnvalue = "COLLAGEN DSG WOUND FILLER";
      break;
    case "A6025":
      returnvalue = "SILICONE GEL SHEET, EACH";
      break;
    case "A6154":
      returnvalue = "WOUND POUCH EACH";
      break;
    case "A6196":
      returnvalue = "ALGINATE DRESSING <=16 SQ IN";
      break;
    case "A6197":
      returnvalue = "ALGINATE DRSG >16 <=48 SQ IN";
      break;
    case "A6198":
      returnvalue = "ALGINATE DRESSING > 48 SQ IN";
      break;
    case "A6199":
      returnvalue = "ALGINATE DRSG WOUND FILLER";
      break;
    case "A6200":
      returnvalue = "COMPOS DRSG <=16 NO BORDER";
      break;
    case "A6201":
      returnvalue = "COMPOS DRSG >16<=48 NO BDR";
      break;
    case "A6202":
      returnvalue = "COMPOS DRSG >48 NO BORDER";
      break;
    case "A6203":
      returnvalue = "COMPOSITE DRSG <= 16 SQ IN";
      break;
    case "A6204":
      returnvalue = "COMPOSITE DRSG >16<=48 SQ IN";
      break;
    case "A6205":
      returnvalue = "COMPOSITE DRSG > 48 SQ IN";
      break;
    case "A6206":
      returnvalue = "CONTACT LAYER <= 16 SQ IN";
      break;
    case "A6207":
      returnvalue = "CONTACT LAYER >16<= 48 SQ IN";
      break;
    case "A6208":
      returnvalue = "CONTACT LAYER > 48 SQ IN";
      break;
    case "A6209":
      returnvalue = "FOAM DRSG <=16 SQ IN W/O BDR";
      break;
    case "A6210":
      returnvalue = "FOAM DRG >16<=48 SQ IN W/O B";
      break;
    case "A6211":
      returnvalue = "FOAM DRG > 48 SQ IN W/O BRDR";
      break;
    case "A6212":
      returnvalue = "FOAM DRG <=16 SQ IN W/BORDER";
      break;
    case "A6213":
      returnvalue = "FOAM DRG >16<=48 SQ IN W/BDR";
      break;
    case "A6214":
      returnvalue = "FOAM DRG > 48 SQ IN W/BORDER";
      break;
    case "A6215":
      returnvalue = "FOAM DRESSING WOUND FILLER";
      break;
    case "A6216":
      returnvalue = "NON-STERILE GAUZE<=16 SQ IN";
      break;
    case "A6217":
      returnvalue = "NON-STERILE GAUZE>16<=48 SQ";
      break;
    case "A6218":
      returnvalue = "NON-STERILE GAUZE > 48 SQ IN";
      break;
    case "A6219":
      returnvalue = "GAUZE <= 16 SQ IN W/BORDER";
      break;
    case "A6220":
      returnvalue = "GAUZE >16 <=48 SQ IN W/BORDR";
      break;
    case "A6221":
      returnvalue = "GAUZE > 48 SQ IN W/BORDER";
      break;
    case "A6222":
      returnvalue = "GAUZE <=16 IN NO W/SAL W/O B";
      break;
    case "A6223":
      returnvalue = "GAUZE >16<=48 NO W/SAL W/O B";
      break;
    case "A6224":
      returnvalue = "GAUZE > 48 IN NO W/SAL W/O B";
      break;
    case "A6228":
      returnvalue = "GAUZE <= 16 SQ IN WATER/SAL";
      break;
    case "A6229":
      returnvalue = "GAUZE >16<=48 SQ IN WATR/SAL";
      break;
    case "A6230":
      returnvalue = "GAUZE > 48 SQ IN WATER/SALNE";
      break;
    case "A6231":
      returnvalue = "HYDROGEL DSG<=16 SQ IN";
      break;
    case "A6232":
      returnvalue = "HYDROGEL DSG>16<=48 SQ IN";
      break;
    case "A6233":
      returnvalue = "HYDROGEL DRESSING >48 SQ IN";
      break;
    case "A6234":
      returnvalue = "HYDROCOLLD DRG <=16 W/O BDR";
      break;
    case "A6235":
      returnvalue = "HYDROCOLLD DRG >16<=48 W/O B";
      break;
    case "A6236":
      returnvalue = "HYDROCOLLD DRG > 48 IN W/O B";
      break;
    case "A6237":
      returnvalue = "HYDROCOLLD DRG <=16 IN W/BDR";
      break;
    case "A6238":
      returnvalue = "HYDROCOLLD DRG >16<=48 W/BDR";
      break;
    case "A6239":
      returnvalue = "HYDROCOLLD DRG > 48 IN W/BDR";
      break;
    case "A6240":
      returnvalue = "HYDROCOLLD DRG FILLER PASTE";
      break;
    case "A6241":
      returnvalue = "HYDROCOLLOID DRG FILLER DRY";
      break;
    case "A6242":
      returnvalue = "HYDROGEL DRG <=16 IN W/O BDR";
      break;
    case "A6243":
      returnvalue = "HYDROGEL DRG >16<=48 W/O BDR";
      break;
    case "A6244":
      returnvalue = "HYDROGEL DRG >48 IN W/O BDR";
      break;
    case "A6245":
      returnvalue = "HYDROGEL DRG <= 16 IN W/BDR";
      break;
    case "A6246":
      returnvalue = "HYDROGEL DRG >16<=48 IN W/B";
      break;
    case "A6247":
      returnvalue = "HYDROGEL DRG > 48 SQ IN W/B";
      break;
    case "A6248":
      returnvalue = "HYDROGEL DRSG GEL FILLER";
      break;
    case "A6250":
      returnvalue = "SKIN SEAL PROTECT MOISTURIZR";
      break;
    case "A6251":
      returnvalue = "ABSORPT DRG <=16 SQ IN W/O B";
      break;
    case "A6252":
      returnvalue = "ABSORPT DRG >16 <=48 W/O BDR";
      break;
    case "A6253":
      returnvalue = "ABSORPT DRG > 48 SQ IN W/O B";
      break;
    case "A6254":
      returnvalue = "ABSORPT DRG <=16 SQ IN W/BDR";
      break;
    case "A6255":
      returnvalue = "ABSORPT DRG >16<=48 IN W/BDR";
      break;
    case "A6256":
      returnvalue = "ABSORPT DRG > 48 SQ IN W/BDR";
      break;
    case "A6257":
      returnvalue = "TRANSPARENT FILM <= 16 SQ IN";
      break;
    case "A6258":
      returnvalue = "TRANSPARENT FILM >16<=48 IN";
      break;
    case "A6259":
      returnvalue = "TRANSPARENT FILM > 48 SQ IN";
      break;
    case "A6260":
      returnvalue = "WOUND CLEANSER ANY TYPE/SIZE";
      break;
    case "A6261":
      returnvalue = "WOUND FILLER GEL/PASTE /OZ";
      break;
    case "A6262":
      returnvalue = "WOUND FILLER DRY FORM / GRAM";
      break;
    case "A6266":
      returnvalue = "IMPREG GAUZE NO H20/SAL/YARD";
      break;
    case "A6402":
      returnvalue = "STERILE GAUZE <= 16 SQ IN";
      break;
    case "A6403":
      returnvalue = "STERILE GAUZE>16 <= 48 SQ IN";
      break;
    case "A6404":
      returnvalue = "STERILE GAUZE > 48 SQ IN";
      break;
    case "A6407":
      returnvalue = "PACKING STRIPS, NON-IMPREG";
      break;
    case "A6410":
      returnvalue = "STERILE EYE PAD";
      break;
    case "A6411":
      returnvalue = "NON-STERILE EYE PAD";
      break;
    case "A6412":
      returnvalue = "OCCLUSIVE EYE PATCH";
      break;
    case "A6413":
      returnvalue = "ADHESIVE BANDAGE, FIRST-AID";
      break;
    case "A6441":
      returnvalue = "PAD BAND W>=3? <5?/YD";
      break;
    case "A6442":
      returnvalue = "CONFORM BAND N/S W<3?/YD";
      break;
    case "A6443":
      returnvalue = "CONFORM BAND N/S W>=3?<5?/YD";
      break;
    case "A6444":
      returnvalue = "CONFORM BAND N/S W>=5?/YD";
      break;
    case "A6445":
      returnvalue = "CONFORM BAND S W <3?/YD";
      break;
    case "A6446":
      returnvalue = "CONFORM BAND S W>=3? <5?/YD";
      break;
    case "A6447":
      returnvalue = "CONFORM BAND S W >=5?/YD";
      break;
    case "A6448":
      returnvalue = "LT COMPRES BAND <3?/YD";
      break;
    case "A6449":
      returnvalue = "LT COMPRES BAND >=3? <5?/YD";
      break;
    case "A6450":
      returnvalue = "LT COMPRES BAND >=5?/YD";
      break;
    case "A6451":
      returnvalue = "MOD COMPRES BAND W>=3?<5?/YD";
      break;
    case "A6452":
      returnvalue = "HIGH COMPRES BAND W>=3?<5?YD";
      break;
    case "A6453":
      returnvalue = "SELF-ADHER BAND W <3?/YD";
      break;
    case "A6454":
      returnvalue = "SELF-ADHER BAND W>=3? <5?/YD";
      break;
    case "A6455":
      returnvalue = "SELF-ADHER BAND >=5?/YD";
      break;
    case "A6456":
      returnvalue = "ZINC PASTE BAND W >=3?<5?/YD";
      break;
    case "A6457":
      returnvalue = "TUBULAR DRESSING";
      break;
    case "A6501":
      returnvalue = "COMPRES BURNGARMENT BODYSUIT";
      break;
    case "A6502":
      returnvalue = "COMPRES BURNGARMENT CHINSTRP";
      break;
    case "A6503":
      returnvalue = "COMPRES BURNGARMENT FACEHOOD";
      break;
    case "A6504":
      returnvalue = "CMPRSBURNGARMENT GLOVE-WRIST";
      break;
    case "A6505":
      returnvalue = "CMPRSBURNGARMENT GLOVE-ELBOW";
      break;
    case "A6506":
      returnvalue = "CMPRSBURNGRMNT GLOVE-AXILLA";
      break;
    case "A6507":
      returnvalue = "CMPRS BURNGARMENT FOOT-KNEE";
      break;
    case "A6508":
      returnvalue = "CMPRS BURNGARMENT FOOT-THIGH";
      break;
    case "A6509":
      returnvalue = "COMPRES BURN GARMENT JACKET";
      break;
    case "A6510":
      returnvalue = "COMPRES BURN GARMENT LEOTARD";
      break;
    case "A6511":
      returnvalue = "COMPRES BURN GARMENT PANTY";
      break;
    case "A6512":
      returnvalue = "COMPRES BURN GARMENT, NOC";
      break;
    case "A6513":
      returnvalue = "COMPRESS BURN MASK FACE/NECK";
      break;
    case "A6530":
      returnvalue = "COMPRESSION STOCKING BK18-30";
      break;
    case "A6531":
      returnvalue = "COMPRESSION STOCKING BK30-40";
      break;
    case "A6532":
      returnvalue = "COMPRESSION STOCKING BK40-50";
      break;
    case "A6533":
      returnvalue = "GC STOCKING THIGHLNGTH 18-30";
      break;
    case "A6534":
      returnvalue = "GC STOCKING THIGHLNGTH 30-40";
      break;
    case "A6535":
      returnvalue = "GC STOCKING THIGHLNGTH 40-50";
      break;
    case "A6536":
      returnvalue = "GC STOCKING FULL LNGTH 18-30";
      break;
    case "A6537":
      returnvalue = "GC STOCKING FULL LNGTH 30-40";
      break;
    case "A6538":
      returnvalue = "GC STOCKING FULL LNGTH 40-50";
      break;
    case "A6539":
      returnvalue = "GC STOCKING WAISTLNGTH 18-30";
      break;
    case "A6540":
      returnvalue = "GC STOCKING WAISTLNGTH 30-40";
      break;
    case "A6541":
      returnvalue = "GC STOCKING WAISTLNGTH 40-50";
      break;
    case "A6542":
      returnvalue = "GC STOCKING CUSTOM MADE";
      break;
    case "A6543":
      returnvalue = "GC STOCKING LYMPHEDEMA";
      break;
    case "A6544":
      returnvalue = "GC STOCKING GARTER BELT";
      break;
    case "A6545":
      returnvalue = "GRAD COMP NON-ELASTIC BK";
      break;
    case "A6549":
      returnvalue = "G COMPRESSION STOCKING";
      break;
    case "A6550":
      returnvalue = "NEG PRES WOUND THER DRSG SET";
      break;
    case "A7000":
      returnvalue = "DISPOSABLE CANISTER FOR PUMP";
      break;
    case "A7001":
      returnvalue = "NONDISPOSABLE PUMP CANISTER";
      break;
    case "A7002":
      returnvalue = "TUBING USED W SUCTION PUMP";
      break;
    case "A7003":
      returnvalue = "NEBULIZER ADMINISTRATION SET";
      break;
    case "A7004":
      returnvalue = "DISPOSABLE NEBULIZER SML VOL";
      break;
    case "A7005":
      returnvalue = "NONDISPOSABLE NEBULIZER SET";
      break;
    case "A7006":
      returnvalue = "FILTERED NEBULIZER ADMIN SET";
      break;
    case "A7007":
      returnvalue = "LG VOL NEBULIZER DISPOSABLE";
      break;
    case "A7008":
      returnvalue = "DISPOSABLE NEBULIZER PREFILL";
      break;
    case "A7009":
      returnvalue = "NEBULIZER RESERVOIR BOTTLE";
      break;
    case "A7010":
      returnvalue = "DISPOSABLE CORRUGATED TUBING";
      break;
    case "A7011":
      returnvalue = "NONDISPOS CORRUGATED TUBING";
      break;
    case "A7012":
      returnvalue = "NEBULIZER WATER COLLEC DEVIC";
      break;
    case "A7013":
      returnvalue = "DISPOSABLE COMPRESSOR FILTER";
      break;
    case "A7014":
      returnvalue = "COMPRESSOR NONDISPOS FILTER";
      break;
    case "A7015":
      returnvalue = "AEROSOL MASK USED W NEBULIZE";
      break;
    case "A7016":
      returnvalue = "NEBULIZER DOME & MOUTHPIECE";
      break;
    case "A7017":
      returnvalue = "NEBULIZER NOT USED W OXYGEN";
      break;
    case "A7018":
      returnvalue = "WATER DISTILLED W/NEBULIZER";
      break;
    case "A7025":
      returnvalue = "REPLACE CHEST COMPRESS VEST";
      break;
    case "A7026":
      returnvalue = "REPLACE CHST CMPRSS SYS HOSE";
      break;
    case "A7027":
      returnvalue = "COMBINATION ORAL/NASAL MASK";
      break;
    case "A7028":
      returnvalue = "REPL ORAL CUSHION COMBO MASK";
      break;
    case "A7029":
      returnvalue = "REPL NASAL PILLOW COMB MASK";
      break;
    case "A7030":
      returnvalue = "CPAP FULL FACE MASK";
      break;
    case "A7031":
      returnvalue = "REPLACEMENT FACEMASK INTERFA";
      break;
    case "A7032":
      returnvalue = "REPLACEMENT NASAL CUSHION";
      break;
    case "A7033":
      returnvalue = "REPLACEMENT NASAL PILLOWS";
      break;
    case "A7034":
      returnvalue = "NASAL APPLICATION DEVICE";
      break;
    case "A7035":
      returnvalue = "POS AIRWAY PRESS HEADGEAR";
      break;
    case "A7036":
      returnvalue = "POS AIRWAY PRESS CHINSTRAP";
      break;
    case "A7037":
      returnvalue = "POS AIRWAY PRESSURE TUBING";
      break;
    case "A7038":
      returnvalue = "POS AIRWAY PRESSURE FILTER";
      break;
    case "A7039":
      returnvalue = "FILTER, NON DISPOSABLE W PAP";
      break;
    case "A7040":
      returnvalue = "ONE WAY CHEST DRAIN VALVE";
      break;
    case "A7041":
      returnvalue = "WATER SEAL DRAIN CONTAINER";
      break;
    case "A7042":
      returnvalue = "IMPLANTED PLEURAL CATHETER";
      break;
    case "A7043":
      returnvalue = "VACUUM DRAINAGEBOTTLE/TUBING";
      break;
    case "A7044":
      returnvalue = "PAP ORAL INTERFACE";
      break;
    case "A7045":
      returnvalue = "REPL EXHALATION PORT FOR PAP";
      break;
    case "A7046":
      returnvalue = "REPL WATER CHAMBER, PAP DEV";
      break;
    case "A7501":
      returnvalue = "TRACHEOSTOMA VALVE W DIAPHRA";
      break;
    case "A7502":
      returnvalue = "REPLACEMENT DIAPHRAGM/FPLATE";
      break;
    case "A7503":
      returnvalue = "HMES FILTER HOLDER OR CAP";
      break;
    case "A7504":
      returnvalue = "TRACHEOSTOMA HMES FILTER";
      break;
    case "A7505":
      returnvalue = "HMES OR TRACH VALVE HOUSING";
      break;
    case "A7506":
      returnvalue = "HMES/TRACHVALVE ADHESIVEDISK";
      break;
    case "A7507":
      returnvalue = "INTEGRATED FILTER & HOLDER";
      break;
    case "A7508":
      returnvalue = "HOUSING & INTEGRATED ADHESIV";
      break;
    case "A7509":
      returnvalue = "HEAT & MOISTURE EXCHANGE SYS";
      break;
    case "A7520":
      returnvalue = "TRACH/LARYN TUBE NON-CUFFED";
      break;
    case "A7521":
      returnvalue = "TRACH/LARYN TUBE CUFFED";
      break;
    case "A7522":
      returnvalue = "TRACH/LARYN TUBE STAINLESS";
      break;
    case "A7523":
      returnvalue = "TRACHEOSTOMY SHOWER PROTECT";
      break;
    case "A7524":
      returnvalue = "TRACHEOSTOMA STENT/STUD/BTTN";
      break;
    case "A7525":
      returnvalue = "TRACHEOSTOMY MASK";
      break;
    case "A7526":
      returnvalue = "TRACHEOSTOMY TUBE COLLAR";
      break;
    case "A7527":
      returnvalue = "TRACH/LARYN TUBE PLUG/STOP";
      break;
    case "A8000":
      returnvalue = "SOFT PROTECT HELMET PREFAB";
      break;
    case "A8001":
      returnvalue = "HARD PROTECT HELMET PREFAB";
      break;
    case "A8002":
      returnvalue = "SOFT PROTECT HELMET CUSTOM";
      break;
    case "A8003":
      returnvalue = "HARD PROTECT HELMET CUSTOM";
      break;
    case "A8004":
      returnvalue = "REPL SOFT INTERFACE, HELMET";
      break;
    case "A9150":
      returnvalue = "MISC/EXPER NON-PRESCRIPT DRU";
      break;
    case "A9152":
      returnvalue = "SINGLE VITAMIN NOS";
      break;
    case "A9153":
      returnvalue = "MULTI-VITAMIN NOS";
      break;
    case "A9155":
      returnvalue = "ARTIFICIAL SALIVA";
      break;
    case "A9180":
      returnvalue = "LICE TREATMENT, TOPICAL";
      break;
    case "A9270":
      returnvalue = "NON-COVERED ITEM OR SERVICE";
      break;
    case "A9274":
      returnvalue = "EXT AMB INSULIN DELIVERY SYS";
      break;
    case "A9275":
      returnvalue = "DISP HOME GLUCOSE MONITOR";
      break;
    case "A9276":
      returnvalue = "DISPOSABLE SENSOR, CGM SYS";
      break;
    case "A9277":
      returnvalue = "EXTERNAL TRANSMITTER, CGM";
      break;
    case "A9278":
      returnvalue = "EXTERNAL RECEIVER, CGM SYS";
      break;
    case "A9279":
      returnvalue = "MONITORING FEATURE/DEVICENOC";
      break;
    case "A9280":
      returnvalue = "ALERT DEVICE, NOC";
      break;
    case "A9281":
      returnvalue = "REACHING/GRABBING DEVICE";
      break;
    case "A9282":
      returnvalue = "WIG ANY TYPE";
      break;
    case "A9283":
      returnvalue = "FOOT PRESS OFF LOAD SUPP DEV";
      break;
    case "A9284":
      returnvalue = "NON-ELECTRONIC SPIROMETER";
      break;
    case "A9300":
      returnvalue = "EXERCISE EQUIPMENT";
      break;
    case "A9500":
      returnvalue = "TC99M SESTAMIBI";
      break;
    case "A9501":
      returnvalue = "TECHNETIUM TC-99M TEBOROXIME";
      break;
    case "A9502":
      returnvalue = "TC99M TETROFOSMIN";
      break;
    case "A9503":
      returnvalue = "TC99M MEDRONATE";
      break;
    case "A9504":
      returnvalue = "TC99M APCITIDE";
      break;
    case "A9505":
      returnvalue = "TL201 THALLIUM";
      break;
    case "A9507":
      returnvalue = "IN111 CAPROMAB";
      break;
    case "A9508":
      returnvalue = "I131 IODOBENGUATE, DX";
      break;
    case "A9509":
      returnvalue = "IODINE I-123 SOD IODIDE MIL";
      break;
    case "A9510":
      returnvalue = "TC99M DISOFENIN";
      break;
    case "A9512":
      returnvalue = "TC99M PERTECHNETATE";
      break;
    case "A9516":
      returnvalue = "IODINE I-123 SOD IODIDE MIC";
      break;
    case "A9517":
      returnvalue = "I131 IODIDE CAP, RX";
      break;
    case "A9521":
      returnvalue = "TC99M EXAMETAZIME";
      break;
    case "A9524":
      returnvalue = "I131 SERUM ALBUMIN, DX";
      break;
    case "A9526":
      returnvalue = "NITROGEN N-13 AMMONIA";
      break;
    case "A9527":
      returnvalue = "IODINE I-125 SODIUM IODIDE";
      break;
    case "A9528":
      returnvalue = "IODINE I-131 IODIDE CAP, DX";
      break;
    case "A9529":
      returnvalue = "I131 IODIDE SOL, DX";
      break;
    case "A9530":
      returnvalue = "I131 IODIDE SOL, RX";
      break;
    case "A9531":
      returnvalue = "I131 MAX 100UCI";
      break;
    case "A9532":
      returnvalue = "I125 SERUM ALBUMIN, DX";
      break;
    case "A9535":
      returnvalue = "INJECTION, METHYLENE BLUE";
      break;
    case "A9536":
      returnvalue = "TC99M DEPREOTIDE";
      break;
    case "A9537":
      returnvalue = "TC99M MEBROFENIN";
      break;
    case "A9538":
      returnvalue = "TC99M PYROPHOSPHATE";
      break;
    case "A9539":
      returnvalue = "TC99M PENTETATE";
      break;
    case "A9540":
      returnvalue = "TC99M MAA";
      break;
    case "A9541":
      returnvalue = "TC99M SULFUR COLLOID";
      break;
    case "A9542":
      returnvalue = "IN111 IBRITUMOMAB, DX";
      break;
    case "A9543":
      returnvalue = "Y90 IBRITUMOMAB, RX";
      break;
    case "A9544":
      returnvalue = "I131 TOSITUMOMAB, DX";
      break;
    case "A9545":
      returnvalue = "I131 TOSITUMOMAB, RX";
      break;
    case "A9546":
      returnvalue = "CO57/58";
      break;
    case "A9547":
      returnvalue = "IN111 OXYQUINOLINE";
      break;
    case "A9548":
      returnvalue = "IN111 PENTETATE";
      break;
    case "A9549":
      returnvalue = "TC99M ARCITUMOMAB";
      break;
    case "A9550":
      returnvalue = "TC99M GLUCEPTATE";
      break;
    case "A9551":
      returnvalue = "TC99M SUCCIMER";
      break;
    case "A9552":
      returnvalue = "F18 FDG";
      break;
    case "A9553":
      returnvalue = "CR51 CHROMATE";
      break;
    case "A9554":
      returnvalue = "I125 IOTHALAMATE, DX";
      break;
    case "A9555":
      returnvalue = "RB82 RUBIDIUM";
      break;
    case "A9556":
      returnvalue = "GA67 GALLIUM";
      break;
    case "A9557":
      returnvalue = "TC99M BICISATE";
      break;
    case "A9558":
      returnvalue = "XE133 XENON 10MCI";
      break;
    case "A9559":
      returnvalue = "CO57 CYANO";
      break;
    case "A9560":
      returnvalue = "TC99M LABELED RBC";
      break;
    case "A9561":
      returnvalue = "TC99M OXIDRONATE";
      break;
    case "A9562":
      returnvalue = "TC99M MERTIATIDE";
      break;
    case "A9563":
      returnvalue = "P32 NA PHOSPHATE";
      break;
    case "A9564":
      returnvalue = "P32 CHROMIC PHOSPHATE";
      break;
    case "A9565":
      returnvalue = "IN111 PENTETREOTIDE";
      break;
    case "A9566":
      returnvalue = "TC99M FANOLESOMAB";
      break;
    case "A9567":
      returnvalue = "TECHNETIUM TC-99M AEROSOL";
      break;
    case "A9568":
      returnvalue = "TECHNETIUM TC99M ARCITUMOMAB";
      break;
    case "A9569":
      returnvalue = "TECHNETIUM TC-99M AUTO WBC";
      break;
    case "A9570":
      returnvalue = "INDIUM IN-111 AUTO WBC";
      break;
    case "A9571":
      returnvalue = "INDIUM IN-111 AUTO PLATELET";
      break;
    case "A9572":
      returnvalue = "INDIUM IN-111 PENTETREOTIDE";
      break;
    case "A9576":
      returnvalue = "INJ PROHANCE MULTIPACK";
      break;
    case "A9577":
      returnvalue = "INJ MULTIHANCE";
      break;
    case "A9578":
      returnvalue = "INJ MULTIHANCE MULTIPACK";
      break;
    case "A9579":
      returnvalue = "GAD-BASE MR CONTRAST NOS,1ML";
      break;
    case "A9580":
      returnvalue = "SODIUM FLUORIDE F-18";
      break;
    case "A9581":
      returnvalue = "GADOXETATE DISODIUM INJ";
      break;
    case "A9582":
      returnvalue = "IODINE I-123 IOBENGUANE";
      break;
    case "A9583":
      returnvalue = "GADOFOSVESET TRISODIUM INJ";
      break;
    case "A9600":
      returnvalue = "SR89 STRONTIUM";
      break;
    case "A9604":
      returnvalue = "SM 153 LEXIDRONAM";
      break;
    case "A9605":
      returnvalue = "SM 153 LEXIDRONM";
      break;
    case "A9698":
      returnvalue = "NON-RAD CONTRAST MATERIALNOC";
      break;
    case "A9699":
      returnvalue = "RADIOPHARM RX AGENT NOC";
      break;
    case "A9700":
      returnvalue = "ECHOCARDIOGRAPHY CONTRAST";
      break;
    case "A9900":
      returnvalue = "SUPPLY/ACCESSORY/SERVICE";
      break;
    case "A9901":
      returnvalue = "DELIVERY/SET UP/DISPENSING";
      break;
    case "A9999":
      returnvalue = "DME SUPPLY OR ACCESSORY, NOS";
      break;
    case "B4034":
      returnvalue = "ENTER FEED SUPKIT SYR BY DAY";
      break;
    case "B4035":
      returnvalue = "ENTERAL FEED SUPP PUMP PER D";
      break;
    case "B4036":
      returnvalue = "ENTERAL FEED SUP KIT GRAV BY";
      break;
    case "B4081":
      returnvalue = "ENTERAL NG TUBING W/ STYLET";
      break;
    case "B4082":
      returnvalue = "ENTERAL NG TUBING W/O STYLET";
      break;
    case "B4083":
      returnvalue = "ENTERAL STOMACH TUBE LEVINE";
      break;
    case "B4086":
      returnvalue = "GASTROSTOMY/JEJUNOSTOMY TUBE";
      break;
    case "B4087":
      returnvalue = "GASTRO/JEJUNO TUBE, STD";
      break;
    case "B4088":
      returnvalue = "GASTRO/JEJUNO TUBE, LOW-PRO";
      break;
    case "B4100":
      returnvalue = "FOOD THICKENER ORAL";
      break;
    case "B4102":
      returnvalue = "EF ADULT FLUIDS AND ELECTRO";
      break;
    case "B4103":
      returnvalue = "EF PED FLUID AND ELECTROLYTE";
      break;
    case "B4104":
      returnvalue = "ADDITIVE FOR ENTERAL FORMULA";
      break;
    case "B4149":
      returnvalue = "EF BLENDERIZED FOODS";
      break;
    case "B4150":
      returnvalue = "EF COMPLET W/INTACT NUTRIENT";
      break;
    case "B4152":
      returnvalue = "EF CALORIE DENSE>/=1.5KCAL";
      break;
    case "B4153":
      returnvalue = "EF HYDROLYZED/AMINO ACIDS";
      break;
    case "B4154":
      returnvalue = "EF SPEC METABOLIC NONINHERIT";
      break;
    case "B4155":
      returnvalue = "EF INCOMPLETE/MODULAR";
      break;
    case "B4157":
      returnvalue = "EF SPECIAL METABOLIC INHERIT";
      break;
    case "B4158":
      returnvalue = "EF PED COMPLETE INTACT NUT";
      break;
    case "B4159":
      returnvalue = "EF PED COMPLETE SOY BASED";
      break;
    case "B4160":
      returnvalue = "EF PED CALORIC DENSE>/=0.7KC";
      break;
    case "B4161":
      returnvalue = "EF PED HYDROLYZED/AMINO ACID";
      break;
    case "B4162":
      returnvalue = "EF PED SPECMETABOLIC INHERIT";
      break;
    case "B4164":
      returnvalue = "PARENTERAL 50% DEXTROSE SOLU";
      break;
    case "B4168":
      returnvalue = "PARENTERAL SOL AMINO ACID 3.";
      break;
    case "B4172":
      returnvalue = "PARENTERAL SOL AMINO ACID 5.";
      break;
    case "B4176":
      returnvalue = "PARENTERAL SOL AMINO ACID 7-";
      break;
    case "B4178":
      returnvalue = "PARENTERAL SOL AMINO ACID >";
      break;
    case "B4180":
      returnvalue = "PARENTERAL SOL CARB > 50%";
      break;
    case "B4185":
      returnvalue = "PARENTERAL SOL 10 GM LIPIDS";
      break;
    case "B4189":
      returnvalue = "PARENTERAL SOL AMINO ACID &";
      break;
    case "B4193":
      returnvalue = "PARENTERAL SOL 52-73 GM PROT";
      break;
    case "B4197":
      returnvalue = "PARENTERAL SOL 74-100 GM PRO";
      break;
    case "B4199":
      returnvalue = "PARENTERAL SOL > 100GM PROTE";
      break;
    case "B4216":
      returnvalue = "PARENTERAL NUTRITION ADDITIV";
      break;
    case "B4220":
      returnvalue = "PARENTERAL SUPPLY KIT PREMIX";
      break;
    case "B4222":
      returnvalue = "PARENTERAL SUPPLY KIT HOMEMI";
      break;
    case "B4224":
      returnvalue = "PARENTERAL ADMINISTRATION KI";
      break;
    case "B5000":
      returnvalue = "PARENTERAL SOL RENAL-AMIROSY";
      break;
    case "B5100":
      returnvalue = "PARENTERAL SOL HEPATIC-FREAM";
      break;
    case "B5200":
      returnvalue = "PARENTERAL SOL STRES-BRNCH C";
      break;
    case "B9000":
      returnvalue = "ENTER INFUSION PUMP W/O ALRM";
      break;
    case "B9002":
      returnvalue = "ENTERAL INFUSION PUMP W/ ALA";
      break;
    case "B9004":
      returnvalue = "PARENTERAL INFUS PUMP PORTAB";
      break;
    case "B9006":
      returnvalue = "PARENTERAL INFUS PUMP STATIO";
      break;
    case "B9998":
      returnvalue = "ENTERAL SUPP NOT OTHERWISE C";
      break;
    case "B9999":
      returnvalue = "PARENTERAL SUPP NOT OTHRWS C";
      break;
    case "C1178":
      returnvalue = "BUSULFAN IV, 6 MG";
      break;
    case "C1300":
      returnvalue = "HYPERBARIC OXYGEN";
      break;
    case "C1713":
      returnvalue = "ANCHOR/SCREW BN/BN,TIS/BN";
      break;
    case "C1714":
      returnvalue = "CATH, TRANS ATHERECTOMY, DIR";
      break;
    case "C1715":
      returnvalue = "BRACHYTHERAPY NEEDLE";
      break;
    case "C1716":
      returnvalue = "BRACHYTX, NON-STR, GOLD-198";
      break;
    case "C1717":
      returnvalue = "BRACHYTX, NON-STR,HDR IR-192";
      break;
    case "C1718":
      returnvalue = "BRACHYTX SOURCE, IODINE 125";
      break;
    case "C1719":
      returnvalue = "BRACHYTX, NS, NON-HDRIR-192";
      break;
    case "C1720":
      returnvalue = "BRACHYTX SOUR, PALLADIUM 103";
      break;
    case "C1721":
      returnvalue = "AICD, DUAL CHAMBER";
      break;
    case "C1722":
      returnvalue = "AICD, SINGLE CHAMBER";
      break;
    case "C1724":
      returnvalue = "CATH, TRANS ATHEREC,ROTATION";
      break;
    case "C1725":
      returnvalue = "CATH, TRANSLUMIN NON-LASER";
      break;
    case "C1726":
      returnvalue = "CATH, BAL DIL, NON-VASCULAR";
      break;
    case "C1727":
      returnvalue = "CATH, BAL TIS DIS, NON-VAS";
      break;
    case "C1728":
      returnvalue = "CATH, BRACHYTX SEED ADM";
      break;
    case "C1729":
      returnvalue = "CATH, DRAINAGE";
      break;
    case "C1730":
      returnvalue = "CATH, EP, 19 OR FEW ELECT";
      break;
    case "C1731":
      returnvalue = "CATH, EP, 20 OR MORE ELEC";
      break;
    case "C1732":
      returnvalue = "CATH, EP, DIAG/ABL, 3D/VECT";
      break;
    case "C1733":
      returnvalue = "CATH, EP, OTHR THAN COOL-TIP";
      break;
    case "C1750":
      returnvalue = "CATH, HEMODIALYSIS,LONG-TERM";
      break;
    case "C1751":
      returnvalue = "CATH, INF, PER/CENT/MIDLINE";
      break;
    case "C1752":
      returnvalue = "CATH,HEMODIALYSIS,SHORT-TERM";
      break;
    case "C1753":
      returnvalue = "CATH, INTRAVAS ULTRASOUND";
      break;
    case "C1754":
      returnvalue = "CATHETER, INTRADISCAL";
      break;
    case "C1755":
      returnvalue = "CATHETER, INTRASPINAL";
      break;
    case "C1756":
      returnvalue = "CATH, PACING, TRANSESOPH";
      break;
    case "C1757":
      returnvalue = "CATH, THROMBECTOMY/EMBOLECT";
      break;
    case "C1758":
      returnvalue = "CATHETER, URETERAL";
      break;
    case "C1759":
      returnvalue = "CATH, INTRA ECHOCARDIOGRAPHY";
      break;
    case "C1760":
      returnvalue = "CLOSURE DEV, VASC";
      break;
    case "C1762":
      returnvalue = "CONN TISS, HUMAN(INC FASCIA)";
      break;
    case "C1763":
      returnvalue = "CONN TISS, NON-HUMAN";
      break;
    case "C1764":
      returnvalue = "EVENT RECORDER, CARDIAC";
      break;
    case "C1765":
      returnvalue = "ADHESION BARRIER";
      break;
    case "C1766":
      returnvalue = "INTRO/SHEATH,STRBLE,NON-PEEL";
      break;
    case "C1767":
      returnvalue = "GENERATOR, NEURO NON-RECHARG";
      break;
    case "C1768":
      returnvalue = "GRAFT, VASCULAR";
      break;
    case "C1769":
      returnvalue = "GUIDE WIRE";
      break;
    case "C1770":
      returnvalue = "IMAGING COIL, MR, INSERTABLE";
      break;
    case "C1771":
      returnvalue = "REP DEV, URINARY, W/SLING";
      break;
    case "C1772":
      returnvalue = "INFUSION PUMP, PROGRAMMABLE";
      break;
    case "C1773":
      returnvalue = "RET DEV, INSERTABLE";
      break;
    case "C1776":
      returnvalue = "JOINT DEVICE (IMPLANTABLE)";
      break;
    case "C1777":
      returnvalue = "LEAD, AICD, ENDO SINGLE COIL";
      break;
    case "C1778":
      returnvalue = "LEAD, NEUROSTIMULATOR";
      break;
    case "C1779":
      returnvalue = "LEAD, PMKR, TRANSVENOUS VDD";
      break;
    case "C1780":
      returnvalue = "LENS, INTRAOCULAR (NEW TECH)";
      break;
    case "C1781":
      returnvalue = "MESH (IMPLANTABLE)";
      break;
    case "C1782":
      returnvalue = "MORCELLATOR";
      break;
    case "C1783":
      returnvalue = "OCULAR IMP, AQUEOUS DRAIN DE";
      break;
    case "C1784":
      returnvalue = "OCULAR DEV, INTRAOP, DET RET";
      break;
    case "C1785":
      returnvalue = "PMKR, DUAL, RATE-RESP";
      break;
    case "C1786":
      returnvalue = "PMKR, SINGLE, RATE-RESP";
      break;
    case "C1787":
      returnvalue = "PATIENT PROGR, NEUROSTIM";
      break;
    case "C1788":
      returnvalue = "PORT, INDWELLING, IMP";
      break;
    case "C1789":
      returnvalue = "PROSTHESIS, BREAST, IMP";
      break;
    case "C1813":
      returnvalue = "PROSTHESIS, PENILE, INFLATAB";
      break;
    case "C1814":
      returnvalue = "RETINAL TAMP, SILICONE OIL";
      break;
    case "C1815":
      returnvalue = "PROS, URINARY SPH, IMP";
      break;
    case "C1816":
      returnvalue = "RECEIVER/TRANSMITTER, NEURO";
      break;
    case "C1817":
      returnvalue = "SEPTAL DEFECT IMP SYS";
      break;
    case "C1818":
      returnvalue = "INTEGRATED KERATOPROSTHESIS";
      break;
    case "C1819":
      returnvalue = "TISSUE LOCALIZATION-EXCISION";
      break;
    case "C1820":
      returnvalue = "GENERATOR NEURO RECHG BAT SY";
      break;
    case "C1821":
      returnvalue = "INTERSPINOUS IMPLANT";
      break;
    case "C1874":
      returnvalue = "STENT, COATED/COV W/DEL SYS";
      break;
    case "C1875":
      returnvalue = "STENT, COATED/COV W/O DEL SY";
      break;
    case "C1876":
      returnvalue = "STENT, NON-COA/NON-COV W/DEL";
      break;
    case "C1877":
      returnvalue = "STENT, NON-COAT/COV W/O DEL";
      break;
    case "C1878":
      returnvalue = "MATRL FOR VOCAL CORD";
      break;
    case "C1879":
      returnvalue = "TISSUE MARKER, IMPLANTABLE";
      break;
    case "C1880":
      returnvalue = "VENA CAVA FILTER";
      break;
    case "C1881":
      returnvalue = "DIALYSIS ACCESS SYSTEM";
      break;
    case "C1882":
      returnvalue = "AICD, OTHER THAN SING/DUAL";
      break;
    case "C1883":
      returnvalue = "ADAPT/EXT, PACING/NEURO LEAD";
      break;
    case "C1884":
      returnvalue = "EMBOLIZATION PROTECT SYST";
      break;
    case "C1885":
      returnvalue = "CATH, TRANSLUMIN ANGIO LASER";
      break;
    case "C1887":
      returnvalue = "CATHETER, GUIDING";
      break;
    case "C1888":
      returnvalue = "ENDOVAS NON-CARDIAC ABL CATH";
      break;
    case "C1891":
      returnvalue = "INFUSION PUMP,NON-PROG, PERM";
      break;
    case "C1892":
      returnvalue = "INTRO/SHEATH,FIXED,PEEL-AWAY";
      break;
    case "C1893":
      returnvalue = "INTRO/SHEATH, FIXED,NON-PEEL";
      break;
    case "C1894":
      returnvalue = "INTRO/SHEATH, NON-LASER";
      break;
    case "C1895":
      returnvalue = "LEAD, AICD, ENDO DUAL COIL";
      break;
    case "C1896":
      returnvalue = "LEAD, AICD, NON SING/DUAL";
      break;
    case "C1897":
      returnvalue = "LEAD, NEUROSTIM TEST KIT";
      break;
    case "C1898":
      returnvalue = "LEAD, PMKR, OTHER THAN TRANS";
      break;
    case "C1899":
      returnvalue = "LEAD, PMKR/AICD COMBINATION";
      break;
    case "C1900":
      returnvalue = "LEAD, CORONARY VENOUS";
      break;
    case "C2614":
      returnvalue = "PROBE, PERC LUMB DISC";
      break;
    case "C2615":
      returnvalue = "SEALANT, PULMONARY, LIQUID";
      break;
    case "C2616":
      returnvalue = "BRACHYTX, NON-STR,YTTRIUM-90";
      break;
    case "C2617":
      returnvalue = "STENT, NON-COR, TEM W/O DEL";
      break;
    case "C2618":
      returnvalue = "PROBE, CRYOABLATION";
      break;
    case "C2619":
      returnvalue = "PMKR, DUAL, NON RATE-RESP";
      break;
    case "C2620":
      returnvalue = "PMKR, SINGLE, NON RATE-RESP";
      break;
    case "C2621":
      returnvalue = "PMKR, OTHER THAN SING/DUAL";
      break;
    case "C2622":
      returnvalue = "PROSTHESIS, PENILE, NON-INF";
      break;
    case "C2625":
      returnvalue = "STENT, NON-COR, TEM W/DEL SY";
      break;
    case "C2626":
      returnvalue = "INFUSION PUMP, NON-PROG,TEMP";
      break;
    case "C2627":
      returnvalue = "CATH, SUPRAPUBIC/CYSTOSCOPIC";
      break;
    case "C2628":
      returnvalue = "CATHETER, OCCLUSION";
      break;
    case "C2629":
      returnvalue = "INTRO/SHEATH, LASER";
      break;
    case "C2630":
      returnvalue = "CATH, EP, COOL-TIP";
      break;
    case "C2631":
      returnvalue = "REP DEV, URINARY, W/O SLING";
      break;
    case "C2632":
      returnvalue = "BRACHYTX SOL, I-125, PER MCI";
      break;
    case "C2633":
      returnvalue = "BRACHYTX SOURCE, CESIUM-131";
      break;
    case "C2634":
      returnvalue = "BRACHYTX, NON-STR, HA, I-125";
      break;
    case "C2635":
      returnvalue = "BRACHYTX, NON-STR, HA, P-103";
      break;
    case "C2636":
      returnvalue = "BRACHY LINEAR, NON-STR,P-103";
      break;
    case "C2637":
      returnvalue = "BRACHY,NON-STR,YTTERBIUM-169";
      break;
    case "C2638":
      returnvalue = "BRACHYTX, STRANDED, I-125";
      break;
    case "C2639":
      returnvalue = "BRACHYTX, NON-STRANDED,I-125";
      break;
    case "C2640":
      returnvalue = "BRACHYTX, STRANDED, P-103";
      break;
    case "C2641":
      returnvalue = "BRACHYTX, NON-STRANDED,P-103";
      break;
    case "C2642":
      returnvalue = "BRACHYTX, STRANDED, C-131";
      break;
    case "C2643":
      returnvalue = "BRACHYTX, NON-STRANDED,C-131";
      break;
    case "C2698":
      returnvalue = "BRACHYTX, STRANDED, NOS";
      break;
    case "C2699":
      returnvalue = "BRACHYTX, NON-STRANDED, NOS";
      break;
    case "C8900":
      returnvalue = "MRA W/CONT, ABD";
      break;
    case "C8901":
      returnvalue = "MRA W/O CONT, ABD";
      break;
    case "C8902":
      returnvalue = "MRA W/O FOL W/CONT, ABD";
      break;
    case "C8903":
      returnvalue = "MRI W/CONT, BREAST,  UNI";
      break;
    case "C8904":
      returnvalue = "MRI W/O CONT, BREAST, UNI";
      break;
    case "C8905":
      returnvalue = "MRI W/O FOL W/CONT, BRST, UN";
      break;
    case "C8906":
      returnvalue = "MRI W/CONT, BREAST,  BI";
      break;
    case "C8907":
      returnvalue = "MRI W/O CONT, BREAST, BI";
      break;
    case "C8908":
      returnvalue = "MRI W/O FOL W/CONT, BREAST,";
      break;
    case "C8909":
      returnvalue = "MRA W/CONT, CHEST";
      break;
    case "C8910":
      returnvalue = "MRA W/O CONT, CHEST";
      break;
    case "C8911":
      returnvalue = "MRA W/O FOL W/CONT, CHEST";
      break;
    case "C8912":
      returnvalue = "MRA W/CONT, LWR EXT";
      break;
    case "C8913":
      returnvalue = "MRA W/O CONT, LWR EXT";
      break;
    case "C8914":
      returnvalue = "MRA W/O FOL W/CONT, LWR EXT";
      break;
    case "C8918":
      returnvalue = "MRA W/CONT, PELVIS";
      break;
    case "C8919":
      returnvalue = "MRA W/O CONT, PELVIS";
      break;
    case "C8920":
      returnvalue = "MRA W/O FOL W/CONT, PELVIS";
      break;
    case "C8921":
      returnvalue = "TTE W OR W/O FOL W/CONT, COM";
      break;
    case "C8922":
      returnvalue = "TTE W OR W/O FOL W/CONT, F/U";
      break;
    case "C8923":
      returnvalue = "2D TTE W OR W/O FOL W/CON,CO";
      break;
    case "C8924":
      returnvalue = "2D TTE W OR W/O FOL W/CON,FU";
      break;
    case "C8925":
      returnvalue = "2D TEE W OR W/O FOL W/CON,IN";
      break;
    case "C8926":
      returnvalue = "TEE W OR W/O FOL W/CONT,CONG";
      break;
    case "C8927":
      returnvalue = "TEE W OR W/O FOL W/CONT, MON";
      break;
    case "C8928":
      returnvalue = "TTE W OR W/O FOL W/CON,STRES";
      break;
    case "C8929":
      returnvalue = "TTE W OR WO FOL WCON,DOPPLER";
      break;
    case "C8930":
      returnvalue = "TTE W OR W/O CONTR, CONT ECG";
      break;
    case "C8950":
      returnvalue = "IV INF, TX/DX, UP TO 1 HR";
      break;
    case "C8951":
      returnvalue = "IV INF, TX/DX, EACH ADDL HR";
      break;
    case "C8952":
      returnvalue = "TX, PROPHY, DX IV PUSH";
      break;
    case "C8953":
      returnvalue = "CHEMOTX ADM, IV PUSH";
      break;
    case "C8954":
      returnvalue = "CHEMOTX ADM, IV INF UP TO 1H";
      break;
    case "C8955":
      returnvalue = "CHEMOTX ADM, IV INF, ADDL HR";
      break;
    case "C8957":
      returnvalue = "PROLONGED IV INF, REQ PUMP";
      break;
    case "C9003":
      returnvalue = "PALIVIZUMAB, PER 50 MG";
      break;
    case "C9113":
      returnvalue = "INJ PANTOPRAZOLE SODIUM, VIA";
      break;
    case "C9121":
      returnvalue = "INJECTION, ARGATROBAN";
      break;
    case "C9220":
      returnvalue = "SODIUM HYALURONATE";
      break;
    case "C9221":
      returnvalue = "GRAFTJACKET REG MATRIX";
      break;
    case "C9222":
      returnvalue = "GRAFTJACKET SFTTIS";
      break;
    case "C9224":
      returnvalue = "INJECTION, GALSULFASE";
      break;
    case "C9225":
      returnvalue = "FLUOCINOLONE ACETONIDE";
      break;
    case "C9227":
      returnvalue = "INJECTION, MICAFUNGIN SODIUM";
      break;
    case "C9228":
      returnvalue = "INJECTION, TIGECYCLINE";
      break;
    case "C9229":
      returnvalue = "INJECTION IBANDRONATE SODIUM";
      break;
    case "C9230":
      returnvalue = "INJECTION, ABATACEPT";
      break;
    case "C9231":
      returnvalue = "INJECTION, DECITABINE";
      break;
    case "C9232":
      returnvalue = "INJECTION, IDURSULFASE";
      break;
    case "C9233":
      returnvalue = "INJECTION, RANIBIZUMAB";
      break;
    case "C9234":
      returnvalue = "INJ, ALGLUCOSIDASE ALFA";
      break;
    case "C9235":
      returnvalue = "INJECTION, PANITUMUMAB";
      break;
    case "C9236":
      returnvalue = "INJECTION, ECULIZUMAB";
      break;
    case "C9237":
      returnvalue = "INJ, LANREOTIDE ACETATE";
      break;
    case "C9238":
      returnvalue = "INJ, LEVETIRACETAM";
      break;
    case "C9239":
      returnvalue = "INJ, TEMSIROLIMUS";
      break;
    case "C9240":
      returnvalue = "INJECTION, IXABEPILONE";
      break;
    case "C9241":
      returnvalue = "INJECTION, DORIPENEM";
      break;
    case "C9242":
      returnvalue = "INJECTION, FOSAPREPITANT";
      break;
    case "C9243":
      returnvalue = "INJECTION, BENDAMUSTINE HCL";
      break;
    case "C9244":
      returnvalue = "INJECTION, REGADENOSON";
      break;
    case "C9245":
      returnvalue = "INJECTION, ROMIPLOSTIM";
      break;
    case "C9246":
      returnvalue = "INJ, GADOXETATE DISODIUM";
      break;
    case "C9247":
      returnvalue = "INJ, IOBENGUANE, I-123, DX";
      break;
    case "C9248":
      returnvalue = "INJ, CLEVIDIPINE BUTYRATE";
      break;
    case "C9249":
      returnvalue = "INJ, CERTOLIZUMAB PEGOL";
      break;
    case "C9250":
      returnvalue = "ARTISS FIBRIN SEALANT";
      break;
    case "C9251":
      returnvalue = "INJ, C1 ESTERASE INHIBITOR";
      break;
    case "C9252":
      returnvalue = "INJECTION, PLERIXAFOR";
      break;
    case "C9253":
      returnvalue = "INJECTION, TEMOZOLOMIDE";
      break;
    case "C9254":
      returnvalue = "INJECTION, LACOSAMIDE";
      break;
    case "C9255":
      returnvalue = "PALIPERIDONE PALMITATE INJ";
      break;
    case "C9256":
      returnvalue = "DEXAMETHASONE INTRAVITREAL";
      break;
    case "C9257":
      returnvalue = "BEVACIZUMAB INJECTION";
      break;
    case "C9350":
      returnvalue = "POROUS COLLAGEN TUBE PER CM";
      break;
    case "C9351":
      returnvalue = "ACELLULAR DERM TISSUE PERCM2";
      break;
    case "C9352":
      returnvalue = "NEURAGEN NERVE GUIDE, PER CM";
      break;
    case "C9353":
      returnvalue = "NEURAWRAP NERVE PROTECTOR,CM";
      break;
    case "C9354":
      returnvalue = "VERITAS COLLAGEN MATRIX, CM2";
      break;
    case "C9355":
      returnvalue = "NEUROMATRIX NERVE CUFF, CM";
      break;
    case "C9356":
      returnvalue = "TENOGLIDE TENDON PROT, CM2";
      break;
    case "C9357":
      returnvalue = "FLOWABLE WOUND MATRIX, 1 CC";
      break;
    case "C9358":
      returnvalue = "SURGIMEND, FETAL";
      break;
    case "C9359":
      returnvalue = "IMPLNT,BON VOID FILLER-PUTTY";
      break;
    case "C9360":
      returnvalue = "SURGIMEND, NEONATAL";
      break;
    case "C9361":
      returnvalue = "NEUROMEND NERVE WRAP";
      break;
    case "C9362":
      returnvalue = "IMPLNT,BON VOID FILLER-STRIP";
      break;
    case "C9363":
      returnvalue = "INTEGRA MESHED BIL WOUND MAT";
      break;
    case "C9364":
      returnvalue = "PORCINE IMPLANT, PERMACOL";
      break;
    case "C9399":
      returnvalue = "UNCLASSIFIED DRUGS OR BIOLOG";
      break;
    case "C9716":
      returnvalue = "RADIOFREQUENCY ENERGY TO ANU";
      break;
    case "C9723":
      returnvalue = "DYN IR PERF IMG";
      break;
    case "C9724":
      returnvalue = "EPS GAST CARDIA PLIC";
      break;
    case "C9725":
      returnvalue = "PLACE ENDORECTAL APP";
      break;
    case "C9726":
      returnvalue = "RXT BREAST APPL PLACE/REMOV";
      break;
    case "C9727":
      returnvalue = "INSERT PALATE IMPLANTS";
      break;
    case "C9728":
      returnvalue = "PLACE DEVICE/MARKER, NON PRO";
      break;
    case "C9898":
      returnvalue = "INPNT STAY RADIOLABELED ITEM";
      break;
    case "C9899":
      returnvalue = "INPT IMPLANT PROS DEV,NO COV";
      break;
    case "D0120":
      returnvalue = "PERIODIC ORAL EVALUATION";
      break;
    case "D0140":
      returnvalue = "LIMIT ORAL EVAL PROBLM FOCUS";
      break;
    case "D0145":
      returnvalue = "ORAL EVALUATION, PT < 3YRS";
      break;
    case "D0150":
      returnvalue = "COMPREHENSVE ORAL EVALUATION";
      break;
    case "D0160":
      returnvalue = "EXTENSV ORAL EVAL PROB FOCUS";
      break;
    case "D0170":
      returnvalue = "RE-EVAL,EST PT,PROBLEM FOCUS";
      break;
    case "D0180":
      returnvalue = "COMP PERIODONTAL EVALUATION";
      break;
    case "D0210":
      returnvalue = "INTRAOR COMPLETE FILM SERIES";
      break;
    case "D0220":
      returnvalue = "INTRAORAL PERIAPICAL FIRST F";
      break;
    case "D0230":
      returnvalue = "INTRAORAL PERIAPICAL EA ADD";
      break;
    case "D0240":
      returnvalue = "INTRAORAL OCCLUSAL FILM";
      break;
    case "D0250":
      returnvalue = "EXTRAORAL FIRST FILM";
      break;
    case "D0260":
      returnvalue = "EXTRAORAL EA ADDITIONAL FILM";
      break;
    case "D0270":
      returnvalue = "DENTAL BITEWING SINGLE FILM";
      break;
    case "D0272":
      returnvalue = "DENTAL BITEWINGS TWO FILMS";
      break;
    case "D0273":
      returnvalue = "BITEWINGS - THREE FILMS";
      break;
    case "D0274":
      returnvalue = "DENTAL BITEWINGS FOUR FILMS";
      break;
    case "D0277":
      returnvalue = "VERT BITEWINGS-SEV TO EIGHT";
      break;
    case "D0290":
      returnvalue = "DENTAL FILM SKULL/FACIAL BON";
      break;
    case "D0310":
      returnvalue = "DENTAL SALIOGRAPHY";
      break;
    case "D0320":
      returnvalue = "DENTAL TMJ ARTHROGRAM INCL I";
      break;
    case "D0321":
      returnvalue = "DENTAL OTHER TMJ FILMS";
      break;
    case "D0322":
      returnvalue = "DENTAL TOMOGRAPHIC SURVEY";
      break;
    case "D0330":
      returnvalue = "DENTAL PANORAMIC FILM";
      break;
    case "D0340":
      returnvalue = "DENTAL CEPHALOMETRIC FILM";
      break;
    case "D0350":
      returnvalue = "ORAL/FACIAL PHOTO IMAGES";
      break;
    case "D0360":
      returnvalue = "CONE BEAM CT";
      break;
    case "D0362":
      returnvalue = "CONE BEAM, TWO DIMENSIONAL";
      break;
    case "D0363":
      returnvalue = "CONE BEAM, THREE DIMENSIONAL";
      break;
    case "D0415":
      returnvalue = "COLLECTION OF MICROORGANISMS";
      break;
    case "D0416":
      returnvalue = "VIRAL CULTURE";
      break;
    case "D0417":
      returnvalue = "COLLECT & PREP SALIVA SAMPLE";
      break;
    case "D0418":
      returnvalue = "ANALYSIS OF SALIVA SAMPLE";
      break;
    case "D0421":
      returnvalue = "GEN TST SUSCEPT ORAL DISEASE";
      break;
    case "D0425":
      returnvalue = "CARIES SUSCEPTIBILITY TEST";
      break;
    case "D0431":
      returnvalue = "DIAG TST DETECT MUCOS ABNORM";
      break;
    case "D0460":
      returnvalue = "PULP VITALITY TEST";
      break;
    case "D0470":
      returnvalue = "DIAGNOSTIC CASTS";
      break;
    case "D0472":
      returnvalue = "GROSS EXAM, PREP & REPORT";
      break;
    case "D0473":
      returnvalue = "MICRO EXAM, PREP & REPORT";
      break;
    case "D0474":
      returnvalue = "MICRO W EXAM OF SURG MARGINS";
      break;
    case "D0475":
      returnvalue = "DECALCIFICATION PROCEDURE";
      break;
    case "D0476":
      returnvalue = "SPEC STAINS FOR MICROORGANIS";
      break;
    case "D0477":
      returnvalue = "SPEC STAINS NOT FOR MICROORG";
      break;
    case "D0478":
      returnvalue = "IMMUNOHISTOCHEMICAL STAINS";
      break;
    case "D0479":
      returnvalue = "TISSUE IN-SITU HYBRIDIZATION";
      break;
    case "D0480":
      returnvalue = "CYTOPATH SMEAR PREP & REPORT";
      break;
    case "D0481":
      returnvalue = "ELECTRON MICROSCOPY DIAGNOST";
      break;
    case "D0482":
      returnvalue = "DIRECT IMMUNOFLUORESCENCE";
      break;
    case "D0483":
      returnvalue = "INDIRECT IMMUNOFLUORESCENCE";
      break;
    case "D0484":
      returnvalue = "CONSULT SLIDES PREP ELSEWHER";
      break;
    case "D0485":
      returnvalue = "CONSULT INC PREP OF SLIDES";
      break;
    case "D0486":
      returnvalue = "ACCESSION OF BRUSH BIOPSY";
      break;
    case "D0502":
      returnvalue = "OTHER ORAL PATHOLOGY PROCEDU";
      break;
    case "D0999":
      returnvalue = "UNSPECIFIED DIAGNOSTIC PROCE";
      break;
    case "D1110":
      returnvalue = "DENTAL PROPHYLAXIS ADULT";
      break;
    case "D1120":
      returnvalue = "DENTAL PROPHYLAXIS CHILD";
      break;
    case "D1201":
      returnvalue = "TOPICAL FLUOR W PROPHY CHILD";
      break;
    case "D1203":
      returnvalue = "TOPICAL APP FLUORIDE CHILD";
      break;
    case "D1204":
      returnvalue = "TOPICAL APP FLUORIDE ADULT";
      break;
    case "D1205":
      returnvalue = "TOPICAL FLUORIDE W/ PROPHY A";
      break;
    case "D1206":
      returnvalue = "TOPICAL FLUORIDE VARNISH";
      break;
    case "D1310":
      returnvalue = "NUTRI COUNSEL-CONTROL CARIES";
      break;
    case "D1320":
      returnvalue = "TOBACCO COUNSELING";
      break;
    case "D1330":
      returnvalue = "ORAL HYGIENE INSTRUCTION";
      break;
    case "D1351":
      returnvalue = "DENTAL SEALANT PER TOOTH";
      break;
    case "D1510":
      returnvalue = "SPACE MAINTAINER FXD UNILAT";
      break;
    case "D1515":
      returnvalue = "FIXED BILAT SPACE MAINTAINER";
      break;
    case "D1520":
      returnvalue = "REMOVE UNILAT SPACE MAINTAIN";
      break;
    case "D1525":
      returnvalue = "REMOVE BILAT SPACE MAINTAIN";
      break;
    case "D1550":
      returnvalue = "RECEMENT SPACE MAINTAINER";
      break;
    case "D1555":
      returnvalue = "REMOVE FIX SPACE MAINTAINER";
      break;
    case "D2140":
      returnvalue = "AMALGAM ONE SURFACE PERMANEN";
      break;
    case "D2150":
      returnvalue = "AMALGAM TWO SURFACES PERMANE";
      break;
    case "D2160":
      returnvalue = "AMALGAM THREE SURFACES PERMA";
      break;
    case "D2161":
      returnvalue = "AMALGAM 4 OR > SURFACES PERM";
      break;
    case "D2330":
      returnvalue = "RESIN ONE SURFACE-ANTERIOR";
      break;
    case "D2331":
      returnvalue = "RESIN TWO SURFACES-ANTERIOR";
      break;
    case "D2332":
      returnvalue = "RESIN THREE SURFACES-ANTERIO";
      break;
    case "D2335":
      returnvalue = "RESIN 4/> SURF OR W INCIS AN";
      break;
    case "D2390":
      returnvalue = "ANT RESIN-BASED CMPST CROWN";
      break;
    case "D2391":
      returnvalue = "POST 1 SRFC RESINBASED CMPST";
      break;
    case "D2392":
      returnvalue = "POST 2 SRFC RESINBASED CMPST";
      break;
    case "D2393":
      returnvalue = "POST 3 SRFC RESINBASED CMPST";
      break;
    case "D2394":
      returnvalue = "POST >=4SRFC RESINBASE CMPST";
      break;
    case "D2410":
      returnvalue = "DENTAL GOLD FOIL ONE SURFACE";
      break;
    case "D2420":
      returnvalue = "DENTAL GOLD FOIL TWO SURFACE";
      break;
    case "D2430":
      returnvalue = "DENTAL GOLD FOIL THREE SURFA";
      break;
    case "D2510":
      returnvalue = "DENTAL INLAY METALIC 1 SURF";
      break;
    case "D2520":
      returnvalue = "DENTAL INLAY METALLIC 2 SURF";
      break;
    case "D2530":
      returnvalue = "DENTAL INLAY METL 3/MORE SUR";
      break;
    case "D2542":
      returnvalue = "DENTAL ONLAY METALLIC 2 SURF";
      break;
    case "D2543":
      returnvalue = "DENTAL ONLAY METALLIC 3 SURF";
      break;
    case "D2544":
      returnvalue = "DENTAL ONLAY METL 4/MORE SUR";
      break;
    case "D2610":
      returnvalue = "INLAY PORCELAIN/CERAMIC 1 SU";
      break;
    case "D2620":
      returnvalue = "INLAY PORCELAIN/CERAMIC 2 SU";
      break;
    case "D2630":
      returnvalue = "DENTAL ONLAY PORC 3/MORE SUR";
      break;
    case "D2642":
      returnvalue = "DENTAL ONLAY PORCELIN 2 SURF";
      break;
    case "D2643":
      returnvalue = "DENTAL ONLAY PORCELIN 3 SURF";
      break;
    case "D2644":
      returnvalue = "DENTAL ONLAY PORC 4/MORE SUR";
      break;
    case "D2650":
      returnvalue = "INLAY COMPOSITE/RESIN ONE SU";
      break;
    case "D2651":
      returnvalue = "INLAY COMPOSITE/RESIN TWO SU";
      break;
    case "D2652":
      returnvalue = "DENTAL INLAY RESIN 3/MRE SUR";
      break;
    case "D2662":
      returnvalue = "DENTAL ONLAY RESIN 2 SURFACE";
      break;
    case "D2663":
      returnvalue = "DENTAL ONLAY RESIN 3 SURFACE";
      break;
    case "D2664":
      returnvalue = "DENTAL ONLAY RESIN 4/MRE SUR";
      break;
    case "D2710":
      returnvalue = "CROWN RESIN-BASED INDIRECT";
      break;
    case "D2712":
      returnvalue = "CROWN 3/4 RESIN-BASED COMPOS";
      break;
    case "D2720":
      returnvalue = "CROWN RESIN W/ HIGH NOBLE ME";
      break;
    case "D2721":
      returnvalue = "CROWN RESIN W/ BASE METAL";
      break;
    case "D2722":
      returnvalue = "CROWN RESIN W/ NOBLE METAL";
      break;
    case "D2740":
      returnvalue = "CROWN PORCELAIN/CERAMIC SUBS";
      break;
    case "D2750":
      returnvalue = "CROWN PORCELAIN W/ H NOBLE M";
      break;
    case "D2751":
      returnvalue = "CROWN PORCELAIN FUSED BASE M";
      break;
    case "D2752":
      returnvalue = "CROWN PORCELAIN W/ NOBLE MET";
      break;
    case "D2780":
      returnvalue = "CROWN 3/4 CAST HI NOBLE MET";
      break;
    case "D2781":
      returnvalue = "CROWN 3/4 CAST BASE METAL";
      break;
    case "D2782":
      returnvalue = "CROWN 3/4 CAST NOBLE METAL";
      break;
    case "D2783":
      returnvalue = "CROWN 3/4 PORCELAIN/CERAMIC";
      break;
    case "D2790":
      returnvalue = "CROWN FULL CAST HIGH NOBLE M";
      break;
    case "D2791":
      returnvalue = "CROWN FULL CAST BASE METAL";
      break;
    case "D2792":
      returnvalue = "CROWN FULL CAST NOBLE METAL";
      break;
    case "D2794":
      returnvalue = "CROWN-TITANIUM";
      break;
    case "D2799":
      returnvalue = "PROVISIONAL CROWN";
      break;
    case "D2910":
      returnvalue = "RECEMENT INLAY ONLAY OR PART";
      break;
    case "D2915":
      returnvalue = "RECEMENT CAST OR PREFAB POST";
      break;
    case "D2920":
      returnvalue = "DENTAL RECEMENT CROWN";
      break;
    case "D2930":
      returnvalue = "PREFAB STNLSS STEEL CRWN PRI";
      break;
    case "D2931":
      returnvalue = "PREFAB STNLSS STEEL CROWN PE";
      break;
    case "D2932":
      returnvalue = "PREFABRICATED RESIN CROWN";
      break;
    case "D2933":
      returnvalue = "PREFAB STAINLESS STEEL CROWN";
      break;
    case "D2934":
      returnvalue = "PREFAB STEEL CROWN PRIMARY";
      break;
    case "D2940":
      returnvalue = "DENTAL SEDATIVE FILLING";
      break;
    case "D2950":
      returnvalue = "CORE BUILD-UP INCL ANY PINS";
      break;
    case "D2951":
      returnvalue = "TOOTH PIN RETENTION";
      break;
    case "D2952":
      returnvalue = "POST AND CORE CAST + CROWN";
      break;
    case "D2953":
      returnvalue = "EACH ADDTNL CAST POST";
      break;
    case "D2954":
      returnvalue = "PREFAB POST/CORE + CROWN";
      break;
    case "D2955":
      returnvalue = "POST REMOVAL";
      break;
    case "D2957":
      returnvalue = "EACH ADDTNL PREFAB POST";
      break;
    case "D2960":
      returnvalue = "LAMINATE LABIAL VENEER";
      break;
    case "D2961":
      returnvalue = "LAB LABIAL VENEER RESIN";
      break;
    case "D2962":
      returnvalue = "LAB LABIAL VENEER PORCELAIN";
      break;
    case "D2970":
      returnvalue = "TEMP CROWN (FRACTURED TOOTH)";
      break;
    case "D2971":
      returnvalue = "ADD PROC CONSTRUCT NEW CROWN";
      break;
    case "D2975":
      returnvalue = "COPING";
      break;
    case "D2980":
      returnvalue = "CROWN REPAIR";
      break;
    case "D2999":
      returnvalue = "DENTAL UNSPEC RESTORATIVE PR";
      break;
    case "D3110":
      returnvalue = "PULP CAP DIRECT";
      break;
    case "D3120":
      returnvalue = "PULP CAP INDIRECT";
      break;
    case "D3220":
      returnvalue = "THERAPEUTIC PULPOTOMY";
      break;
    case "D3221":
      returnvalue = "GROSS PULPAL DEBRIDEMENT";
      break;
    case "D3222":
      returnvalue = "PART PULP FOR APEXOGENESIS";
      break;
    case "D3230":
      returnvalue = "PULPAL THERAPY ANTERIOR PRIM";
      break;
    case "D3240":
      returnvalue = "PULPAL THERAPY POSTERIOR PRI";
      break;
    case "D3310":
      returnvalue = "END THXPY, ANTERIOR TOOTH";
      break;
    case "D3320":
      returnvalue = "END THXPY, BICUSPID TOOTH";
      break;
    case "D3330":
      returnvalue = "END THXPY, MOLAR";
      break;
    case "D3331":
      returnvalue = "NON-SURG TX ROOT CANAL OBS";
      break;
    case "D3332":
      returnvalue = "INCOMPLETE ENDODONTIC TX";
      break;
    case "D3333":
      returnvalue = "INTERNAL ROOT REPAIR";
      break;
    case "D3346":
      returnvalue = "RETREAT ROOT CANAL ANTERIOR";
      break;
    case "D3347":
      returnvalue = "RETREAT ROOT CANAL BICUSPID";
      break;
    case "D3348":
      returnvalue = "RETREAT ROOT CANAL MOLAR";
      break;
    case "D3351":
      returnvalue = "APEXIFICATION/RECALC INITIAL";
      break;
    case "D3352":
      returnvalue = "APEXIFICATION/RECALC INTERIM";
      break;
    case "D3353":
      returnvalue = "APEXIFICATION/RECALC FINAL";
      break;
    case "D3410":
      returnvalue = "APICOECT/PERIRAD SURG ANTER";
      break;
    case "D3421":
      returnvalue = "ROOT SURGERY BICUSPID";
      break;
    case "D3425":
      returnvalue = "ROOT SURGERY MOLAR";
      break;
    case "D3426":
      returnvalue = "ROOT SURGERY EA ADD ROOT";
      break;
    case "D3430":
      returnvalue = "RETROGRADE FILLING";
      break;
    case "D3450":
      returnvalue = "ROOT AMPUTATION";
      break;
    case "D3460":
      returnvalue = "ENDODONTIC ENDOSSEOUS IMPLAN";
      break;
    case "D3470":
      returnvalue = "INTENTIONAL REPLANTATION";
      break;
    case "D3910":
      returnvalue = "ISOLATION- TOOTH W RUBB DAM";
      break;
    case "D3920":
      returnvalue = "TOOTH SPLITTING";
      break;
    case "D3950":
      returnvalue = "CANAL PREP/FITTING OF DOWEL";
      break;
    case "D3999":
      returnvalue = "ENDODONTIC PROCEDURE";
      break;
    case "D4210":
      returnvalue = "GINGIVECTOMY/PLASTY PER QUAD";
      break;
    case "D4211":
      returnvalue = "GINGIVECTOMY/PLASTY PER TOOT";
      break;
    case "D4230":
      returnvalue = "ANA CROWN EXP 4 OR> PER QUAD";
      break;
    case "D4231":
      returnvalue = "ANA CROWN EXP 1-3 PER QUAD";
      break;
    case "D4240":
      returnvalue = "GINGIVAL FLAP PROC W/ PLANIN";
      break;
    case "D4241":
      returnvalue = "GNGVL FLAP W ROOTPLAN 1-3 TH";
      break;
    case "D4245":
      returnvalue = "APICALLY POSITIONED FLAP";
      break;
    case "D4249":
      returnvalue = "CROWN LENGTHEN HARD TISSUE";
      break;
    case "D4260":
      returnvalue = "OSSEOUS SURGERY PER QUADRANT";
      break;
    case "D4261":
      returnvalue = "OSSEOUS SURGL-3TEETHPERQUAD";
      break;
    case "D4263":
      returnvalue = "BONE REPLCE GRAFT FIRST SITE";
      break;
    case "D4264":
      returnvalue = "BONE REPLCE GRAFT EACH ADD";
      break;
    case "D4265":
      returnvalue = "BIO MTRLS TO AID SOFT/OS REG";
      break;
    case "D4266":
      returnvalue = "GUIDED TISS REGEN RESORBLE";
      break;
    case "D4267":
      returnvalue = "GUIDED TISS REGEN NONRESORB";
      break;
    case "D4268":
      returnvalue = "SURGICAL REVISION PROCEDURE";
      break;
    case "D4270":
      returnvalue = "PEDICLE SOFT TISSUE GRAFT PR";
      break;
    case "D4271":
      returnvalue = "FREE SOFT TISSUE GRAFT PROC";
      break;
    case "D4273":
      returnvalue = "SUBEPITHELIAL TISSUE GRAFT";
      break;
    case "D4274":
      returnvalue = "DISTAL/PROXIMAL WEDGE PROC";
      break;
    case "D4275":
      returnvalue = "SOFT TISSUE ALLOGRAFT";
      break;
    case "D4276":
      returnvalue = "CON TISSUE W DBLE PED GRAFT";
      break;
    case "D4320":
      returnvalue = "PROVISION SPLNT INTRACORONAL";
      break;
    case "D4321":
      returnvalue = "PROVISIONAL SPLINT EXTRACORO";
      break;
    case "D4341":
      returnvalue = "PERIODONTAL SCALING & ROOT";
      break;
    case "D4342":
      returnvalue = "PERIODONTAL SCALING 1-3TEETH";
      break;
    case "D4355":
      returnvalue = "FULL MOUTH DEBRIDEMENT";
      break;
    case "D4381":
      returnvalue = "LOCALIZED DELIVERY ANTIMICRO";
      break;
    case "D4910":
      returnvalue = "PERIODONTAL MAINT PROCEDURES";
      break;
    case "D4920":
      returnvalue = "UNSCHEDULED DRESSING CHANGE";
      break;
    case "D4999":
      returnvalue = "UNSPECIFIED PERIODONTAL PROC";
      break;
    case "D5110":
      returnvalue = "DENTURES COMPLETE MAXILLARY";
      break;
    case "D5120":
      returnvalue = "DENTURES COMPLETE MANDIBLE";
      break;
    case "D5130":
      returnvalue = "DENTURES IMMEDIAT MAXILLARY";
      break;
    case "D5140":
      returnvalue = "DENTURES IMMEDIAT MANDIBLE";
      break;
    case "D5211":
      returnvalue = "DENTURES MAXILL PART RESIN";
      break;
    case "D5212":
      returnvalue = "DENTURES MAND PART RESIN";
      break;
    case "D5213":
      returnvalue = "DENTURES MAXILL PART METAL";
      break;
    case "D5214":
      returnvalue = "DENTURES MANDIBL PART METAL";
      break;
    case "D5225":
      returnvalue = "MAXILLARY PART DENTURE FLEX";
      break;
    case "D5226":
      returnvalue = "MANDIBULAR PART DENTURE FLEX";
      break;
    case "D5281":
      returnvalue = "REMOVABLE PARTIAL DENTURE";
      break;
    case "D5410":
      returnvalue = "DENTURES ADJUST CMPLT MAXIL";
      break;
    case "D5411":
      returnvalue = "DENTURES ADJUST CMPLT MAND";
      break;
    case "D5421":
      returnvalue = "DENTURES ADJUST PART MAXILL";
      break;
    case "D5422":
      returnvalue = "DENTURES ADJUST PART MANDBL";
      break;
    case "D5510":
      returnvalue = "DENTUR REPR BROKEN COMPL BAS";
      break;
    case "D5520":
      returnvalue = "REPLACE DENTURE TEETH COMPLT";
      break;
    case "D5610":
      returnvalue = "DENTURES REPAIR RESIN BASE";
      break;
    case "D5620":
      returnvalue = "REP PART DENTURE CAST FRAME";
      break;
    case "D5630":
      returnvalue = "REP PARTIAL DENTURE CLASP";
      break;
    case "D5640":
      returnvalue = "REPLACE PART DENTURE TEETH";
      break;
    case "D5650":
      returnvalue = "ADD TOOTH TO PARTIAL DENTURE";
      break;
    case "D5660":
      returnvalue = "ADD CLASP TO PARTIAL DENTURE";
      break;
    case "D5670":
      returnvalue = "REPLC TTH&ACRLC ON MTL FRMWK";
      break;
    case "D5671":
      returnvalue = "REPLC TTH&ACRLC MANDIBULAR";
      break;
    case "D5710":
      returnvalue = "DENTURES REBASE CMPLT MAXIL";
      break;
    case "D5711":
      returnvalue = "DENTURES REBASE CMPLT MAND";
      break;
    case "D5720":
      returnvalue = "DENTURES REBASE PART MAXILL";
      break;
    case "D5721":
      returnvalue = "DENTURES REBASE PART MANDBL";
      break;
    case "D5730":
      returnvalue = "DENTURE RELN CMPLT MAXIL CH";
      break;
    case "D5731":
      returnvalue = "DENTURE RELN CMPLT MAND CHR";
      break;
    case "D5740":
      returnvalue = "DENTURE RELN PART MAXIL CHR";
      break;
    case "D5741":
      returnvalue = "DENTURE RELN PART MAND CHR";
      break;
    case "D5750":
      returnvalue = "DENTURE RELN CMPLT MAX LAB";
      break;
    case "D5751":
      returnvalue = "DENTURE RELN CMPLT MAND LAB";
      break;
    case "D5760":
      returnvalue = "DENTURE RELN PART MAXIL LAB";
      break;
    case "D5761":
      returnvalue = "DENTURE RELN PART MAND LAB";
      break;
    case "D5810":
      returnvalue = "DENTURE INTERM CMPLT MAXILL";
      break;
    case "D5811":
      returnvalue = "DENTURE INTERM CMPLT MANDBL";
      break;
    case "D5820":
      returnvalue = "DENTURE INTERM PART MAXILL";
      break;
    case "D5821":
      returnvalue = "DENTURE INTERM PART MANDBL";
      break;
    case "D5850":
      returnvalue = "DENTURE TISS CONDITN MAXILL";
      break;
    case "D5851":
      returnvalue = "DENTURE TISS CONDTIN MANDBL";
      break;
    case "D5860":
      returnvalue = "OVERDENTURE COMPLETE";
      break;
    case "D5861":
      returnvalue = "OVERDENTURE PARTIAL";
      break;
    case "D5862":
      returnvalue = "PRECISION ATTACHMENT";
      break;
    case "D5867":
      returnvalue = "REPLACEMENT OF PRECISION ATT";
      break;
    case "D5875":
      returnvalue = "PROSTHESIS MODIFICATION";
      break;
    case "D5899":
      returnvalue = "REMOVABLE PROSTHODONTIC PROC";
      break;
    case "D5911":
      returnvalue = "FACIAL MOULAGE SECTIONAL";
      break;
    case "D5912":
      returnvalue = "FACIAL MOULAGE COMPLETE";
      break;
    case "D5913":
      returnvalue = "NASAL PROSTHESIS";
      break;
    case "D5914":
      returnvalue = "AURICULAR PROSTHESIS";
      break;
    case "D5915":
      returnvalue = "ORBITAL PROSTHESIS";
      break;
    case "D5916":
      returnvalue = "OCULAR PROSTHESIS";
      break;
    case "D5919":
      returnvalue = "FACIAL PROSTHESIS";
      break;
    case "D5922":
      returnvalue = "NASAL SEPTAL PROSTHESIS";
      break;
    case "D5923":
      returnvalue = "OCULAR PROSTHESIS INTERIM";
      break;
    case "D5924":
      returnvalue = "CRANIAL PROSTHESIS";
      break;
    case "D5925":
      returnvalue = "FACIAL AUGMENTATION IMPLANT";
      break;
    case "D5926":
      returnvalue = "REPLACEMENT NASAL PROSTHESIS";
      break;
    case "D5927":
      returnvalue = "AURICULAR REPLACEMENT";
      break;
    case "D5928":
      returnvalue = "ORBITAL REPLACEMENT";
      break;
    case "D5929":
      returnvalue = "FACIAL REPLACEMENT";
      break;
    case "D5931":
      returnvalue = "SURGICAL OBTURATOR";
      break;
    case "D5932":
      returnvalue = "POSTSURGICAL OBTURATOR";
      break;
    case "D5933":
      returnvalue = "REFITTING OF OBTURATOR";
      break;
    case "D5934":
      returnvalue = "MANDIBULAR FLANGE PROSTHESIS";
      break;
    case "D5935":
      returnvalue = "MANDIBULAR DENTURE PROSTH";
      break;
    case "D5936":
      returnvalue = "TEMP OBTURATOR PROSTHESIS";
      break;
    case "D5937":
      returnvalue = "TRISMUS APPLIANCE";
      break;
    case "D5951":
      returnvalue = "FEEDING AID";
      break;
    case "D5952":
      returnvalue = "PEDIATRIC SPEECH AID";
      break;
    case "D5953":
      returnvalue = "ADULT SPEECH AID";
      break;
    case "D5954":
      returnvalue = "SUPERIMPOSED PROSTHESIS";
      break;
    case "D5955":
      returnvalue = "PALATAL LIFT PROSTHESIS";
      break;
    case "D5958":
      returnvalue = "INTRAORAL CON DEF INTER PLT";
      break;
    case "D5959":
      returnvalue = "INTRAORAL CON DEF MOD PALAT";
      break;
    case "D5960":
      returnvalue = "MODIFY SPEECH AID PROSTHESIS";
      break;
    case "D5982":
      returnvalue = "SURGICAL STENT";
      break;
    case "D5983":
      returnvalue = "RADIATION APPLICATOR";
      break;
    case "D5984":
      returnvalue = "RADIATION SHIELD";
      break;
    case "D5985":
      returnvalue = "RADIATION CONE LOCATOR";
      break;
    case "D5986":
      returnvalue = "FLUORIDE APPLICATOR";
      break;
    case "D5987":
      returnvalue = "COMMISSURE SPLINT";
      break;
    case "D5988":
      returnvalue = "SURGICAL SPLINT";
      break;
    case "D5991":
      returnvalue = "TOPICAL MEDICAMENT CARRIER";
      break;
    case "D5999":
      returnvalue = "MAXILLOFACIAL PROSTHESIS";
      break;
    case "D6010":
      returnvalue = "ODONTICS ENDOSTEAL IMPLANT";
      break;
    case "D6012":
      returnvalue = "ENDOSTEAL IMPLANT";
      break;
    case "D6040":
      returnvalue = "ODONTICS EPOSTEAL IMPLANT";
      break;
    case "D6050":
      returnvalue = "ODONTICS TRANSOSTEAL IMPLNT";
      break;
    case "D6053":
      returnvalue = "IMPLNT/ABTMNT SPPRT REMV DNT";
      break;
    case "D6054":
      returnvalue = "IMPLNT/ABTMNT SPPRT REMVPRTL";
      break;
    case "D6055":
      returnvalue = "IMPLANT CONNECTING BAR";
      break;
    case "D6056":
      returnvalue = "PREFABRICATED ABUTMENT";
      break;
    case "D6057":
      returnvalue = "CUSTOM ABUTMENT";
      break;
    case "D6058":
      returnvalue = "ABUTMENT SUPPORTED CROWN";
      break;
    case "D6059":
      returnvalue = "ABUTMENT SUPPORTED MTL CROWN";
      break;
    case "D6060":
      returnvalue = "ABUTMENT SUPPORTED MTL CROWN";
      break;
    case "D6061":
      returnvalue = "ABUTMENT SUPPORTED MTL CROWN";
      break;
    case "D6062":
      returnvalue = "ABUTMENT SUPPORTED MTL CROWN";
      break;
    case "D6063":
      returnvalue = "ABUTMENT SUPPORTED MTL CROWN";
      break;
    case "D6064":
      returnvalue = "ABUTMENT SUPPORTED MTL CROWN";
      break;
    case "D6065":
      returnvalue = "IMPLANT SUPPORTED CROWN";
      break;
    case "D6066":
      returnvalue = "IMPLANT SUPPORTED MTL CROWN";
      break;
    case "D6067":
      returnvalue = "IMPLANT SUPPORTED MTL CROWN";
      break;
    case "D6068":
      returnvalue = "ABUTMENT SUPPORTED RETAINER";
      break;
    case "D6069":
      returnvalue = "ABUTMENT SUPPORTED RETAINER";
      break;
    case "D6070":
      returnvalue = "ABUTMENT SUPPORTED RETAINER";
      break;
    case "D6071":
      returnvalue = "ABUTMENT SUPPORTED RETAINER";
      break;
    case "D6072":
      returnvalue = "ABUTMENT SUPPORTED RETAINER";
      break;
    case "D6073":
      returnvalue = "ABUTMENT SUPPORTED RETAINER";
      break;
    case "D6074":
      returnvalue = "ABUTMENT SUPPORTED RETAINER";
      break;
    case "D6075":
      returnvalue = "IMPLANT SUPPORTED RETAINER";
      break;
    case "D6076":
      returnvalue = "IMPLANT SUPPORTED RETAINER";
      break;
    case "D6077":
      returnvalue = "IMPLANT SUPPORTED RETAINER";
      break;
    case "D6078":
      returnvalue = "IMPLNT/ABUT SUPRTD FIXD DENT";
      break;
    case "D6079":
      returnvalue = "IMPLNT/ABUT SUPRTD FIXD DENT";
      break;
    case "D6080":
      returnvalue = "IMPLANT MAINTENANCE";
      break;
    case "D6090":
      returnvalue = "REPAIR IMPLANT";
      break;
    case "D6091":
      returnvalue = "REPL SEMI/PRECISION ATTACH";
      break;
    case "D6092":
      returnvalue = "RECEMENT SUPP CROWN";
      break;
    case "D6093":
      returnvalue = "RECEMENT SUPP PART DENTURE";
      break;
    case "D6094":
      returnvalue = "ABUT SUPPORT CROWN TITANIUM";
      break;
    case "D6095":
      returnvalue = "ODONTICS REPR ABUTMENT";
      break;
    case "D6100":
      returnvalue = "REMOVAL OF IMPLANT";
      break;
    case "D6190":
      returnvalue = "RADIO/SURGICAL IMPLANT INDEX";
      break;
    case "D6194":
      returnvalue = "ABUT SUPPORT RETAINER TITANI";
      break;
    case "D6199":
      returnvalue = "IMPLANT PROCEDURE";
      break;
    case "D6205":
      returnvalue = "PONTIC-INDIRECT RESIN BASED";
      break;
    case "D6210":
      returnvalue = "PROSTHODONT HIGH NOBLE METAL";
      break;
    case "D6211":
      returnvalue = "BRIDGE BASE METAL CAST";
      break;
    case "D6212":
      returnvalue = "BRIDGE NOBLE METAL CAST";
      break;
    case "D6214":
      returnvalue = "PONTIC TITANIUM";
      break;
    case "D6240":
      returnvalue = "BRIDGE PORCELAIN HIGH NOBLE";
      break;
    case "D6241":
      returnvalue = "BRIDGE PORCELAIN BASE METAL";
      break;
    case "D6242":
      returnvalue = "BRIDGE PORCELAIN NOBEL METAL";
      break;
    case "D6245":
      returnvalue = "BRIDGE PORCELAIN/CERAMIC";
      break;
    case "D6250":
      returnvalue = "BRIDGE RESIN W/HIGH NOBLE";
      break;
    case "D6251":
      returnvalue = "BRIDGE RESIN BASE METAL";
      break;
    case "D6252":
      returnvalue = "BRIDGE RESIN W/NOBLE METAL";
      break;
    case "D6253":
      returnvalue = "PROVISIONAL PONTIC";
      break;
    case "D6545":
      returnvalue = "DENTAL RETAINR CAST METL";
      break;
    case "D6548":
      returnvalue = "PORCELAIN/CERAMIC RETAINER";
      break;
    case "D6600":
      returnvalue = "PORCELAIN/CERAMIC INLAY 2SRF";
      break;
    case "D6601":
      returnvalue = "PORC/CERAM INLAY >= 3 SURFAC";
      break;
    case "D6602":
      returnvalue = "CST HGH NBLE MTL INLAY 2 SRF";
      break;
    case "D6603":
      returnvalue = "CST HGH NBLE MTL INLAY >=3SR";
      break;
    case "D6604":
      returnvalue = "CST BSE MTL INLAY 2 SURFACES";
      break;
    case "D6605":
      returnvalue = "CST BSE MTL INLAY >= 3 SURFA";
      break;
    case "D6606":
      returnvalue = "CAST NOBLE METAL INLAY 2 SUR";
      break;
    case "D6607":
      returnvalue = "CST NOBLE MTL INLAY >=3 SURF";
      break;
    case "D6608":
      returnvalue = "ONLAY PORC/CRMC 2 SURFACES";
      break;
    case "D6609":
      returnvalue = "ONLAY PORC/CRMC >=3 SURFACES";
      break;
    case "D6610":
      returnvalue = "ONLAY CST HGH NBL MTL 2 SRFC";
      break;
    case "D6611":
      returnvalue = "ONLAY CST HGH NBL MTL >=3SRF";
      break;
    case "D6612":
      returnvalue = "ONLAY CST BASE MTL 2 SURFACE";
      break;
    case "D6613":
      returnvalue = "ONLAY CST BASE MTL >=3 SURFA";
      break;
    case "D6614":
      returnvalue = "ONLAY CST NBL MTL 2 SURFACES";
      break;
    case "D6615":
      returnvalue = "ONLAY CST NBL MTL >=3 SURFAC";
      break;
    case "D6624":
      returnvalue = "INLAY TITANIUM";
      break;
    case "D6634":
      returnvalue = "ONLAY TITANIUM";
      break;
    case "D6710":
      returnvalue = "CROWN-INDIRECT RESIN BASED";
      break;
    case "D6720":
      returnvalue = "RETAIN CROWN RESIN W HI NBLE";
      break;
    case "D6721":
      returnvalue = "CROWN RESIN W/BASE METAL";
      break;
    case "D6722":
      returnvalue = "CROWN RESIN W/NOBLE METAL";
      break;
    case "D6740":
      returnvalue = "CROWN PORCELAIN/CERAMIC";
      break;
    case "D6750":
      returnvalue = "CROWN PORCELAIN HIGH NOBLE";
      break;
    case "D6751":
      returnvalue = "CROWN PORCELAIN BASE METAL";
      break;
    case "D6752":
      returnvalue = "CROWN PORCELAIN NOBLE METAL";
      break;
    case "D6780":
      returnvalue = "CROWN 3/4 HIGH NOBLE METAL";
      break;
    case "D6781":
      returnvalue = "CROWN 3/4 CAST BASED METAL";
      break;
    case "D6782":
      returnvalue = "CROWN 3/4 CAST NOBLE METAL";
      break;
    case "D6783":
      returnvalue = "CROWN 3/4 PORCELAIN/CERAMIC";
      break;
    case "D6790":
      returnvalue = "CROWN FULL HIGH NOBLE METAL";
      break;
    case "D6791":
      returnvalue = "CROWN FULL BASE METAL CAST";
      break;
    case "D6792":
      returnvalue = "CROWN FULL NOBLE METAL CAST";
      break;
    case "D6793":
      returnvalue = "PROVISIONAL RETAINER CROWN";
      break;
    case "D6794":
      returnvalue = "CROWN TITANIUM";
      break;
    case "D6920":
      returnvalue = "DENTAL CONNECTOR BAR";
      break;
    case "D6930":
      returnvalue = "DENTAL RECEMENT BRIDGE";
      break;
    case "D6940":
      returnvalue = "STRESS BREAKER";
      break;
    case "D6950":
      returnvalue = "PRECISION ATTACHMENT";
      break;
    case "D6970":
      returnvalue = "POST & CORE PLUS RETAINER";
      break;
    case "D6971":
      returnvalue = "CAST POST BRIDGE RETAINER";
      break;
    case "D6972":
      returnvalue = "PREFAB POST & CORE PLUS RETA";
      break;
    case "D6973":
      returnvalue = "CORE BUILD UP FOR RETAINER";
      break;
    case "D6975":
      returnvalue = "COPING METAL";
      break;
    case "D6976":
      returnvalue = "EACH ADDTNL CAST POST";
      break;
    case "D6977":
      returnvalue = "EACH ADDTL PREFAB POST";
      break;
    case "D6980":
      returnvalue = "BRIDGE REPAIR";
      break;
    case "D6985":
      returnvalue = "PEDIATRIC PARTIAL DENTURE FX";
      break;
    case "D6999":
      returnvalue = "FIXED PROSTHODONTIC PROC";
      break;
    case "D7111":
      returnvalue = "EXTRACTION CORONAL REMNANTS";
      break;
    case "D7140":
      returnvalue = "EXTRACTION ERUPTED TOOTH/EXR";
      break;
    case "D7210":
      returnvalue = "REM IMP TOOTH W MUCOPER FLP";
      break;
    case "D7220":
      returnvalue = "IMPACT TOOTH REMOV SOFT TISS";
      break;
    case "D7230":
      returnvalue = "IMPACT TOOTH REMOV PART BONY";
      break;
    case "D7240":
      returnvalue = "IMPACT TOOTH REMOV COMP BONY";
      break;
    case "D7241":
      returnvalue = "IMPACT TOOTH REM BONY W/COMP";
      break;
    case "D7250":
      returnvalue = "TOOTH ROOT REMOVAL";
      break;
    case "D7260":
      returnvalue = "ORAL ANTRAL FISTULA CLOSURE";
      break;
    case "D7261":
      returnvalue = "PRIMARY CLOSURE SINUS PERF";
      break;
    case "D7270":
      returnvalue = "TOOTH REIMPLANTATION";
      break;
    case "D7272":
      returnvalue = "TOOTH TRANSPLANTATION";
      break;
    case "D7280":
      returnvalue = "EXPOSURE IMPACT TOOTH ORTHOD";
      break;
    case "D7282":
      returnvalue = "MOBILIZE ERUPTED/MALPOS TOOT";
      break;
    case "D7283":
      returnvalue = "PLACE DEVICE IMPACTED TOOTH";
      break;
    case "D7285":
      returnvalue = "BIOPSY OF ORAL TISSUE HARD";
      break;
    case "D7286":
      returnvalue = "BIOPSY OF ORAL TISSUE SOFT";
      break;
    case "D7287":
      returnvalue = "EXFOLIATIVE CYTOLOG COLLECT";
      break;
    case "D7288":
      returnvalue = "BRUSH BIOPSY";
      break;
    case "D7290":
      returnvalue = "REPOSITIONING OF TEETH";
      break;
    case "D7291":
      returnvalue = "TRANSSEPTAL FIBEROTOMY";
      break;
    case "D7292":
      returnvalue = "SCREW RETAINED PLATE";
      break;
    case "D7293":
      returnvalue = "TEMP ANCHORAGE DEV W FLAP";
      break;
    case "D7294":
      returnvalue = "TEMP ANCHORAGE DEV W/O FLAP";
      break;
    case "D7310":
      returnvalue = "ALVEOPLASTY W/ EXTRACTION";
      break;
    case "D7311":
      returnvalue = "ALVEOLOPLASTY W/EXTRACT 1-3";
      break;
    case "D7320":
      returnvalue = "ALVEOPLASTY W/O EXTRACTION";
      break;
    case "D7321":
      returnvalue = "ALVEOLOPLASTY NOT W/EXTRACTS";
      break;
    case "D7340":
      returnvalue = "VESTIBULOPLASTY RIDGE EXTENS";
      break;
    case "D7350":
      returnvalue = "VESTIBULOPLASTY EXTEN GRAFT";
      break;
    case "D7410":
      returnvalue = "RAD EXC LESION UP TO 1.25 CM";
      break;
    case "D7411":
      returnvalue = "EXCISION BENIGN LESION>1.25C";
      break;
    case "D7412":
      returnvalue = "EXCISION BENIGN LESION COMPL";
      break;
    case "D7413":
      returnvalue = "EXCISION MALIG LESION<=1.25C";
      break;
    case "D7414":
      returnvalue = "EXCISION MALIG LESION>1.25CM";
      break;
    case "D7415":
      returnvalue = "EXCISION MALIG LES COMPLICAT";
      break;
    case "D7440":
      returnvalue = "MALIG TUMOR EXC TO 1.25 CM";
      break;
    case "D7441":
      returnvalue = "MALIG TUMOR > 1.25 CM";
      break;
    case "D7450":
      returnvalue = "REM ODONTOGEN CYST TO 1.25CM";
      break;
    case "D7451":
      returnvalue = "REM ODONTOGEN CYST > 1.25 CM";
      break;
    case "D7460":
      returnvalue = "REM NONODONTO CYST TO 1.25CM";
      break;
    case "D7461":
      returnvalue = "REM NONODONTO CYST > 1.25 CM";
      break;
    case "D7465":
      returnvalue = "LESION DESTRUCTION";
      break;
    case "D7471":
      returnvalue = "REM EXOSTOSIS ANY SITE";
      break;
    case "D7472":
      returnvalue = "REMOVAL OF TORUS PALATINUS";
      break;
    case "D7473":
      returnvalue = "REMOVE TORUS MANDIBULARIS";
      break;
    case "D7485":
      returnvalue = "SURG REDUCT OSSEOUSTUBEROSIT";
      break;
    case "D7490":
      returnvalue = "MAXILLA OR MANDIBLE RESECTIO";
      break;
    case "D7510":
      returnvalue = "I&D ABSC INTRAORAL SOFT TISS";
      break;
    case "D7511":
      returnvalue = "INCISION/DRAIN ABSCESS INTRA";
      break;
    case "D7520":
      returnvalue = "I&D ABSCESS EXTRAORAL";
      break;
    case "D7521":
      returnvalue = "INCISION/DRAIN ABSCESS EXTRA";
      break;
    case "D7530":
      returnvalue = "REMOVAL FB SKIN/AREOLAR TISS";
      break;
    case "D7540":
      returnvalue = "REMOVAL OF FB REACTION";
      break;
    case "D7550":
      returnvalue = "REMOVAL OF SLOUGHED OFF BONE";
      break;
    case "D7560":
      returnvalue = "MAXILLARY SINUSOTOMY";
      break;
    case "D7610":
      returnvalue = "MAXILLA OPEN REDUCT SIMPLE";
      break;
    case "D7620":
      returnvalue = "CLSD REDUCT SIMPL MAXILLA FX";
      break;
    case "D7630":
      returnvalue = "OPEN RED SIMPL MANDIBLE FX";
      break;
    case "D7640":
      returnvalue = "CLSD RED SIMPL MANDIBLE FX";
      break;
    case "D7650":
      returnvalue = "OPEN RED SIMP MALAR/ZYGOM FX";
      break;
    case "D7660":
      returnvalue = "CLSD RED SIMP MALAR/ZYGOM FX";
      break;
    case "D7670":
      returnvalue = "CLOSD RDUCTN SPLINT ALVEOLUS";
      break;
    case "D7671":
      returnvalue = "ALVEOLUS OPEN REDUCTION";
      break;
    case "D7680":
      returnvalue = "REDUCT SIMPLE FACIAL BONE FX";
      break;
    case "D7710":
      returnvalue = "MAXILLA OPEN REDUCT COMPOUND";
      break;
    case "D7720":
      returnvalue = "CLSD REDUCT COMPD MAXILLA FX";
      break;
    case "D7730":
      returnvalue = "OPEN REDUCT COMPD MANDBLE FX";
      break;
    case "D7740":
      returnvalue = "CLSD REDUCT COMPD MANDBLE FX";
      break;
    case "D7750":
      returnvalue = "OPEN RED COMP MALAR/ZYGMA FX";
      break;
    case "D7760":
      returnvalue = "CLSD RED COMP MALAR/ZYGMA FX";
      break;
    case "D7770":
      returnvalue = "OPEN REDUC COMPD ALVEOLUS FX";
      break;
    case "D7771":
      returnvalue = "ALVEOLUS CLSD REDUC STBLZ TE";
      break;
    case "D7780":
      returnvalue = "REDUCT COMPND FACIAL BONE FX";
      break;
    case "D7810":
      returnvalue = "TMJ OPEN REDUCT-DISLOCATION";
      break;
    case "D7820":
      returnvalue = "CLOSED TMP MANIPULATION";
      break;
    case "D7830":
      returnvalue = "TMJ MANIPULATION UNDER ANEST";
      break;
    case "D7840":
      returnvalue = "REMOVAL OF TMJ CONDYLE";
      break;
    case "D7850":
      returnvalue = "TMJ MENISCECTOMY";
      break;
    case "D7852":
      returnvalue = "TMJ REPAIR OF JOINT DISC";
      break;
    case "D7854":
      returnvalue = "TMJ EXCISN OF JOINT MEMBRANE";
      break;
    case "D7856":
      returnvalue = "TMJ CUTTING OF A MUSCLE";
      break;
    case "D7858":
      returnvalue = "TMJ RECONSTRUCTION";
      break;
    case "D7860":
      returnvalue = "TMJ CUTTING INTO JOINT";
      break;
    case "D7865":
      returnvalue = "TMJ RESHAPING COMPONENTS";
      break;
    case "D7870":
      returnvalue = "TMJ ASPIRATION JOINT FLUID";
      break;
    case "D7871":
      returnvalue = "LYSIS + LAVAGE W CATHETERS";
      break;
    case "D7872":
      returnvalue = "TMJ DIAGNOSTIC ARTHROSCOPY";
      break;
    case "D7873":
      returnvalue = "TMJ ARTHROSCOPY LYSIS ADHESN";
      break;
    case "D7874":
      returnvalue = "TMJ ARTHROSCOPY DISC REPOSIT";
      break;
    case "D7875":
      returnvalue = "TMJ ARTHROSCOPY SYNOVECTOMY";
      break;
    case "D7876":
      returnvalue = "TMJ ARTHROSCOPY DISCECTOMY";
      break;
    case "D7877":
      returnvalue = "TMJ ARTHROSCOPY DEBRIDEMENT";
      break;
    case "D7880":
      returnvalue = "OCCLUSAL ORTHOTIC APPLIANCE";
      break;
    case "D7899":
      returnvalue = "TMJ UNSPECIFIED THERAPY";
      break;
    case "D7910":
      returnvalue = "DENT SUTUR RECENT WND TO 5CM";
      break;
    case "D7911":
      returnvalue = "DENTAL SUTURE WOUND TO 5 CM";
      break;
    case "D7912":
      returnvalue = "SUTURE COMPLICATE WND > 5 CM";
      break;
    case "D7920":
      returnvalue = "DENTAL SKIN GRAFT";
      break;
    case "D7940":
      returnvalue = "RESHAPING BONE ORTHOGNATHIC";
      break;
    case "D7941":
      returnvalue = "BONE CUTTING RAMUS CLOSED";
      break;
    case "D7943":
      returnvalue = "CUTTING RAMUS OPEN W/GRAFT";
      break;
    case "D7944":
      returnvalue = "BONE CUTTING SEGMENTED";
      break;
    case "D7945":
      returnvalue = "BONE CUTTING BODY MANDIBLE";
      break;
    case "D7946":
      returnvalue = "RECONSTRUCTION MAXILLA TOTAL";
      break;
    case "D7947":
      returnvalue = "RECONSTRUCT MAXILLA SEGMENT";
      break;
    case "D7948":
      returnvalue = "RECONSTRUCT MIDFACE NO GRAFT";
      break;
    case "D7949":
      returnvalue = "RECONSTRUCT MIDFACE W/GRAFT";
      break;
    case "D7950":
      returnvalue = "MANDIBLE GRAFT";
      break;
    case "D7951":
      returnvalue = "SINUS AUG W BONE/BONE SUP";
      break;
    case "D7953":
      returnvalue = "BONE REPLACEMENT GRAFT";
      break;
    case "D7955":
      returnvalue = "REPAIR MAXILLOFACIAL DEFECTS";
      break;
    case "D7960":
      returnvalue = "FRENULECTOMY/FRENULOTOMY";
      break;
    case "D7963":
      returnvalue = "FRENULOPLASTY";
      break;
    case "D7970":
      returnvalue = "EXCISION HYPERPLASTIC TISSUE";
      break;
    case "D7971":
      returnvalue = "EXCISION PERICORONAL GINGIVA";
      break;
    case "D7972":
      returnvalue = "SURG REDCT FIBROUS TUBEROSIT";
      break;
    case "D7980":
      returnvalue = "SIALOLITHOTOMY";
      break;
    case "D7981":
      returnvalue = "EXCISION OF SALIVARY GLAND";
      break;
    case "D7982":
      returnvalue = "SIALODOCHOPLASTY";
      break;
    case "D7983":
      returnvalue = "CLOSURE OF SALIVARY FISTULA";
      break;
    case "D7990":
      returnvalue = "EMERGENCY TRACHEOTOMY";
      break;
    case "D7991":
      returnvalue = "DENTAL CORONOIDECTOMY";
      break;
    case "D7995":
      returnvalue = "SYNTHETIC GRAFT FACIAL BONES";
      break;
    case "D7996":
      returnvalue = "IMPLANT MANDIBLE FOR AUGMENT";
      break;
    case "D7997":
      returnvalue = "APPLIANCE REMOVAL";
      break;
    case "D7998":
      returnvalue = "INTRAORAL PLACE OF FIX DEV";
      break;
    case "D7999":
      returnvalue = "ORAL SURGERY PROCEDURE";
      break;
    case "D8010":
      returnvalue = "LIMITED DENTAL TX PRIMARY";
      break;
    case "D8020":
      returnvalue = "LIMITED DENTAL TX TRANSITION";
      break;
    case "D8030":
      returnvalue = "LIMITED DENTAL TX ADOLESCENT";
      break;
    case "D8040":
      returnvalue = "LIMITED DENTAL TX ADULT";
      break;
    case "D8050":
      returnvalue = "INTERCEP DENTAL TX PRIMARY";
      break;
    case "D8060":
      returnvalue = "INTERCEP DENTAL TX TRANSITN";
      break;
    case "D8070":
      returnvalue = "COMPRE DENTAL TX TRANSITION";
      break;
    case "D8080":
      returnvalue = "COMPRE DENTAL TX ADOLESCENT";
      break;
    case "D8090":
      returnvalue = "COMPRE DENTAL TX ADULT";
      break;
    case "D8210":
      returnvalue = "ORTHODONTIC REM APPLIANCE TX";
      break;
    case "D8220":
      returnvalue = "FIXED APPLIANCE THERAPY HABT";
      break;
    case "D8660":
      returnvalue = "PREORTHODONTIC TX VISIT";
      break;
    case "D8670":
      returnvalue = "PERIODIC ORTHODONTC TX VISIT";
      break;
    case "D8680":
      returnvalue = "ORTHODONTIC RETENTION";
      break;
    case "D8690":
      returnvalue = "ORTHODONTIC TREATMENT";
      break;
    case "D8691":
      returnvalue = "REPAIR ORTHO APPLIANCE";
      break;
    case "D8692":
      returnvalue = "REPLACEMENT RETAINER";
      break;
    case "D8693":
      returnvalue = "REBOND/CEMENT/REPAIR RETAIN";
      break;
    case "D8999":
      returnvalue = "ORTHODONTIC PROCEDURE";
      break;
    case "D9110":
      returnvalue = "TX DENTAL PAIN MINOR PROC";
      break;
    case "D9120":
      returnvalue = "FIX PARTIAL DENTURE SECTION";
      break;
    case "D9210":
      returnvalue = "DENT ANESTHESIA W/O SURGERY";
      break;
    case "D9211":
      returnvalue = "REGIONAL BLOCK ANESTHESIA";
      break;
    case "D9212":
      returnvalue = "TRIGEMINAL BLOCK ANESTHESIA";
      break;
    case "D9215":
      returnvalue = "LOCAL ANESTHESIA";
      break;
    case "D9220":
      returnvalue = "GENERAL ANESTHESIA";
      break;
    case "D9221":
      returnvalue = "GENERAL ANESTHESIA EA AD 15M";
      break;
    case "D9230":
      returnvalue = "ANALGESIA";
      break;
    case "D9241":
      returnvalue = "INTRAVENOUS SEDATION";
      break;
    case "D9242":
      returnvalue = "IV SEDATION EA AD 30 M";
      break;
    case "D9248":
      returnvalue = "SEDATION (NON-IV)";
      break;
    case "D9310":
      returnvalue = "DENTAL CONSULTATION";
      break;
    case "D9410":
      returnvalue = "DENTAL HOUSE CALL";
      break;
    case "D9420":
      returnvalue = "HOSPITAL CALL";
      break;
    case "D9430":
      returnvalue = "OFFICE VISIT DURING HOURS";
      break;
    case "D9440":
      returnvalue = "OFFICE VISIT AFTER HOURS";
      break;
    case "D9450":
      returnvalue = "CASE PRESENTATION TX PLAN";
      break;
    case "D9610":
      returnvalue = "DENT THERAPEUTIC DRUG INJECT";
      break;
    case "D9612":
      returnvalue = "THERA PAR DRUGS 2 OR > ADMIN";
      break;
    case "D9630":
      returnvalue = "OTHER DRUGS/MEDICAMENTS";
      break;
    case "D9910":
      returnvalue = "DENT APPL DESENSITIZING MED";
      break;
    case "D9911":
      returnvalue = "APPL DESENSITIZING RESIN";
      break;
    case "D9920":
      returnvalue = "BEHAVIOR MANAGEMENT";
      break;
    case "D9930":
      returnvalue = "TREATMENT OF COMPLICATIONS";
      break;
    case "D9940":
      returnvalue = "DENTAL OCCLUSAL GUARD";
      break;
    case "D9941":
      returnvalue = "FABRICATION ATHLETIC GUARD";
      break;
    case "D9942":
      returnvalue = "REPAIR/RELINE OCCLUSAL GUARD";
      break;
    case "D9950":
      returnvalue = "OCCLUSION ANALYSIS";
      break;
    case "D9951":
      returnvalue = "LIMITED OCCLUSAL ADJUSTMENT";
      break;
    case "D9952":
      returnvalue = "COMPLETE OCCLUSAL ADJUSTMENT";
      break;
    case "D9970":
      returnvalue = "ENAMEL MICROABRASION";
      break;
    case "D9971":
      returnvalue = "ODONTOPLASTY 1-2 TEETH";
      break;
    case "D9972":
      returnvalue = "EXTRNL BLEACHING PER ARCH";
      break;
    case "D9973":
      returnvalue = "EXTRNL BLEACHING PER TOOTH";
      break;
    case "D9974":
      returnvalue = "INTRNL BLEACHING PER TOOTH";
      break;
    case "D9999":
      returnvalue = "ADJUNCTIVE PROCEDURE";
      break;
    case "E0100":
      returnvalue = "CANE ADJUST/FIXED WITH TIP";
      break;
    case "E0105":
      returnvalue = "CANE ADJUST/FIXED QUAD/3 PRO";
      break;
    case "E0110":
      returnvalue = "CRUTCH FOREARM PAIR";
      break;
    case "E0111":
      returnvalue = "CRUTCH FOREARM EACH";
      break;
    case "E0112":
      returnvalue = "CRUTCH UNDERARM PAIR WOOD";
      break;
    case "E0113":
      returnvalue = "CRUTCH UNDERARM EACH WOOD";
      break;
    case "E0114":
      returnvalue = "CRUTCH UNDERARM PAIR NO WOOD";
      break;
    case "E0116":
      returnvalue = "CRUTCH UNDERARM EACH NO WOOD";
      break;
    case "E0117":
      returnvalue = "UNDERARM SPRINGASSIST CRUTCH";
      break;
    case "E0118":
      returnvalue = "CRUTCH SUBSTITUTE";
      break;
    case "E0130":
      returnvalue = "WALKER RIGID ADJUST/FIXED HT";
      break;
    case "E0135":
      returnvalue = "WALKER FOLDING ADJUST/FIXED";
      break;
    case "E0140":
      returnvalue = "WALKER W TRUNK SUPPORT";
      break;
    case "E0141":
      returnvalue = "RIGID WHEELED WALKER ADJ/FIX";
      break;
    case "E0143":
      returnvalue = "WALKER FOLDING WHEELED W/O S";
      break;
    case "E0144":
      returnvalue = "ENCLOSED WALKER W REAR SEAT";
      break;
    case "E0147":
      returnvalue = "WALKER VARIABLE WHEEL RESIST";
      break;
    case "E0148":
      returnvalue = "HEAVYDUTY WALKER NO WHEELS";
      break;
    case "E0149":
      returnvalue = "HEAVY DUTY WHEELED WALKER";
      break;
    case "E0153":
      returnvalue = "FOREARM CRUTCH PLATFORM ATTA";
      break;
    case "E0154":
      returnvalue = "WALKER PLATFORM ATTACHMENT";
      break;
    case "E0155":
      returnvalue = "WALKER WHEEL ATTACHMENT,PAIR";
      break;
    case "E0156":
      returnvalue = "WALKER SEAT ATTACHMENT";
      break;
    case "E0157":
      returnvalue = "WALKER CRUTCH ATTACHMENT";
      break;
    case "E0158":
      returnvalue = "WALKER LEG EXTENDERS SET OF4";
      break;
    case "E0159":
      returnvalue = "BRAKE FOR WHEELED WALKER";
      break;
    case "E0160":
      returnvalue = "SITZ TYPE BATH OR EQUIPMENT";
      break;
    case "E0161":
      returnvalue = "SITZ BATH/EQUIPMENT W/FAUCET";
      break;
    case "E0162":
      returnvalue = "SITZ BATH CHAIR";
      break;
    case "E0163":
      returnvalue = "COMMODE CHAIR WITH FIXED ARM";
      break;
    case "E0164":
      returnvalue = "COMMODE CHAIR MOBILE FIXED A";
      break;
    case "E0165":
      returnvalue = "COMMODE CHAIR WITH DETACHARM";
      break;
    case "E0166":
      returnvalue = "COMMODE CHAIR MOBILE DETACH";
      break;
    case "E0167":
      returnvalue = "COMMODE CHAIR PAIL OR PAN";
      break;
    case "E0168":
      returnvalue = "HEAVYDUTY/WIDE COMMODE CHAIR";
      break;
    case "E0170":
      returnvalue = "COMMODE CHAIR ELECTRIC";
      break;
    case "E0171":
      returnvalue = "COMMODE CHAIR NON-ELECTRIC";
      break;
    case "E0172":
      returnvalue = "SEAT LIFT MECHANISM TOILET";
      break;
    case "E0175":
      returnvalue = "COMMODE CHAIR FOOT REST";
      break;
    case "E0180":
      returnvalue = "PRESS PAD ALTERNATING W PUMP";
      break;
    case "E0181":
      returnvalue = "PRESS PAD ALTERNATING W/ PUM";
      break;
    case "E0182":
      returnvalue = "REPLACE PUMP, ALT PRESS PAD";
      break;
    case "E0184":
      returnvalue = "DRY PRESSURE MATTRESS";
      break;
    case "E0185":
      returnvalue = "GEL PRESSURE MATTRESS PAD";
      break;
    case "E0186":
      returnvalue = "AIR PRESSURE MATTRESS";
      break;
    case "E0187":
      returnvalue = "WATER PRESSURE MATTRESS";
      break;
    case "E0188":
      returnvalue = "SYNTHETIC SHEEPSKIN PAD";
      break;
    case "E0189":
      returnvalue = "LAMBSWOOL SHEEPSKIN PAD";
      break;
    case "E0190":
      returnvalue = "POSITIONING CUSHION";
      break;
    case "E0191":
      returnvalue = "PROTECTOR HEEL OR ELBOW";
      break;
    case "E0193":
      returnvalue = "POWERED AIR FLOTATION BED";
      break;
    case "E0194":
      returnvalue = "AIR FLUIDIZED BED";
      break;
    case "E0196":
      returnvalue = "GEL PRESSURE MATTRESS";
      break;
    case "E0197":
      returnvalue = "AIR PRESSURE PAD FOR MATTRES";
      break;
    case "E0198":
      returnvalue = "WATER PRESSURE PAD FOR MATTR";
      break;
    case "E0199":
      returnvalue = "DRY PRESSURE PAD FOR MATTRES";
      break;
    case "E0200":
      returnvalue = "HEAT LAMP WITHOUT STAND";
      break;
    case "E0202":
      returnvalue = "PHOTOTHERAPY LIGHT W/ PHOTOM";
      break;
    case "E0203":
      returnvalue = "THERAPEUTIC LIGHTBOX TABLETP";
      break;
    case "E0205":
      returnvalue = "HEAT LAMP WITH STAND";
      break;
    case "E0210":
      returnvalue = "ELECTRIC HEAT PAD STANDARD";
      break;
    case "E0215":
      returnvalue = "ELECTRIC HEAT PAD MOIST";
      break;
    case "E0217":
      returnvalue = "WATER CIRC HEAT PAD W PUMP";
      break;
    case "E0218":
      returnvalue = "WATER CIRC COLD PAD W PUMP";
      break;
    case "E0220":
      returnvalue = "HOT WATER BOTTLE";
      break;
    case "E0221":
      returnvalue = "INFRARED HEATING PAD SYSTEM";
      break;
    case "E0225":
      returnvalue = "HYDROCOLLATOR UNIT";
      break;
    case "E0230":
      returnvalue = "ICE CAP OR COLLAR";
      break;
    case "E0231":
      returnvalue = "WOUND WARMING DEVICE";
      break;
    case "E0232":
      returnvalue = "WARMING CARD FOR NWT";
      break;
    case "E0235":
      returnvalue = "PARAFFIN BATH UNIT PORTABLE";
      break;
    case "E0236":
      returnvalue = "PUMP FOR WATER CIRCULATING P";
      break;
    case "E0238":
      returnvalue = "HEAT PAD NON-ELECTRIC MOIST";
      break;
    case "E0239":
      returnvalue = "HYDROCOLLATOR UNIT PORTABLE";
      break;
    case "E0240":
      returnvalue = "BATH/SHOWER CHAIR";
      break;
    case "E0241":
      returnvalue = "BATH TUB WALL RAIL";
      break;
    case "E0242":
      returnvalue = "BATH TUB RAIL FLOOR";
      break;
    case "E0243":
      returnvalue = "TOILET RAIL";
      break;
    case "E0244":
      returnvalue = "TOILET SEAT RAISED";
      break;
    case "E0245":
      returnvalue = "TUB STOOL OR BENCH";
      break;
    case "E0246":
      returnvalue = "TRANSFER TUB RAIL ATTACHMENT";
      break;
    case "E0247":
      returnvalue = "TRANS BENCH W/WO COMM OPEN";
      break;
    case "E0248":
      returnvalue = "HDTRANS BENCH W/WO COMM OPEN";
      break;
    case "E0249":
      returnvalue = "PAD WATER CIRCULATING HEAT U";
      break;
    case "E0250":
      returnvalue = "HOSP BED FIXED HT W/ MATTRES";
      break;
    case "E0251":
      returnvalue = "HOSP BED FIXD HT W/O MATTRES";
      break;
    case "E0255":
      returnvalue = "HOSPITAL BED VAR HT W/ MATTR";
      break;
    case "E0256":
      returnvalue = "HOSPITAL BED VAR HT W/O MATT";
      break;
    case "E0260":
      returnvalue = "HOSP BED SEMI-ELECTR W/ MATT";
      break;
    case "E0261":
      returnvalue = "HOSP BED SEMI-ELECTR W/O MAT";
      break;
    case "E0265":
      returnvalue = "HOSP BED TOTAL ELECTR W/ MAT";
      break;
    case "E0266":
      returnvalue = "HOSP BED TOTAL ELEC W/O MATT";
      break;
    case "E0270":
      returnvalue = "HOSPITAL BED INSTITUTIONAL T";
      break;
    case "E0271":
      returnvalue = "MATTRESS INNERSPRING";
      break;
    case "E0272":
      returnvalue = "MATTRESS FOAM RUBBER";
      break;
    case "E0273":
      returnvalue = "BED BOARD";
      break;
    case "E0274":
      returnvalue = "OVER-BED TABLE";
      break;
    case "E0275":
      returnvalue = "BED PAN STANDARD";
      break;
    case "E0276":
      returnvalue = "BED PAN FRACTURE";
      break;
    case "E0277":
      returnvalue = "POWERED PRES-REDU AIR MATTRS";
      break;
    case "E0280":
      returnvalue = "BED CRADLE";
      break;
    case "E0290":
      returnvalue = "HOSP BED FX HT W/O RAILS W/M";
      break;
    case "E0291":
      returnvalue = "HOSP BED FX HT W/O RAIL W/O";
      break;
    case "E0292":
      returnvalue = "HOSP BED VAR HT W/O RAIL W/O";
      break;
    case "E0293":
      returnvalue = "HOSP BED VAR HT W/O RAIL W/";
      break;
    case "E0294":
      returnvalue = "HOSP BED SEMI-ELECT W/ MATTR";
      break;
    case "E0295":
      returnvalue = "HOSP BED SEMI-ELECT W/O MATT";
      break;
    case "E0296":
      returnvalue = "HOSP BED TOTAL ELECT W/ MATT";
      break;
    case "E0297":
      returnvalue = "HOSP BED TOTAL ELECT W/O MAT";
      break;
    case "E0300":
      returnvalue = "ENCLOSED PED CRIB HOSP GRADE";
      break;
    case "E0301":
      returnvalue = "HD HOSP BED, 350-600 LBS";
      break;
    case "E0302":
      returnvalue = "EX HD HOSP BED > 600 LBS";
      break;
    case "E0303":
      returnvalue = "HOSP BED HVY DTY XTRA WIDE";
      break;
    case "E0304":
      returnvalue = "HOSP BED XTRA HVY DTY X WIDE";
      break;
    case "E0305":
      returnvalue = "RAILS BED SIDE HALF LENGTH";
      break;
    case "E0310":
      returnvalue = "RAILS BED SIDE FULL LENGTH";
      break;
    case "E0315":
      returnvalue = "BED ACCESSORY BRD/TBL/SUPPRT";
      break;
    case "E0316":
      returnvalue = "BED SAFETY ENCLOSURE";
      break;
    case "E0325":
      returnvalue = "URINAL MALE JUG-TYPE";
      break;
    case "E0326":
      returnvalue = "URINAL FEMALE JUG-TYPE";
      break;
    case "E0328":
      returnvalue = "PED HOSPITAL BED, MANUAL";
      break;
    case "E0329":
      returnvalue = "PED HOSPITAL BED SEMI/ELECT";
      break;
    case "E0350":
      returnvalue = "CONTROL UNIT BOWEL SYSTEM";
      break;
    case "E0352":
      returnvalue = "DISPOSABLE PACK W/BOWEL SYST";
      break;
    case "E0370":
      returnvalue = "AIR ELEVATOR FOR HEEL";
      break;
    case "E0371":
      returnvalue = "NONPOWER MATTRESS OVERLAY";
      break;
    case "E0372":
      returnvalue = "POWERED AIR MATTRESS OVERLAY";
      break;
    case "E0373":
      returnvalue = "NONPOWERED PRESSURE MATTRESS";
      break;
    case "E0424":
      returnvalue = "STATIONARY COMPRESSED GAS 02";
      break;
    case "E0425":
      returnvalue = "GAS SYSTEM STATIONARY COMPRE";
      break;
    case "E0430":
      returnvalue = "OXYGEN SYSTEM GAS PORTABLE";
      break;
    case "E0431":
      returnvalue = "PORTABLE GASEOUS 02";
      break;
    case "E0433":
      returnvalue = "PORTABLE LIQUID OXYGEN SYS";
      break;
    case "E0434":
      returnvalue = "PORTABLE LIQUID 02";
      break;
    case "E0435":
      returnvalue = "OXYGEN SYSTEM LIQUID PORTABL";
      break;
    case "E0439":
      returnvalue = "STATIONARY LIQUID 02";
      break;
    case "E0440":
      returnvalue = "OXYGEN SYSTEM LIQUID STATION";
      break;
    case "E0441":
      returnvalue = "STATIONARY O2 CONTENTS, GAS";
      break;
    case "E0442":
      returnvalue = "STATIONARY O2 CONTENTS, LIQ";
      break;
    case "E0443":
      returnvalue = "PORTABLE 02 CONTENTS, GAS";
      break;
    case "E0444":
      returnvalue = "PORTABLE 02 CONTENTS, LIQUID";
      break;
    case "E0445":
      returnvalue = "OXIMETER NON-INVASIVE";
      break;
    case "E0450":
      returnvalue = "VOL CONTROL VENT INVASIV INT";
      break;
    case "E0455":
      returnvalue = "OXYGEN TENT EXCL CROUP/PED T";
      break;
    case "E0457":
      returnvalue = "CHEST SHELL";
      break;
    case "E0459":
      returnvalue = "CHEST WRAP";
      break;
    case "E0460":
      returnvalue = "NEG PRESS VENT PORTABL/STATN";
      break;
    case "E0461":
      returnvalue = "VOL CONTROL VENT NONINV INT";
      break;
    case "E0462":
      returnvalue = "ROCKING BED W/ OR W/O SIDE R";
      break;
    case "E0463":
      returnvalue = "PRESS SUPP VENT INVASIVE INT";
      break;
    case "E0464":
      returnvalue = "PRESS SUPP VENT NONINV INT";
      break;
    case "E0470":
      returnvalue = "RAD W/O BACKUP NON-INV INTFC";
      break;
    case "E0471":
      returnvalue = "RAD W/BACKUP NON INV INTRFC";
      break;
    case "E0472":
      returnvalue = "RAD W BACKUP INVASIVE INTRFC";
      break;
    case "E0480":
      returnvalue = "PERCUSSOR ELECT/PNEUM HOME M";
      break;
    case "E0481":
      returnvalue = "INTRPULMNRY PERCUSS VENT SYS";
      break;
    case "E0482":
      returnvalue = "COUGH STIMULATING DEVICE";
      break;
    case "E0483":
      returnvalue = "CHEST COMPRESSION GEN SYSTEM";
      break;
    case "E0484":
      returnvalue = "NON-ELEC OSCILLATORY PEP DVC";
      break;
    case "E0485":
      returnvalue = "ORAL DEVICE/APPLIANCE PREFAB";
      break;
    case "E0486":
      returnvalue = "ORAL DEVICE/APPLIANCE CUSFAB";
      break;
    case "E0487":
      returnvalue = "ELECTRONIC SPIROMETER";
      break;
    case "E0500":
      returnvalue = "IPPB ALL TYPES";
      break;
    case "E0550":
      returnvalue = "HUMIDIF EXTENS SUPPLE W IPPB";
      break;
    case "E0555":
      returnvalue = "HUMIDIFIER FOR USE W/ REGULA";
      break;
    case "E0560":
      returnvalue = "HUMIDIFIER SUPPLEMENTAL W/ I";
      break;
    case "E0561":
      returnvalue = "HUMIDIFIER NONHEATED W PAP";
      break;
    case "E0562":
      returnvalue = "HUMIDIFIER HEATED USED W PAP";
      break;
    case "E0565":
      returnvalue = "COMPRESSOR AIR POWER SOURCE";
      break;
    case "E0570":
      returnvalue = "NEBULIZER WITH COMPRESSION";
      break;
    case "E0571":
      returnvalue = "AEROSOL COMPRESSOR FOR SVNEB";
      break;
    case "E0572":
      returnvalue = "AEROSOL COMPRESSOR ADJUST PR";
      break;
    case "E0574":
      returnvalue = "ULTRASONIC GENERATOR W SVNEB";
      break;
    case "E0575":
      returnvalue = "NEBULIZER ULTRASONIC";
      break;
    case "E0580":
      returnvalue = "NEBULIZER FOR USE W/ REGULAT";
      break;
    case "E0585":
      returnvalue = "NEBULIZER W/ COMPRESSOR & HE";
      break;
    case "E0600":
      returnvalue = "SUCTION PUMP PORTAB HOM MODL";
      break;
    case "E0601":
      returnvalue = "CONT AIRWAY PRESSURE DEVICE";
      break;
    case "E0602":
      returnvalue = "MANUAL BREAST PUMP";
      break;
    case "E0603":
      returnvalue = "ELECTRIC BREAST PUMP";
      break;
    case "E0604":
      returnvalue = "HOSP GRADE ELEC BREAST PUMP";
      break;
    case "E0605":
      returnvalue = "VAPORIZER ROOM TYPE";
      break;
    case "E0606":
      returnvalue = "DRAINAGE BOARD POSTURAL";
      break;
    case "E0607":
      returnvalue = "BLOOD GLUCOSE MONITOR HOME";
      break;
    case "E0610":
      returnvalue = "PACEMAKER MONITR AUDIBLE/VIS";
      break;
    case "E0615":
      returnvalue = "PACEMAKER MONITR DIGITAL/VIS";
      break;
    case "E0616":
      returnvalue = "CARDIAC EVENT RECORDER";
      break;
    case "E0617":
      returnvalue = "AUTOMATIC EXT DEFIBRILLATOR";
      break;
    case "E0618":
      returnvalue = "APNEA MONITOR";
      break;
    case "E0619":
      returnvalue = "APNEA MONITOR W RECORDER";
      break;
    case "E0620":
      returnvalue = "CAP BLD SKIN PIERCING LASER";
      break;
    case "E0621":
      returnvalue = "PATIENT LIFT SLING OR SEAT";
      break;
    case "E0625":
      returnvalue = "PATIENT LIFT BATHROOM OR TOI";
      break;
    case "E0627":
      returnvalue = "SEAT LIFT INCORP LIFT-CHAIR";
      break;
    case "E0628":
      returnvalue = "SEAT LIFT FOR PT FURN-ELECTR";
      break;
    case "E0629":
      returnvalue = "SEAT LIFT FOR PT FURN-NON-EL";
      break;
    case "E0630":
      returnvalue = "PATIENT LIFT HYDRAULIC";
      break;
    case "E0635":
      returnvalue = "PATIENT LIFT ELECTRIC";
      break;
    case "E0636":
      returnvalue = "PT SUPPORT & POSITIONING SYS";
      break;
    case "E0637":
      returnvalue = "COMBINATION SIT TO STAND SYS";
      break;
    case "E0638":
      returnvalue = "STANDING FRAME SYS";
      break;
    case "E0639":
      returnvalue = "MOVEABLE PATIENT LIFT SYSTEM";
      break;
    case "E0640":
      returnvalue = "FIXED PATIENT LIFT SYSTEM";
      break;
    case "E0641":
      returnvalue = "MULTI-POSITION STND FRAM SYS";
      break;
    case "E0642":
      returnvalue = "DYNAMIC STANDING FRAME";
      break;
    case "E0650":
      returnvalue = "PNEUMA COMPRESOR NON-SEGMENT";
      break;
    case "E0651":
      returnvalue = "PNEUM COMPRESSOR SEGMENTAL";
      break;
    case "E0652":
      returnvalue = "PNEUM COMPRES W/CAL PRESSURE";
      break;
    case "E0655":
      returnvalue = "PNEUMATIC APPLIANCE HALF ARM";
      break;
    case "E0656":
      returnvalue = "SEGMENTAL PNEUMATIC TRUNK";
      break;
    case "E0657":
      returnvalue = "SEGMENTAL PNEUMATIC CHEST";
      break;
    case "E0660":
      returnvalue = "PNEUMATIC APPLIANCE FULL LEG";
      break;
    case "E0665":
      returnvalue = "PNEUMATIC APPLIANCE FULL ARM";
      break;
    case "E0666":
      returnvalue = "PNEUMATIC APPLIANCE HALF LEG";
      break;
    case "E0667":
      returnvalue = "SEG PNEUMATIC APPL FULL LEG";
      break;
    case "E0668":
      returnvalue = "SEG PNEUMATIC APPL FULL ARM";
      break;
    case "E0669":
      returnvalue = "SEG PNEUMATIC APPLI HALF LEG";
      break;
    case "E0671":
      returnvalue = "PRESSURE PNEUM APPL FULL LEG";
      break;
    case "E0672":
      returnvalue = "PRESSURE PNEUM APPL FULL ARM";
      break;
    case "E0673":
      returnvalue = "PRESSURE PNEUM APPL HALF LEG";
      break;
    case "E0675":
      returnvalue = "PNEUMATIC COMPRESSION DEVICE";
      break;
    case "E0676":
      returnvalue = "INTER LIMB COMPRESS DEV NOS";
      break;
    case "E0691":
      returnvalue = "UVL PNL 2 SQ FT OR LESS";
      break;
    case "E0692":
      returnvalue = "UVL SYS PANEL 4 FT";
      break;
    case "E0693":
      returnvalue = "UVL SYS PANEL 6 FT";
      break;
    case "E0694":
      returnvalue = "UVL MD CABINET SYS 6 FT";
      break;
    case "E0700":
      returnvalue = "SAFETY EQUIPMENT";
      break;
    case "E0701":
      returnvalue = "HELMET W FACE GUARD PREFAB";
      break;
    case "E0705":
      returnvalue = "TRANSFER DEVICE";
      break;
    case "E0710":
      returnvalue = "RESTRAINTS ANY TYPE";
      break;
    case "E0720":
      returnvalue = "TENS TWO LEAD";
      break;
    case "E0730":
      returnvalue = "TENS FOUR LEAD";
      break;
    case "E0731":
      returnvalue = "CONDUCTIVE GARMENT FOR TENS/";
      break;
    case "E0740":
      returnvalue = "INCONTINENCE TREATMENT SYSTM";
      break;
    case "E0744":
      returnvalue = "NEUROMUSCULAR STIM FOR SCOLI";
      break;
    case "E0745":
      returnvalue = "NEUROMUSCULAR STIM FOR SHOCK";
      break;
    case "E0746":
      returnvalue = "ELECTROMYOGRAPH BIOFEEDBACK";
      break;
    case "E0747":
      returnvalue = "ELEC OSTEOGEN STIM NOT SPINE";
      break;
    case "E0748":
      returnvalue = "ELEC OSTEOGEN STIM SPINAL";
      break;
    case "E0749":
      returnvalue = "ELEC OSTEOGEN STIM IMPLANTED";
      break;
    case "E0755":
      returnvalue = "ELECTRONIC SALIVARY REFLEX S";
      break;
    case "E0760":
      returnvalue = "OSTEOGEN ULTRASOUND STIMLTOR";
      break;
    case "E0761":
      returnvalue = "NONTHERM ELECTROMGNTC DEVICE";
      break;
    case "E0762":
      returnvalue = "TRANS ELEC JT STIM DEV SYS";
      break;
    case "E0764":
      returnvalue = "FUNCTIONAL NEUROMUSCULARSTIM";
      break;
    case "E0765":
      returnvalue = "NERVE STIMULATOR FOR TX N&V";
      break;
    case "E0769":
      returnvalue = "ELECTRIC WOUND TREATMENT DEV";
      break;
    case "E0770":
      returnvalue = "FUNCTIONAL ELECTRIC STIM NOS";
      break;
    case "E0776":
      returnvalue = "IV POLE";
      break;
    case "E0779":
      returnvalue = "AMB INFUSION PUMP MECHANICAL";
      break;
    case "E0780":
      returnvalue = "MECH AMB INFUSION PUMP <8HRS";
      break;
    case "E0781":
      returnvalue = "EXTERNAL AMBULATORY INFUS PU";
      break;
    case "E0782":
      returnvalue = "NON-PROGRAMBLE INFUSION PUMP";
      break;
    case "E0783":
      returnvalue = "PROGRAMMABLE INFUSION PUMP";
      break;
    case "E0784":
      returnvalue = "EXT AMB INFUSN PUMP INSULIN";
      break;
    case "E0785":
      returnvalue = "REPLACEMENT IMPL PUMP CATHET";
      break;
    case "E0786":
      returnvalue = "IMPLANTABLE PUMP REPLACEMENT";
      break;
    case "E0791":
      returnvalue = "PARENTERAL INFUSION PUMP STA";
      break;
    case "E0830":
      returnvalue = "AMBULATORY TRACTION DEVICE";
      break;
    case "E0840":
      returnvalue = "TRACT FRAME ATTACH HEADBOARD";
      break;
    case "E0849":
      returnvalue = "CERVICAL PNEUM TRAC EQUIP";
      break;
    case "E0850":
      returnvalue = "TRACTION STAND FREE STANDING";
      break;
    case "E0855":
      returnvalue = "CERVICAL TRACTION EQUIPMENT";
      break;
    case "E0856":
      returnvalue = "CERVIC COLLAR W AIR BLADDER";
      break;
    case "E0860":
      returnvalue = "TRACT EQUIP CERVICAL TRACT";
      break;
    case "E0870":
      returnvalue = "TRACT FRAME ATTACH FOOTBOARD";
      break;
    case "E0880":
      returnvalue = "TRAC STAND FREE STAND EXTREM";
      break;
    case "E0890":
      returnvalue = "TRACTION FRAME ATTACH PELVIC";
      break;
    case "E0900":
      returnvalue = "TRAC STAND FREE STAND PELVIC";
      break;
    case "E0910":
      returnvalue = "TRAPEZE BAR ATTACHED TO BED";
      break;
    case "E0911":
      returnvalue = "HD TRAPEZE BAR ATTACH TO BED";
      break;
    case "E0912":
      returnvalue = "HD TRAPEZE BAR FREE STANDING";
      break;
    case "E0920":
      returnvalue = "FRACTURE FRAME ATTACHED TO B";
      break;
    case "E0930":
      returnvalue = "FRACTURE FRAME FREE STANDING";
      break;
    case "E0935":
      returnvalue = "CONT PAS MOTION EXERCISE DEV";
      break;
    case "E0936":
      returnvalue = "CPM DEVICE, OTHER THAN KNEE";
      break;
    case "E0940":
      returnvalue = "TRAPEZE BAR FREE STANDING";
      break;
    case "E0941":
      returnvalue = "GRAVITY ASSISTED TRACTION DE";
      break;
    case "E0942":
      returnvalue = "CERVICAL HEAD HARNESS/HALTER";
      break;
    case "E0944":
      returnvalue = "PELVIC BELT/HARNESS/BOOT";
      break;
    case "E0945":
      returnvalue = "BELT/HARNESS EXTREMITY";
      break;
    case "E0946":
      returnvalue = "FRACTURE FRAME DUAL W CROSS";
      break;
    case "E0947":
      returnvalue = "FRACTURE FRAME ATTACHMNTS PE";
      break;
    case "E0948":
      returnvalue = "FRACTURE FRAME ATTACHMNTS CE";
      break;
    case "E0950":
      returnvalue = "TRAY";
      break;
    case "E0951":
      returnvalue = "LOOP HEEL";
      break;
    case "E0952":
      returnvalue = "TOE LOOP/HOLDER, EACH";
      break;
    case "E0955":
      returnvalue = "CUSHIONED HEADREST";
      break;
    case "E0956":
      returnvalue = "W/C LATERAL TRUNK/HIP SUPPOR";
      break;
    case "E0957":
      returnvalue = "W/C MEDIAL THIGH SUPPORT";
      break;
    case "E0958":
      returnvalue = "WHLCHR ATT- CONV 1 ARM DRIVE";
      break;
    case "E0959":
      returnvalue = "AMPUTEE ADAPTER";
      break;
    case "E0960":
      returnvalue = "W/C SHOULDER HARNESS/STRAPS";
      break;
    case "E0961":
      returnvalue = "WHEELCHAIR BRAKE EXTENSION";
      break;
    case "E0966":
      returnvalue = "WHEELCHAIR HEAD REST EXTENSI";
      break;
    case "E0967":
      returnvalue = "MANUAL WC HAND RIM W PROJECT";
      break;
    case "E0968":
      returnvalue = "WHEELCHAIR COMMODE SEAT";
      break;
    case "E0969":
      returnvalue = "WHEELCHAIR NARROWING DEVICE";
      break;
    case "E0970":
      returnvalue = "WHEELCHAIR NO. 2 FOOTPLATES";
      break;
    case "E0971":
      returnvalue = "WHEELCHAIR ANTI-TIPPING DEVI";
      break;
    case "E0973":
      returnvalue = "W/CH ACCESS DET ADJ ARMREST";
      break;
    case "E0974":
      returnvalue = "W/CH ACCESS ANTI-ROLLBACK";
      break;
    case "E0977":
      returnvalue = "WHEELCHAIR WEDGE CUSHION";
      break;
    case "E0978":
      returnvalue = "W/C ACC,SAF BELT PELV STRAP";
      break;
    case "E0980":
      returnvalue = "WHEELCHAIR SAFETY VEST";
      break;
    case "E0981":
      returnvalue = "SEAT UPHOLSTERY, REPLACEMENT";
      break;
    case "E0982":
      returnvalue = "BACK UPHOLSTERY, REPLACEMENT";
      break;
    case "E0983":
      returnvalue = "ADD PWR JOYSTICK";
      break;
    case "E0984":
      returnvalue = "ADD PWR TILLER";
      break;
    case "E0985":
      returnvalue = "W/C SEAT LIFT MECHANISM";
      break;
    case "E0986":
      returnvalue = "MAN W/C PUSH-RIM POW ASSIST";
      break;
    case "E0990":
      returnvalue = "WHEELCHAIR ELEVATING LEG RES";
      break;
    case "E0992":
      returnvalue = "WHEELCHAIR SOLID SEAT INSERT";
      break;
    case "E0994":
      returnvalue = "WHEELCHAIR ARM REST";
      break;
    case "E0995":
      returnvalue = "WHEELCHAIR CALF REST";
      break;
    case "E0997":
      returnvalue = "WHEELCHAIR CASTER W/ A FORK";
      break;
    case "E0998":
      returnvalue = "WHEELCHAIR CASTER W/O A FORK";
      break;
    case "E0999":
      returnvalue = "WHEELCHR PNEUMATIC TIRE W/WH";
      break;
    case "E1002":
      returnvalue = "PWR SEAT TILT";
      break;
    case "E1003":
      returnvalue = "PWR SEAT RECLINE";
      break;
    case "E1004":
      returnvalue = "PWR SEAT RECLINE MECH";
      break;
    case "E1005":
      returnvalue = "PWR SEAT RECLINE PWR";
      break;
    case "E1006":
      returnvalue = "PWR SEAT COMBO W/O SHEAR";
      break;
    case "E1007":
      returnvalue = "PWR SEAT COMBO W/SHEAR";
      break;
    case "E1008":
      returnvalue = "PWR SEAT COMBO PWR SHEAR";
      break;
    case "E1009":
      returnvalue = "ADD MECH LEG ELEVATION";
      break;
    case "E1010":
      returnvalue = "ADD PWR LEG ELEVATION";
      break;
    case "E1011":
      returnvalue = "PED WC MODIFY WIDTH ADJUSTM";
      break;
    case "E1014":
      returnvalue = "RECLINING BACK ADD PED W/C";
      break;
    case "E1015":
      returnvalue = "SHOCK ABSORBER FOR MAN W/C";
      break;
    case "E1016":
      returnvalue = "SHOCK ABSORBER FOR POWER W/C";
      break;
    case "E1017":
      returnvalue = "HD SHCK ABSRBR FOR HD MAN WC";
      break;
    case "E1018":
      returnvalue = "HD SHCK ABSRBER FOR HD POWWC";
      break;
    case "E1020":
      returnvalue = "RESIDUAL LIMB SUPPORT SYSTEM";
      break;
    case "E1028":
      returnvalue = "W/C MANUAL SWINGAWAY";
      break;
    case "E1029":
      returnvalue = "W/C VENT TRAY FIXED";
      break;
    case "E1030":
      returnvalue = "W/C VENT TRAY GIMBALED";
      break;
    case "E1031":
      returnvalue = "ROLLABOUT CHAIR WITH CASTERS";
      break;
    case "E1035":
      returnvalue = "PATIENT TRANSFER SYSTEM <300";
      break;
    case "E1036":
      returnvalue = "PATIENT TRANSFER SYSTEM >300";
      break;
    case "E1037":
      returnvalue = "TRANSPORT CHAIR, PED SIZE";
      break;
    case "E1038":
      returnvalue = "TRANSPORT CHAIR PT WT<=300LB";
      break;
    case "E1039":
      returnvalue = "TRANSPORT CHAIR PT WT >300LB";
      break;
    case "E1050":
      returnvalue = "WHELCHR FXD FULL LENGTH ARMS";
      break;
    case "E1060":
      returnvalue = "WHEELCHAIR DETACHABLE ARMS";
      break;
    case "E1070":
      returnvalue = "WHEELCHAIR DETACHABLE FOOT R";
      break;
    case "E1083":
      returnvalue = "HEMI-WHEELCHAIR FIXED ARMS";
      break;
    case "E1084":
      returnvalue = "HEMI-WHEELCHAIR DETACHABLE A";
      break;
    case "E1085":
      returnvalue = "HEMI-WHEELCHAIR FIXED ARMS";
      break;
    case "E1086":
      returnvalue = "HEMI-WHEELCHAIR DETACHABLE A";
      break;
    case "E1087":
      returnvalue = "WHEELCHAIR LIGHTWT FIXED ARM";
      break;
    case "E1088":
      returnvalue = "WHEELCHAIR LIGHTWEIGHT DET A";
      break;
    case "E1089":
      returnvalue = "WHEELCHAIR LIGHTWT FIXED ARM";
      break;
    case "E1090":
      returnvalue = "WHEELCHAIR LIGHTWEIGHT DET A";
      break;
    case "E1092":
      returnvalue = "WHEELCHAIR WIDE W/ LEG RESTS";
      break;
    case "E1093":
      returnvalue = "WHEELCHAIR WIDE W/ FOOT REST";
      break;
    case "E1100":
      returnvalue = "WHCHR S-RECL FXD ARM LEG RES";
      break;
    case "E1110":
      returnvalue = "WHEELCHAIR SEMI-RECL DETACH";
      break;
    case "E1130":
      returnvalue = "WHLCHR STAND FXD ARM FT REST";
      break;
    case "E1140":
      returnvalue = "WHEELCHAIR STANDARD DETACH A";
      break;
    case "E1150":
      returnvalue = "WHEELCHAIR STANDARD W/ LEG R";
      break;
    case "E1160":
      returnvalue = "WHEELCHAIR FIXED ARMS";
      break;
    case "E1161":
      returnvalue = "MANUAL ADULT WC W TILTINSPAC";
      break;
    case "E1170":
      returnvalue = "WHLCHR AMPU FXD ARM LEG REST";
      break;
    case "E1171":
      returnvalue = "WHEELCHAIR AMPUTEE W/O LEG R";
      break;
    case "E1172":
      returnvalue = "WHEELCHAIR AMPUTEE DETACH AR";
      break;
    case "E1180":
      returnvalue = "WHEELCHAIR AMPUTEE W/ FOOT R";
      break;
    case "E1190":
      returnvalue = "WHEELCHAIR AMPUTEE W/ LEG RE";
      break;
    case "E1195":
      returnvalue = "WHEELCHAIR AMPUTEE HEAVY DUT";
      break;
    case "E1200":
      returnvalue = "WHEELCHAIR AMPUTEE FIXED ARM";
      break;
    case "E1220":
      returnvalue = "WHLCHR SPECIAL SIZE/CONSTRC";
      break;
    case "E1221":
      returnvalue = "WHEELCHAIR SPEC SIZE W FOOT";
      break;
    case "E1222":
      returnvalue = "WHEELCHAIR SPEC SIZE W/ LEG";
      break;
    case "E1223":
      returnvalue = "WHEELCHAIR SPEC SIZE W FOOT";
      break;
    case "E1224":
      returnvalue = "WHEELCHAIR SPEC SIZE W/ LEG";
      break;
    case "E1225":
      returnvalue = "MANUAL SEMI-RECLINING BACK";
      break;
    case "E1226":
      returnvalue = "MANUAL FULLY RECLINING BACK";
      break;
    case "E1227":
      returnvalue = "WHEELCHAIR SPEC SZ SPEC HT A";
      break;
    case "E1228":
      returnvalue = "WHEELCHAIR SPEC SZ SPEC HT B";
      break;
    case "E1229":
      returnvalue = "PEDIATRIC WHEELCHAIR NOS";
      break;
    case "E1230":
      returnvalue = "POWER OPERATED VEHICLE";
      break;
    case "E1231":
      returnvalue = "RIGID PED W/C TILT-IN-SPACE";
      break;
    case "E1232":
      returnvalue = "FOLDING PED WC TILT-IN-SPACE";
      break;
    case "E1233":
      returnvalue = "RIG PED WC TLTNSPC W/O SEAT";
      break;
    case "E1234":
      returnvalue = "FLD PED WC TLTNSPC W/O SEAT";
      break;
    case "E1235":
      returnvalue = "RIGID PED WC ADJUSTABLE";
      break;
    case "E1236":
      returnvalue = "FOLDING PED WC ADJUSTABLE";
      break;
    case "E1237":
      returnvalue = "RGD PED WC ADJSTABL W/O SEAT";
      break;
    case "E1238":
      returnvalue = "FLD PED WC ADJSTABL W/O SEAT";
      break;
    case "E1239":
      returnvalue = "PED POWER WHEELCHAIR NOS";
      break;
    case "E1240":
      returnvalue = "WHCHR LITWT DET ARM LEG REST";
      break;
    case "E1250":
      returnvalue = "WHEELCHAIR LIGHTWT FIXED ARM";
      break;
    case "E1260":
      returnvalue = "WHEELCHAIR LIGHTWT FOOT REST";
      break;
    case "E1270":
      returnvalue = "WHEELCHAIR LIGHTWEIGHT LEG R";
      break;
    case "E1280":
      returnvalue = "WHCHR H-DUTY DET ARM LEG RES";
      break;
    case "E1285":
      returnvalue = "WHEELCHAIR HEAVY DUTY FIXED";
      break;
    case "E1290":
      returnvalue = "WHEELCHAIR HVY DUTY DETACH A";
      break;
    case "E1295":
      returnvalue = "WHEELCHAIR HEAVY DUTY FIXED";
      break;
    case "E1296":
      returnvalue = "WHEELCHAIR SPECIAL SEAT HEIG";
      break;
    case "E1297":
      returnvalue = "WHEELCHAIR SPECIAL SEAT DEPT";
      break;
    case "E1298":
      returnvalue = "WHEELCHAIR SPEC SEAT DEPTH/W";
      break;
    case "E1300":
      returnvalue = "WHIRLPOOL PORTABLE";
      break;
    case "E1310":
      returnvalue = "WHIRLPOOL NON-PORTABLE";
      break;
    case "E1340":
      returnvalue = "REPAIR FOR DME, PER 15 MIN";
      break;
    case "E1353":
      returnvalue = "OXYGEN SUPPLIES REGULATOR";
      break;
    case "E1354":
      returnvalue = "WHEELED CART, PORT CYL/CONC";
      break;
    case "E1355":
      returnvalue = "OXYGEN SUPPLIES STAND/RACK";
      break;
    case "E1356":
      returnvalue = "BATT PACK/CART, PORT CONC";
      break;
    case "E1357":
      returnvalue = "BATTERY CHARGER, PORT CONC";
      break;
    case "E1358":
      returnvalue = "DC POWER ADAPTER, PORT CONC";
      break;
    case "E1372":
      returnvalue = "OXY SUPPL HEATER FOR NEBULIZ";
      break;
    case "E1390":
      returnvalue = "OXYGEN CONCENTRATOR";
      break;
    case "E1391":
      returnvalue = "OXYGEN CONCENTRATOR, DUAL";
      break;
    case "E1392":
      returnvalue = "PORTABLE OXYGEN CONCENTRATOR";
      break;
    case "E1399":
      returnvalue = "DURABLE MEDICAL EQUIPMENT MI";
      break;
    case "E1405":
      returnvalue = "O2/WATER VAPOR ENRICH W/HEAT";
      break;
    case "E1406":
      returnvalue = "O2/WATER VAPOR ENRICH W/O HE";
      break;
    case "E1500":
      returnvalue = "CENTRIFUGE";
      break;
    case "E1510":
      returnvalue = "KIDNEY DIALYSATE DELIVRY SYS";
      break;
    case "E1520":
      returnvalue = "HEPARIN INFUSION PUMP";
      break;
    case "E1530":
      returnvalue = "REPLACEMENT AIR BUBBLE DETEC";
      break;
    case "E1540":
      returnvalue = "REPLACEMENT PRESSURE ALARM";
      break;
    case "E1550":
      returnvalue = "BATH CONDUCTIVITY METER";
      break;
    case "E1560":
      returnvalue = "REPLACE BLOOD LEAK DETECTOR";
      break;
    case "E1570":
      returnvalue = "ADJUSTABLE CHAIR FOR ESRD PT";
      break;
    case "E1575":
      returnvalue = "TRANSDUCER PROTECT/FLD BAR";
      break;
    case "E1580":
      returnvalue = "UNIPUNCTURE CONTROL SYSTEM";
      break;
    case "E1590":
      returnvalue = "HEMODIALYSIS MACHINE";
      break;
    case "E1592":
      returnvalue = "AUTO INTERM PERITONEAL DIALY";
      break;
    case "E1594":
      returnvalue = "CYCLER DIALYSIS MACHINE";
      break;
    case "E1600":
      returnvalue = "DELI/INSTALL CHRG HEMO EQUIP";
      break;
    case "E1610":
      returnvalue = "REVERSE OSMOSIS H2O PURI SYS";
      break;
    case "E1615":
      returnvalue = "DEIONIZER H2O PURI SYSTEM";
      break;
    case "E1620":
      returnvalue = "REPLACEMENT BLOOD PUMP";
      break;
    case "E1625":
      returnvalue = "WATER SOFTENING SYSTEM";
      break;
    case "E1630":
      returnvalue = "RECIPROCATING PERITONEAL DIA";
      break;
    case "E1632":
      returnvalue = "WEARABLE ARTIFICIAL KIDNEY";
      break;
    case "E1634":
      returnvalue = "PERITONEAL DIALYSIS CLAMP";
      break;
    case "E1635":
      returnvalue = "COMPACT TRAVEL HEMODIALYZER";
      break;
    case "E1636":
      returnvalue = "SORBENT CARTRIDGES PER 10";
      break;
    case "E1637":
      returnvalue = "HEMOSTATS FOR DIALYSIS, EACH";
      break;
    case "E1639":
      returnvalue = "DIALYSIS SCALE";
      break;
    case "E1699":
      returnvalue = "DIALYSIS EQUIPMENT NOC";
      break;
    case "E1700":
      returnvalue = "JAW MOTION REHAB SYSTEM";
      break;
    case "E1701":
      returnvalue = "REPL CUSHIONS FOR JAW MOTION";
      break;
    case "E1702":
      returnvalue = "REPL MEASR SCALES JAW MOTION";
      break;
    case "E1800":
      returnvalue = "ADJUST ELBOW EXT/FLEX DEVICE";
      break;
    case "E1801":
      returnvalue = "SPS ELBOW DEVICE";
      break;
    case "E1802":
      returnvalue = "ADJST FOREARM PRO/SUP DEVICE";
      break;
    case "E1805":
      returnvalue = "ADJUST WRIST EXT/FLEX DEVICE";
      break;
    case "E1806":
      returnvalue = "SPS WRIST DEVICE";
      break;
    case "E1810":
      returnvalue = "ADJUST KNEE EXT/FLEX DEVICE";
      break;
    case "E1811":
      returnvalue = "SPS KNEE DEVICE";
      break;
    case "E1812":
      returnvalue = "KNEE EXT/FLEX W ACT RES CTRL";
      break;
    case "E1815":
      returnvalue = "ADJUST ANKLE EXT/FLEX DEVICE";
      break;
    case "E1816":
      returnvalue = "SPS ANKLE DEVICE";
      break;
    case "E1818":
      returnvalue = "SPS FOREARM DEVICE";
      break;
    case "E1820":
      returnvalue = "SOFT INTERFACE MATERIAL";
      break;
    case "E1821":
      returnvalue = "REPLACEMENT INTERFACE SPSD";
      break;
    case "E1825":
      returnvalue = "ADJUST FINGER EXT/FLEX DEVC";
      break;
    case "E1830":
      returnvalue = "ADJUST TOE EXT/FLEX DEVICE";
      break;
    case "E1840":
      returnvalue = "ADJ SHOULDER EXT/FLEX DEVICE";
      break;
    case "E1841":
      returnvalue = "STATIC STR SHLDR DEV ROM ADJ";
      break;
    case "E1902":
      returnvalue = "AAC NON-ELECTRONIC BOARD";
      break;
    case "E2000":
      returnvalue = "GASTRIC SUCTION PUMP HME MDL";
      break;
    case "E2100":
      returnvalue = "BLD GLUCOSE MONITOR W VOICE";
      break;
    case "E2101":
      returnvalue = "BLD GLUCOSE MONITOR W LANCE";
      break;
    case "E2120":
      returnvalue = "PULSE GEN SYS TX ENDOLYMP FL";
      break;
    case "E2201":
      returnvalue = "MAN W/CH ACC SEAT W>=20?<24?";
      break;
    case "E2202":
      returnvalue = "SEAT WIDTH 24-27 IN";
      break;
    case "E2203":
      returnvalue = "FRAME DEPTH LESS THAN 22 IN";
      break;
    case "E2204":
      returnvalue = "FRAME DEPTH 22 TO 25 IN";
      break;
    case "E2205":
      returnvalue = "MANUAL WC ACCESSORY, HANDRIM";
      break;
    case "E2206":
      returnvalue = "COMPLETE WHEEL LOCK ASSEMBLY";
      break;
    case "E2207":
      returnvalue = "CRUTCH AND CANE HOLDER";
      break;
    case "E2208":
      returnvalue = "CYLINDER TANK CARRIER";
      break;
    case "E2209":
      returnvalue = "ARM TROUGH EACH";
      break;
    case "E2210":
      returnvalue = "WHEELCHAIR BEARINGS";
      break;
    case "E2211":
      returnvalue = "PNEUMATIC PROPULSION TIRE";
      break;
    case "E2212":
      returnvalue = "PNEUMATIC PROP TIRE TUBE";
      break;
    case "E2213":
      returnvalue = "PNEUMATIC PROP TIRE INSERT";
      break;
    case "E2214":
      returnvalue = "PNEUMATIC CASTER TIRE EACH";
      break;
    case "E2215":
      returnvalue = "PNEUMATIC CASTER TIRE TUBE";
      break;
    case "E2216":
      returnvalue = "FOAM FILLED PROPULSION TIRE";
      break;
    case "E2217":
      returnvalue = "FOAM FILLED CASTER TIRE EACH";
      break;
    case "E2218":
      returnvalue = "FOAM PROPULSION TIRE EACH";
      break;
    case "E2219":
      returnvalue = "FOAM CASTER TIRE ANY SIZE EA";
      break;
    case "E2220":
      returnvalue = "SOLID PROPULSION TIRE EACH";
      break;
    case "E2221":
      returnvalue = "SOLID CASTER TIRE EACH";
      break;
    case "E2222":
      returnvalue = "SOLID CASTER INTEGRATED WHL";
      break;
    case "E2223":
      returnvalue = "VALVE REPLACEMENT ONLY EACH";
      break;
    case "E2224":
      returnvalue = "PROPULSION WHL EXCLUDES TIRE";
      break;
    case "E2225":
      returnvalue = "CASTER WHEEL EXCLUDES TIRE";
      break;
    case "E2226":
      returnvalue = "CASTER FORK REPLACEMENT ONLY";
      break;
    case "E2227":
      returnvalue = "GEAR REDUCTION DRIVE WHEEL";
      break;
    case "E2228":
      returnvalue = "MWC ACC, WHEELCHAIR BRAKE";
      break;
    case "E2230":
      returnvalue = "MANUAL STANDING SYSTEM";
      break;
    case "E2231":
      returnvalue = "SOLID SEAT SUPPORT BASE";
      break;
    case "E2291":
      returnvalue = "PLANAR BACK FOR PED SIZE WC";
      break;
    case "E2292":
      returnvalue = "PLANAR SEAT FOR PED SIZE WC";
      break;
    case "E2293":
      returnvalue = "CONTOUR BACK FOR PED SIZE WC";
      break;
    case "E2294":
      returnvalue = "CONTOUR SEAT FOR PED SIZE WC";
      break;
    case "E2295":
      returnvalue = "PED DYNAMIC SEATING FRAME";
      break;
    case "E2300":
      returnvalue = "PWR SEAT ELEVATION SYS";
      break;
    case "E2301":
      returnvalue = "PWR STANDING";
      break;
    case "E2310":
      returnvalue = "ELECTRO CONNECT BTW CONTROL";
      break;
    case "E2311":
      returnvalue = "ELECTRO CONNECT BTW 2 SYS";
      break;
    case "E2312":
      returnvalue = "MINI-PROP REMOTE JOYSTICK";
      break;
    case "E2313":
      returnvalue = "PWC HARNESS, EXPAND CONTROL";
      break;
    case "E2320":
      returnvalue = "HAND CHIN CONTROL";
      break;
    case "E2321":
      returnvalue = "HAND INTERFACE JOYSTICK";
      break;
    case "E2322":
      returnvalue = "MULT MECH SWITCHES";
      break;
    case "E2323":
      returnvalue = "SPECIAL JOYSTICK HANDLE";
      break;
    case "E2324":
      returnvalue = "CHIN CUP INTERFACE";
      break;
    case "E2325":
      returnvalue = "SIP AND PUFF INTERFACE";
      break;
    case "E2326":
      returnvalue = "BREATH TUBE KIT";
      break;
    case "E2327":
      returnvalue = "HEAD CONTROL INTERFACE MECH";
      break;
    case "E2328":
      returnvalue = "HEAD/EXTREMITY CONTROL INTER";
      break;
    case "E2329":
      returnvalue = "HEAD CONTROL NONPROPORTIONAL";
      break;
    case "E2330":
      returnvalue = "HEAD CONTROL PROXIMITY SWITC";
      break;
    case "E2331":
      returnvalue = "ATTENDANT CONTROL";
      break;
    case "E2340":
      returnvalue = "W/C WDTH 20-23 IN SEAT FRAME";
      break;
    case "E2341":
      returnvalue = "W/C WDTH 24-27 IN SEAT FRAME";
      break;
    case "E2342":
      returnvalue = "W/C DPTH 20-21 IN SEAT FRAME";
      break;
    case "E2343":
      returnvalue = "W/C DPTH 22-25 IN SEAT FRAME";
      break;
    case "E2351":
      returnvalue = "ELECTRONIC SGD INTERFACE";
      break;
    case "E2360":
      returnvalue = "22NF NONSEALED LEADACID";
      break;
    case "E2361":
      returnvalue = "22NF SEALED LEADACID BATTERY";
      break;
    case "E2362":
      returnvalue = "GR24 NONSEALED LEADACID";
      break;
    case "E2363":
      returnvalue = "GR24 SEALED LEADACID BATTERY";
      break;
    case "E2364":
      returnvalue = "U1NONSEALED LEADACID BATTERY";
      break;
    case "E2365":
      returnvalue = "U1 SEALED LEADACID BATTERY";
      break;
    case "E2366":
      returnvalue = "BATTERY CHARGER, SINGLE MODE";
      break;
    case "E2367":
      returnvalue = "BATTERY CHARGER, DUAL MODE";
      break;
    case "E2368":
      returnvalue = "POWER WC MOTOR REPLACEMENT";
      break;
    case "E2369":
      returnvalue = "PWR WC GEAR BOX REPLACEMENT";
      break;
    case "E2370":
      returnvalue = "PWR WC MOTOR/GEAR BOX COMBO";
      break;
    case "E2371":
      returnvalue = "GR27 SEALED LEADACID BATTERY";
      break;
    case "E2372":
      returnvalue = "GR27 NON-SEALED LEADACID";
      break;
    case "E2373":
      returnvalue = "HAND/CHIN CTRL SPEC JOYSTICK";
      break;
    case "E2374":
      returnvalue = "HAND/CHIN CTRL STD JOYSTICK";
      break;
    case "E2375":
      returnvalue = "NON-EXPANDABLE CONTROLLER";
      break;
    case "E2376":
      returnvalue = "EXPANDABLE CONTROLLER, REPL";
      break;
    case "E2377":
      returnvalue = "EXPANDABLE CONTROLLER, INITL";
      break;
    case "E2381":
      returnvalue = "PNEUM DRIVE WHEEL TIRE";
      break;
    case "E2382":
      returnvalue = "TUBE, PNEUM WHEEL DRIVE TIRE";
      break;
    case "E2383":
      returnvalue = "INSERT, PNEUM WHEEL DRIVE";
      break;
    case "E2384":
      returnvalue = "PNEUMATIC CASTER TIRE";
      break;
    case "E2385":
      returnvalue = "TUBE, PNEUMATIC CASTER TIRE";
      break;
    case "E2386":
      returnvalue = "FOAM FILLED DRIVE WHEEL TIRE";
      break;
    case "E2387":
      returnvalue = "FOAM FILLED CASTER TIRE";
      break;
    case "E2388":
      returnvalue = "FOAM DRIVE WHEEL TIRE";
      break;
    case "E2389":
      returnvalue = "FOAM CASTER TIRE";
      break;
    case "E2390":
      returnvalue = "SOLID DRIVE WHEEL TIRE";
      break;
    case "E2391":
      returnvalue = "SOLID CASTER TIRE";
      break;
    case "E2392":
      returnvalue = "SOLID CASTER TIRE, INTEGRATE";
      break;
    case "E2393":
      returnvalue = "VALVE, PNEUMATIC TIRE TUBE";
      break;
    case "E2394":
      returnvalue = "DRIVE WHEEL EXCLUDES TIRE";
      break;
    case "E2395":
      returnvalue = "CASTER WHEEL EXCLUDES TIRE";
      break;
    case "E2396":
      returnvalue = "CASTER FORK";
      break;
    case "E2397":
      returnvalue = "PWC ACC, LITH-BASED BATTERY";
      break;
    case "E2399":
      returnvalue = "NOC INTERFACE";
      break;
    case "E2402":
      returnvalue = "NEG PRESS WOUND THERAPY PUMP";
      break;
    case "E2500":
      returnvalue = "SGD DIGITIZED PRE-REC <=8MIN";
      break;
    case "E2502":
      returnvalue = "SGD PREREC MSG >8MIN <=20MIN";
      break;
    case "E2504":
      returnvalue = "SGD PREREC MSG>20MIN <=40MIN";
      break;
    case "E2506":
      returnvalue = "SGD PREREC MSG > 40 MIN";
      break;
    case "E2508":
      returnvalue = "SGD SPELLING PHYS CONTACT";
      break;
    case "E2510":
      returnvalue = "SGD W MULTI METHODS MSG/ACCS";
      break;
    case "E2511":
      returnvalue = "SGD SFTWRE PRGRM FOR PC/PDA";
      break;
    case "E2512":
      returnvalue = "SGD ACCESSORY, MOUNTING SYS";
      break;
    case "E2599":
      returnvalue = "SGD ACCESSORY NOC";
      break;
    case "E2601":
      returnvalue = "GEN W/C CUSHION WDTH < 22 IN";
      break;
    case "E2602":
      returnvalue = "GEN W/C CUSHION WDTH >=22 IN";
      break;
    case "E2603":
      returnvalue = "SKIN PROTECT WC CUS WD <22IN";
      break;
    case "E2604":
      returnvalue = "SKIN PROTECT WC CUS WD>=22IN";
      break;
    case "E2605":
      returnvalue = "POSITION WC CUSH WDTH <22 IN";
      break;
    case "E2606":
      returnvalue = "POSITION WC CUSH WDTH>=22 IN";
      break;
    case "E2607":
      returnvalue = "SKIN PRO/POS WC CUS WD <22IN";
      break;
    case "E2608":
      returnvalue = "SKIN PRO/POS WC CUS WD>=22IN";
      break;
    case "E2609":
      returnvalue = "CUSTOM FABRICATE W/C CUSHION";
      break;
    case "E2610":
      returnvalue = "POWERED W/C CUSHION";
      break;
    case "E2611":
      returnvalue = "GEN USE BACK CUSH WDTH <22IN";
      break;
    case "E2612":
      returnvalue = "GEN USE BACK CUSH WDTH>=22IN";
      break;
    case "E2613":
      returnvalue = "POSITION BACK CUSH WD <22IN";
      break;
    case "E2614":
      returnvalue = "POSITION BACK CUSH WD>=22IN";
      break;
    case "E2615":
      returnvalue = "POS BACK POST/LAT WDTH <22IN";
      break;
    case "E2616":
      returnvalue = "POS BACK POST/LAT WDTH>=22IN";
      break;
    case "E2617":
      returnvalue = "CUSTOM FAB W/C BACK CUSHION";
      break;
    case "E2618":
      returnvalue = "WC ACC SOLID SEAT SUPP BASE";
      break;
    case "E2619":
      returnvalue = "REPLACE COVER W/C SEAT CUSH";
      break;
    case "E2620":
      returnvalue = "WC PLANAR BACK CUSH WD <22IN";
      break;
    case "E2621":
      returnvalue = "WC PLANAR BACK CUSH WD>=22IN";
      break;
    case "E8000":
      returnvalue = "POSTERIOR GAIT TRAINER";
      break;
    case "E8001":
      returnvalue = "UPRIGHT GAIT TRAINER";
      break;
    case "E8002":
      returnvalue = "ANTERIOR GAIT TRAINER";
      break;
    case "G0008":
      returnvalue = "ADMIN INFLUENZA VIRUS VAC";
      break;
    case "G0009":
      returnvalue = "ADMIN PNEUMOCOCCAL VACCINE";
      break;
    case "G0010":
      returnvalue = "ADMIN HEPATITIS B VACCINE";
      break;
    case "G0027":
      returnvalue = "SEMEN ANALYSIS";
      break;
    case "G0101":
      returnvalue = "CA SCREEN;PELVIC/BREAST EXAM";
      break;
    case "G0102":
      returnvalue = "PROSTATE CA SCREENING; DRE";
      break;
    case "G0103":
      returnvalue = "PSA SCREENING";
      break;
    case "G0104":
      returnvalue = "CA SCREEN;FLEXI SIGMOIDSCOPE";
      break;
    case "G0105":
      returnvalue = "COLORECTAL SCRN; HI RISK IND";
      break;
    case "G0106":
      returnvalue = "COLON CA SCREEN;BARIUM ENEMA";
      break;
    case "G0107":
      returnvalue = "CA SCREEN; FECAL BLOOD TEST";
      break;
    case "G0108":
      returnvalue = "DIAB MANAGE TRN  PER INDIV";
      break;
    case "G0109":
      returnvalue = "DIAB MANAGE TRN IND/GROUP";
      break;
    case "G0117":
      returnvalue = "GLAUCOMA SCRN HGH RISK DIREC";
      break;
    case "G0118":
      returnvalue = "GLAUCOMA SCRN HGH RISK DIREC";
      break;
    case "G0120":
      returnvalue = "COLON CA SCRN; BARIUM ENEMA";
      break;
    case "G0121":
      returnvalue = "COLON CA SCRN NOT HI RSK IND";
      break;
    case "G0122":
      returnvalue = "COLON CA SCRN; BARIUM ENEMA";
      break;
    case "G0123":
      returnvalue = "SCREEN CERV/VAG THIN LAYER";
      break;
    case "G0124":
      returnvalue = "SCREEN C/V THIN LAYER BY MD";
      break;
    case "G0127":
      returnvalue = "TRIM NAIL(S)";
      break;
    case "G0128":
      returnvalue = "CORF SKILLED NURSING SERVICE";
      break;
    case "G0129":
      returnvalue = "PARTIAL HOSP PROG SERVICE";
      break;
    case "G0130":
      returnvalue = "SINGLE ENERGY X-RAY STUDY";
      break;
    case "G0141":
      returnvalue = "SCR C/V CYTO,AUTOSYS AND MD";
      break;
    case "G0143":
      returnvalue = "SCR C/V CYTO,THINLAYER,RESCR";
      break;
    case "G0144":
      returnvalue = "SCR C/V CYTO,THINLAYER,RESCR";
      break;
    case "G0145":
      returnvalue = "SCR C/V CYTO,THINLAYER,RESCR";
      break;
    case "G0147":
      returnvalue = "SCR C/V CYTO, AUTOMATED SYS";
      break;
    case "G0148":
      returnvalue = "SCR C/V CYTO, AUTOSYS, RESCR";
      break;
    case "G0151":
      returnvalue = "HHCP-SERV OF PT,EA 15 MIN";
      break;
    case "G0152":
      returnvalue = "HHCP-SERV OF OT,EA 15 MIN";
      break;
    case "G0153":
      returnvalue = "HHCP-SVS OF S/L PATH,EA 15MN";
      break;
    case "G0154":
      returnvalue = "HHCP-SVS OF RN,EA 15 MIN";
      break;
    case "G0155":
      returnvalue = "HHCP-SVS OF CSW,EA 15 MIN";
      break;
    case "G0156":
      returnvalue = "HHCP-SVS OF AIDE,EA 15 MIN";
      break;
    case "G0166":
      returnvalue = "EXTRNL COUNTERPULSE, PER TX";
      break;
    case "G0168":
      returnvalue = "WOUND CLOSURE BY ADHESIVE";
      break;
    case "G0173":
      returnvalue = "LINEAR ACC STEREO RADSUR COM";
      break;
    case "G0175":
      returnvalue = "OPPS SERVICE,SCHED TEAM CONF";
      break;
    case "G0176":
      returnvalue = "OPPS/PHP;ACTIVITY THERAPY";
      break;
    case "G0177":
      returnvalue = "OPPS/PHP; TRAIN & EDUC SERV";
      break;
    case "G0179":
      returnvalue = "MD RECERTIFICATION HHA PT";
      break;
    case "G0180":
      returnvalue = "MD CERTIFICATION HHA PATIENT";
      break;
    case "G0181":
      returnvalue = "HOME HEALTH CARE SUPERVISION";
      break;
    case "G0182":
      returnvalue = "HOSPICE CARE SUPERVISION";
      break;
    case "G0186":
      returnvalue = "DSTRY EYE LESN,FDR VSSL TECH";
      break;
    case "G0202":
      returnvalue = "SCREENINGMAMMOGRAPHYDIGITAL";
      break;
    case "G0204":
      returnvalue = "DIAGNOSTICMAMMOGRAPHYDIGITAL";
      break;
    case "G0206":
      returnvalue = "DIAGNOSTICMAMMOGRAPHYDIGITAL";
      break;
    case "G0219":
      returnvalue = "PET IMG WHOLBOD MELANO NONCO";
      break;
    case "G0235":
      returnvalue = "PET NOT OTHERWISE SPECIFIED";
      break;
    case "G0237":
      returnvalue = "THERAPEUTIC PROCD STRG ENDUR";
      break;
    case "G0238":
      returnvalue = "OTH RESP PROC, INDIV";
      break;
    case "G0239":
      returnvalue = "OTH RESP PROC, GROUP";
      break;
    case "G0243":
      returnvalue = "MULTISOUR PHOTON STERO TREAT";
      break;
    case "G0245":
      returnvalue = "INITIAL FOOT EXAM PT LOPS";
      break;
    case "G0246":
      returnvalue = "FOLLOWUP EVAL OF FOOT PT LOP";
      break;
    case "G0247":
      returnvalue = "ROUTINE FOOTCARE PT W LOPS";
      break;
    case "G0248":
      returnvalue = "DEMONSTRATE USE HOME INR MON";
      break;
    case "G0249":
      returnvalue = "PROVIDE INR TEST MATER/EQUIP";
      break;
    case "G0250":
      returnvalue = "MD INR TEST REVIE INTER MGMT";
      break;
    case "G0251":
      returnvalue = "LINEAR ACC BASED STERO RADIO";
      break;
    case "G0252":
      returnvalue = "PET IMAGING INITIAL DX";
      break;
    case "G0255":
      returnvalue = "CURRENT PERCEP THRESHOLD TST";
      break;
    case "G0257":
      returnvalue = "UNSCHED DIALYSIS ESRD PT HOS";
      break;
    case "G0259":
      returnvalue = "INJECT FOR SACROILIAC JOINT";
      break;
    case "G0260":
      returnvalue = "INJ FOR SACROILIAC JT ANESTH";
      break;
    case "G0265":
      returnvalue = "CRYOPRESEVATION FREEZE+STORA";
      break;
    case "G0266":
      returnvalue = "THAWING + EXPANSION FROZ CEL";
      break;
    case "G0267":
      returnvalue = "BONE MARROW OR PSC HARVEST";
      break;
    case "G0268":
      returnvalue = "REMOVAL OF IMPACTED WAX MD";
      break;
    case "G0269":
      returnvalue = "OCCLUSIVE DEVICE IN VEIN ART";
      break;
    case "G0270":
      returnvalue = "MNT SUBS TX FOR CHANGE DX";
      break;
    case "G0271":
      returnvalue = "GROUP MNT 2 OR MORE 30 MINS";
      break;
    case "G0275":
      returnvalue = "RENAL ANGIO, CARDIAC CATH";
      break;
    case "G0278":
      returnvalue = "ILIAC ART ANGIO,CARDIAC CATH";
      break;
    case "G0281":
      returnvalue = "ELEC STIM UNATTEND FOR PRESS";
      break;
    case "G0282":
      returnvalue = "ELECT STIM WOUND CARE NOT PD";
      break;
    case "G0283":
      returnvalue = "ELEC STIM OTHER THAN WOUND";
      break;
    case "G0288":
      returnvalue = "RECON, CTA FOR SURG PLAN";
      break;
    case "G0289":
      returnvalue = "ARTHRO, LOOSE BODY + CHONDRO";
      break;
    case "G0290":
      returnvalue = "DRUG-ELUTING STENTS, SINGLE";
      break;
    case "G0291":
      returnvalue = "DRUG-ELUTING STENTS,EACH ADD";
      break;
    case "G0293":
      returnvalue = "NON-COV SURG PROC,CLIN TRIAL";
      break;
    case "G0294":
      returnvalue = "NON-COV PROC, CLINICAL TRIAL";
      break;
    case "G0295":
      returnvalue = "ELECTROMAGNETIC THERAPY ONC";
      break;
    case "G0297":
      returnvalue = "INSERT SINGLE CHAMBER/CD";
      break;
    case "G0298":
      returnvalue = "INSERT DUAL CHAMBER/CD";
      break;
    case "G0299":
      returnvalue = "INSER/REPOS SINGLE ICD+LEADS";
      break;
    case "G0300":
      returnvalue = "INSERT REPOSIT LEAD DUAL+GEN";
      break;
    case "G0302":
      returnvalue = "PRE-OP SERVICE LVRS COMPLETE";
      break;
    case "G0303":
      returnvalue = "PRE-OP SERVICE LVRS 10-15DOS";
      break;
    case "G0304":
      returnvalue = "PRE-OP SERVICE LVRS 1-9 DOS";
      break;
    case "G0305":
      returnvalue = "POST OP SERVICE LVRS MIN 6";
      break;
    case "G0306":
      returnvalue = "CBC/DIFFWBC W/O PLATELET";
      break;
    case "G0307":
      returnvalue = "CBC WITHOUT PLATELET";
      break;
    case "G0308":
      returnvalue = "ESRD RELATED SVC 4+MO < 2YRS";
      break;
    case "G0309":
      returnvalue = "ESRD RELATED SVC 2-3MO <2YRS";
      break;
    case "G0310":
      returnvalue = "ESRD RELATED SVC 1 VST <2YRS";
      break;
    case "G0311":
      returnvalue = "ESRD RELATED SVS 4+MO 2-11YR";
      break;
    case "G0312":
      returnvalue = "ESRD RELATE SVS 2-3 MO 2-11Y";
      break;
    case "G0313":
      returnvalue = "ESRD RELATED SVS 1 MON 2-11Y";
      break;
    case "G0314":
      returnvalue = "ESRD RELATED SVS 4+ MO 12-19";
      break;
    case "G0315":
      returnvalue = "ESRD RELATED SVS 2-3MO/12-19";
      break;
    case "G0316":
      returnvalue = "ESRD RELATED SVS 1VIS/12-19Y";
      break;
    case "G0317":
      returnvalue = "ESRD RELATED SVS 4+MO 20+YRS";
      break;
    case "G0318":
      returnvalue = "ESRD RELATED SVS 2-3 MO 20+Y";
      break;
    case "G0319":
      returnvalue = "ESRD RELATED SVS 1VISIT 20+Y";
      break;
    case "G0320":
      returnvalue = "ESD RELATED SVS HOME UNDR 2";
      break;
    case "G0321":
      returnvalue = "ESRDRELATEDSVS HOME MO 2-11Y";
      break;
    case "G0322":
      returnvalue = "ESRD RELATED SVS HOM MO12-19";
      break;
    case "G0323":
      returnvalue = "ESRD RELATED SVS HOME MO 20+";
      break;
    case "G0324":
      returnvalue = "ESRD RELATED SERV/DY, 2Y";
      break;
    case "G0325":
      returnvalue = "ESRD RELATE SERV/DY 2-11YR";
      break;
    case "G0326":
      returnvalue = "ESRD RELATE SERV/DY 12-19Y";
      break;
    case "G0327":
      returnvalue = "ESRD RELATE SERV/DY 20+YRS";
      break;
    case "G0328":
      returnvalue = "FECAL BLOOD SCRN IMMUNOASSAY";
      break;
    case "G0329":
      returnvalue = "ELECTROMAGNTIC TX FOR ULCERS";
      break;
    case "G0332":
      returnvalue = "PREADMIN IV IMMUNOGLOBULIN";
      break;
    case "G0333":
      returnvalue = "DISPENSE FEE INITIAL 30 DAY";
      break;
    case "G0337":
      returnvalue = "HOSPICE EVALUATION PREELECTI";
      break;
    case "G0339":
      returnvalue = "ROBOT LIN-RADSURG COM, FIRST";
      break;
    case "G0340":
      returnvalue = "ROBT LIN-RADSURG FRACTX 2-5";
      break;
    case "G0341":
      returnvalue = "PERCUTANEOUS ISLET CELLTRANS";
      break;
    case "G0342":
      returnvalue = "LAPAROSCOPY ISLET CELL TRANS";
      break;
    case "G0343":
      returnvalue = "LAPAROTOMY ISLET CELL TRANSP";
      break;
    case "G0344":
      returnvalue = "INITIAL PREVENTIVE EXAM";
      break;
    case "G0364":
      returnvalue = "BONE MARROW ASPIRATE &BIOPSY";
      break;
    case "G0365":
      returnvalue = "VESSEL MAPPING HEMO ACCESS";
      break;
    case "G0366":
      returnvalue = "EKG FOR INITIAL PREVENT EXAM";
      break;
    case "G0367":
      returnvalue = "EKG TRACING FOR INITIAL PREV";
      break;
    case "G0368":
      returnvalue = "EKG INTERPRET & REPORT PREVE";
      break;
    case "G0372":
      returnvalue = "MD SERVICE REQUIRED FOR PMD";
      break;
    case "G0375":
      returnvalue = "SMOKE/TOBACCO COUNSELNG 3-10";
      break;
    case "G0376":
      returnvalue = "SMOKE/TOBACCO COUNSELING >10";
      break;
    case "G0377":
      returnvalue = "ADMINISTRA PART D VACCINE";
      break;
    case "G0378":
      returnvalue = "HOSPITAL OBSERVATION PER HR";
      break;
    case "G0379":
      returnvalue = "DIRECT REFER HOSPITAL OBSERV";
      break;
    case "G0380":
      returnvalue = "LEV 1 HOSP TYPE B ED VISIT";
      break;
    case "G0381":
      returnvalue = "LEV 2 HOSP TYPE B ED VISIT";
      break;
    case "G0382":
      returnvalue = "LEV 3 HOSP TYPE B ED VISIT";
      break;
    case "G0383":
      returnvalue = "LEV 4 HOSP TYPE B ED VISIT";
      break;
    case "G0384":
      returnvalue = "LEV 5 HOSP TYPE B ED VISIT";
      break;
    case "G0389":
      returnvalue = "ULTRASOUND EXAM AAA SCREEN";
      break;
    case "G0390":
      returnvalue = "TRAUMA RESPONS W/HOSP CRITI";
      break;
    case "G0392":
      returnvalue = "AV FISTULA OR GRAFT ARTERIAL";
      break;
    case "G0393":
      returnvalue = "AV FISTULA OR GRAFT VENOUS";
      break;
    case "G0394":
      returnvalue = "BLOOD OCCULT TEST,COLORECTAL";
      break;
    case "G0396":
      returnvalue = "ALCOHOL/SUBS INTERV 15-30MN";
      break;
    case "G0397":
      returnvalue = "ALCOHOL/SUBS INTERV >30 MIN";
      break;
    case "G0398":
      returnvalue = "HOME SLEEP TEST/TYPE 2 PORTA";
      break;
    case "G0399":
      returnvalue = "HOME SLEEP TEST/TYPE 3 PORTA";
      break;
    case "G0400":
      returnvalue = "HOME SLEEP TEST/TYPE 4 PORTA";
      break;
    case "G0402":
      returnvalue = "INITIAL PREVENTIVE EXAM";
      break;
    case "G0403":
      returnvalue = "EKG FOR INITIAL PREVENT EXAM";
      break;
    case "G0404":
      returnvalue = "EKG TRACING FOR INITIAL PREV";
      break;
    case "G0405":
      returnvalue = "EKG INTERPRET & REPORT PREVE";
      break;
    case "G0406":
      returnvalue = "TELHEALTH INPT CONSULT 15MIN";
      break;
    case "G0407":
      returnvalue = "TELHEATH INPT CONSULT 25MIN";
      break;
    case "G0408":
      returnvalue = "TELHEALTH INPT CONSULT 35MIN";
      break;
    case "G0409":
      returnvalue = "CORF RELATED SERV 15 MINS EA";
      break;
    case "G0410":
      returnvalue = "GRP PSYCH PARTIAL HOSP 45-50";
      break;
    case "G0411":
      returnvalue = "INTER ACTIVE GRP PSYCH PARTI";
      break;
    case "G0412":
      returnvalue = "OPEN TX ILIAC SPINE UNI/BIL";
      break;
    case "G0413":
      returnvalue = "PELVIC RING FRACTURE UNI/BIL";
      break;
    case "G0414":
      returnvalue = "PELVIC RING FX TREAT INT FIX";
      break;
    case "G0415":
      returnvalue = "OPEN TX POST PELVIC FXCTURE";
      break;
    case "G0416":
      returnvalue = "SAT BIOPSY PROSTATE 1-20 SPC";
      break;
    case "G0417":
      returnvalue = "SAT BIOPSY PROSTATE 21-40";
      break;
    case "G0418":
      returnvalue = "SAT BIOPSY PROSTATE 41-60";
      break;
    case "G0419":
      returnvalue = "SAT BIOPSY PROSTATE: >60";
      break;
    case "G0420":
      returnvalue = "ED SVC CKD IND PER SESSION";
      break;
    case "G0421":
      returnvalue = "ED SVC CKD GRP PER SESSION";
      break;
    case "G0422":
      returnvalue = "INTENS CARDIAC REHAB W/EXERC";
      break;
    case "G0423":
      returnvalue = "INTENS CARDIAC REHAB NO EXER";
      break;
    case "G0424":
      returnvalue = "PULMONARY REHAB W EXER";
      break;
    case "G0425":
      returnvalue = "INPT TELEHEALTH CONSULT 30M";
      break;
    case "G0426":
      returnvalue = "INPT TELEHEALTH CONSULT 50M";
      break;
    case "G0427":
      returnvalue = "INPT TELEHEALTH CON 70/>M";
      break;
    case "G0430":
      returnvalue = "DRUG SCREEN MULTI CLASS";
      break;
    case "G0431":
      returnvalue = "DRUG SCREEN SINGLE CLASS";
      break;
    case "G3001":
      returnvalue = "ADMIN + SUPPLY, TOSITUMOMAB";
      break;
    case "G8006":
      returnvalue = "AMI PT RECD ASPIRIN AT ARRIV";
      break;
    case "G8007":
      returnvalue = "AMI PT DID NOT RECEIV ASPIRI";
      break;
    case "G8008":
      returnvalue = "AMI PT INELIGIBLE FOR ASPIRI";
      break;
    case "G8009":
      returnvalue = "AMI PT RECD BBLOCK AT ARR";
      break;
    case "G8010":
      returnvalue = "AMI PT DID NOT REC BBLOCK";
      break;
    case "G8011":
      returnvalue = "AMI PT INELIG BBLOC AT ARRIV";
      break;
    case "G8012":
      returnvalue = "PNEUM PT RECV ANTIBIOTIC 4 H";
      break;
    case "G8013":
      returnvalue = "PNEUM PT W/O ANTIBIOTIC 4 HR";
      break;
    case "G8014":
      returnvalue = "PNEUM PT NOT ELIG ANTIBIOTIC";
      break;
    case "G8015":
      returnvalue = "DIABETIC PT W/ HBA1C>9%";
      break;
    case "G8016":
      returnvalue = "DIABETIC PT W/ HBA1C<OR=9%";
      break;
    case "G8017":
      returnvalue = "DM PT INELIG FOR HBA1C MEASU";
      break;
    case "G8018":
      returnvalue = "CARE NOT PROVIDED FOR HBA1C";
      break;
    case "G8019":
      returnvalue = "DIABETIC PT W/LDL>= 100MG/DL";
      break;
    case "G8020":
      returnvalue = "DIAB PT W/LDL< 100MG/DL";
      break;
    case "G8021":
      returnvalue = "DIAB PT INELIG FOR LDL MEAS";
      break;
    case "G8022":
      returnvalue = "CARE NOT PROVIDED FOR LDL";
      break;
    case "G8023":
      returnvalue = "DM PT W BP>=140/80";
      break;
    case "G8024":
      returnvalue = "DIABETIC PT WBP<140/80";
      break;
    case "G8025":
      returnvalue = "DIABETIC PT INELIG FOR BP ME";
      break;
    case "G8026":
      returnvalue = "DIABET PT W NO CARE RE BP ME";
      break;
    case "G8027":
      returnvalue = "HF P W/LVSD ON ACE-I/ARB";
      break;
    case "G8028":
      returnvalue = "HF PT W/LVSD NOT ON ACE-I/AR";
      break;
    case "G8029":
      returnvalue = "HF PT NOT ELIG FOR ACE-I/ARB";
      break;
    case "G8030":
      returnvalue = "HF PT W/LVSD ON BBLOCKER";
      break;
    case "G8031":
      returnvalue = "HF PT W/LVSD NOT ON BBLOCKER";
      break;
    case "G8032":
      returnvalue = "HF PT NOT ELIG FOR BBLOCKER";
      break;
    case "G8033":
      returnvalue = "PMI-CAD PT ON BBLOCKER";
      break;
    case "G8034":
      returnvalue = "PMI-CAD PT NOT ON BBLOCKER";
      break;
    case "G8035":
      returnvalue = "PMI-CAD PT INELIG BBLOCKER";
      break;
    case "G8036":
      returnvalue = "AMI-CAD PT DOC ON ANTIPLATEL";
      break;
    case "G8037":
      returnvalue = "AMI-CAD PT NOT DOCU ON ANTIP";
      break;
    case "G8038":
      returnvalue = "AMI-CAD INELIG ANTIPLATE MEA";
      break;
    case "G8039":
      returnvalue = "CAD PT W/LDL>100MG/DL";
      break;
    case "G8040":
      returnvalue = "CAD PT W/LDL<OR=100MG/DL";
      break;
    case "G8041":
      returnvalue = "CAD PT NOT ELIGIBLE FOR LDL";
      break;
    case "G8051":
      returnvalue = "OSTEOPOROSIS ASSESS";
      break;
    case "G8052":
      returnvalue = "OSTEOPOR PT NOT ASSESS";
      break;
    case "G8053":
      returnvalue = "PT INELIG FOR OSTEOPOR MEAS";
      break;
    case "G8054":
      returnvalue = "FALLS ASSESS NOT DOCUM 12 MO";
      break;
    case "G8055":
      returnvalue = "FALLS ASSESS W/ 12 MON";
      break;
    case "G8056":
      returnvalue = "NOT ELIG FOR FALLS ASSESSMEN";
      break;
    case "G8057":
      returnvalue = "HEARING ASSESS RECEIVE";
      break;
    case "G8058":
      returnvalue = "PT W/O HEARING ASSESS";
      break;
    case "G8059":
      returnvalue = "PT INELIG FOR HEARING ASSESS";
      break;
    case "G8060":
      returnvalue = "URINARY INCONT PT ASSESS";
      break;
    case "G8061":
      returnvalue = "PT NOT ASSESS FOR URINARY IN";
      break;
    case "G8062":
      returnvalue = "PT NOT ELIG FOR URINARY INCO";
      break;
    case "G8075":
      returnvalue = "ESRD PT W/ DIALY OF URR>=65%";
      break;
    case "G8076":
      returnvalue = "ESRD PT W/ DIALY OF URR<65%";
      break;
    case "G8077":
      returnvalue = "ESRD PT NOT ELIG FOR URR/KTV";
      break;
    case "G8078":
      returnvalue = "ESRD PT W/HCT>OR=33";
      break;
    case "G8079":
      returnvalue = "ESRD PT W/HCT<33";
      break;
    case "G8080":
      returnvalue = "ESRD PT INELIG FOR HCT/HGB";
      break;
    case "G8081":
      returnvalue = "ESRD PT W/ AUTO AV FISTULA";
      break;
    case "G8082":
      returnvalue = "ESRD PT W OTHER FISTULA";
      break;
    case "G8085":
      returnvalue = "ESRD PT INELIG AUTO AV FISTU";
      break;
    case "G8093":
      returnvalue = "COPD PT REC SMOKING CESSAT";
      break;
    case "G8094":
      returnvalue = "COPD PT W/O SMOKE CESSAT INT";
      break;
    case "G8099":
      returnvalue = "OSTEOPO PT GIVEN CA+VITD SUP";
      break;
    case "G8100":
      returnvalue = "OSTEOP PT INELIG FOR CA+VITD";
      break;
    case "G8103":
      returnvalue = "NEW DX OSTEO PT W/ANTIRESORP";
      break;
    case "G8104":
      returnvalue = "OSTEO PT INELIG FOR ANTIRESO";
      break;
    case "G8106":
      returnvalue = "BONE DENS MEAS TEST PERF";
      break;
    case "G8107":
      returnvalue = "BONE DENS MEAS TEST INELIG";
      break;
    case "G8108":
      returnvalue = "PT RECEIV INFLUENZA VACC";
      break;
    case "G8109":
      returnvalue = "PT W/O INFLUENZA VACC";
      break;
    case "G8110":
      returnvalue = "PT INELIG FOR INFLUENZA VACC";
      break;
    case "G8111":
      returnvalue = "PT RECEIV MAMMOGRAM";
      break;
    case "G8112":
      returnvalue = "PT NOT DOC MAMMOGRAM";
      break;
    case "G8113":
      returnvalue = "PT INELIGIBLE MAMMOGRAPHY";
      break;
    case "G8114":
      returnvalue = "CARE NOT PROVIDED FOR MAMOGR";
      break;
    case "G8115":
      returnvalue = "PT RECEIV PNEUMO VACC";
      break;
    case "G8116":
      returnvalue = "PT DID NOT REC PNEUMO VACC";
      break;
    case "G8117":
      returnvalue = "PT WAS INELIG FOR PNEUMO VAC";
      break;
    case "G8126":
      returnvalue = "PT TREAT W/ANTIDEPRESS12WKS";
      break;
    case "G8127":
      returnvalue = "PT NOT TREAT W/ANTIDEPRES12W";
      break;
    case "G8128":
      returnvalue = "PT INELIG FOR ANTIDEPRES MED";
      break;
    case "G8129":
      returnvalue = "PT TREAT W/ANTIDEPRES FOR 6M";
      break;
    case "G8130":
      returnvalue = "PT NOT TREAT W/ANTIDEPRES 6M";
      break;
    case "G8131":
      returnvalue = "PT INELIG FOR ANTIDEPRES MED";
      break;
    case "G8152":
      returnvalue = "PT W/AB 1 HR PRIOR TO INCISI";
      break;
    case "G8153":
      returnvalue = "PT NOT DOC FOR AB 1 HR PRIOR";
      break;
    case "G8154":
      returnvalue = "PT INELIGI FOR AB THERAPY";
      break;
    case "G8155":
      returnvalue = "PT RECD THROMBOEMB PROPHYLAX";
      break;
    case "G8156":
      returnvalue = "PT DID NOT REC THROMBOEMBO";
      break;
    case "G8157":
      returnvalue = "PT INELIGI FOR THROMBOLISM";
      break;
    case "G8158":
      returnvalue = "PT RECD CABG W/ IMA";
      break;
    case "G8159":
      returnvalue = "PT W/CABG W/O IMA";
      break;
    case "G8160":
      returnvalue = "PT INELIG FOR CABG W/IMA";
      break;
    case "G8161":
      returnvalue = "ISO CABG PT REC PREOP BBLOCK";
      break;
    case "G8162":
      returnvalue = "ISO CABG PT W/O PREOP BBLOCK";
      break;
    case "G8163":
      returnvalue = "ISO CABG PT INELIG FOR PREO";
      break;
    case "G8164":
      returnvalue = "ISO CABG PT W/PROLNG INTUB";
      break;
    case "G8165":
      returnvalue = "ISO CABG PT W/O PROLNG INTUB";
      break;
    case "G8166":
      returnvalue = "ISO CABG REQ SURG REXPO";
      break;
    case "G8167":
      returnvalue = "ISO CABG W/O SURG EXPLO";
      break;
    case "G8170":
      returnvalue = "CEA/EXT BYPASS PT ON ASPIRIN";
      break;
    case "G8171":
      returnvalue = "PT W/CAROT ENDARCT/EXT BYPAS";
      break;
    case "G8172":
      returnvalue = "CEA/EXT BYPASS PT NOT ON ASP";
      break;
    case "G8182":
      returnvalue = "CAD PT CARE NOT PROV LDL";
      break;
    case "G8183":
      returnvalue = "HF/ATRIAL FIB PT ON WARFARIN";
      break;
    case "G8184":
      returnvalue = "HF/ATRIAL FIB PT INELIG WARF";
      break;
    case "G8185":
      returnvalue = "OSTEOARTH PT W/ ASSESS PAIN";
      break;
    case "G8186":
      returnvalue = "OSTEOARTH PT INELIG ASSESS";
      break;
    case "G8191":
      returnvalue = "ANTIBIOTIC GIVEN PRIOR SURG";
      break;
    case "G8192":
      returnvalue = "ANTIB GIVEN PRIOR SURG INCIS";
      break;
    case "G8193":
      returnvalue = "ANTIBIO NOT DOC PRIOR SURG";
      break;
    case "G8194":
      returnvalue = "PT NOT ELIG FOR ANTIBIOTIC";
      break;
    case "G8195":
      returnvalue = "ANTIBIOTIC GIVEN PRIOR SURG";
      break;
    case "G8196":
      returnvalue = "ANTIBIO NOT DOCUM PRIOR SURG";
      break;
    case "G8197":
      returnvalue = "ANTIB ORDER PRIOR TO SURG";
      break;
    case "G8198":
      returnvalue = "CEFAZOLIN DOCUMENTED ORDERED";
      break;
    case "G8199":
      returnvalue = "CEFAZOLIN GIVEN PROPHYLAXIS";
      break;
    case "G8200":
      returnvalue = "CEFAZOLIN NOT DOCUM PROPHY";
      break;
    case "G8201":
      returnvalue = "PT NOT ELIGI FOR CEFAZOLIN";
      break;
    case "G8202":
      returnvalue = "ORDER GIVEN TO D/C ANTIBIO";
      break;
    case "G8203":
      returnvalue = "ANTIB WAS D/C 24HRS SURG TIM";
      break;
    case "G8204":
      returnvalue = "MD NOT DOC ORDER TO D/C ANTI";
      break;
    case "G8205":
      returnvalue = "PT NOT ELIGI FOR PROPH ANTIB";
      break;
    case "G8206":
      returnvalue = "MD DOC PROPHYLACTIC AB GIVEN";
      break;
    case "G8207":
      returnvalue = "CLINI DOC ORDER TO D/C ANTIB";
      break;
    case "G8208":
      returnvalue = "CLINI DOC AB WAS D/C 48 H";
      break;
    case "G8209":
      returnvalue = "CLINICIAN DID NOT DOC";
      break;
    case "G8210":
      returnvalue = "CLINI DOC PT INELIGIB ANTI";
      break;
    case "G8211":
      returnvalue = "CLINI DOC PROPH AB GIV";
      break;
    case "G8212":
      returnvalue = "CLINI ORDER GIVEN FOR VTE";
      break;
    case "G8213":
      returnvalue = "CLINI GIVEN VTE PROP";
      break;
    case "G8214":
      returnvalue = "CLINI NOT DOC ORDER VTE";
      break;
    case "G8215":
      returnvalue = "CLINI DOC PT INELIG VTE";
      break;
    case "G8216":
      returnvalue = "PT RECEIVED DVT PROPHYLAXIS";
      break;
    case "G8217":
      returnvalue = "PT NOT RECEIVED DVT PROPH";
      break;
    case "G8218":
      returnvalue = "PT INELIG DVT PROPHYLAXIS";
      break;
    case "G8219":
      returnvalue = "RECEIVED DVT PROPH DAY 2";
      break;
    case "G8220":
      returnvalue = "PT NOT REC DVT PROPH DAY 2";
      break;
    case "G8221":
      returnvalue = "PT INELIG FOR DVT PROPH";
      break;
    case "G8222":
      returnvalue = "PT PRESCRIBE PLATELET AT D/C";
      break;
    case "G8223":
      returnvalue = "PT NOT DOC FOR PRESC ANTIPLA";
      break;
    case "G8224":
      returnvalue = "PT INELIG FOR ANTIPLAT PROPH";
      break;
    case "G8225":
      returnvalue = "PT PRESCRIB ANTICOAG AT D/C";
      break;
    case "G8226":
      returnvalue = "PT NO PRESCR ANTICOA AT D/C";
      break;
    case "G8227":
      returnvalue = "PT NOT DOC TO HAVE PERM/AF";
      break;
    case "G8228":
      returnvalue = "CLIN PT INELIG ANTICOAG D/C";
      break;
    case "G8229":
      returnvalue = "PT DOC TO HAVE ADMIN T-PA";
      break;
    case "G8230":
      returnvalue = "PT INELIG T-PA ISCH STROK>3H";
      break;
    case "G8231":
      returnvalue = "PT NOT DOC FOR ADMIN T-PA";
      break;
    case "G8232":
      returnvalue = "PT RECEIVED DYSPHAGIA SCREEN";
      break;
    case "G8234":
      returnvalue = "PT NOT DOC DYSPHAGIA SCREEN";
      break;
    case "G8235":
      returnvalue = "PT RECEIVED NPO";
      break;
    case "G8236":
      returnvalue = "PT INELIG DYSPHAGIA SCREEN";
      break;
    case "G8237":
      returnvalue = "PT DOC REC REHAB SERV";
      break;
    case "G8238":
      returnvalue = "PT NOT DOC TO REC REHAB SERV";
      break;
    case "G8239":
      returnvalue = "INTER CAROTID STENOSIS <30%";
      break;
    case "G8240":
      returnvalue = "INTER CAROTID STENOSIS30-99%";
      break;
    case "G8241":
      returnvalue = "PT INELIG CANDIDATE ITO MEAS";
      break;
    case "G8242":
      returnvalue = "PT DOC TO HAVE CT/MRI W/LES";
      break;
    case "G8243":
      returnvalue = "PT NOT DOC MRI/CT W/O LESION";
      break;
    case "G8245":
      returnvalue = "CLINI DOC PRESE/ABS ALARM";
      break;
    case "G8246":
      returnvalue = "PT INELIG HX W NEW/CHG MOLE";
      break;
    case "G8247":
      returnvalue = "PT W/ALARM SYMP UPPER ENDO";
      break;
    case "G8248":
      returnvalue = "PT W/ONE ALARM SYMP NOT DOC";
      break;
    case "G8249":
      returnvalue = "PT INELIG FOR UPPER ENDO";
      break;
    case "G8250":
      returnvalue = "PT W/BARRETTS ESOPH ENDO RE";
      break;
    case "G8251":
      returnvalue = "PT NOT DOC W/BARRETTS, ENDO";
      break;
    case "G8252":
      returnvalue = "PT INELIG FOR ESOPHAG BIOP";
      break;
    case "G8253":
      returnvalue = "PT REC ORDER FOR BARIUM";
      break;
    case "G8254":
      returnvalue = "PT W/NO DOC ORDER FOR BARIUM";
      break;
    case "G8255":
      returnvalue = "CLINI DOC PT INELIG BAR SWAL";
      break;
    case "G8256":
      returnvalue = "CLINI DOC REV D/C MEDS W/MED";
      break;
    case "G8257":
      returnvalue = "PT NOT DOC REV MEDS D/C";
      break;
    case "G8258":
      returnvalue = "PT INELIG FOR D/C MEDS REV";
      break;
    case "G8259":
      returnvalue = "PT DOC TO HAV DECISION MAKER";
      break;
    case "G8260":
      returnvalue = "PT NOT DOC TO HAVE DEC MAKER";
      break;
    case "G8261":
      returnvalue = "CLIN DOC PT INELIG DEC MAKER";
      break;
    case "G8262":
      returnvalue = "PT DOC ASSESS URINY INCON";
      break;
    case "G8263":
      returnvalue = "PT NOT DOC ASSESS URINARY IN";
      break;
    case "G8264":
      returnvalue = "PT INELIG ASSESS URINARY INC";
      break;
    case "G8265":
      returnvalue = "PT DOC REC CHARC URIN INCON";
      break;
    case "G8266":
      returnvalue = "PT NOT DOC CHARC URIN INCON";
      break;
    case "G8267":
      returnvalue = "PT DOC REC PLAN URINARY INCO";
      break;
    case "G8268":
      returnvalue = "PT NOT DOC REC CARE URIN INC";
      break;
    case "G8269":
      returnvalue = "CLIN NOT PROV CARE URIN INCO";
      break;
    case "G8270":
      returnvalue = "PT RECEIV SCREEN FOR FALL";
      break;
    case "G8271":
      returnvalue = "PT NO DOC SCREEN FALL";
      break;
    case "G8272":
      returnvalue = "CLIN DOC PT INELIG FALL RISK";
      break;
    case "G8273":
      returnvalue = "CLIN NOT PROV CARE SCRE FALL";
      break;
    case "G8274":
      returnvalue = "CLINI NOT DOC PRES/ABS ALARM";
      break;
    case "G8275":
      returnvalue = "PT HX W/ NEW MOLES";
      break;
    case "G8276":
      returnvalue = "PT NOT DOC MOLE CHANGE";
      break;
    case "G8277":
      returnvalue = "PT INELIG FOR ASSESS MOLE";
      break;
    case "G8278":
      returnvalue = "PT DOC REC PE SKIN";
      break;
    case "G8279":
      returnvalue = "PT NOT DOC REC PE";
      break;
    case "G8280":
      returnvalue = "PT INELIG PE SKIN";
      break;
    case "G8281":
      returnvalue = "PT REC COUNSEL FOR SELF-EXAM";
      break;
    case "G8282":
      returnvalue = "PT NOT DOC TO REC COUNS";
      break;
    case "G8283":
      returnvalue = "PT INELIG FOR COUNSEL";
      break;
    case "G8284":
      returnvalue = "PT DOC TO REC PRES OSTEO";
      break;
    case "G8285":
      returnvalue = "PT DID NOT REC PRES OSTEO";
      break;
    case "G8286":
      returnvalue = "PT INELIG TO REC PRES OSTEO";
      break;
    case "G8287":
      returnvalue = "CLIN NOT PROV CARE FOR PHARM";
      break;
    case "G8288":
      returnvalue = "PT DOC REC CA/VIT D";
      break;
    case "G8289":
      returnvalue = "PT NOT DOC REC CA/VIT D";
      break;
    case "G8290":
      returnvalue = "CLIN DOC PT INELIG CA/VIT D";
      break;
    case "G8291":
      returnvalue = "CLIN NO PRO CARE PT CA/VIT D";
      break;
    case "G8292":
      returnvalue = "COPD PT W/SPIR RESULTS";
      break;
    case "G8293":
      returnvalue = "COPD PT W/O SPIR RESULTS";
      break;
    case "G8294":
      returnvalue = "COPD PT INELIG SPIR RESULTS";
      break;
    case "G8295":
      returnvalue = "COPD PT DOC BRONCH THER";
      break;
    case "G8296":
      returnvalue = "COPD PT NOT DOC BRONCH THER";
      break;
    case "G8297":
      returnvalue = "COPD PT INELIG BRONCH THERAP";
      break;
    case "G8298":
      returnvalue = "PT DOC OPTIC NERVE EVAL";
      break;
    case "G8299":
      returnvalue = "PT NOT DOC OPTIC NERV EVAL";
      break;
    case "G8300":
      returnvalue = "PT INELIG FOR OPTIC NERV EVA";
      break;
    case "G8301":
      returnvalue = "CLIN NOT PROV CARE POAG";
      break;
    case "G8302":
      returnvalue = "PT DOC W/ TARGET IOP";
      break;
    case "G8303":
      returnvalue = "PT NOT DOC W/ IOP";
      break;
    case "G8304":
      returnvalue = "CLIN DOC PT INELIG IOP";
      break;
    case "G8305":
      returnvalue = "CLIN NOT PROV CARE POAG";
      break;
    case "G8306":
      returnvalue = "POAG W/ IOP REC CARE PLAN";
      break;
    case "G8307":
      returnvalue = "POAG W/ IOP NO CARE PLAN";
      break;
    case "G8308":
      returnvalue = "POAG W/ IOP NOT DOC PLAN";
      break;
    case "G8309":
      returnvalue = "PT DOC REC ANTIOXIDANT";
      break;
    case "G8310":
      returnvalue = "PT NOT DOC REC ANTIOX";
      break;
    case "G8311":
      returnvalue = "PT INELIG FOR ANTIOXIDANT";
      break;
    case "G8312":
      returnvalue = "CLIN NO PROV CARE FOR ANTIOX";
      break;
    case "G8313":
      returnvalue = "PT DOC REC MACULAR EXAM";
      break;
    case "G8314":
      returnvalue = "PT NOT DOC TO REC MAC EXAM";
      break;
    case "G8315":
      returnvalue = "CLIN DOC PT INELIG MAC EXAM";
      break;
    case "G8316":
      returnvalue = "CLIN NO PRO CARE FOR MAC DEG";
      break;
    case "G8317":
      returnvalue = "PT DOC TO HAVE VISUAL FUNC";
      break;
    case "G8318":
      returnvalue = "PT DOC NOT HAVE VISUAL FUNC";
      break;
    case "G8319":
      returnvalue = "PT INELIG FOR VIS FUNC STAT";
      break;
    case "G8320":
      returnvalue = "CLIN NOT PROV CARE CATARAC";
      break;
    case "G8321":
      returnvalue = "PT DOC TO PRE AXIAL LENG";
      break;
    case "G8322":
      returnvalue = "PT NOT DOC PRE AXIAL LENG";
      break;
    case "G8323":
      returnvalue = "PT INELIG FOR PRE SURG AXIAL";
      break;
    case "G8324":
      returnvalue = "CLIN NOT PROV CARE FOR IOL";
      break;
    case "G8325":
      returnvalue = "PT REC FUND EXAM PRIOR SURG";
      break;
    case "G8326":
      returnvalue = "PT NOT DOC REC FUNDUS EXAM";
      break;
    case "G8327":
      returnvalue = "PT INELIG FOR PRE SURG FUNDU";
      break;
    case "G8328":
      returnvalue = "CLIN NOT PROV CARE FUND EVAL";
      break;
    case "G8329":
      returnvalue = "PT DOC REC DILATED MACULAR";
      break;
    case "G8330":
      returnvalue = "PT NOT DOC REC DILATED MAC";
      break;
    case "G8331":
      returnvalue = "PT INELIG DILATE FUNDUS";
      break;
    case "G8332":
      returnvalue = "CLIN PROV NO CARE DIABETIC R";
      break;
    case "G8333":
      returnvalue = "PT DOC TO HAVE MACULAR EXAM";
      break;
    case "G8334":
      returnvalue = "DOC OF MACULAR NOT GIV MD";
      break;
    case "G8335":
      returnvalue = "CLIN DOC PT INELIG MACULAR";
      break;
    case "G8336":
      returnvalue = "CLIN DID NOT PRO CARE DIABET";
      break;
    case "G8337":
      returnvalue = "CLIN DOC PT WAS TEST OSTEO";
      break;
    case "G8338":
      returnvalue = "CLIN NOT DOC PT TEST OSTEO";
      break;
    case "G8339":
      returnvalue = "PT INELIG FOR TEST OSTEO";
      break;
    case "G8340":
      returnvalue = "PT DOC HAVE DEXA";
      break;
    case "G8341":
      returnvalue = "PT NOT DOC FOR DEXA";
      break;
    case "G8342":
      returnvalue = "CLIN DOC PT INELIG DEXA";
      break;
    case "G8343":
      returnvalue = "CLIN NOT PROV CARE DEXA";
      break;
    case "G8344":
      returnvalue = "PT DOC HAVE DEXA PERFORM";
      break;
    case "G8345":
      returnvalue = "PT NOT DOC HAVE DEXA";
      break;
    case "G8346":
      returnvalue = "CLIN DOC PT INELIG DEXA";
      break;
    case "G8347":
      returnvalue = "CLIN NOT PROV CARE DEXA";
      break;
    case "G8348":
      returnvalue = "INT CAROTID STENOSIS MEAS";
      break;
    case "G8349":
      returnvalue = "PT INELIG FOR DOC OF ALARM";
      break;
    case "G8350":
      returnvalue = "PT DOC 12 LEAD ECG";
      break;
    case "G8351":
      returnvalue = "PT NOT DOC ECG";
      break;
    case "G8352":
      returnvalue = "PT INELIG FOR ECG";
      break;
    case "G8353":
      returnvalue = "PT DOC REC ASPIRIN 24HRS ER";
      break;
    case "G8354":
      returnvalue = "PT NOT REC ASPIRIN PRIOR ER";
      break;
    case "G8355":
      returnvalue = "CLIN DOC PT INELIG ASPIRIN";
      break;
    case "G8356":
      returnvalue = "PT DOC TO HAVE ECG";
      break;
    case "G8357":
      returnvalue = "PT NOT DOC TO HAVE ECG";
      break;
    case "G8358":
      returnvalue = "CLIN DOC PT INELIG ECG";
      break;
    case "G8359":
      returnvalue = "PT DOC VITAL SIGNS RECORDED";
      break;
    case "G8360":
      returnvalue = "PT NOT DOC VITAL SIGNS RECOR";
      break;
    case "G8361":
      returnvalue = "PT DOC TO HAVE 02 SAT ASSESS";
      break;
    case "G8362":
      returnvalue = "PT NOT DOC 02 SAT ASSESS";
      break;
    case "G8363":
      returnvalue = "CLIN DOC PT INELIG 02 SAT";
      break;
    case "G8364":
      returnvalue = "PT DOC MENTAL STATUS ASSESS";
      break;
    case "G8365":
      returnvalue = "PT NOT DOC MENTAL STATUS";
      break;
    case "G8366":
      returnvalue = "PT DOC TO HAVE EMPIRIC AB";
      break;
    case "G8367":
      returnvalue = "PT NOT DOC HAVE EMPIRIC AB";
      break;
    case "G8368":
      returnvalue = "CLIN DOC PT INELIG EMPIRI AB";
      break;
    case "G8370":
      returnvalue = "ASTHMA PT W SURVEY NOT DOCUM";
      break;
    case "G8371":
      returnvalue = "CHEMOTHER NOT REC STG3 COLON";
      break;
    case "G8372":
      returnvalue = "CHEMOTHER REC STG3 COLON CA";
      break;
    case "G8373":
      returnvalue = "CHEMO PLAN DOCUMEN PRIOR CHE";
      break;
    case "G8374":
      returnvalue = "CHEMO PLAN NOT DOC PRIOR CHE";
      break;
    case "G8375":
      returnvalue = "CLL PT W/O DOC FLOW CYTOMETR";
      break;
    case "G8376":
      returnvalue = "BRST CA PT INELIG TAMOXIFEN";
      break;
    case "G8377":
      returnvalue = "MD DOC COLON CA PT INELIG CH";
      break;
    case "G8378":
      returnvalue = "MD DOC PT INELIG RADIATION";
      break;
    case "G8379":
      returnvalue = "DOC RADIAT TX RECOM 12MO OV";
      break;
    case "G8380":
      returnvalue = "PT W STGIC-3BRST CA NOT REC";
      break;
    case "G8381":
      returnvalue = "PT W STGIC-3BRST CA REC TAM";
      break;
    case "G8382":
      returnvalue = "MM PT W/O DOC IV BISPHOPHON";
      break;
    case "G8383":
      returnvalue = "NO DOC RADIATION REC 12MO OV";
      break;
    case "G8384":
      returnvalue = "BASE CYTOGEN TEST MDS NOTPER";
      break;
    case "G8385":
      returnvalue = "DIABET PT NO DO HGB A1C 12M";
      break;
    case "G8386":
      returnvalue = "DIABET PT NODOC LDLIPROTEI";
      break;
    case "G8387":
      returnvalue = "ESRD PT W HCT/HGB NOT DOCUME";
      break;
    case "G8388":
      returnvalue = "ESRD PT W URR/KTV NOTDOC ELI";
      break;
    case "G8389":
      returnvalue = "MDS PT NO DOC FE ST PRIO EPO";
      break;
    case "G8390":
      returnvalue = "DIABETIC W/O DOCUMENT BP 12M";
      break;
    case "G8391":
      returnvalue = "PT W ASTHMA NO DOC MED OR TX";
      break;
    case "G8395":
      returnvalue = "LVEF>=40% DOC NORMAL OR MILD";
      break;
    case "G8396":
      returnvalue = "LVEF NOT PERFORMED";
      break;
    case "G8397":
      returnvalue = "DIL MACULA/FUNDUS EXAM/W DOC";
      break;
    case "G8398":
      returnvalue = "DIL MACULAR/FUNDUS NOT PERFO";
      break;
    case "G8399":
      returnvalue = "PT W/DXA DOCUMENT OR ORDER";
      break;
    case "G8400":
      returnvalue = "PT W/DXA NO DOCUMENT OR ORDE";
      break;
    case "G8401":
      returnvalue = "PT INELIG OSTEO SCREEN MEASU";
      break;
    case "G8402":
      returnvalue = "SMOKE PREVEN INTERVEN COUNSE";
      break;
    case "G8403":
      returnvalue = "SMOKE PREVEN NOCOUNSEL";
      break;
    case "G8404":
      returnvalue = "LOW EXTEMITY NEUR EXAM DOCUM";
      break;
    case "G8405":
      returnvalue = "LOW EXTEMITY NEUR NOT PERFOR";
      break;
    case "G8406":
      returnvalue = "PT INELIG LOWER EXTREM NEURO";
      break;
    case "G8407":
      returnvalue = "ABI DOCUMENTED";
      break;
    case "G8408":
      returnvalue = "ABI NOT DOCUMENTED";
      break;
    case "G8409":
      returnvalue = "PT INELIG FOR ABI MEASURE";
      break;
    case "G8410":
      returnvalue = "EVAL ON FOOT DOCUMENTED";
      break;
    case "G8415":
      returnvalue = "EVAL ON FOOT NOT PERFORMED";
      break;
    case "G8416":
      returnvalue = "PT INELIG FOOTWEAR EVALUATIO";
      break;
    case "G8417":
      returnvalue = "CALC BMI ABV UP PARAM F/U";
      break;
    case "G8418":
      returnvalue = "CALC BMI BLW LOW PARAM F/U";
      break;
    case "G8419":
      returnvalue = "CALC BMI OUT NRM PARAM NOF/U";
      break;
    case "G8420":
      returnvalue = "CALC BMI NORM PARAMETERS";
      break;
    case "G8421":
      returnvalue = "BMI NOT CALCULATED";
      break;
    case "G8422":
      returnvalue = "PT INELIG BMI CALCULATION";
      break;
    case "G8423":
      returnvalue = "PT SCREEN FLU VAC & COUNSEL";
      break;
    case "G8424":
      returnvalue = "FLU VACCINE NOT SCREEN";
      break;
    case "G8425":
      returnvalue = "FLU VACCINE SCREEN NOT CURRE";
      break;
    case "G8426":
      returnvalue = "PT NOT APPROP SCREEN & COUNC";
      break;
    case "G8427":
      returnvalue = "DOC MEDS VERIFIED W/PT OR RE";
      break;
    case "G8428":
      returnvalue = "MEDS DOCUMENT W/O VERIFICA";
      break;
    case "G8429":
      returnvalue = "INCOMPLETE DOC PT ON MEDS";
      break;
    case "G8430":
      returnvalue = "PT INELIG MED CHECK";
      break;
    case "G8431":
      returnvalue = "POS CLIN DEPRES SCRN F/U DOC";
      break;
    case "G8432":
      returnvalue = "CLIN DEPRESSION SCREEN NOT D";
      break;
    case "G8433":
      returnvalue = "PT INELIG; SCRN CLIN DEP";
      break;
    case "G8434":
      returnvalue = "COGNITIVE IMPAIRMENT SCREEN";
      break;
    case "G8435":
      returnvalue = "COGNITIVE SCREEN NOT DOCUMEN";
      break;
    case "G8436":
      returnvalue = "PT INELIG FOR COGNITIVE IMPA";
      break;
    case "G8437":
      returnvalue = "CARE PLAN DEVELOP & DOCUMENT";
      break;
    case "G8438":
      returnvalue = "PT INELIG FOR DEVLP CARE PLN";
      break;
    case "G8439":
      returnvalue = "CARE PLAN DEVELP & NOT DOCUM";
      break;
    case "G8440":
      returnvalue = "PAIN ASSESS F/U PLN DOCUMENT";
      break;
    case "G8441":
      returnvalue = "NO DOCUMENT OF PAIN ASSESS";
      break;
    case "G8442":
      returnvalue = "PT INELIG PAIN ASSESSMENT";
      break;
    case "G8443":
      returnvalue = "PRESCRIPTION BY E-PRESCRIB S";
      break;
    case "G8445":
      returnvalue = "PRESCRIP NOT GEN AT ENCOUNTE";
      break;
    case "G8446":
      returnvalue = "SOME PRESCRIB PRINT OR CALL";
      break;
    case "G8447":
      returnvalue = "PT VIS DOC USE CCHIT CER EHR";
      break;
    case "G8448":
      returnvalue = "PT VIS DOC W/NON-CCHIT EHR";
      break;
    case "G8449":
      returnvalue = "PT NOT DOC W/EMR DUE TO SYST";
      break;
    case "G8450":
      returnvalue = "BETA-BLOC RX PT W/ABN LVEF";
      break;
    case "G8451":
      returnvalue = "PT W/ABN LVEF INELIG B-BLOC";
      break;
    case "G8452":
      returnvalue = "PT W/ABN LVEF B-BLOC NO RX";
      break;
    case "G8453":
      returnvalue = "TOB USE CESS INT COUNSEL";
      break;
    case "G8454":
      returnvalue = "TOB USE CESS INT NO COUNSEL";
      break;
    case "G8455":
      returnvalue = "CURRENT TOBACCO SMOKER";
      break;
    case "G8456":
      returnvalue = "CURRENT SMKLESS TOBACCO USER";
      break;
    case "G8457":
      returnvalue = "CUR TOBACCO NON-USER";
      break;
    case "G8458":
      returnvalue = "PT INELIG GENO NO ANTVIR TX";
      break;
    case "G8459":
      returnvalue = "DOC PT REC ANTIVIR TREAT";
      break;
    case "G8460":
      returnvalue = "PT INELIG RNA NO ANTVIR TX";
      break;
    case "G8461":
      returnvalue = "PT REC ANTIVIR TREAT HEP C";
      break;
    case "G8462":
      returnvalue = "PT INELIG COUNS NO ANTVIR TX";
      break;
    case "G8463":
      returnvalue = "PT REC ANTIVIRAL TREAT DOC";
      break;
    case "G8464":
      returnvalue = "PT INELIG; LO TO NO DTER RSK";
      break;
    case "G8465":
      returnvalue = "HIGH RISK RECURRENCE PRO CA";
      break;
    case "G8466":
      returnvalue = "PT INELIG SUIC; MDD REMIS";
      break;
    case "G8467":
      returnvalue = "NEW DX INIT/REC EPISODE MDD";
      break;
    case "G8468":
      returnvalue = "ACE/ARB RX PT W/ABN LVEF";
      break;
    case "G8469":
      returnvalue = "PT W/ABN LVEF INELIG ACE/ARB";
      break;
    case "G8470":
      returnvalue = "PT W/ NORMAL LVEF";
      break;
    case "G8471":
      returnvalue = "LVEF NOT PERFORMED/DOC";
      break;
    case "G8472":
      returnvalue = "ACE/ARB NO RX PT W/ABN LVEF";
      break;
    case "G8473":
      returnvalue = "ACE/ARB THXPY RX?D";
      break;
    case "G8474":
      returnvalue = "ACE/ARB NOT RX?D; DOC REAS";
      break;
    case "G8475":
      returnvalue = "ACE/ARB THXPY NOT RX?D";
      break;
    case "G8476":
      returnvalue = "BP SYS <130 AND DIAS <80";
      break;
    case "G8477":
      returnvalue = "BP SYS>=130 AND/OR DIAS >=80";
      break;
    case "G8478":
      returnvalue = "BP NOT PERFORMED/DOC";
      break;
    case "G8479":
      returnvalue = "MD RX?D ACE/ARB THXPY";
      break;
    case "G8480":
      returnvalue = "PT INELIG ACE/ARB THXPY";
      break;
    case "G8481":
      returnvalue = "MD NOT RX?D ACE/ARB THXPY";
      break;
    case "G8482":
      returnvalue = "FLU IMMUNIZE ORDER/ADMIN";
      break;
    case "G8483":
      returnvalue = "FLU IMM NO ORD/ADMIN DOC REA";
      break;
    case "G8484":
      returnvalue = "FLU IMMUNIZE NO ORDER/ADMIN";
      break;
    case "G8485":
      returnvalue = "REPORT, DIABETES MEASURES";
      break;
    case "G8486":
      returnvalue = "REPORT, PREV CARE MEASURES";
      break;
    case "G8487":
      returnvalue = "REPORT CKD MEASURES";
      break;
    case "G8488":
      returnvalue = "REPORT ESRD MEASURES";
      break;
    case "G8489":
      returnvalue = "CAD MEASURES GRP";
      break;
    case "G8490":
      returnvalue = "RA MEASURES GRP";
      break;
    case "G8491":
      returnvalue = "HIV/AIDS MEASURES GRP";
      break;
    case "G8492":
      returnvalue = "PERIOP CARE MEASURES GRP";
      break;
    case "G8493":
      returnvalue = "BACK PAIN MEASURES GRP";
      break;
    case "G8494":
      returnvalue = "DM MEAS QUAL ACT PERFORM";
      break;
    case "G8495":
      returnvalue = "CKD MEAS QUAL ACT PERFORM";
      break;
    case "G8496":
      returnvalue = "PREV CARE MG QUAL ACT PERFRM";
      break;
    case "G8497":
      returnvalue = "CABG MEAS QUAL ACT PERFORM";
      break;
    case "G8498":
      returnvalue = "CAD MEAS QUAL ACT PERFORM";
      break;
    case "G8499":
      returnvalue = "RA MEAS QUAL ACT PERFORM";
      break;
    case "G8500":
      returnvalue = "HIV MEAS QUAL ACT PERFORM";
      break;
    case "G8501":
      returnvalue = "PERIO MEAS QUAL ACT PERFORM";
      break;
    case "G8502":
      returnvalue = "BACK PAIN MG QUAL ACT PERFRM";
      break;
    case "G8503":
      returnvalue = "DOC PROPH ANTIBX W/IN 1 HR";
      break;
    case "G8504":
      returnvalue = "DOC ORD PRO ANTBX W/IN 1 HR";
      break;
    case "G8505":
      returnvalue = "NO DOC PROPH ANTIBX W/IN 1HR";
      break;
    case "G8506":
      returnvalue = "PT REC ACE/ARB";
      break;
    case "G8507":
      returnvalue = "PT INELIG PT VERIF MEDS";
      break;
    case "G8508":
      returnvalue = "PT INELIG; PAIN ASSES NO F/U";
      break;
    case "G8509":
      returnvalue = "PAIN ASSESS NO F/U PLN DOC";
      break;
    case "G8510":
      returnvalue = "PT INELIG NEG SCRN DEPRES";
      break;
    case "G8511":
      returnvalue = "CLIN DEPRES SCRN NO F/U DOC";
      break;
    case "G8512":
      returnvalue = "PAIN SEV QUANT PRESENT";
      break;
    case "G8513":
      returnvalue = "ABI MEAS & DOC";
      break;
    case "G8514":
      returnvalue = "PT INELIG; ABI MEASURE";
      break;
    case "G8515":
      returnvalue = "NO ABI MEASUREMENT";
      break;
    case "G8516":
      returnvalue = "SCRN FAL RSK >2 FAL OR W/INJ";
      break;
    case "G8517":
      returnvalue = "SCRN FALL RSK; <2 FALLS";
      break;
    case "G8518":
      returnvalue = "CLIN STG B/F LUN/ESO CA SURG";
      break;
    case "G8519":
      returnvalue = "PT IN; CLIN CA STG B/F SURG";
      break;
    case "G8520":
      returnvalue = "CLIN STG B/F SURG NOT DOC";
      break;
    case "G8521":
      returnvalue = "ANTPLT RECD 48 HRS & DISCH";
      break;
    case "G8522":
      returnvalue = "PT INELIG; ANTIPLT THERAPY";
      break;
    case "G8523":
      returnvalue = "ANTPLT NOT RECD REAS NO SPEC";
      break;
    case "G8524":
      returnvalue = "PATCH CLOSURE CONV CEA";
      break;
    case "G8525":
      returnvalue = "NO PATCH CLOSURE CEA";
      break;
    case "G8526":
      returnvalue = "NO PATCH CLOSURE CONV CEA";
      break;
    case "G8527":
      returnvalue = "DOC ORD ANTIMIC PROPHY";
      break;
    case "G8528":
      returnvalue = "PT INELIG; PROPH ANTIBIOT";
      break;
    case "G8529":
      returnvalue = "NO DOC ORD ANTIMIC PROPHY";
      break;
    case "G8530":
      returnvalue = "AUTO AV FISTULA RECD";
      break;
    case "G8531":
      returnvalue = "PT INELIG; AUTO AV FISTULA";
      break;
    case "G8532":
      returnvalue = "NO AUTO AV FISTULA; NO REAS";
      break;
    case "G8533":
      returnvalue = "PARTIC IN CLIN DATA BASE REG";
      break;
    case "G8534":
      returnvalue = "DOC ELDER MAL SCRN F/U PLAN";
      break;
    case "G8535":
      returnvalue = "PT INELIG NO ELD MAL SCRN";
      break;
    case "G8536":
      returnvalue = "NO DOC ELDER MAL SCRN";
      break;
    case "G8537":
      returnvalue = "PT INELIG ELDMAL SCRN NO F/U";
      break;
    case "G8538":
      returnvalue = "ELD MAL SCRN NO F/U PLN";
      break;
    case "G8539":
      returnvalue = "CUR FUNCT ASSESS & CARE PLN";
      break;
    case "G8540":
      returnvalue = "PT INELIG FUNCT ASSESS";
      break;
    case "G8541":
      returnvalue = "NO DOC CUR FUNCT ASSESS";
      break;
    case "G8542":
      returnvalue = "PT INELIG FUNC ASSES NO PLN";
      break;
    case "G8543":
      returnvalue = "CUR FUNCT ASSES; NO CARE PLN";
      break;
    case "G8544":
      returnvalue = "CABG MEASURES GRP";
      break;
    case "G8545":
      returnvalue = "HEPC MEASURES GRP";
      break;
    case "G8546":
      returnvalue = "CAP MEASURES GRP";
      break;
    case "G8547":
      returnvalue = "IVD MEASURES GRP";
      break;
    case "G8548":
      returnvalue = "HF MEASURES GRP";
      break;
    case "G8549":
      returnvalue = "HEPC MG QUAL ACT PERFORM";
      break;
    case "G8550":
      returnvalue = "CAP MG QUAL ACT PERFORM";
      break;
    case "G8551":
      returnvalue = "HF MG QUAL ACT PERFORM";
      break;
    case "G8552":
      returnvalue = "IVD MG QUAL ACT PERFORM";
      break;
    case "G8553":
      returnvalue = "1 RX VIA QUALIFIED ERX SYS";
      break;
    case "G8556":
      returnvalue = "REF TO DOC OTOLOG EVAL";
      break;
    case "G8557":
      returnvalue = "PT INELIG REF OTOLOG EVAL";
      break;
    case "G8558":
      returnvalue = "NO REF TO DOC OTOLOG EVAL";
      break;
    case "G8559":
      returnvalue = "PT REF DOC OTO EVAL";
      break;
    case "G8560":
      returnvalue = "PT HX ACT DRAIN PREV 90 DAYS";
      break;
    case "G8561":
      returnvalue = "PT INELIG FOR REF OTO EVAL";
      break;
    case "G8562":
      returnvalue = "PT NO HX ACT DRAIN 90 D";
      break;
    case "G8563":
      returnvalue = "PT NO REF OTO REAS NO SPEC";
      break;
    case "G8564":
      returnvalue = "PT REF OTO EVAL";
      break;
    case "G8565":
      returnvalue = "VER DOC HEAR LOSS";
      break;
    case "G8566":
      returnvalue = "PT INELIG REF OTO EVAL";
      break;
    case "G8567":
      returnvalue = "PT NO DOC HEAR LOSS";
      break;
    case "G8568":
      returnvalue = "PT NO REF OTOLO NO SPEC";
      break;
    case "G8569":
      returnvalue = "PROL INTUBATION REQ";
      break;
    case "G8570":
      returnvalue = "NO PROL INTUB REQ";
      break;
    case "G8571":
      returnvalue = "STER WD IFX 30 D POSTOP";
      break;
    case "G8572":
      returnvalue = "NO STER WD IFX";
      break;
    case "G8573":
      returnvalue = "STK/CVA CABG";
      break;
    case "G8574":
      returnvalue = "NO STRK/CVA CABG";
      break;
    case "G8575":
      returnvalue = "POSTOP REN INSUF";
      break;
    case "G8576":
      returnvalue = "NO POSTOP REN INSUF";
      break;
    case "G8577":
      returnvalue = "REOP REQ BLD GRFT OTH";
      break;
    case "G8578":
      returnvalue = "NO REOP REQ BLD GRFT OTH";
      break;
    case "G8579":
      returnvalue = "ANTPLT MED DISCH";
      break;
    case "G8580":
      returnvalue = "ANTPLT MED CONTRAIND";
      break;
    case "G8581":
      returnvalue = "NO ANTPLT MED DISCH";
      break;
    case "G8582":
      returnvalue = "BBLOCK DISCH";
      break;
    case "G8583":
      returnvalue = "BBLOCK CONTRAIND";
      break;
    case "G8584":
      returnvalue = "NO BBLOCK DISCH";
      break;
    case "G8585":
      returnvalue = "ANTILIPID TREAT DISCH";
      break;
    case "G8586":
      returnvalue = "ANTLIP DISCH CONTRA";
      break;
    case "G8587":
      returnvalue = "NO ANTLIPID TREAT DISCH";
      break;
    case "G8588":
      returnvalue = "SYS BP <140";
      break;
    case "G8589":
      returnvalue = "SYS BP >= 140";
      break;
    case "G8590":
      returnvalue = "DIA BP < 90";
      break;
    case "G8591":
      returnvalue = "DIA BP >= 90";
      break;
    case "G8592":
      returnvalue = "NO BP MEASURE";
      break;
    case "G8593":
      returnvalue = "LIPID PN RESULTS";
      break;
    case "G8594":
      returnvalue = "NO LIPID PROF PERF";
      break;
    case "G8595":
      returnvalue = "LDL < 100";
      break;
    case "G8596":
      returnvalue = "NO LDL PERF";
      break;
    case "G8597":
      returnvalue = "LDL >= 100";
      break;
    case "G8598":
      returnvalue = "ASP THERP USED";
      break;
    case "G8599":
      returnvalue = "NO ASP THERP USED";
      break;
    case "G8600":
      returnvalue = "TPA INITI W/IN 3 HRS";
      break;
    case "G8601":
      returnvalue = "NO ELIG TPA INIT W/IN 3 HRS";
      break;
    case "G8602":
      returnvalue = "NO TPA INIT W/IN 3 HRS";
      break;
    case "G8603":
      returnvalue = "SPOK LANG COMP SCORE";
      break;
    case "G8604":
      returnvalue = "NO HIGH SCORE SPOK LANG";
      break;
    case "G8605":
      returnvalue = "NO SPOK LANG COMP SCORE";
      break;
    case "G8606":
      returnvalue = "ATTENTION SCORE";
      break;
    case "G8607":
      returnvalue = "NO HIGH SCORE ATTENTION";
      break;
    case "G8608":
      returnvalue = "NO ATTENTION SCORE";
      break;
    case "G8609":
      returnvalue = "MEMORY SCORE";
      break;
    case "G8610":
      returnvalue = "NO HIGH SCORE MEMORY";
      break;
    case "G8611":
      returnvalue = "NO MEMORY SCORE";
      break;
    case "G8612":
      returnvalue = "MOTO SPEECH SCORE";
      break;
    case "G8613":
      returnvalue = "NO HIGH SCORE MOTO SPEECH";
      break;
    case "G8614":
      returnvalue = "NO MOTO SPEECH SCORE";
      break;
    case "G8615":
      returnvalue = "READING SCORE";
      break;
    case "G8616":
      returnvalue = "NO HIGH SCORE READING";
      break;
    case "G8617":
      returnvalue = "NO READING SCORE";
      break;
    case "G8618":
      returnvalue = "SPOK LANG EXP SCORE";
      break;
    case "G8619":
      returnvalue = "NO HIGH SCORE SPOK LANG EXP";
      break;
    case "G8620":
      returnvalue = "NO SPOK LANG EXP SCORE";
      break;
    case "G8621":
      returnvalue = "WRITING SCORE";
      break;
    case "G8622":
      returnvalue = "NO HIGH SCORE WRITING";
      break;
    case "G8623":
      returnvalue = "NO WRITING SCORE";
      break;
    case "G8624":
      returnvalue = "SWALLOWING SCORE";
      break;
    case "G8625":
      returnvalue = "NO HIGH SCORE SWALLOWING";
      break;
    case "G8626":
      returnvalue = "NO SWALLOWING SCORE";
      break;
    case "G8627":
      returnvalue = "SURG PROC W/IN 30 DAYS";
      break;
    case "G8628":
      returnvalue = "NO SURG PROC W/IN 30 DAYS";
      break;
    case "G9001":
      returnvalue = "MCCD, INITIAL RATE";
      break;
    case "G9002":
      returnvalue = "MCCD,MAINTENANCE RATE";
      break;
    case "G9003":
      returnvalue = "MCCD, RISK ADJ HI, INITIAL";
      break;
    case "G9004":
      returnvalue = "MCCD, RISK ADJ LO, INITIAL";
      break;
    case "G9005":
      returnvalue = "MCCD, RISK ADJ, MAINTENANCE";
      break;
    case "G9006":
      returnvalue = "MCCD, HOME MONITORING";
      break;
    case "G9007":
      returnvalue = "MCCD, SCH TEAM CONF";
      break;
    case "G9008":
      returnvalue = "MCCD,PHYS COOR-CARE OVRSGHT";
      break;
    case "G9009":
      returnvalue = "MCCD, RISK ADJ, LEVEL 3";
      break;
    case "G9010":
      returnvalue = "MCCD, RISK ADJ, LEVEL 4";
      break;
    case "G9011":
      returnvalue = "MCCD, RISK ADJ, LEVEL 5";
      break;
    case "G9012":
      returnvalue = "OTHER SPECIFIED CASE MGMT";
      break;
    case "G9013":
      returnvalue = "ESRD DEMO BUNDLE LEVEL I";
      break;
    case "G9014":
      returnvalue = "ESRD DEMO BUNDLE-LEVEL II";
      break;
    case "G9016":
      returnvalue = "DEMO-SMOKING CESSATION COUN";
      break;
    case "G9017":
      returnvalue = "AMANTADINE HCL 100MG ORAL";
      break;
    case "G9018":
      returnvalue = "ZANAMIVIR,INHALATION PWD 10M";
      break;
    case "G9019":
      returnvalue = "OSELTAMIVIR PHOSPHATE 75MG";
      break;
    case "G9020":
      returnvalue = "RIMANTADINE HCL 100MG ORAL";
      break;
    case "G9033":
      returnvalue = "AMANTADINE HCL ORAL BRAND";
      break;
    case "G9034":
      returnvalue = "ZANAMIVIR, INH PWDR, BRAND";
      break;
    case "G9035":
      returnvalue = "OSELTAMIVIR PHOSP, BRAND";
      break;
    case "G9036":
      returnvalue = "RIMANTADINE HCL, BRAND";
      break;
    case "G9041":
      returnvalue = "LOW VISION REHAB OCCUPATIONA";
      break;
    case "G9042":
      returnvalue = "LOW VISION REHAB ORIENT/MOBI";
      break;
    case "G9043":
      returnvalue = "LOW VISION LOWVISION THERAPI";
      break;
    case "G9044":
      returnvalue = "LOW VISION REHABILATE TEACHE";
      break;
    case "G9050":
      returnvalue = "ONCOLOGY WORK-UP EVALUATION";
      break;
    case "G9051":
      returnvalue = "ONCOLOGY TX DECISION-MGMT";
      break;
    case "G9052":
      returnvalue = "ONC SURVEILLANCE FOR DISEASE";
      break;
    case "G9053":
      returnvalue = "ONC EXPECTANT MANAGEMENT PT";
      break;
    case "G9054":
      returnvalue = "ONC SUPERVISION PALLIATIVE";
      break;
    case "G9055":
      returnvalue = "ONC VISIT UNSPECIFIED NOS";
      break;
    case "G9056":
      returnvalue = "ONC PRAC MGMT ADHERES GUIDE";
      break;
    case "G9057":
      returnvalue = "ONC PRACT MGMT DIFFERS TRIAL";
      break;
    case "G9058":
      returnvalue = "ONC PRAC MGMT DISAGREE W/GUI";
      break;
    case "G9059":
      returnvalue = "ONC PRAC MGMT PT OPT ALTERNA";
      break;
    case "G9060":
      returnvalue = "ONC PRAC MGMT DIF PT COMORB";
      break;
    case "G9061":
      returnvalue = "ONC PRAC COND NOADD BY GUIDE";
      break;
    case "G9062":
      returnvalue = "ONC PRAC GUIDE DIFFERS NOS";
      break;
    case "G9063":
      returnvalue = "ONC DX NSCLC STGI NO PROGRES";
      break;
    case "G9064":
      returnvalue = "ONC DX NSCLC STG2 NO PROGRES";
      break;
    case "G9065":
      returnvalue = "ONC DX NSCLC STG3A NO PROGRE";
      break;
    case "G9066":
      returnvalue = "ONC DX NSCLC STG3B-4 METASTA";
      break;
    case "G9067":
      returnvalue = "ONC DX NSCLC DX UNKNOWN NOS";
      break;
    case "G9068":
      returnvalue = "ONC DX SCLC/NSCLC LIMITED";
      break;
    case "G9069":
      returnvalue = "ONC DX SCLC/NSCLC EXT AT DX";
      break;
    case "G9070":
      returnvalue = "ONC DX SCLC/NSCLC EXT UNKNWN";
      break;
    case "G9071":
      returnvalue = "ONC DX BRST STG1-2B HR,NOPRO";
      break;
    case "G9072":
      returnvalue = "ONC DX BRST STG1-2 NOPROGRES";
      break;
    case "G9073":
      returnvalue = "ONC DX BRST STG3-HR, NO PRO";
      break;
    case "G9074":
      returnvalue = "ONC DX BRST STG3-NOPROGRESS";
      break;
    case "G9075":
      returnvalue = "ONC DX BRST METASTIC/ RECUR";
      break;
    case "G9076":
      returnvalue = "ONC DX BRST UNKNOWN NOS";
      break;
    case "G9077":
      returnvalue = "ONC DX PROSTATE T1NO PROGRES";
      break;
    case "G9078":
      returnvalue = "ONC DX PROSTATE T2NO PROGRES";
      break;
    case "G9079":
      returnvalue = "ONC DX PROSTATE T3B-T4NOPROG";
      break;
    case "G9080":
      returnvalue = "ONC DX PROSTATE W/RISE PSA";
      break;
    case "G9081":
      returnvalue = "ONC DX PROSTATE METS NO CAST";
      break;
    case "G9082":
      returnvalue = "ONC DX PROSTATE CASTRATE MET";
      break;
    case "G9083":
      returnvalue = "ONC DX PROSTATE UNKNWN NOS";
      break;
    case "G9084":
      returnvalue = "ONC DX COLON T1-3,N1-2,NO PR";
      break;
    case "G9085":
      returnvalue = "ONC DX COLON T4, N0 W/O PROG";
      break;
    case "G9086":
      returnvalue = "ONC DX COLON T1-4 NO DX PROG";
      break;
    case "G9087":
      returnvalue = "ONC DX COLON METAS EVID DX";
      break;
    case "G9088":
      returnvalue = "ONC DX COLON METAS NOEVID DX";
      break;
    case "G9089":
      returnvalue = "ONC DX COLON EXTENT UNKNOWN";
      break;
    case "G9090":
      returnvalue = "ONC DX RECTAL T1-2 NO PROGR";
      break;
    case "G9091":
      returnvalue = "ONC DX RECTAL T3 N0 NO PROG";
      break;
    case "G9092":
      returnvalue = "ONC DX RECTAL T1-3,N1-2NOPRG";
      break;
    case "G9093":
      returnvalue = "ONC DX RECTAL T4,N,M0 NO PRG";
      break;
    case "G9094":
      returnvalue = "ONC DX RECTAL M1 W/METS PROG";
      break;
    case "G9095":
      returnvalue = "ONC DX RECTAL EXTENT UNKNWN";
      break;
    case "G9096":
      returnvalue = "ONC DX ESOPHAG T1-T3 NOPROG";
      break;
    case "G9097":
      returnvalue = "ONC DX ESOPHAGEAL T4 NO PROG";
      break;
    case "G9098":
      returnvalue = "ONC DX ESOPHAGEAL METS RECUR";
      break;
    case "G9099":
      returnvalue = "ONC DX ESOPHAGEAL UNKNOWN";
      break;
    case "G9100":
      returnvalue = "ONC DX GASTRIC NO RECURRENCE";
      break;
    case "G9101":
      returnvalue = "ONC DX GASTRIC P R1-R2NOPROG";
      break;
    case "G9102":
      returnvalue = "ONC DX GASTRIC UNRESECTABLE";
      break;
    case "G9103":
      returnvalue = "ONC DX GASTRIC RECURRENT";
      break;
    case "G9104":
      returnvalue = "ONC DX GASTRIC UNKNOWN NOS";
      break;
    case "G9105":
      returnvalue = "ONC DX PANCREATC P R0 RES NO";
      break;
    case "G9106":
      returnvalue = "ONC DX PANCREATC P R1/R2 NO";
      break;
    case "G9107":
      returnvalue = "ONC DX PANCREATIC UNRESECTAB";
      break;
    case "G9108":
      returnvalue = "ONC DX PANCREATIC UNKNWN NOS";
      break;
    case "G9109":
      returnvalue = "ONC DX HEAD/NECK T1-T2NO PRG";
      break;
    case "G9110":
      returnvalue = "ONC DX HEAD/NECK T3-4 NOPROG";
      break;
    case "G9111":
      returnvalue = "ONC DX HEAD/NECK M1 METS REC";
      break;
    case "G9112":
      returnvalue = "ONC DX HEAD/NECK EXT UNKNOWN";
      break;
    case "G9113":
      returnvalue = "ONC DX OVARIAN STG1A-B NO PR";
      break;
    case "G9114":
      returnvalue = "ONC DX OVARIAN STG1A-B OR 2";
      break;
    case "G9115":
      returnvalue = "ONC DX OVARIAN STG3/4 NOPROG";
      break;
    case "G9116":
      returnvalue = "ONC DX OVARIAN RECURRENCE";
      break;
    case "G9117":
      returnvalue = "ONC DX OVARIAN UNKNOWN NOS";
      break;
    case "G9118":
      returnvalue = "ONC NHLSTG 1-2 NO RELAP NO";
      break;
    case "G9119":
      returnvalue = "ONC DX NHL STG 3-4 NOT RELAP";
      break;
    case "G9120":
      returnvalue = "ONC DX NHL TRANS TO LG BCELL";
      break;
    case "G9121":
      returnvalue = "ONC DX NHL RELAPSE/REFRACTOR";
      break;
    case "G9122":
      returnvalue = "ONC DX NHL STG UNKNOWN";
      break;
    case "G9123":
      returnvalue = "ONC DX CML CHRONIC PHASE";
      break;
    case "G9124":
      returnvalue = "ONC DX CML ACCELER PHASE";
      break;
    case "G9125":
      returnvalue = "ONC DX CML BLAST PHASE";
      break;
    case "G9126":
      returnvalue = "ONC DX CML REMISSION";
      break;
    case "G9127":
      returnvalue = "ONC DX CML DX STATUS UNKNOWN";
      break;
    case "G9128":
      returnvalue = "ONC DX MULTI MYELOMA STAGE I";
      break;
    case "G9129":
      returnvalue = "ONC DX MULT MYELOMA STG2 HIG";
      break;
    case "G9130":
      returnvalue = "ONC DX MULTI MYELOMA UNKNOWN";
      break;
    case "G9131":
      returnvalue = "ONC DX BRST UNKNOWN NOS";
      break;
    case "G9132":
      returnvalue = "ONC DX PROSTATE METS NO CAST";
      break;
    case "G9133":
      returnvalue = "ONC DX PROSTATE CLINICAL MET";
      break;
    case "G9134":
      returnvalue = "ONC NHLSTG 1-2 NO RELAP NO";
      break;
    case "G9135":
      returnvalue = "ONC DX NHL STG 3-4 NOT RELAP";
      break;
    case "G9136":
      returnvalue = "ONC DX NHL TRANS TO LG BCELL";
      break;
    case "G9137":
      returnvalue = "ONC DX NHL RELAPSE/REFRACTOR";
      break;
    case "G9138":
      returnvalue = "ONC DX NHL STG UNKNOWN";
      break;
    case "G9139":
      returnvalue = "ONC DX CML DX STATUS UNKNOWN";
      break;
    case "G9140":
      returnvalue = "FRONTIER EXTENDED STAY DEMO";
      break;
    case "G9141":
      returnvalue = "INFLUENZA A H1N1,ADMIN W COU";
      break;
    case "G9142":
      returnvalue = "INFLUENZA A H1N1, VACCINE";
      break;
    case "G9143":
      returnvalue = "WARFARIN RESPON GENETIC TEST";
      break;
    case "H0001":
      returnvalue = "ALCOHOL AND/OR DRUG ASSESS";
      break;
    case "H0002":
      returnvalue = "ALCOHOL AND/OR DRUG SCREENIN";
      break;
    case "H0003":
      returnvalue = "ALCOHOL AND/OR DRUG SCREENIN";
      break;
    case "H0004":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0005":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0006":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0007":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0008":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0009":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0010":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0011":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0012":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0013":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0014":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0015":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0016":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0017":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0018":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0019":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0020":
      returnvalue = "ALCOHOL AND/OR DRUG SERVICES";
      break;
    case "H0021":
      returnvalue = "ALCOHOL AND/OR DRUG TRAINING";
      break;
    case "H0022":
      returnvalue = "ALCOHOL AND/OR DRUG INTERVEN";
      break;
    case "H0023":
      returnvalue = "ALCOHOL AND/OR DRUG OUTREACH";
      break;
    case "H0024":
      returnvalue = "ALCOHOL AND/OR DRUG PREVENTI";
      break;
    case "H0025":
      returnvalue = "ALCOHOL AND/OR DRUG PREVENTI";
      break;
    case "H0026":
      returnvalue = "ALCOHOL AND/OR DRUG PREVENTI";
      break;
    case "H0027":
      returnvalue = "ALCOHOL AND/OR DRUG PREVENTI";
      break;
    case "H0028":
      returnvalue = "ALCOHOL AND/OR DRUG PREVENTI";
      break;
    case "H0029":
      returnvalue = "ALCOHOL AND/OR DRUG PREVENTI";
      break;
    case "H0030":
      returnvalue = "ALCOHOL AND/OR DRUG HOTLINE";
      break;
    case "H0031":
      returnvalue = "MH HEALTH ASSESS BY NON-MD";
      break;
    case "H0032":
      returnvalue = "MH SVC PLAN DEV BY NON-MD";
      break;
    case "H0033":
      returnvalue = "ORAL MED ADM DIRECT OBSERVE";
      break;
    case "H0034":
      returnvalue = "MED TRNG & SUPPORT PER 15MIN";
      break;
    case "H0035":
      returnvalue = "MH PARTIAL HOSP TX UNDER 24H";
      break;
    case "H0036":
      returnvalue = "COMM PSY FACE-FACE PER 15MIN";
      break;
    case "H0037":
      returnvalue = "COMM PSY SUP TX PGM PER DIEM";
      break;
    case "H0038":
      returnvalue = "SELF-HELP/PEER SVC PER 15MIN";
      break;
    case "H0039":
      returnvalue = "ASSER COM TX FACE-FACE/15MIN";
      break;
    case "H0040":
      returnvalue = "ASSERT COMM TX PGM PER DIEM";
      break;
    case "H0041":
      returnvalue = "FOS C CHLD NON-THER PER DIEM";
      break;
    case "H0042":
      returnvalue = "FOS C CHLD NON-THER PER MON";
      break;
    case "H0043":
      returnvalue = "SUPPORTED HOUSING, PER DIEM";
      break;
    case "H0044":
      returnvalue = "SUPPORTED HOUSING, PER MONTH";
      break;
    case "H0045":
      returnvalue = "RESPITE NOT-IN-HOME PER DIEM";
      break;
    case "H0046":
      returnvalue = "MENTAL HEALTH SERVICE, NOS";
      break;
    case "H0047":
      returnvalue = "ALCOHOL/DRUG ABUSE SVC NOS";
      break;
    case "H0048":
      returnvalue = "SPEC COLL NON-BLOOD:A/D TEST";
      break;
    case "H0049":
      returnvalue = "ALCOHOL/DRUG SCREENING";
      break;
    case "H0050":
      returnvalue = "ALCOHOL/DRUG SERVICE 15 MIN";
      break;
    case "H1000":
      returnvalue = "PRENATAL CARE ATRISK ASSESSM";
      break;
    case "H1001":
      returnvalue = "ANTEPARTUM MANAGEMENT";
      break;
    case "H1002":
      returnvalue = "CARECOORDINATION PRENATAL";
      break;
    case "H1003":
      returnvalue = "PRENATAL AT RISK EDUCATION";
      break;
    case "H1004":
      returnvalue = "FOLLOW UP HOME VISIT/PRENTAL";
      break;
    case "H1005":
      returnvalue = "PRENATALCARE ENHANCED SRV PK";
      break;
    case "H1010":
      returnvalue = "NONMED FAMILY PLANNING ED";
      break;
    case "H1011":
      returnvalue = "FAMILY ASSESSMENT";
      break;
    case "H2000":
      returnvalue = "COMP MULTIDISIPLN EVALUATION";
      break;
    case "H2001":
      returnvalue = "REHABILITATION PROGRAM 1/2 D";
      break;
    case "H2010":
      returnvalue = "COMPREHENSIVE MED SVC 15 MIN";
      break;
    case "H2011":
      returnvalue = "CRISIS INTERVEN SVC, 15 MIN";
      break;
    case "H2012":
      returnvalue = "BEHAV HLTH DAY TREAT, PER HR";
      break;
    case "H2013":
      returnvalue = "PSYCH HLTH FAC SVC, PER DIEM";
      break;
    case "H2014":
      returnvalue = "SKILLS TRAIN AND DEV, 15 MIN";
      break;
    case "H2015":
      returnvalue = "COMP COMM SUPP SVC, 15 MIN";
      break;
    case "H2016":
      returnvalue = "COMP COMM SUPP SVC, PER DIEM";
      break;
    case "H2017":
      returnvalue = "PSYSOC REHAB SVC, PER 15 MIN";
      break;
    case "H2018":
      returnvalue = "PSYSOC REHAB SVC, PER DIEM";
      break;
    case "H2019":
      returnvalue = "THER BEHAV SVC, PER 15 MIN";
      break;
    case "H2020":
      returnvalue = "THER BEHAV SVC, PER DIEM";
      break;
    case "H2021":
      returnvalue = "COM WRAP-AROUND SV, 15 MIN";
      break;
    case "H2022":
      returnvalue = "COM WRAP-AROUND SV, PER DIEM";
      break;
    case "H2023":
      returnvalue = "SUPPORTED EMPLOY, PER 15 MIN";
      break;
    case "H2024":
      returnvalue = "SUPPORTED EMPLOY, PER DIEM";
      break;
    case "H2025":
      returnvalue = "SUPP MAINT EMPLOY, 15 MIN";
      break;
    case "H2026":
      returnvalue = "SUPP MAINT EMPLOY, PER DIEM";
      break;
    case "H2027":
      returnvalue = "PSYCHOED SVC, PER 15 MIN";
      break;
    case "H2028":
      returnvalue = "SEX OFFEND TX SVC, 15 MIN";
      break;
    case "H2029":
      returnvalue = "SEX OFFEND TX SVC, PER DIEM";
      break;
    case "H2030":
      returnvalue = "MH CLUBHOUSE SVC, PER 15 MIN";
      break;
    case "H2031":
      returnvalue = "MH CLUBHOUSE SVC, PER DIEM";
      break;
    case "H2032":
      returnvalue = "ACTIVITY THERAPY, PER 15 MIN";
      break;
    case "H2033":
      returnvalue = "MULTISYS THER/JUVENILE 15MIN";
      break;
    case "H2034":
      returnvalue = "A/D HALFWAY HOUSE, PER DIEM";
      break;
    case "H2035":
      returnvalue = "A/D TX PROGRAM, PER HOUR";
      break;
    case "H2036":
      returnvalue = "A/D TX PROGRAM, PER DIEM";
      break;
    case "H2037":
      returnvalue = "DEV DELAY PREV DP CH, 15 MIN";
      break;
    case "J0120":
      returnvalue = "TETRACYCLIN INJECTION";
      break;
    case "J0128":
      returnvalue = "ABARELIX INJECTION";
      break;
    case "J0129":
      returnvalue = "ABATACEPT INJECTION";
      break;
    case "J0130":
      returnvalue = "ABCIXIMAB INJECTION";
      break;
    case "J0132":
      returnvalue = "ACETYLCYSTEINE INJECTION";
      break;
    case "J0133":
      returnvalue = "ACYCLOVIR INJECTION";
      break;
    case "J0135":
      returnvalue = "ADALIMUMAB INJECTION";
      break;
    case "J0150":
      returnvalue = "INJECTION ADENOSINE 6 MG";
      break;
    case "J0152":
      returnvalue = "ADENOSINE INJECTION";
      break;
    case "J0170":
      returnvalue = "ADRENALIN EPINEPHRIN INJECT";
      break;
    case "J0180":
      returnvalue = "AGALSIDASE BETA INJECTION";
      break;
    case "J0190":
      returnvalue = "INJ BIPERIDEN LACTATE/5 MG";
      break;
    case "J0200":
      returnvalue = "ALATROFLOXACIN MESYLATE";
      break;
    case "J0205":
      returnvalue = "ALGLUCERASE INJECTION";
      break;
    case "J0207":
      returnvalue = "AMIFOSTINE";
      break;
    case "J0210":
      returnvalue = "METHYLDOPATE HCL INJECTION";
      break;
    case "J0215":
      returnvalue = "ALEFACEPT";
      break;
    case "J0220":
      returnvalue = "ALGLUCOSIDASE ALFA INJECTION";
      break;
    case "J0256":
      returnvalue = "ALPHA 1 PROTEINASE INHIBITOR";
      break;
    case "J0270":
      returnvalue = "ALPROSTADIL FOR INJECTION";
      break;
    case "J0275":
      returnvalue = "ALPROSTADIL URETHRAL SUPPOS";
      break;
    case "J0278":
      returnvalue = "AMIKACIN SULFATE INJECTION";
      break;
    case "J0280":
      returnvalue = "AMINOPHYLLIN 250 MG INJ";
      break;
    case "J0282":
      returnvalue = "AMIODARONE HCL";
      break;
    case "J0285":
      returnvalue = "AMPHOTERICIN B";
      break;
    case "J0287":
      returnvalue = "AMPHOTERICIN B LIPID COMPLEX";
      break;
    case "J0288":
      returnvalue = "AMPHO B CHOLESTERYL SULFATE";
      break;
    case "J0289":
      returnvalue = "AMPHOTERICIN B LIPOSOME INJ";
      break;
    case "J0290":
      returnvalue = "AMPICILLIN 500 MG INJ";
      break;
    case "J0295":
      returnvalue = "AMPICILLIN SODIUM PER 1.5 GM";
      break;
    case "J0300":
      returnvalue = "AMOBARBITAL 125 MG INJ";
      break;
    case "J0330":
      returnvalue = "SUCCINYCHOLINE CHLORIDE INJ";
      break;
    case "J0348":
      returnvalue = "ANIDULAFUNGIN INJECTION";
      break;
    case "J0350":
      returnvalue = "INJECTION ANISTREPLASE 30 U";
      break;
    case "J0360":
      returnvalue = "HYDRALAZINE HCL INJECTION";
      break;
    case "J0364":
      returnvalue = "APOMORPHINE HYDROCHLORIDE";
      break;
    case "J0365":
      returnvalue = "APROTONIN, 10,000 KIU";
      break;
    case "J0380":
      returnvalue = "INJ METARAMINOL BITARTRATE";
      break;
    case "J0390":
      returnvalue = "CHLOROQUINE INJECTION";
      break;
    case "J0395":
      returnvalue = "ARBUTAMINE HCL INJECTION";
      break;
    case "J0400":
      returnvalue = "ARIPIPRAZOLE INJECTION";
      break;
    case "J0456":
      returnvalue = "AZITHROMYCIN";
      break;
    case "J0460":
      returnvalue = "ATROPINE SULFATE INJECTION";
      break;
    case "J0461":
      returnvalue = "ATROPINE SULFATE INJECTION";
      break;
    case "J0470":
      returnvalue = "DIMECAPROL INJECTION";
      break;
    case "J0475":
      returnvalue = "BACLOFEN 10 MG INJECTION";
      break;
    case "J0476":
      returnvalue = "BACLOFEN INTRATHECAL TRIAL";
      break;
    case "J0480":
      returnvalue = "BASILIXIMAB";
      break;
    case "J0500":
      returnvalue = "DICYCLOMINE INJECTION";
      break;
    case "J0515":
      returnvalue = "INJ BENZTROPINE MESYLATE";
      break;
    case "J0520":
      returnvalue = "BETHANECHOL CHLORIDE INJECT";
      break;
    case "J0530":
      returnvalue = "PENICILLIN G BENZATHINE INJ";
      break;
    case "J0540":
      returnvalue = "PENICILLIN G BENZATHINE INJ";
      break;
    case "J0550":
      returnvalue = "PENICILLIN G BENZATHINE INJ";
      break;
    case "J0559":
      returnvalue = "PENG BENZATHINE/PROCAINE INJ";
      break;
    case "J0560":
      returnvalue = "PENICILLIN G BENZATHINE INJ";
      break;
    case "J0570":
      returnvalue = "PENICILLIN G BENZATHINE INJ";
      break;
    case "J0580":
      returnvalue = "PENICILLIN G BENZATHINE INJ";
      break;
    case "J0583":
      returnvalue = "BIVALIRUDIN";
      break;
    case "J0585":
      returnvalue = "INJECTION,ONABOTULINUMTOXINA";
      break;
    case "J0586":
      returnvalue = "ABOBOTULINUMTOXINA";
      break;
    case "J0587":
      returnvalue = "INJ, RIMABOTULINUMTOXINB";
      break;
    case "J0592":
      returnvalue = "BUPRENORPHINE HYDROCHLORIDE";
      break;
    case "J0594":
      returnvalue = "BUSULFAN INJECTION";
      break;
    case "J0595":
      returnvalue = "BUTORPHANOL TARTRATE 1 MG";
      break;
    case "J0598":
      returnvalue = "C1 ESTERASE INHIBITOR INJ";
      break;
    case "J0600":
      returnvalue = "EDETATE CALCIUM DISODIUM INJ";
      break;
    case "J0610":
      returnvalue = "CALCIUM GLUCONATE INJECTION";
      break;
    case "J0620":
      returnvalue = "CALCIUM GLYCER & LACT/10 ML";
      break;
    case "J0630":
      returnvalue = "CALCITONIN SALMON INJECTION";
      break;
    case "J0636":
      returnvalue = "INJ CALCITRIOL PER 0.1 MCG";
      break;
    case "J0637":
      returnvalue = "CASPOFUNGIN ACETATE";
      break;
    case "J0640":
      returnvalue = "LEUCOVORIN CALCIUM INJECTION";
      break;
    case "J0641":
      returnvalue = "LEVOLEUCOVORIN INJECTION";
      break;
    case "J0670":
      returnvalue = "INJ MEPIVACAINE HCL/10 ML";
      break;
    case "J0690":
      returnvalue = "CEFAZOLIN SODIUM INJECTION";
      break;
    case "J0692":
      returnvalue = "CEFEPIME HCL FOR INJECTION";
      break;
    case "J0694":
      returnvalue = "CEFOXITIN SODIUM INJECTION";
      break;
    case "J0696":
      returnvalue = "CEFTRIAXONE SODIUM INJECTION";
      break;
    case "J0697":
      returnvalue = "STERILE CEFUROXIME INJECTION";
      break;
    case "J0698":
      returnvalue = "CEFOTAXIME SODIUM INJECTION";
      break;
    case "J0702":
      returnvalue = "BETAMETHASONE ACET&SOD PHOSP";
      break;
    case "J0704":
      returnvalue = "BETAMETHASONE SOD PHOSP/4 MG";
      break;
    case "J0706":
      returnvalue = "CAFFEINE CITRATE INJECTION";
      break;
    case "J0710":
      returnvalue = "CEPHAPIRIN SODIUM INJECTION";
      break;
    case "J0713":
      returnvalue = "INJ CEFTAZIDIME PER 500 MG";
      break;
    case "J0715":
      returnvalue = "CEFTIZOXIME SODIUM / 500 MG";
      break;
    case "J0718":
      returnvalue = "CERTOLIZUMAB PEGOL INJ";
      break;
    case "J0720":
      returnvalue = "CHLORAMPHENICOL SODIUM INJEC";
      break;
    case "J0725":
      returnvalue = "CHORIONIC GONADOTROPIN/1000U";
      break;
    case "J0735":
      returnvalue = "CLONIDINE HYDROCHLORIDE";
      break;
    case "J0740":
      returnvalue = "CIDOFOVIR INJECTION";
      break;
    case "J0743":
      returnvalue = "CILASTATIN SODIUM INJECTION";
      break;
    case "J0744":
      returnvalue = "CIPROFLOXACIN IV";
      break;
    case "J0745":
      returnvalue = "INJ CODEINE PHOSPHATE /30 MG";
      break;
    case "J0760":
      returnvalue = "COLCHICINE INJECTION";
      break;
    case "J0770":
      returnvalue = "COLISTIMETHATE SODIUM INJ";
      break;
    case "J0780":
      returnvalue = "PROCHLORPERAZINE INJECTION";
      break;
    case "J0795":
      returnvalue = "CORTICORELIN OVINE TRIFLUTAL";
      break;
    case "J0800":
      returnvalue = "CORTICOTROPIN INJECTION";
      break;
    case "J0833":
      returnvalue = "COSYNTROPIN INJECTION NOS";
      break;
    case "J0834":
      returnvalue = "COSYNTROPIN CORTROSYN INJ";
      break;
    case "J0835":
      returnvalue = "INJ COSYNTROPIN PER 0.25 MG";
      break;
    case "J0850":
      returnvalue = "CYTOMEGALOVIRUS IMM IV /VIAL";
      break;
    case "J0878":
      returnvalue = "DAPTOMYCIN INJECTION";
      break;
    case "J0881":
      returnvalue = "DARBEPOETIN ALFA, NON-ESRD";
      break;
    case "J0882":
      returnvalue = "DARBEPOETIN ALFA, ESRD USE";
      break;
    case "J0885":
      returnvalue = "EPOETIN ALFA, NON-ESRD";
      break;
    case "J0886":
      returnvalue = "EPOETIN ALFA 1000 UNITS ESRD";
      break;
    case "J0894":
      returnvalue = "DECITABINE INJECTION";
      break;
    case "J0895":
      returnvalue = "DEFEROXAMINE MESYLATE INJ";
      break;
    case "J0900":
      returnvalue = "TESTOSTERONE ENANTHATE INJ";
      break;
    case "J0945":
      returnvalue = "BROMPHENIRAMINE MALEATE INJ";
      break;
    case "J0970":
      returnvalue = "ESTRADIOL VALERATE INJECTION";
      break;
    case "J1000":
      returnvalue = "DEPO-ESTRADIOL CYPIONATE INJ";
      break;
    case "J1020":
      returnvalue = "METHYLPREDNISOLONE 20 MG INJ";
      break;
    case "J1030":
      returnvalue = "METHYLPREDNISOLONE 40 MG INJ";
      break;
    case "J1040":
      returnvalue = "METHYLPREDNISOLONE 80 MG INJ";
      break;
    case "J1051":
      returnvalue = "MEDROXYPROGESTERONE INJ";
      break;
    case "J1055":
      returnvalue = "MEDRXYPROGESTER ACETATE INJ";
      break;
    case "J1056":
      returnvalue = "MA/EC CONTRACEPTIVEINJECTION";
      break;
    case "J1060":
      returnvalue = "TESTOSTERONE CYPIONATE 1 ML";
      break;
    case "J1070":
      returnvalue = "TESTOSTERONE CYPIONAT 100 MG";
      break;
    case "J1080":
      returnvalue = "TESTOSTERONE CYPIONAT 200 MG";
      break;
    case "J1094":
      returnvalue = "INJ DEXAMETHASONE ACETATE";
      break;
    case "J1100":
      returnvalue = "DEXAMETHASONE SODIUM PHOS";
      break;
    case "J1110":
      returnvalue = "INJ DIHYDROERGOTAMINE MESYLT";
      break;
    case "J1120":
      returnvalue = "ACETAZOLAMID SODIUM INJECTIO";
      break;
    case "J1160":
      returnvalue = "DIGOXIN INJECTION";
      break;
    case "J1162":
      returnvalue = "DIGOXIN IMMUNE FAB (OVINE)";
      break;
    case "J1165":
      returnvalue = "PHENYTOIN SODIUM INJECTION";
      break;
    case "J1170":
      returnvalue = "HYDROMORPHONE INJECTION";
      break;
    case "J1180":
      returnvalue = "DYPHYLLINE INJECTION";
      break;
    case "J1190":
      returnvalue = "DEXRAZOXANE HCL INJECTION";
      break;
    case "J1200":
      returnvalue = "DIPHENHYDRAMINE HCL INJECTIO";
      break;
    case "J1205":
      returnvalue = "CHLOROTHIAZIDE SODIUM INJ";
      break;
    case "J1212":
      returnvalue = "DIMETHYL SULFOXIDE 50% 50 ML";
      break;
    case "J1230":
      returnvalue = "METHADONE INJECTION";
      break;
    case "J1240":
      returnvalue = "DIMENHYDRINATE INJECTION";
      break;
    case "J1245":
      returnvalue = "DIPYRIDAMOLE INJECTION";
      break;
    case "J1250":
      returnvalue = "INJ DOBUTAMINE HCL/250 MG";
      break;
    case "J1260":
      returnvalue = "DOLASETRON MESYLATE";
      break;
    case "J1265":
      returnvalue = "DOPAMINE INJECTION";
      break;
    case "J1267":
      returnvalue = "DORIPENEM INJECTION";
      break;
    case "J1270":
      returnvalue = "INJECTION, DOXERCALCIFEROL";
      break;
    case "J1300":
      returnvalue = "ECULIZUMAB INJECTION";
      break;
    case "J1320":
      returnvalue = "AMITRIPTYLINE INJECTION";
      break;
    case "J1324":
      returnvalue = "ENFUVIRTIDE INJECTION";
      break;
    case "J1325":
      returnvalue = "EPOPROSTENOL INJECTION";
      break;
    case "J1327":
      returnvalue = "EPTIFIBATIDE INJECTION";
      break;
    case "J1330":
      returnvalue = "ERGONOVINE MALEATE INJECTION";
      break;
    case "J1335":
      returnvalue = "ERTAPENEM INJECTION";
      break;
    case "J1364":
      returnvalue = "ERYTHRO LACTOBIONATE /500 MG";
      break;
    case "J1380":
      returnvalue = "ESTRADIOL VALERATE 10 MG INJ";
      break;
    case "J1390":
      returnvalue = "ESTRADIOL VALERATE 20 MG INJ";
      break;
    case "J1410":
      returnvalue = "INJ ESTROGEN CONJUGATE 25 MG";
      break;
    case "J1430":
      returnvalue = "ETHANOLAMINE OLEATE 100 MG";
      break;
    case "J1435":
      returnvalue = "INJECTION ESTRONE PER 1 MG";
      break;
    case "J1436":
      returnvalue = "ETIDRONATE DISODIUM INJ";
      break;
    case "J1438":
      returnvalue = "ETANERCEPT INJECTION";
      break;
    case "J1440":
      returnvalue = "FILGRASTIM 300 MCG INJECTION";
      break;
    case "J1441":
      returnvalue = "FILGRASTIM 480 MCG INJECTION";
      break;
    case "J1450":
      returnvalue = "FLUCONAZOLE";
      break;
    case "J1451":
      returnvalue = "FOMEPIZOLE, 15 MG";
      break;
    case "J1452":
      returnvalue = "INTRAOCULAR FOMIVIRSEN NA";
      break;
    case "J1453":
      returnvalue = "FOSAPREPITANT INJECTION";
      break;
    case "J1455":
      returnvalue = "FOSCARNET SODIUM INJECTION";
      break;
    case "J1457":
      returnvalue = "GALLIUM NITRATE INJECTION";
      break;
    case "J1458":
      returnvalue = "GALSULFASE INJECTION";
      break;
    case "J1459":
      returnvalue = "INJ IVIG PRIVIGEN 500 MG";
      break;
    case "J1460":
      returnvalue = "GAMMA GLOBULIN 1 CC INJ";
      break;
    case "J1470":
      returnvalue = "GAMMA GLOBULIN 2 CC INJ";
      break;
    case "J1480":
      returnvalue = "GAMMA GLOBULIN 3 CC INJ";
      break;
    case "J1490":
      returnvalue = "GAMMA GLOBULIN 4 CC INJ";
      break;
    case "J1500":
      returnvalue = "GAMMA GLOBULIN 5 CC INJ";
      break;
    case "J1510":
      returnvalue = "GAMMA GLOBULIN 6 CC INJ";
      break;
    case "J1520":
      returnvalue = "GAMMA GLOBULIN 7 CC INJ";
      break;
    case "J1530":
      returnvalue = "GAMMA GLOBULIN 8 CC INJ";
      break;
    case "J1540":
      returnvalue = "GAMMA GLOBULIN 9 CC INJ";
      break;
    case "J1550":
      returnvalue = "GAMMA GLOBULIN 10 CC INJ";
      break;
    case "J1560":
      returnvalue = "GAMMA GLOBULIN > 10 CC INJ";
      break;
    case "J1561":
      returnvalue = "GAMUNEX INJECTION";
      break;
    case "J1562":
      returnvalue = "VIVAGLOBIN, INJ";
      break;
    case "J1565":
      returnvalue = "RSV-IVIG";
      break;
    case "J1566":
      returnvalue = "IMMUNE GLOBULIN, POWDER";
      break;
    case "J1567":
      returnvalue = "IMMUNE GLOBULIN, LIQUID";
      break;
    case "J1568":
      returnvalue = "OCTAGAM INJECTION";
      break;
    case "J1569":
      returnvalue = "GAMMAGARD LIQUID INJECTION";
      break;
    case "J1570":
      returnvalue = "GANCICLOVIR SODIUM INJECTION";
      break;
    case "J1571":
      returnvalue = "HEPAGAM B IM INJECTION";
      break;
    case "J1572":
      returnvalue = "FLEBOGAMMA INJECTION";
      break;
    case "J1573":
      returnvalue = "HEPAGAM B INTRAVENOUS, INJ";
      break;
    case "J1580":
      returnvalue = "GARAMYCIN GENTAMICIN INJ";
      break;
    case "J1590":
      returnvalue = "GATIFLOXACIN INJECTION";
      break;
    case "J1595":
      returnvalue = "INJECTION GLATIRAMER ACETATE";
      break;
    case "J1600":
      returnvalue = "GOLD SODIUM THIOMALEATE INJ";
      break;
    case "J1610":
      returnvalue = "GLUCAGON HYDROCHLORIDE/1 MG";
      break;
    case "J1620":
      returnvalue = "GONADORELIN HYDROCH/ 100 MCG";
      break;
    case "J1626":
      returnvalue = "GRANISETRON HCL INJECTION";
      break;
    case "J1630":
      returnvalue = "HALOPERIDOL INJECTION";
      break;
    case "J1631":
      returnvalue = "HALOPERIDOL DECANOATE INJ";
      break;
    case "J1640":
      returnvalue = "HEMIN, 1 MG";
      break;
    case "J1642":
      returnvalue = "INJ HEPARIN SODIUM PER 10 U";
      break;
    case "J1644":
      returnvalue = "INJ HEPARIN SODIUM PER 1000U";
      break;
    case "J1645":
      returnvalue = "DALTEPARIN SODIUM";
      break;
    case "J1650":
      returnvalue = "INJ ENOXAPARIN SODIUM";
      break;
    case "J1652":
      returnvalue = "FONDAPARINUX SODIUM";
      break;
    case "J1655":
      returnvalue = "TINZAPARIN SODIUM INJECTION";
      break;
    case "J1670":
      returnvalue = "TETANUS IMMUNE GLOBULIN INJ";
      break;
    case "J1675":
      returnvalue = "HISTRELIN ACETATE";
      break;
    case "J1680":
      returnvalue = "HUMAN FIBRINOGEN CONC INJ";
      break;
    case "J1700":
      returnvalue = "HYDROCORTISONE ACETATE INJ";
      break;
    case "J1710":
      returnvalue = "HYDROCORTISONE SODIUM PH INJ";
      break;
    case "J1720":
      returnvalue = "HYDROCORTISONE SODIUM SUCC I";
      break;
    case "J1730":
      returnvalue = "DIAZOXIDE INJECTION";
      break;
    case "J1740":
      returnvalue = "IBANDRONATE SODIUM INJECTION";
      break;
    case "J1742":
      returnvalue = "IBUTILIDE FUMARATE INJECTION";
      break;
    case "J1743":
      returnvalue = "IDURSULFASE INJECTION";
      break;
    case "J1745":
      returnvalue = "INFLIXIMAB INJECTION";
      break;
    case "J1750":
      returnvalue = "INJ IRON DEXTRAN";
      break;
    case "J1751":
      returnvalue = "IRON DEXTRAN 165 INJECTION";
      break;
    case "J1752":
      returnvalue = "IRON DEXTRAN 267 INJECTION";
      break;
    case "J1756":
      returnvalue = "IRON SUCROSE INJECTION";
      break;
    case "J1785":
      returnvalue = "INJECTION IMIGLUCERASE /UNIT";
      break;
    case "J1790":
      returnvalue = "DROPERIDOL INJECTION";
      break;
    case "J1800":
      returnvalue = "PROPRANOLOL INJECTION";
      break;
    case "J1810":
      returnvalue = "DROPERIDOL/FENTANYL INJ";
      break;
    case "J1815":
      returnvalue = "INSULIN INJECTION";
      break;
    case "J1817":
      returnvalue = "INSULIN FOR INSULIN PUMP USE";
      break;
    case "J1825":
      returnvalue = "INTERFERON BETA-1A";
      break;
    case "J1830":
      returnvalue = "INTERFERON BETA-1B / .25 MG";
      break;
    case "J1835":
      returnvalue = "ITRACONAZOLE INJECTION";
      break;
    case "J1840":
      returnvalue = "KANAMYCIN SULFATE 500 MG INJ";
      break;
    case "J1850":
      returnvalue = "KANAMYCIN SULFATE 75 MG INJ";
      break;
    case "J1885":
      returnvalue = "KETOROLAC TROMETHAMINE INJ";
      break;
    case "J1890":
      returnvalue = "CEPHALOTHIN SODIUM INJECTION";
      break;
    case "J1930":
      returnvalue = "LANREOTIDE INJECTION";
      break;
    case "J1931":
      returnvalue = "LARONIDASE INJECTION";
      break;
    case "J1940":
      returnvalue = "FUROSEMIDE INJECTION";
      break;
    case "J1945":
      returnvalue = "LEPIRUDIN";
      break;
    case "J1950":
      returnvalue = "LEUPROLIDE ACETATE /3.75 MG";
      break;
    case "J1953":
      returnvalue = "LEVETIRACETAM INJECTION";
      break;
    case "J1955":
      returnvalue = "INJ LEVOCARNITINE PER 1 GM";
      break;
    case "J1956":
      returnvalue = "LEVOFLOXACIN INJECTION";
      break;
    case "J1960":
      returnvalue = "LEVORPHANOL TARTRATE INJ";
      break;
    case "J1980":
      returnvalue = "HYOSCYAMINE SULFATE INJ";
      break;
    case "J1990":
      returnvalue = "CHLORDIAZEPOXIDE INJECTION";
      break;
    case "J2001":
      returnvalue = "LIDOCAINE INJECTION";
      break;
    case "J2010":
      returnvalue = "LINCOMYCIN INJECTION";
      break;
    case "J2020":
      returnvalue = "LINEZOLID INJECTION";
      break;
    case "J2060":
      returnvalue = "LORAZEPAM INJECTION";
      break;
    case "J2150":
      returnvalue = "MANNITOL INJECTION";
      break;
    case "J2170":
      returnvalue = "MECASERMIN INJECTION";
      break;
    case "J2175":
      returnvalue = "MEPERIDINE HYDROCHL /100 MG";
      break;
    case "J2180":
      returnvalue = "MEPERIDINE/PROMETHAZINE INJ";
      break;
    case "J2185":
      returnvalue = "MEROPENEM";
      break;
    case "J2210":
      returnvalue = "METHYLERGONOVIN MALEATE INJ";
      break;
    case "J2248":
      returnvalue = "MICAFUNGIN SODIUM INJECTION";
      break;
    case "J2250":
      returnvalue = "INJ MIDAZOLAM HYDROCHLORIDE";
      break;
    case "J2260":
      returnvalue = "INJ MILRINONE LACTATE / 5 MG";
      break;
    case "J2270":
      returnvalue = "MORPHINE SULFATE INJECTION";
      break;
    case "J2271":
      returnvalue = "MORPHINE SO4 INJECTION 100MG";
      break;
    case "J2275":
      returnvalue = "MORPHINE SULFATE INJECTION";
      break;
    case "J2278":
      returnvalue = "ZICONOTIDE INJECTION";
      break;
    case "J2280":
      returnvalue = "INJ, MOXIFLOXACIN 100 MG";
      break;
    case "J2300":
      returnvalue = "INJ NALBUPHINE HYDROCHLORIDE";
      break;
    case "J2310":
      returnvalue = "INJ NALOXONE HYDROCHLORIDE";
      break;
    case "J2315":
      returnvalue = "NALTREXONE, DEPOT FORM";
      break;
    case "J2320":
      returnvalue = "NANDROLONE DECANOATE 50 MG";
      break;
    case "J2321":
      returnvalue = "NANDROLONE DECANOATE 100 MG";
      break;
    case "J2322":
      returnvalue = "NANDROLONE DECANOATE 200 MG";
      break;
    case "J2323":
      returnvalue = "NATALIZUMAB INJECTION";
      break;
    case "J2325":
      returnvalue = "NESIRITIDE INJECTION";
      break;
    case "J2353":
      returnvalue = "OCTREOTIDE INJECTION, DEPOT";
      break;
    case "J2354":
      returnvalue = "OCTREOTIDE INJ, NON-DEPOT";
      break;
    case "J2355":
      returnvalue = "OPRELVEKIN INJECTION";
      break;
    case "J2357":
      returnvalue = "OMALIZUMAB INJECTION";
      break;
    case "J2360":
      returnvalue = "ORPHENADRINE INJECTION";
      break;
    case "J2370":
      returnvalue = "PHENYLEPHRINE HCL INJECTION";
      break;
    case "J2400":
      returnvalue = "CHLOROPROCAINE HCL INJECTION";
      break;
    case "J2405":
      returnvalue = "ONDANSETRON HCL INJECTION";
      break;
    case "J2410":
      returnvalue = "OXYMORPHONE HCL INJECTION";
      break;
    case "J2425":
      returnvalue = "PALIFERMIN INJECTION";
      break;
    case "J2430":
      returnvalue = "PAMIDRONATE DISODIUM /30 MG";
      break;
    case "J2440":
      returnvalue = "PAPAVERIN HCL INJECTION";
      break;
    case "J2460":
      returnvalue = "OXYTETRACYCLINE INJECTION";
      break;
    case "J2469":
      returnvalue = "PALONOSETRON HCL";
      break;
    case "J2501":
      returnvalue = "PARICALCITOL";
      break;
    case "J2503":
      returnvalue = "PEGAPTANIB SODIUM INJECTION";
      break;
    case "J2504":
      returnvalue = "PEGADEMASE BOVINE, 25 IU";
      break;
    case "J2505":
      returnvalue = "INJECTION, PEGFILGRASTIM 6MG";
      break;
    case "J2510":
      returnvalue = "PENICILLIN G PROCAINE INJ";
      break;
    case "J2513":
      returnvalue = "PENTASTARCH 10% SOLUTION";
      break;
    case "J2515":
      returnvalue = "PENTOBARBITAL SODIUM INJ";
      break;
    case "J2540":
      returnvalue = "PENICILLIN G POTASSIUM INJ";
      break;
    case "J2543":
      returnvalue = "PIPERACILLIN/TAZOBACTAM";
      break;
    case "J2545":
      returnvalue = "PENTAMIDINE NON-COMP UNIT";
      break;
    case "J2550":
      returnvalue = "PROMETHAZINE HCL INJECTION";
      break;
    case "J2560":
      returnvalue = "PHENOBARBITAL SODIUM INJ";
      break;
    case "J2562":
      returnvalue = "PLERIXAFOR INJECTION";
      break;
    case "J2590":
      returnvalue = "OXYTOCIN INJECTION";
      break;
    case "J2597":
      returnvalue = "INJ DESMOPRESSIN ACETATE";
      break;
    case "J2650":
      returnvalue = "PREDNISOLONE ACETATE INJ";
      break;
    case "J2670":
      returnvalue = "TOTAZOLINE HCL INJECTION";
      break;
    case "J2675":
      returnvalue = "INJ PROGESTERONE PER 50 MG";
      break;
    case "J2680":
      returnvalue = "FLUPHENAZINE DECANOATE 25 MG";
      break;
    case "J2690":
      returnvalue = "PROCAINAMIDE HCL INJECTION";
      break;
    case "J2700":
      returnvalue = "OXACILLIN SODIUM INJECITON";
      break;
    case "J2710":
      returnvalue = "NEOSTIGMINE METHYLSLFTE INJ";
      break;
    case "J2720":
      returnvalue = "INJ PROTAMINE SULFATE/10 MG";
      break;
    case "J2724":
      returnvalue = "PROTEIN C CONCENTRATE";
      break;
    case "J2725":
      returnvalue = "INJ PROTIRELIN PER 250 MCG";
      break;
    case "J2730":
      returnvalue = "PRALIDOXIME CHLORIDE INJ";
      break;
    case "J2760":
      returnvalue = "PHENTOLAINE MESYLATE INJ";
      break;
    case "J2765":
      returnvalue = "METOCLOPRAMIDE HCL INJECTION";
      break;
    case "J2770":
      returnvalue = "QUINUPRISTIN/DALFOPRISTIN";
      break;
    case "J2778":
      returnvalue = "RANIBIZUMAB INJECTION";
      break;
    case "J2780":
      returnvalue = "RANITIDINE HYDROCHLORIDE INJ";
      break;
    case "J2783":
      returnvalue = "RASBURICASE";
      break;
    case "J2785":
      returnvalue = "REGADENOSON INJECTION";
      break;
    case "J2788":
      returnvalue = "RHO D IMMUNE GLOBULIN 50 MCG";
      break;
    case "J2790":
      returnvalue = "RHO D IMMUNE GLOBULIN INJ";
      break;
    case "J2791":
      returnvalue = "RHOPHYLAC INJECTION";
      break;
    case "J2792":
      returnvalue = "RHO(D) IMMUNE GLOBULIN H, SD";
      break;
    case "J2793":
      returnvalue = "RILONACEPT INJECTION";
      break;
    case "J2794":
      returnvalue = "RISPERIDONE, LONG ACTING";
      break;
    case "J2795":
      returnvalue = "ROPIVACAINE HCL INJECTION";
      break;
    case "J2796":
      returnvalue = "ROMIPLOSTIM INJECTION";
      break;
    case "J2800":
      returnvalue = "METHOCARBAMOL INJECTION";
      break;
    case "J2805":
      returnvalue = "SINCALIDE INJECTION";
      break;
    case "J2810":
      returnvalue = "INJ THEOPHYLLINE PER 40 MG";
      break;
    case "J2820":
      returnvalue = "SARGRAMOSTIM INJECTION";
      break;
    case "J2850":
      returnvalue = "INJ SECRETIN SYNTHETIC HUMAN";
      break;
    case "J2910":
      returnvalue = "AUROTHIOGLUCOSE INJECITON";
      break;
    case "J2912":
      returnvalue = "SODIUM CHLORIDE INJECTION";
      break;
    case "J2916":
      returnvalue = "NA FERRIC GLUCONATE COMPLEX";
      break;
    case "J2920":
      returnvalue = "METHYLPREDNISOLONE INJECTION";
      break;
    case "J2930":
      returnvalue = "METHYLPREDNISOLONE INJECTION";
      break;
    case "J2940":
      returnvalue = "SOMATREM INJECTION";
      break;
    case "J2941":
      returnvalue = "SOMATROPIN INJECTION";
      break;
    case "J2950":
      returnvalue = "PROMAZINE HCL INJECTION";
      break;
    case "J2993":
      returnvalue = "RETEPLASE INJECTION";
      break;
    case "J2995":
      returnvalue = "INJ STREPTOKINASE /250000 IU";
      break;
    case "J2997":
      returnvalue = "ALTEPLASE RECOMBINANT";
      break;
    case "J3000":
      returnvalue = "STREPTOMYCIN INJECTION";
      break;
    case "J3010":
      returnvalue = "FENTANYL CITRATE INJECITON";
      break;
    case "J3030":
      returnvalue = "SUMATRIPTAN SUCCINATE / 6 MG";
      break;
    case "J3070":
      returnvalue = "PENTAZOCINE INJECTION";
      break;
    case "J3100":
      returnvalue = "TENECTEPLASE INJECTION";
      break;
    case "J3101":
      returnvalue = "TENECTEPLASE INJECTION";
      break;
    case "J3105":
      returnvalue = "TERBUTALINE SULFATE INJ";
      break;
    case "J3110":
      returnvalue = "TERIPARATIDE INJECTION";
      break;
    case "J3120":
      returnvalue = "TESTOSTERONE ENANTHATE INJ";
      break;
    case "J3130":
      returnvalue = "TESTOSTERONE ENANTHATE INJ";
      break;
    case "J3140":
      returnvalue = "TESTOSTERONE SUSPENSION INJ";
      break;
    case "J3150":
      returnvalue = "TESTOSTERON PROPIONATE INJ";
      break;
    case "J3230":
      returnvalue = "CHLORPROMAZINE HCL INJECTION";
      break;
    case "J3240":
      returnvalue = "THYROTROPIN INJECTION";
      break;
    case "J3243":
      returnvalue = "TIGECYCLINE INJECTION";
      break;
    case "J3246":
      returnvalue = "TIROFIBAN HCL";
      break;
    case "J3250":
      returnvalue = "TRIMETHOBENZAMIDE HCL INJ";
      break;
    case "J3260":
      returnvalue = "TOBRAMYCIN SULFATE INJECTION";
      break;
    case "J3265":
      returnvalue = "INJECTION TORSEMIDE 10 MG/ML";
      break;
    case "J3280":
      returnvalue = "THIETHYLPERAZINE MALEATE INJ";
      break;
    case "J3285":
      returnvalue = "TREPROSTINIL INJECTION";
      break;
    case "J3300":
      returnvalue = "TRIAMCINOLONE A INJ PRS-FREE";
      break;
    case "J3301":
      returnvalue = "TRIAMCINOLONE ACET INJ NOS";
      break;
    case "J3302":
      returnvalue = "TRIAMCINOLONE DIACETATE INJ";
      break;
    case "J3303":
      returnvalue = "TRIAMCINOLONE HEXACETONL INJ";
      break;
    case "J3305":
      returnvalue = "INJ TRIMETREXATE GLUCORONATE";
      break;
    case "J3310":
      returnvalue = "PERPHENAZINE INJECITON";
      break;
    case "J3315":
      returnvalue = "TRIPTORELIN PAMOATE";
      break;
    case "J3320":
      returnvalue = "SPECTINOMYCN DI-HCL INJ";
      break;
    case "J3350":
      returnvalue = "UREA INJECTION";
      break;
    case "J3355":
      returnvalue = "UROFOLLITROPIN, 75 IU";
      break;
    case "J3360":
      returnvalue = "DIAZEPAM INJECTION";
      break;
    case "J3364":
      returnvalue = "UROKINASE 5000 IU INJECTION";
      break;
    case "J3365":
      returnvalue = "UROKINASE 250,000 IU INJ";
      break;
    case "J3370":
      returnvalue = "VANCOMYCIN HCL INJECTION";
      break;
    case "J3396":
      returnvalue = "VERTEPORFIN INJECTION";
      break;
    case "J3400":
      returnvalue = "TRIFLUPROMAZINE HCL INJ";
      break;
    case "J3410":
      returnvalue = "HYDROXYZINE HCL INJECTION";
      break;
    case "J3411":
      returnvalue = "THIAMINE HCL 100 MG";
      break;
    case "J3415":
      returnvalue = "PYRIDOXINE HCL 100 MG";
      break;
    case "J3420":
      returnvalue = "VITAMIN B12 INJECTION";
      break;
    case "J3430":
      returnvalue = "VITAMIN K PHYTONADIONE INJ";
      break;
    case "J3465":
      returnvalue = "INJECTION, VORICONAZOLE";
      break;
    case "J3470":
      returnvalue = "HYALURONIDASE INJECTION";
      break;
    case "J3471":
      returnvalue = "OVINE, UP TO 999 USP UNITS";
      break;
    case "J3472":
      returnvalue = "OVINE, 1000 USP UNITS";
      break;
    case "J3473":
      returnvalue = "HYALURONIDASE RECOMBINANT";
      break;
    case "J3475":
      returnvalue = "INJ MAGNESIUM SULFATE";
      break;
    case "J3480":
      returnvalue = "INJ POTASSIUM CHLORIDE";
      break;
    case "J3485":
      returnvalue = "ZIDOVUDINE";
      break;
    case "J3486":
      returnvalue = "ZIPRASIDONE MESYLATE";
      break;
    case "J3487":
      returnvalue = "ZOLEDRONIC ACID";
      break;
    case "J3488":
      returnvalue = "RECLAST INJECTION";
      break;
    case "J3490":
      returnvalue = "DRUGS UNCLASSIFIED INJECTION";
      break;
    case "J3520":
      returnvalue = "EDETATE DISODIUM PER 150 MG";
      break;
    case "J3530":
      returnvalue = "NASAL VACCINE INHALATION";
      break;
    case "J3535":
      returnvalue = "METERED DOSE INHALER DRUG";
      break;
    case "J3570":
      returnvalue = "LAETRILE AMYGDALIN VIT B17";
      break;
    case "J3590":
      returnvalue = "UNCLASSIFIED BIOLOGICS";
      break;
    case "J7030":
      returnvalue = "NORMAL SALINE SOLUTION INFUS";
      break;
    case "J7040":
      returnvalue = "NORMAL SALINE SOLUTION INFUS";
      break;
    case "J7042":
      returnvalue = "5% DEXTROSE/NORMAL SALINE";
      break;
    case "J7050":
      returnvalue = "NORMAL SALINE SOLUTION INFUS";
      break;
    case "J7060":
      returnvalue = "5% DEXTROSE/WATER";
      break;
    case "J7070":
      returnvalue = "D5W INFUSION";
      break;
    case "J7100":
      returnvalue = "DEXTRAN 40 INFUSION";
      break;
    case "J7110":
      returnvalue = "DEXTRAN 75 INFUSION";
      break;
    case "J7120":
      returnvalue = "RINGERS LACTATE INFUSION";
      break;
    case "J7130":
      returnvalue = "HYPERTONIC SALINE SOLUTION";
      break;
    case "J7185":
      returnvalue = "XYNTHA INJ";
      break;
    case "J7186":
      returnvalue = "ANTIHEMOPHILIC VIII/VWF COMP";
      break;
    case "J7187":
      returnvalue = "HUMATE-P, INJ";
      break;
    case "J7188":
      returnvalue = "INJ VONWILLEBRAND FACTOR IU";
      break;
    case "J7189":
      returnvalue = "FACTOR VIIA";
      break;
    case "J7190":
      returnvalue = "FACTOR VIII";
      break;
    case "J7191":
      returnvalue = "FACTOR VIII (PORCINE)";
      break;
    case "J7192":
      returnvalue = "FACTOR VIII RECOMBINANT NOS";
      break;
    case "J7193":
      returnvalue = "FACTOR IX NON-RECOMBINANT";
      break;
    case "J7194":
      returnvalue = "FACTOR IX COMPLEX";
      break;
    case "J7195":
      returnvalue = "FACTOR IX RECOMBINANT";
      break;
    case "J7197":
      returnvalue = "ANTITHROMBIN III INJECTION";
      break;
    case "J7198":
      returnvalue = "ANTI-INHIBITOR";
      break;
    case "J7199":
      returnvalue = "HEMOPHILIA CLOT FACTOR NOC";
      break;
    case "J7300":
      returnvalue = "INTRAUT COPPER CONTRACEPTIVE";
      break;
    case "J7302":
      returnvalue = "LEVONORGESTREL IU CONTRACEPT";
      break;
    case "J7303":
      returnvalue = "CONTRACEPTIVE VAGINAL RING";
      break;
    case "J7304":
      returnvalue = "CONTRACEPTIVE HORMONE PATCH";
      break;
    case "J7306":
      returnvalue = "LEVONORGESTREL IMPLANT SYS";
      break;
    case "J7307":
      returnvalue = "ETONOGESTREL IMPLANT SYSTEM";
      break;
    case "J7308":
      returnvalue = "AMINOLEVULINIC ACID HCL TOP";
      break;
    case "J7310":
      returnvalue = "GANCICLOVIR LONG ACT IMPLANT";
      break;
    case "J7311":
      returnvalue = "FLUOCINOLONE ACETONIDE IMPLT";
      break;
    case "J7317":
      returnvalue = "SODIUM HYALURONATE INJECTION";
      break;
    case "J7319":
      returnvalue = "SODIUM HYALURONATE INJECTION";
      break;
    case "J7320":
      returnvalue = "HYLAN G-F 20 INJECTION";
      break;
    case "J7321":
      returnvalue = "HYALGAN/SUPARTZ INJ PER DOSE";
      break;
    case "J7322":
      returnvalue = "SYNVISC INJ PER DOSE";
      break;
    case "J7323":
      returnvalue = "EUFLEXXA INJ PER DOSE";
      break;
    case "J7324":
      returnvalue = "ORTHOVISC INJ PER DOSE";
      break;
    case "J7325":
      returnvalue = "SYNVISC OR SYNVISC-ONE";
      break;
    case "J7330":
      returnvalue = "CULTURED CHONDROCYTES IMPLNT";
      break;
    case "J7340":
      returnvalue = "METABOLIC ACTIVE D/E TISSUE";
      break;
    case "J7341":
      returnvalue = "NON-HUMAN, METABOLIC TISSUE";
      break;
    case "J7342":
      returnvalue = "METABOLICALLY ACTIVE TISSUE";
      break;
    case "J7343":
      returnvalue = "NONMETABOLIC ACT D/E TISSUE";
      break;
    case "J7344":
      returnvalue = "NONMETABOLIC ACTIVE TISSUE";
      break;
    case "J7345":
      returnvalue = "NON-HUMAN, NON-METAB TISSUE";
      break;
    case "J7346":
      returnvalue = "INJECTABLE HUMAN TISSUE";
      break;
    case "J7347":
      returnvalue = "INTEGRA MATRIX TISSUE";
      break;
    case "J7348":
      returnvalue = "TISSUEMEND TISSUE";
      break;
    case "J7349":
      returnvalue = "PRIMATRIX TISSUE";
      break;
    case "J7350":
      returnvalue = "INJECTABLE HUMAN TISSUE";
      break;
    case "J7500":
      returnvalue = "AZATHIOPRINE ORAL 50MG";
      break;
    case "J7501":
      returnvalue = "AZATHIOPRINE PARENTERAL";
      break;
    case "J7502":
      returnvalue = "CYCLOSPORINE ORAL 100 MG";
      break;
    case "J7504":
      returnvalue = "LYMPHOCYTE IMMUNE GLOBULIN";
      break;
    case "J7505":
      returnvalue = "MONOCLONAL ANTIBODIES";
      break;
    case "J7506":
      returnvalue = "PREDNISONE ORAL";
      break;
    case "J7507":
      returnvalue = "TACROLIMUS ORAL PER 1 MG";
      break;
    case "J7509":
      returnvalue = "METHYLPREDNISOLONE ORAL";
      break;
    case "J7510":
      returnvalue = "PREDNISOLONE ORAL PER 5 MG";
      break;
    case "J7511":
      returnvalue = "ANTITHYMOCYTE GLOBULN RABBIT";
      break;
    case "J7513":
      returnvalue = "DACLIZUMAB, PARENTERAL";
      break;
    case "J7515":
      returnvalue = "CYCLOSPORINE ORAL 25 MG";
      break;
    case "J7516":
      returnvalue = "CYCLOSPORIN PARENTERAL 250MG";
      break;
    case "J7517":
      returnvalue = "MYCOPHENOLATE MOFETIL ORAL";
      break;
    case "J7518":
      returnvalue = "MYCOPHENOLIC ACID";
      break;
    case "J7520":
      returnvalue = "SIROLIMUS, ORAL";
      break;
    case "J7525":
      returnvalue = "TACROLIMUS INJECTION";
      break;
    case "J7599":
      returnvalue = "IMMUNOSUPPRESSIVE DRUG NOC";
      break;
    case "J7602":
      returnvalue = "ALBUTEROL INH NON-COMP CON";
      break;
    case "J7603":
      returnvalue = "ALBUTEROL INH NON-COMP U D";
      break;
    case "J7604":
      returnvalue = "ACETYLCYSTEINE COMP UNIT";
      break;
    case "J7605":
      returnvalue = "ARFORMOTEROL NON-COMP UNIT";
      break;
    case "J7606":
      returnvalue = "FORMOTEROL FUMARATE, INH";
      break;
    case "J7607":
      returnvalue = "LEVALBUTEROL COMP CON";
      break;
    case "J7608":
      returnvalue = "ACETYLCYSTEINE NON-COMP UNIT";
      break;
    case "J7609":
      returnvalue = "ALBUTEROL COMP UNIT";
      break;
    case "J7610":
      returnvalue = "ALBUTEROL COMP CON";
      break;
    case "J7611":
      returnvalue = "ALBUTEROL NON-COMP CON";
      break;
    case "J7612":
      returnvalue = "LEVALBUTEROL NON-COMP CON";
      break;
    case "J7613":
      returnvalue = "ALBUTEROL NON-COMP UNIT";
      break;
    case "J7614":
      returnvalue = "LEVALBUTEROL NON-COMP UNIT";
      break;
    case "J7615":
      returnvalue = "LEVALBUTEROL COMP UNIT";
      break;
    case "J7620":
      returnvalue = "ALBUTEROL IPRATROP NON-COMP";
      break;
    case "J7622":
      returnvalue = "BECLOMETHASONE COMP UNIT";
      break;
    case "J7624":
      returnvalue = "BETAMETHASONE COMP UNIT";
      break;
    case "J7626":
      returnvalue = "BUDESONIDE NON-COMP UNIT";
      break;
    case "J7627":
      returnvalue = "BUDESONIDE COMP UNIT";
      break;
    case "J7628":
      returnvalue = "BITOLTEROL MESYLATE COMP CON";
      break;
    case "J7629":
      returnvalue = "BITOLTEROL MESYLATE COMP UNT";
      break;
    case "J7631":
      returnvalue = "CROMOLYN SODIUM NONCOMP UNIT";
      break;
    case "J7632":
      returnvalue = "CROMOLYN SODIUM COMP UNIT";
      break;
    case "J7633":
      returnvalue = "BUDESONIDE NON-COMP CON";
      break;
    case "J7634":
      returnvalue = "BUDESONIDE COMP CON";
      break;
    case "J7635":
      returnvalue = "ATROPINE COMP CON";
      break;
    case "J7636":
      returnvalue = "ATROPINE COMP UNIT";
      break;
    case "J7637":
      returnvalue = "DEXAMETHASONE COMP CON";
      break;
    case "J7638":
      returnvalue = "DEXAMETHASONE COMP UNIT";
      break;
    case "J7639":
      returnvalue = "DORNASE ALFA NON-COMP UNIT";
      break;
    case "J7640":
      returnvalue = "FORMOTEROL COMP UNIT";
      break;
    case "J7641":
      returnvalue = "FLUNISOLIDE COMP UNIT";
      break;
    case "J7642":
      returnvalue = "GLYCOPYRROLATE COMP CON";
      break;
    case "J7643":
      returnvalue = "GLYCOPYRROLATE COMP UNIT";
      break;
    case "J7644":
      returnvalue = "IPRATROPIUM BROMIDE NON-COMP";
      break;
    case "J7645":
      returnvalue = "IPRATROPIUM BROMIDE COMP";
      break;
    case "J7647":
      returnvalue = "ISOETHARINE COMP CON";
      break;
    case "J7648":
      returnvalue = "ISOETHARINE NON-COMP CON";
      break;
    case "J7649":
      returnvalue = "ISOETHARINE NON-COMP UNIT";
      break;
    case "J7650":
      returnvalue = "ISOETHARINE COMP UNIT";
      break;
    case "J7657":
      returnvalue = "ISOPROTERENOL COMP CON";
      break;
    case "J7658":
      returnvalue = "ISOPROTERENOL NON-COMP CON";
      break;
    case "J7659":
      returnvalue = "ISOPROTERENOL NON-COMP UNIT";
      break;
    case "J7660":
      returnvalue = "ISOPROTERENOL COMP UNIT";
      break;
    case "J7667":
      returnvalue = "METAPROTERENOL COMP CON";
      break;
    case "J7668":
      returnvalue = "METAPROTERENOL NON-COMP CON";
      break;
    case "J7669":
      returnvalue = "METAPROTERENOL NON-COMP UNIT";
      break;
    case "J7670":
      returnvalue = "METAPROTERENOL COMP UNIT";
      break;
    case "J7674":
      returnvalue = "METHACHOLINE CHLORIDE, NEB";
      break;
    case "J7676":
      returnvalue = "PENTAMIDINE COMP UNIT DOSE";
      break;
    case "J7680":
      returnvalue = "TERBUTALINE SULF COMP CON";
      break;
    case "J7681":
      returnvalue = "TERBUTALINE SULF COMP UNIT";
      break;
    case "J7682":
      returnvalue = "TOBRAMYCIN NON-COMP UNIT";
      break;
    case "J7683":
      returnvalue = "TRIAMCINOLONE COMP CON";
      break;
    case "J7684":
      returnvalue = "TRIAMCINOLONE COMP UNIT";
      break;
    case "J7685":
      returnvalue = "TOBRAMYCIN COMP UNIT";
      break;
    case "J7699":
      returnvalue = "INHALATION SOLUTION FOR DME";
      break;
    case "J7799":
      returnvalue = "NON-INHALATION DRUG FOR DME";
      break;
    case "J8498":
      returnvalue = "ANTIEMETIC RECTAL/SUPP NOS";
      break;
    case "J8499":
      returnvalue = "ORAL PRESCRIP DRUG NON CHEMO";
      break;
    case "J8501":
      returnvalue = "ORAL APREPITANT";
      break;
    case "J8510":
      returnvalue = "ORAL BUSULFAN";
      break;
    case "J8515":
      returnvalue = "CABERGOLINE, ORAL 0.25MG";
      break;
    case "J8520":
      returnvalue = "CAPECITABINE, ORAL, 150 MG";
      break;
    case "J8521":
      returnvalue = "CAPECITABINE, ORAL, 500 MG";
      break;
    case "J8530":
      returnvalue = "CYCLOPHOSPHAMIDE ORAL 25 MG";
      break;
    case "J8540":
      returnvalue = "ORAL DEXAMETHASONE";
      break;
    case "J8560":
      returnvalue = "ETOPOSIDE ORAL 50 MG";
      break;
    case "J8565":
      returnvalue = "GEFITINIB ORAL";
      break;
    case "J8597":
      returnvalue = "ANTIEMETIC DRUG ORAL NOS";
      break;
    case "J8600":
      returnvalue = "MELPHALAN ORAL 2 MG";
      break;
    case "J8610":
      returnvalue = "METHOTREXATE ORAL 2.5 MG";
      break;
    case "J8650":
      returnvalue = "NABILONE ORAL";
      break;
    case "J8700":
      returnvalue = "TEMOZOLOMIDE";
      break;
    case "J8705":
      returnvalue = "TOPOTECAN ORAL";
      break;
    case "J8999":
      returnvalue = "ORAL PRESCRIPTION DRUG CHEMO";
      break;
    case "J9000":
      returnvalue = "DOXORUBICIN HCL INJECTION";
      break;
    case "J9001":
      returnvalue = "DOXORUBICIN HCL LIPOSOME INJ";
      break;
    case "J9010":
      returnvalue = "ALEMTUZUMAB INJECTION";
      break;
    case "J9015":
      returnvalue = "ALDESLEUKIN INJECTION";
      break;
    case "J9017":
      returnvalue = "ARSENIC TRIOXIDE INJECTION";
      break;
    case "J9020":
      returnvalue = "ASPARAGINASE INJECTION";
      break;
    case "J9025":
      returnvalue = "AZACITIDINE INJECTION";
      break;
    case "J9027":
      returnvalue = "CLOFARABINE INJECTION";
      break;
    case "J9031":
      returnvalue = "BCG LIVE INTRAVESICAL VAC";
      break;
    case "J9033":
      returnvalue = "BENDAMUSTINE INJECTION";
      break;
    case "J9035":
      returnvalue = "BEVACIZUMAB INJECTION";
      break;
    case "J9040":
      returnvalue = "BLEOMYCIN SULFATE INJECTION";
      break;
    case "J9041":
      returnvalue = "BORTEZOMIB INJECTION";
      break;
    case "J9045":
      returnvalue = "CARBOPLATIN INJECTION";
      break;
    case "J9050":
      returnvalue = "CARMUSTINE INJECTION";
      break;
    case "J9055":
      returnvalue = "CETUXIMAB INJECTION";
      break;
    case "J9060":
      returnvalue = "CISPLATIN 10 MG INJECTION";
      break;
    case "J9062":
      returnvalue = "CISPLATIN 50 MG INJECTION";
      break;
    case "J9065":
      returnvalue = "INJ CLADRIBINE PER 1 MG";
      break;
    case "J9070":
      returnvalue = "CYCLOPHOSPHAMIDE 100 MG INJ";
      break;
    case "J9080":
      returnvalue = "CYCLOPHOSPHAMIDE 200 MG INJ";
      break;
    case "J9090":
      returnvalue = "CYCLOPHOSPHAMIDE 500 MG INJ";
      break;
    case "J9091":
      returnvalue = "CYCLOPHOSPHAMIDE 1.0 GRM INJ";
      break;
    case "J9092":
      returnvalue = "CYCLOPHOSPHAMIDE 2.0 GRM INJ";
      break;
    case "J9093":
      returnvalue = "CYCLOPHOSPHAMIDE LYOPHILIZED";
      break;
    case "J9094":
      returnvalue = "CYCLOPHOSPHAMIDE LYOPHILIZED";
      break;
    case "J9095":
      returnvalue = "CYCLOPHOSPHAMIDE LYOPHILIZED";
      break;
    case "J9096":
      returnvalue = "CYCLOPHOSPHAMIDE LYOPHILIZED";
      break;
    case "J9097":
      returnvalue = "CYCLOPHOSPHAMIDE LYOPHILIZED";
      break;
    case "J9098":
      returnvalue = "CYTARABINE LIPOSOME INJ";
      break;
    case "J9100":
      returnvalue = "CYTARABINE HCL 100 MG INJ";
      break;
    case "J9110":
      returnvalue = "CYTARABINE HCL 500 MG INJ";
      break;
    case "J9120":
      returnvalue = "DACTINOMYCIN INJECTION";
      break;
    case "J9130":
      returnvalue = "DACARBAZINE 100 MG INJ";
      break;
    case "J9140":
      returnvalue = "DACARBAZINE 200 MG INJ";
      break;
    case "J9150":
      returnvalue = "DAUNORUBICIN INJECTION";
      break;
    case "J9151":
      returnvalue = "DAUNORUBICIN CITRATE INJ";
      break;
    case "J9155":
      returnvalue = "DEGARELIX INJECTION";
      break;
    case "J9160":
      returnvalue = "DENILEUKIN DIFTITOX INJ";
      break;
    case "J9165":
      returnvalue = "DIETHYLSTILBESTROL INJECTION";
      break;
    case "J9170":
      returnvalue = "DOCETAXEL INJECTION";
      break;
    case "J9171":
      returnvalue = "DOCETAXEL INJECTION";
      break;
    case "J9175":
      returnvalue = "ELLIOTTS B SOLUTION PER ML";
      break;
    case "J9178":
      returnvalue = "INJ, EPIRUBICIN HCL, 2 MG";
      break;
    case "J9181":
      returnvalue = "ETOPOSIDE INJECTION";
      break;
    case "J9182":
      returnvalue = "ETOPOSIDE 100 MG INJ";
      break;
    case "J9185":
      returnvalue = "FLUDARABINE PHOSPHATE INJ";
      break;
    case "J9190":
      returnvalue = "FLUOROURACIL INJECTION";
      break;
    case "J9200":
      returnvalue = "FLOXURIDINE INJECTION";
      break;
    case "J9201":
      returnvalue = "GEMCITABINE HCL INJECTION";
      break;
    case "J9202":
      returnvalue = "GOSERELIN ACETATE IMPLANT";
      break;
    case "J9206":
      returnvalue = "IRINOTECAN INJECTION";
      break;
    case "J9207":
      returnvalue = "IXABEPILONE INJECTION";
      break;
    case "J9208":
      returnvalue = "IFOSFOMIDE INJECTION";
      break;
    case "J9209":
      returnvalue = "MESNA INJECTION";
      break;
    case "J9211":
      returnvalue = "IDARUBICIN HCL INJECTION";
      break;
    case "J9212":
      returnvalue = "INTERFERON ALFACON-1 INJ";
      break;
    case "J9213":
      returnvalue = "INTERFERON ALFA-2A INJ";
      break;
    case "J9214":
      returnvalue = "INTERFERON ALFA-2B INJ";
      break;
    case "J9215":
      returnvalue = "INTERFERON ALFA-N3 INJ";
      break;
    case "J9216":
      returnvalue = "INTERFERON GAMMA 1-B INJ";
      break;
    case "J9217":
      returnvalue = "LEUPROLIDE ACETATE SUSPNSION";
      break;
    case "J9218":
      returnvalue = "LEUPROLIDE ACETATE INJECITON";
      break;
    case "J9219":
      returnvalue = "LEUPROLIDE ACETATE IMPLANT";
      break;
    case "J9225":
      returnvalue = "VANTAS IMPLANT";
      break;
    case "J9226":
      returnvalue = "SUPPRELIN LA IMPLANT";
      break;
    case "J9230":
      returnvalue = "MECHLORETHAMINE HCL INJ";
      break;
    case "J9245":
      returnvalue = "INJ MELPHALAN HYDROCHL 50 MG";
      break;
    case "J9250":
      returnvalue = "METHOTREXATE SODIUM INJ";
      break;
    case "J9260":
      returnvalue = "METHOTREXATE SODIUM INJ";
      break;
    case "J9261":
      returnvalue = "NELARABINE INJECTION";
      break;
    case "J9263":
      returnvalue = "OXALIPLATIN";
      break;
    case "J9264":
      returnvalue = "PACLITAXEL PROTEIN BOUND";
      break;
    case "J9265":
      returnvalue = "PACLITAXEL INJECTION";
      break;
    case "J9266":
      returnvalue = "PEGASPARGASE INJECTION";
      break;
    case "J9268":
      returnvalue = "PENTOSTATIN INJECTION";
      break;
    case "J9270":
      returnvalue = "PLICAMYCIN (MITHRAMYCIN) INJ";
      break;
    case "J9280":
      returnvalue = "MITOMYCIN 5 MG INJ";
      break;
    case "J9290":
      returnvalue = "MITOMYCIN 20 MG INJ";
      break;
    case "J9291":
      returnvalue = "MITOMYCIN 40 MG INJ";
      break;
    case "J9293":
      returnvalue = "MITOXANTRONE HYDROCHL / 5 MG";
      break;
    case "J9300":
      returnvalue = "GEMTUZUMAB OZOGAMICIN INJ";
      break;
    case "J9303":
      returnvalue = "PANITUMUMAB INJECTION";
      break;
    case "J9305":
      returnvalue = "PEMETREXED INJECTION";
      break;
    case "J9310":
      returnvalue = "RITUXIMAB INJECTION";
      break;
    case "J9320":
      returnvalue = "STREPTOZOCIN INJECTION";
      break;
    case "J9328":
      returnvalue = "TEMOZOLOMIDE INJECTION";
      break;
    case "J9330":
      returnvalue = "TEMSIROLIMUS INJECTION";
      break;
    case "J9340":
      returnvalue = "THIOTEPA INJECTION";
      break;
    case "J9350":
      returnvalue = "TOPOTECAN INJECTION";
      break;
    case "J9355":
      returnvalue = "TRASTUZUMAB INJECTION";
      break;
    case "J9357":
      returnvalue = "VALRUBICIN INJECTION";
      break;
    case "J9360":
      returnvalue = "VINBLASTINE SULFATE INJ";
      break;
    case "J9370":
      returnvalue = "VINCRISTINE SULFATE 1 MG INJ";
      break;
    case "J9375":
      returnvalue = "VINCRISTINE SULFATE 2 MG INJ";
      break;
    case "J9380":
      returnvalue = "VINCRISTINE SULFATE 5 MG INJ";
      break;
    case "J9390":
      returnvalue = "VINORELBINE TARTRATE INJ";
      break;
    case "J9395":
      returnvalue = "INJECTION, FULVESTRANT";
      break;
    case "J9600":
      returnvalue = "PORFIMER SODIUM INJECTION";
      break;
    case "J9999":
      returnvalue = "CHEMOTHERAPY DRUG";
      break;
    case "K0001":
      returnvalue = "STANDARD WHEELCHAIR";
      break;
    case "K0002":
      returnvalue = "STND HEMI (LOW SEAT) WHLCHR";
      break;
    case "K0003":
      returnvalue = "LIGHTWEIGHT WHEELCHAIR";
      break;
    case "K0004":
      returnvalue = "HIGH STRENGTH LTWT WHLCHR";
      break;
    case "K0005":
      returnvalue = "ULTRALIGHTWEIGHT WHEELCHAIR";
      break;
    case "K0006":
      returnvalue = "HEAVY DUTY WHEELCHAIR";
      break;
    case "K0007":
      returnvalue = "EXTRA HEAVY DUTY WHEELCHAIR";
      break;
    case "K0009":
      returnvalue = "OTHER MANUAL WHEELCHAIR/BASE";
      break;
    case "K0010":
      returnvalue = "STND WT FRAME POWER WHLCHR";
      break;
    case "K0011":
      returnvalue = "STND WT PWR WHLCHR W CONTROL";
      break;
    case "K0012":
      returnvalue = "LTWT PORTBL POWER WHLCHR";
      break;
    case "K0014":
      returnvalue = "OTHER POWER WHLCHR BASE";
      break;
    case "K0015":
      returnvalue = "DETACH NON-ADJUS HGHT ARMRST";
      break;
    case "K0017":
      returnvalue = "DETACH ADJUST ARMREST BASE";
      break;
    case "K0018":
      returnvalue = "DETACH ADJUST ARMRST UPPER";
      break;
    case "K0019":
      returnvalue = "ARM PAD EACH";
      break;
    case "K0020":
      returnvalue = "FIXED ADJUST ARMREST PAIR";
      break;
    case "K0037":
      returnvalue = "HIGH MOUNT FLIP-UP FOOTREST";
      break;
    case "K0038":
      returnvalue = "LEG STRAP EACH";
      break;
    case "K0039":
      returnvalue = "LEG STRAP H STYLE EACH";
      break;
    case "K0040":
      returnvalue = "ADJUSTABLE ANGLE FOOTPLATE";
      break;
    case "K0041":
      returnvalue = "LARGE SIZE FOOTPLATE EACH";
      break;
    case "K0042":
      returnvalue = "STANDARD SIZE FOOTPLATE EACH";
      break;
    case "K0043":
      returnvalue = "FTRST LOWER EXTENSION TUBE";
      break;
    case "K0044":
      returnvalue = "FTRST UPPER HANGER BRACKET";
      break;
    case "K0045":
      returnvalue = "FOOTREST COMPLETE ASSEMBLY";
      break;
    case "K0046":
      returnvalue = "ELEVAT LEGRST LOW EXTENSION";
      break;
    case "K0047":
      returnvalue = "ELEVAT LEGRST UP HANGR BRACK";
      break;
    case "K0050":
      returnvalue = "RATCHET ASSEMBLY";
      break;
    case "K0051":
      returnvalue = "CAM RELESE ASSEM FTRST/LGRST";
      break;
    case "K0052":
      returnvalue = "SWINGAWAY DETACH FOOTREST";
      break;
    case "K0053":
      returnvalue = "ELEVATE FOOTREST ARTICULATE";
      break;
    case "K0056":
      returnvalue = "SEAT HT <17 OR >=21 LTWT WC";
      break;
    case "K0065":
      returnvalue = "SPOKE PROTECTORS";
      break;
    case "K0069":
      returnvalue = "REAR WHL COMPLETE SOLID TIRE";
      break;
    case "K0070":
      returnvalue = "REAR WHL COMPL PNEUM TIRE";
      break;
    case "K0071":
      returnvalue = "FRONT CASTR COMPL PNEUM TIRE";
      break;
    case "K0072":
      returnvalue = "FRNT CSTR CMPL SEM-PNEUM TIR";
      break;
    case "K0073":
      returnvalue = "CASTER PIN LOCK EACH";
      break;
    case "K0077":
      returnvalue = "FRONT CASTER ASSEM COMPLETE";
      break;
    case "K0090":
      returnvalue = "REAR TIRE POWER WHEELCHAIR";
      break;
    case "K0091":
      returnvalue = "REAR TIRE TUBE POWER WHLCHR";
      break;
    case "K0092":
      returnvalue = "REAR ASSEM CMPLT POWR WHLCHR";
      break;
    case "K0093":
      returnvalue = "REAR ZERO PRESSURE TIRE TUBE";
      break;
    case "K0094":
      returnvalue = "WHEEL TIRE FOR POWER BASE";
      break;
    case "K0095":
      returnvalue = "WHEEL TIRE TUBE EACH BASE";
      break;
    case "K0096":
      returnvalue = "WHEEL ASSEM POWR BASE COMPLT";
      break;
    case "K0097":
      returnvalue = "WHEEL ZERO PRESURE TIRE TUBE";
      break;
    case "K0098":
      returnvalue = "DRIVE BELT POWER WHEELCHAIR";
      break;
    case "K0099":
      returnvalue = "PWR WHEELCHAIR FRONT  CASTER";
      break;
    case "K0105":
      returnvalue = "IV HANGER";
      break;
    case "K0108":
      returnvalue = "W/C COMPONENT-ACCESSORY NOS";
      break;
    case "K0195":
      returnvalue = "ELEVATING WHLCHAIR LEG RESTS";
      break;
    case "K0455":
      returnvalue = "PUMP UNINTERRUPTED INFUSION";
      break;
    case "K0462":
      returnvalue = "TEMPORARY REPLACEMENT EQPMNT";
      break;
    case "K0552":
      returnvalue = "SUPPLY/EXT INF PUMP SYR TYPE";
      break;
    case "K0553":
      returnvalue = "COMBINATION ORAL/NASAL MASK";
      break;
    case "K0554":
      returnvalue = "REPL ORAL CUSHION COMBO MASK";
      break;
    case "K0555":
      returnvalue = "REPL NASAL PILLOW COMB MASK";
      break;
    case "K0601":
      returnvalue = "REPL BATT SILVER OXIDE 1.5 V";
      break;
    case "K0602":
      returnvalue = "REPL BATT SILVER OXIDE 3 V";
      break;
    case "K0603":
      returnvalue = "REPL BATT ALKALINE 1.5 V";
      break;
    case "K0604":
      returnvalue = "REPL BATT LITHIUM 3.6 V";
      break;
    case "K0605":
      returnvalue = "REPL BATT LITHIUM 4.5 V";
      break;
    case "K0606":
      returnvalue = "AED GARMENT W ELEC ANALYSIS";
      break;
    case "K0607":
      returnvalue = "REPL BATT FOR AED";
      break;
    case "K0608":
      returnvalue = "REPL GARMENT FOR AED";
      break;
    case "K0609":
      returnvalue = "REPL ELECTRODE FOR AED";
      break;
    case "K0669":
      returnvalue = "SEAT/BACK CUS NO SADMERC VER";
      break;
    case "K0672":
      returnvalue = "REMOVABLE SOFT INTERFACE LE";
      break;
    case "K0730":
      returnvalue = "CTRL DOSE INH DRUG DELIV SYS";
      break;
    case "K0733":
      returnvalue = "12-24HR SEALED LEAD ACID";
      break;
    case "K0734":
      returnvalue = "ADJ SKIN PRO W/C CUS WD<22IN";
      break;
    case "K0735":
      returnvalue = "ADJ SKIN PRO WC CUS WD>=22IN";
      break;
    case "K0736":
      returnvalue = "ADJ SKIN PRO/POS WC CUS<22IN";
      break;
    case "K0737":
      returnvalue = "ADJ SKIN PRO/POS WC CUS>=22?";
      break;
    case "K0738":
      returnvalue = "PORTABLE GAS OXYGEN SYSTEM";
      break;
    case "K0739":
      returnvalue = "REPAIR/SVC DME NON-OXYGEN EQ";
      break;
    case "K0740":
      returnvalue = "REPAIR/SVC OXYGEN EQUIPMENT";
      break;
    case "K0800":
      returnvalue = "POV GROUP 1 STD UP TO 300LBS";
      break;
    case "K0801":
      returnvalue = "POV GROUP 1 HD 301-450 LBS";
      break;
    case "K0802":
      returnvalue = "POV GROUP 1 VHD 451-600 LBS";
      break;
    case "K0806":
      returnvalue = "POV GROUP 2 STD UP TO 300LBS";
      break;
    case "K0807":
      returnvalue = "POV GROUP 2 HD 301-450 LBS";
      break;
    case "K0808":
      returnvalue = "POV GROUP 2 VHD 451-600 LBS";
      break;
    case "K0812":
      returnvalue = "POWER OPERATED VEHICLE NOC";
      break;
    case "K0813":
      returnvalue = "PWC GP 1 STD PORT SEAT/BACK";
      break;
    case "K0814":
      returnvalue = "PWC GP 1 STD PORT CAP CHAIR";
      break;
    case "K0815":
      returnvalue = "PWC GP 1 STD SEAT/BACK";
      break;
    case "K0816":
      returnvalue = "PWC GP 1 STD CAP CHAIR";
      break;
    case "K0820":
      returnvalue = "PWC GP 2 STD PORT SEAT/BACK";
      break;
    case "K0821":
      returnvalue = "PWC GP 2 STD PORT CAP CHAIR";
      break;
    case "K0822":
      returnvalue = "PWC GP 2 STD SEAT/BACK";
      break;
    case "K0823":
      returnvalue = "PWC GP 2 STD CAP CHAIR";
      break;
    case "K0824":
      returnvalue = "PWC GP 2 HD SEAT/BACK";
      break;
    case "K0825":
      returnvalue = "PWC GP 2 HD CAP CHAIR";
      break;
    case "K0826":
      returnvalue = "PWC GP 2 VHD SEAT/BACK";
      break;
    case "K0827":
      returnvalue = "PWC GP VHD CAP CHAIR";
      break;
    case "K0828":
      returnvalue = "PWC GP 2 XTRA HD SEAT/BACK";
      break;
    case "K0829":
      returnvalue = "PWC GP 2 XTRA HD CAP CHAIR";
      break;
    case "K0830":
      returnvalue = "PWC GP2 STD SEAT ELEVATE S/B";
      break;
    case "K0831":
      returnvalue = "PWC GP2 STD SEAT ELEVATE CAP";
      break;
    case "K0835":
      returnvalue = "PWC GP2 STD SING POW OPT S/B";
      break;
    case "K0836":
      returnvalue = "PWC GP2 STD SING POW OPT CAP";
      break;
    case "K0837":
      returnvalue = "PWC GP 2 HD SING POW OPT S/B";
      break;
    case "K0838":
      returnvalue = "PWC GP 2 HD SING POW OPT CAP";
      break;
    case "K0839":
      returnvalue = "PWC GP2 VHD SING POW OPT S/B";
      break;
    case "K0840":
      returnvalue = "PWC GP2 XHD SING POW OPT S/B";
      break;
    case "K0841":
      returnvalue = "PWC GP2 STD MULT POW OPT S/B";
      break;
    case "K0842":
      returnvalue = "PWC GP2 STD MULT POW OPT CAP";
      break;
    case "K0843":
      returnvalue = "PWC GP2 HD MULT POW OPT S/B";
      break;
    case "K0848":
      returnvalue = "PWC GP 3 STD SEAT/BACK";
      break;
    case "K0849":
      returnvalue = "PWC GP 3 STD CAP CHAIR";
      break;
    case "K0850":
      returnvalue = "PWC GP 3 HD SEAT/BACK";
      break;
    case "K0851":
      returnvalue = "PWC GP 3 HD CAP CHAIR";
      break;
    case "K0852":
      returnvalue = "PWC GP 3 VHD SEAT/BACK";
      break;
    case "K0853":
      returnvalue = "PWC GP 3 VHD CAP CHAIR";
      break;
    case "K0854":
      returnvalue = "PWC GP 3 XHD SEAT/BACK";
      break;
    case "K0855":
      returnvalue = "PWC GP 3 XHD CAP CHAIR";
      break;
    case "K0856":
      returnvalue = "PWC GP3 STD SING POW OPT S/B";
      break;
    case "K0857":
      returnvalue = "PWC GP3 STD SING POW OPT CAP";
      break;
    case "K0858":
      returnvalue = "PWC GP3 HD SING POW OPT S/B";
      break;
    case "K0859":
      returnvalue = "PWC GP3 HD SING POW OPT CAP";
      break;
    case "K0860":
      returnvalue = "PWC GP3 VHD SING POW OPT S/B";
      break;
    case "K0861":
      returnvalue = "PWC GP3 STD MULT POW OPT S/B";
      break;
    case "K0862":
      returnvalue = "PWC GP3 HD MULT POW OPT S/B";
      break;
    case "K0863":
      returnvalue = "PWC GP3 VHD MULT POW OPT S/B";
      break;
    case "K0864":
      returnvalue = "PWC GP3 XHD MULT POW OPT S/B";
      break;
    case "K0868":
      returnvalue = "PWC GP 4 STD SEAT/BACK";
      break;
    case "K0869":
      returnvalue = "PWC GP 4 STD CAP CHAIR";
      break;
    case "K0870":
      returnvalue = "PWC GP 4 HD SEAT/BACK";
      break;
    case "K0871":
      returnvalue = "PWC GP 4 VHD SEAT/BACK";
      break;
    case "K0877":
      returnvalue = "PWC GP4 STD SING POW OPT S/B";
      break;
    case "K0878":
      returnvalue = "PWC GP4 STD SING POW OPT CAP";
      break;
    case "K0879":
      returnvalue = "PWC GP4 HD SING POW OPT S/B";
      break;
    case "K0880":
      returnvalue = "PWC GP4 VHD SING POW OPT S/B";
      break;
    case "K0884":
      returnvalue = "PWC GP4 STD MULT POW OPT S/B";
      break;
    case "K0885":
      returnvalue = "PWC GP4 STD MULT POW OPT CAP";
      break;
    case "K0886":
      returnvalue = "PWC GP4 HD MULT POW S/B";
      break;
    case "K0890":
      returnvalue = "PWC GP5 PED SING POW OPT S/B";
      break;
    case "K0891":
      returnvalue = "PWC GP5 PED MULT POW OPT S/B";
      break;
    case "K0898":
      returnvalue = "POWER WHEELCHAIR NOC";
      break;
    case "K0899":
      returnvalue = "POW MOBIL DEV NO SADMERC";
      break;
    case "L0100":
      returnvalue = "CRANIAL ORTHOSIS/HELMET MOLD";
      break;
    case "L0110":
      returnvalue = "CRANIAL ORTHOSIS/HELMET NONM";
      break;
    case "L0112":
      returnvalue = "CRANIAL CERVICAL ORTHOSIS";
      break;
    case "L0113":
      returnvalue = "CRANIAL CERVICAL TORTICOLLIS";
      break;
    case "L0120":
      returnvalue = "CERV FLEXIBLE NON-ADJUSTABLE";
      break;
    case "L0130":
      returnvalue = "FLEX THERMOPLASTIC COLLAR MO";
      break;
    case "L0140":
      returnvalue = "CERVICAL SEMI-RIGID ADJUSTAB";
      break;
    case "L0150":
      returnvalue = "CERV SEMI-RIG ADJ MOLDED CHN";
      break;
    case "L0160":
      returnvalue = "CERV SEMI-RIG WIRE OCC/MAND";
      break;
    case "L0170":
      returnvalue = "CERVICAL COLLAR MOLDED TO PT";
      break;
    case "L0172":
      returnvalue = "CERV COL THERMPLAS FOAM 2 PI";
      break;
    case "L0174":
      returnvalue = "CERV COL FOAM 2 PIECE W THOR";
      break;
    case "L0180":
      returnvalue = "CER POST COL OCC/MAN SUP ADJ";
      break;
    case "L0190":
      returnvalue = "CERV COLLAR SUPP ADJ CERV BA";
      break;
    case "L0200":
      returnvalue = "CERV COL SUPP ADJ BAR & THOR";
      break;
    case "L0210":
      returnvalue = "THORACIC RIB BELT";
      break;
    case "L0220":
      returnvalue = "THOR RIB BELT CUSTOM FABRICA";
      break;
    case "L0430":
      returnvalue = "DEWALL POSTURE PROTECTOR";
      break;
    case "L0450":
      returnvalue = "TLSO FLEX PREFAB THORACIC";
      break;
    case "L0452":
      returnvalue = "TLSO FLEX CUSTOM FAB THORACI";
      break;
    case "L0454":
      returnvalue = "TLSO FLEX PREFAB SACROCOC-T9";
      break;
    case "L0456":
      returnvalue = "TLSO FLEX PREFAB";
      break;
    case "L0458":
      returnvalue = "TLSO 2MOD SYMPHIS-XIPHO PRE";
      break;
    case "L0460":
      returnvalue = "TLSO2MOD SYMPHYSIS-STERN PRE";
      break;
    case "L0462":
      returnvalue = "TLSO 3MOD SACRO-SCAP PRE";
      break;
    case "L0464":
      returnvalue = "TLSO 4MOD SACRO-SCAP PRE";
      break;
    case "L0466":
      returnvalue = "TLSO RIGID FRAME PRE SOFT AP";
      break;
    case "L0468":
      returnvalue = "TLSO RIGID FRAME PREFAB PELV";
      break;
    case "L0470":
      returnvalue = "TLSO RIGID FRAME PRE SUBCLAV";
      break;
    case "L0472":
      returnvalue = "TLSO RIGID FRAME HYPEREX PRE";
      break;
    case "L0480":
      returnvalue = "TLSO RIGID PLASTIC CUSTOM FA";
      break;
    case "L0482":
      returnvalue = "TLSO RIGID LINED CUSTOM FAB";
      break;
    case "L0484":
      returnvalue = "TLSO RIGID PLASTIC CUST FAB";
      break;
    case "L0486":
      returnvalue = "TLSO RIGIDLINED CUST FAB TWO";
      break;
    case "L0488":
      returnvalue = "TLSO RIGID LINED PRE ONE PIE";
      break;
    case "L0490":
      returnvalue = "TLSO RIGID PLASTIC PRE ONE";
      break;
    case "L0491":
      returnvalue = "TLSO 2 PIECE RIGID SHELL";
      break;
    case "L0492":
      returnvalue = "TLSO 3 PIECE RIGID SHELL";
      break;
    case "L0621":
      returnvalue = "SIO FLEX PELVISACRAL PREFAB";
      break;
    case "L0622":
      returnvalue = "SIO FLEX PELVISACRAL CUSTOM";
      break;
    case "L0623":
      returnvalue = "SIO PANEL PREFAB";
      break;
    case "L0624":
      returnvalue = "SIO PANEL CUSTOM";
      break;
    case "L0625":
      returnvalue = "LO FLEXIBL L1-BELOW L5 PRE";
      break;
    case "L0626":
      returnvalue = "LO SAG STAYS/PANELS PRE-FAB";
      break;
    case "L0627":
      returnvalue = "LO SAGITT RIGID PANEL PREFAB";
      break;
    case "L0628":
      returnvalue = "LO FLEX W/O RIGID STAYS PRE";
      break;
    case "L0629":
      returnvalue = "LSO FLEX W/RIGID STAYS CUST";
      break;
    case "L0630":
      returnvalue = "LSO POST RIGID PANEL PRE";
      break;
    case "L0631":
      returnvalue = "LSO SAG-CORO RIGID FRAME PRE";
      break;
    case "L0632":
      returnvalue = "LSO SAG RIGID FRAME CUST";
      break;
    case "L0633":
      returnvalue = "LSO FLEXION CONTROL PREFAB";
      break;
    case "L0634":
      returnvalue = "LSO FLEXION CONTROL CUSTOM";
      break;
    case "L0635":
      returnvalue = "LSO SAGIT RIGID PANEL PREFAB";
      break;
    case "L0636":
      returnvalue = "LSO SAGITTAL RIGID PANEL CUS";
      break;
    case "L0637":
      returnvalue = "LSO SAG-CORONAL PANEL PREFAB";
      break;
    case "L0638":
      returnvalue = "LSO SAG-CORONAL PANEL CUSTOM";
      break;
    case "L0639":
      returnvalue = "LSO S/C SHELL/PANEL PREFAB";
      break;
    case "L0640":
      returnvalue = "LSO S/C SHELL/PANEL CUSTOM";
      break;
    case "L0700":
      returnvalue = "CTLSO A-P-L CONTROL MOLDED";
      break;
    case "L0710":
      returnvalue = "CTLSO A-P-L CONTROL W/ INTER";
      break;
    case "L0810":
      returnvalue = "HALO CERVICAL INTO JCKT VEST";
      break;
    case "L0820":
      returnvalue = "HALO CERVICAL INTO BODY JACK";
      break;
    case "L0830":
      returnvalue = "HALO CERV INTO MILWAUKEE TYP";
      break;
    case "L0859":
      returnvalue = "MRI COMPATIBLE SYSTEM";
      break;
    case "L0861":
      returnvalue = "HALO REPL LINER/INTERFACE";
      break;
    case "L0960":
      returnvalue = "POST SURGICAL SUPPORT PADS";
      break;
    case "L0970":
      returnvalue = "TLSO CORSET FRONT";
      break;
    case "L0972":
      returnvalue = "LSO CORSET FRONT";
      break;
    case "L0974":
      returnvalue = "TLSO FULL CORSET";
      break;
    case "L0976":
      returnvalue = "LSO FULL CORSET";
      break;
    case "L0978":
      returnvalue = "AXILLARY CRUTCH EXTENSION";
      break;
    case "L0980":
      returnvalue = "PERONEAL STRAPS PAIR";
      break;
    case "L0982":
      returnvalue = "STOCKING SUPP GRIPS SET OF F";
      break;
    case "L0984":
      returnvalue = "PROTECTIVE BODY SOCK EACH";
      break;
    case "L0999":
      returnvalue = "ADD TO SPINAL ORTHOSIS NOS";
      break;
    case "L1000":
      returnvalue = "CTLSO MILWAUKE INITIAL MODEL";
      break;
    case "L1001":
      returnvalue = "CTLSO INFANT IMMOBILIZER";
      break;
    case "L1005":
      returnvalue = "TENSION BASED SCOLIOSIS ORTH";
      break;
    case "L1010":
      returnvalue = "CTLSO AXILLA SLING";
      break;
    case "L1020":
      returnvalue = "KYPHOSIS PAD";
      break;
    case "L1025":
      returnvalue = "KYPHOSIS PAD FLOATING";
      break;
    case "L1030":
      returnvalue = "LUMBAR BOLSTER PAD";
      break;
    case "L1040":
      returnvalue = "LUMBAR OR LUMBAR RIB PAD";
      break;
    case "L1050":
      returnvalue = "STERNAL PAD";
      break;
    case "L1060":
      returnvalue = "THORACIC PAD";
      break;
    case "L1070":
      returnvalue = "TRAPEZIUS SLING";
      break;
    case "L1080":
      returnvalue = "OUTRIGGER";
      break;
    case "L1085":
      returnvalue = "OUTRIGGER BIL W/ VERT EXTENS";
      break;
    case "L1090":
      returnvalue = "LUMBAR SLING";
      break;
    case "L1100":
      returnvalue = "RING FLANGE PLASTIC/LEATHER";
      break;
    case "L1110":
      returnvalue = "RING FLANGE PLAS/LEATHER MOL";
      break;
    case "L1120":
      returnvalue = "COVERS FOR UPRIGHT EACH";
      break;
    case "L1200":
      returnvalue = "FURNSH INITIAL ORTHOSIS ONLY";
      break;
    case "L1210":
      returnvalue = "LATERAL THORACIC EXTENSION";
      break;
    case "L1220":
      returnvalue = "ANTERIOR THORACIC EXTENSION";
      break;
    case "L1230":
      returnvalue = "MILWAUKEE TYPE SUPERSTRUCTUR";
      break;
    case "L1240":
      returnvalue = "LUMBAR DEROTATION PAD";
      break;
    case "L1250":
      returnvalue = "ANTERIOR ASIS PAD";
      break;
    case "L1260":
      returnvalue = "ANTERIOR THORACIC DEROTATION";
      break;
    case "L1270":
      returnvalue = "ABDOMINAL PAD";
      break;
    case "L1280":
      returnvalue = "RIB GUSSET (ELASTIC) EACH";
      break;
    case "L1290":
      returnvalue = "LATERAL TROCHANTERIC PAD";
      break;
    case "L1300":
      returnvalue = "BODY JACKET MOLD TO PATIENT";
      break;
    case "L1310":
      returnvalue = "POST-OPERATIVE BODY JACKET";
      break;
    case "L1499":
      returnvalue = "SPINAL ORTHOSIS NOS";
      break;
    case "L1500":
      returnvalue = "THKAO MOBILITY FRAME";
      break;
    case "L1510":
      returnvalue = "THKAO STANDING FRAME";
      break;
    case "L1520":
      returnvalue = "THKAO SWIVEL WALKER";
      break;
    case "L1600":
      returnvalue = "ABDUCT HIP FLEX FREJKA W CVR";
      break;
    case "L1610":
      returnvalue = "ABDUCT HIP FLEX FREJKA COVR";
      break;
    case "L1620":
      returnvalue = "ABDUCT HIP FLEX PAVLIK HARNE";
      break;
    case "L1630":
      returnvalue = "ABDUCT CONTROL HIP SEMI-FLEX";
      break;
    case "L1640":
      returnvalue = "PELV BAND/SPREAD BAR THIGH C";
      break;
    case "L1650":
      returnvalue = "HO ABDUCTION HIP ADJUSTABLE";
      break;
    case "L1652":
      returnvalue = "HO BI THIGHCUFFS W SPRDR BAR";
      break;
    case "L1660":
      returnvalue = "HO ABDUCTION STATIC PLASTIC";
      break;
    case "L1680":
      returnvalue = "PELVIC & HIP CONTROL THIGH C";
      break;
    case "L1685":
      returnvalue = "POST-OP HIP ABDUCT CUSTOM FA";
      break;
    case "L1686":
      returnvalue = "HO POST-OP HIP ABDUCTION";
      break;
    case "L1690":
      returnvalue = "COMBINATION BILATERAL HO";
      break;
    case "L1700":
      returnvalue = "LEG PERTHES ORTH TORONTO TYP";
      break;
    case "L1710":
      returnvalue = "LEGG PERTHES ORTH NEWINGTON";
      break;
    case "L1720":
      returnvalue = "LEGG PERTHES ORTHOSIS TRILAT";
      break;
    case "L1730":
      returnvalue = "LEGG PERTHES ORTH SCOTTISH R";
      break;
    case "L1755":
      returnvalue = "LEGG PERTHES PATTEN BOTTOM T";
      break;
    case "L1800":
      returnvalue = "KNEE ORTHOSES ELAS W STAYS";
      break;
    case "L1810":
      returnvalue = "KO ELASTIC WITH JOINTS";
      break;
    case "L1815":
      returnvalue = "ELASTIC WITH CONDYLAR PADS";
      break;
    case "L1820":
      returnvalue = "KO ELAS W/ CONDYLE PADS & JO";
      break;
    case "L1825":
      returnvalue = "KO ELASTIC KNEE CAP";
      break;
    case "L1830":
      returnvalue = "KO IMMOBILIZER CANVAS LONGIT";
      break;
    case "L1831":
      returnvalue = "KNEE ORTH POS LOCKING JOINT";
      break;
    case "L1832":
      returnvalue = "KO ADJ JNT POS RIGID SUPPORT";
      break;
    case "L1834":
      returnvalue = "KO W/0 JOINT RIGID MOLDED TO";
      break;
    case "L1836":
      returnvalue = "RIGID KO WO JOINTS";
      break;
    case "L1840":
      returnvalue = "KO DEROT ANT CRUCIATE CUSTOM";
      break;
    case "L1843":
      returnvalue = "KO SINGLE UPRIGHT CUSTOM FIT";
      break;
    case "L1844":
      returnvalue = "KO W/ADJ JT ROT CNTRL MOLDED";
      break;
    case "L1845":
      returnvalue = "KO W/ ADJ FLEX/EXT ROTAT CUS";
      break;
    case "L1846":
      returnvalue = "KO W ADJ FLEX/EXT ROTAT MOLD";
      break;
    case "L1847":
      returnvalue = "KO ADJUSTABLE W AIR CHAMBERS";
      break;
    case "L1850":
      returnvalue = "KO SWEDISH TYPE";
      break;
    case "L1855":
      returnvalue = "KO PLAS DOUB UPRIGHT JNT MOL";
      break;
    case "L1858":
      returnvalue = "KO POLYCENTRIC PNEUMATIC PAD";
      break;
    case "L1860":
      returnvalue = "KO SUPRACONDYLAR SOCKET MOLD";
      break;
    case "L1870":
      returnvalue = "KO DOUB UPRIGHT LACERS MOLDE";
      break;
    case "L1880":
      returnvalue = "KO DOUB UPRIGHT CUFFS/LACERS";
      break;
    case "L1900":
      returnvalue = "AFO SPRNG WIR DRSFLX CALF BD";
      break;
    case "L1901":
      returnvalue = "PREFAB ANKLE ORTHOSIS";
      break;
    case "L1902":
      returnvalue = "AFO ANKLE GAUNTLET";
      break;
    case "L1904":
      returnvalue = "AFO MOLDED ANKLE GAUNTLET";
      break;
    case "L1906":
      returnvalue = "AFO MULTILIGAMENTUS ANKLE SU";
      break;
    case "L1907":
      returnvalue = "AFO SUPRAMALLEOLAR CUSTOM";
      break;
    case "L1910":
      returnvalue = "AFO SING BAR CLASP ATTACH SH";
      break;
    case "L1920":
      returnvalue = "AFO SING UPRIGHT W/ ADJUST S";
      break;
    case "L1930":
      returnvalue = "AFO PLASTIC";
      break;
    case "L1932":
      returnvalue = "AFO RIG ANT TIB PREFAB TCF/=";
      break;
    case "L1940":
      returnvalue = "AFO MOLDED TO PATIENT PLASTI";
      break;
    case "L1945":
      returnvalue = "AFO MOLDED PLAS RIG ANT TIB";
      break;
    case "L1950":
      returnvalue = "AFO SPIRAL MOLDED TO PT PLAS";
      break;
    case "L1951":
      returnvalue = "AFO SPIRAL PREFABRICATED";
      break;
    case "L1960":
      returnvalue = "AFO POS SOLID ANK PLASTIC MO";
      break;
    case "L1970":
      returnvalue = "AFO PLASTIC MOLDED W/ANKLE J";
      break;
    case "L1971":
      returnvalue = "AFO W/ANKLE JOINT, PREFAB";
      break;
    case "L1980":
      returnvalue = "AFO SING SOLID STIRRUP CALF";
      break;
    case "L1990":
      returnvalue = "AFO DOUB SOLID STIRRUP CALF";
      break;
    case "L2000":
      returnvalue = "KAFO SING FRE STIRR THI/CALF";
      break;
    case "L2005":
      returnvalue = "KAFO SNG/DBL MECHANICAL ACT";
      break;
    case "L2010":
      returnvalue = "KAFO SNG SOLID STIRRUP W/O J";
      break;
    case "L2020":
      returnvalue = "KAFO DBL SOLID STIRRUP BAND/";
      break;
    case "L2030":
      returnvalue = "KAFO DBL SOLID STIRRUP W/O J";
      break;
    case "L2034":
      returnvalue = "KAFO PLA SIN UP W/WO K/A CUS";
      break;
    case "L2035":
      returnvalue = "KAFO PLASTIC PEDIATRIC SIZE";
      break;
    case "L2036":
      returnvalue = "KAFO PLAS DOUB FREE KNEE MOL";
      break;
    case "L2037":
      returnvalue = "KAFO PLAS SING FREE KNEE MOL";
      break;
    case "L2038":
      returnvalue = "KAFO W/O JOINT MULTI-AXIS AN";
      break;
    case "L2040":
      returnvalue = "HKAFO TORSION BIL ROT STRAPS";
      break;
    case "L2050":
      returnvalue = "HKAFO TORSION CABLE HIP PELV";
      break;
    case "L2060":
      returnvalue = "HKAFO TORSION BALL BEARING J";
      break;
    case "L2070":
      returnvalue = "HKAFO TORSION UNILAT ROT STR";
      break;
    case "L2080":
      returnvalue = "HKAFO UNILAT TORSION CABLE";
      break;
    case "L2090":
      returnvalue = "HKAFO UNILAT TORSION BALL BR";
      break;
    case "L2106":
      returnvalue = "AFO TIB FX CAST PLASTER MOLD";
      break;
    case "L2108":
      returnvalue = "AFO TIB FX CAST MOLDED TO PT";
      break;
    case "L2112":
      returnvalue = "AFO TIBIAL FRACTURE SOFT";
      break;
    case "L2114":
      returnvalue = "AFO TIB FX SEMI-RIGID";
      break;
    case "L2116":
      returnvalue = "AFO TIBIAL FRACTURE RIGID";
      break;
    case "L2126":
      returnvalue = "KAFO FEM FX CAST THERMOPLAS";
      break;
    case "L2128":
      returnvalue = "KAFO FEM FX CAST MOLDED TO P";
      break;
    case "L2132":
      returnvalue = "KAFO FEMORAL FX CAST SOFT";
      break;
    case "L2134":
      returnvalue = "KAFO FEM FX CAST SEMI-RIGID";
      break;
    case "L2136":
      returnvalue = "KAFO FEMORAL FX CAST RIGID";
      break;
    case "L2180":
      returnvalue = "PLAS SHOE INSERT W ANK JOINT";
      break;
    case "L2182":
      returnvalue = "DROP LOCK KNEE";
      break;
    case "L2184":
      returnvalue = "LIMITED MOTION KNEE JOINT";
      break;
    case "L2186":
      returnvalue = "ADJ MOTION KNEE JNT LERMAN T";
      break;
    case "L2188":
      returnvalue = "QUADRILATERAL BRIM";
      break;
    case "L2190":
      returnvalue = "WAIST BELT";
      break;
    case "L2192":
      returnvalue = "PELVIC BAND & BELT THIGH FLA";
      break;
    case "L2200":
      returnvalue = "LIMITED ANKLE MOTION EA JNT";
      break;
    case "L2210":
      returnvalue = "DORSIFLEXION ASSIST EACH JOI";
      break;
    case "L2220":
      returnvalue = "DORSI & PLANTAR FLEX ASS/RES";
      break;
    case "L2230":
      returnvalue = "SPLIT FLAT CALIPER STIRR & P";
      break;
    case "L2232":
      returnvalue = "ROCKER BOTTOM, CONTACT AFO";
      break;
    case "L2240":
      returnvalue = "ROUND CALIPER AND PLATE ATTA";
      break;
    case "L2250":
      returnvalue = "FOOT PLATE MOLDED STIRRUP AT";
      break;
    case "L2260":
      returnvalue = "REINFORCED SOLID STIRRUP";
      break;
    case "L2265":
      returnvalue = "LONG TONGUE STIRRUP";
      break;
    case "L2270":
      returnvalue = "VARUS/VALGUS STRAP PADDED/LI";
      break;
    case "L2275":
      returnvalue = "PLASTIC MOD LOW EXT PAD/LINE";
      break;
    case "L2280":
      returnvalue = "MOLDED INNER BOOT";
      break;
    case "L2300":
      returnvalue = "ABDUCTION BAR JOINTED ADJUST";
      break;
    case "L2310":
      returnvalue = "ABDUCTION BAR-STRAIGHT";
      break;
    case "L2320":
      returnvalue = "NON-MOLDED LACER";
      break;
    case "L2330":
      returnvalue = "LACER MOLDED TO PATIENT MODE";
      break;
    case "L2335":
      returnvalue = "ANTERIOR SWING BAND";
      break;
    case "L2340":
      returnvalue = "PRE-TIBIAL SHELL MOLDED TO P";
      break;
    case "L2350":
      returnvalue = "PROSTHETIC TYPE SOCKET MOLDE";
      break;
    case "L2360":
      returnvalue = "EXTENDED STEEL SHANK";
      break;
    case "L2370":
      returnvalue = "PATTEN BOTTOM";
      break;
    case "L2375":
      returnvalue = "TORSION ANK & HALF SOLID STI";
      break;
    case "L2380":
      returnvalue = "TORSION STRAIGHT KNEE JOINT";
      break;
    case "L2385":
      returnvalue = "STRAIGHT KNEE JOINT HEAVY DU";
      break;
    case "L2387":
      returnvalue = "ADD LE POLY KNEE CUSTOM KAFO";
      break;
    case "L2390":
      returnvalue = "OFFSET KNEE JOINT EACH";
      break;
    case "L2395":
      returnvalue = "OFFSET KNEE JOINT HEAVY DUTY";
      break;
    case "L2397":
      returnvalue = "SUSPENSION SLEEVE LOWER EXT";
      break;
    case "L2405":
      returnvalue = "KNEE JOINT DROP LOCK EA JNT";
      break;
    case "L2415":
      returnvalue = "KNEE JOINT CAM LOCK EACH JOI";
      break;
    case "L2425":
      returnvalue = "KNEE DISC/DIAL LOCK/ADJ FLEX";
      break;
    case "L2430":
      returnvalue = "KNEE JNT RATCHET LOCK EA JNT";
      break;
    case "L2492":
      returnvalue = "KNEE LIFT LOOP DROP LOCK RIN";
      break;
    case "L2500":
      returnvalue = "THI/GLUT/ISCHIA WGT BEARING";
      break;
    case "L2510":
      returnvalue = "TH/WGHT BEAR QUAD-LAT BRIM M";
      break;
    case "L2520":
      returnvalue = "TH/WGHT BEAR QUAD-LAT BRIM C";
      break;
    case "L2525":
      returnvalue = "TH/WGHT BEAR NAR M-L BRIM MO";
      break;
    case "L2526":
      returnvalue = "TH/WGHT BEAR NAR M-L BRIM CU";
      break;
    case "L2530":
      returnvalue = "THIGH/WGHT BEAR LACER NON-MO";
      break;
    case "L2540":
      returnvalue = "THIGH/WGHT BEAR LACER MOLDED";
      break;
    case "L2550":
      returnvalue = "THIGH/WGHT BEAR HIGH ROLL CU";
      break;
    case "L2570":
      returnvalue = "HIP CLEVIS TYPE 2 POSIT JNT";
      break;
    case "L2580":
      returnvalue = "PELVIC CONTROL PELVIC SLING";
      break;
    case "L2600":
      returnvalue = "HIP CLEVIS/THRUST BEARING FR";
      break;
    case "L2610":
      returnvalue = "HIP CLEVIS/THRUST BEARING LO";
      break;
    case "L2620":
      returnvalue = "PELVIC CONTROL HIP HEAVY DUT";
      break;
    case "L2622":
      returnvalue = "HIP JOINT ADJUSTABLE FLEXION";
      break;
    case "L2624":
      returnvalue = "HIP ADJ FLEX EXT ABDUCT CONT";
      break;
    case "L2627":
      returnvalue = "PLASTIC MOLD RECIPRO HIP & C";
      break;
    case "L2628":
      returnvalue = "METAL FRAME RECIPRO HIP & CA";
      break;
    case "L2630":
      returnvalue = "PELVIC CONTROL BAND & BELT U";
      break;
    case "L2640":
      returnvalue = "PELVIC CONTROL BAND & BELT B";
      break;
    case "L2650":
      returnvalue = "PELV & THOR CONTROL GLUTEAL";
      break;
    case "L2660":
      returnvalue = "THORACIC CONTROL THORACIC BA";
      break;
    case "L2670":
      returnvalue = "THORAC CONT PARASPINAL UPRIG";
      break;
    case "L2680":
      returnvalue = "THORAC CONT LAT SUPPORT UPRI";
      break;
    case "L2750":
      returnvalue = "PLATING CHROME/NICKEL PR BAR";
      break;
    case "L2755":
      returnvalue = "CARBON GRAPHITE LAMINATION";
      break;
    case "L2760":
      returnvalue = "EXTENSION PER EXTENSION PER";
      break;
    case "L2768":
      returnvalue = "ORTHO SIDEBAR DISCONNECT";
      break;
    case "L2770":
      returnvalue = "LOW EXT ORTHOSIS PER BAR/JNT";
      break;
    case "L2780":
      returnvalue = "NON-CORROSIVE FINISH";
      break;
    case "L2785":
      returnvalue = "DROP LOCK RETAINER EACH";
      break;
    case "L2795":
      returnvalue = "KNEE CONTROL FULL KNEECAP";
      break;
    case "L2800":
      returnvalue = "KNEE CAP MEDIAL OR LATERAL P";
      break;
    case "L2810":
      returnvalue = "KNEE CONTROL CONDYLAR PAD";
      break;
    case "L2820":
      returnvalue = "SOFT INTERFACE BELOW KNEE SE";
      break;
    case "L2830":
      returnvalue = "SOFT INTERFACE ABOVE KNEE SE";
      break;
    case "L2840":
      returnvalue = "TIBIAL LENGTH SOCK FX OR EQU";
      break;
    case "L2850":
      returnvalue = "FEMORAL LGTH SOCK FX OR EQUA";
      break;
    case "L2860":
      returnvalue = "TORSION MECHANISM KNEE/ANKLE";
      break;
    case "L2861":
      returnvalue = "TORSION MECHANISM KNEE/ANKLE";
      break;
    case "L2999":
      returnvalue = "LOWER EXTREMITY ORTHOSIS NOS";
      break;
    case "L3000":
      returnvalue = "FT INSERT UCB BERKELEY SHELL";
      break;
    case "L3001":
      returnvalue = "FOOT INSERT REMOV MOLDED SPE";
      break;
    case "L3002":
      returnvalue = "FOOT INSERT PLASTAZOTE OR EQ";
      break;
    case "L3003":
      returnvalue = "FOOT INSERT SILICONE GEL EAC";
      break;
    case "L3010":
      returnvalue = "FOOT LONGITUDINAL ARCH SUPPO";
      break;
    case "L3020":
      returnvalue = "FOOT LONGITUD/METATARSAL SUP";
      break;
    case "L3030":
      returnvalue = "FOOT ARCH SUPPORT REMOV PREM";
      break;
    case "L3031":
      returnvalue = "FOOT LAMIN/PREPREG COMPOSITE";
      break;
    case "L3040":
      returnvalue = "FT ARCH SUPRT PREMOLD LONGIT";
      break;
    case "L3050":
      returnvalue = "FOOT ARCH SUPP PREMOLD METAT";
      break;
    case "L3060":
      returnvalue = "FOOT ARCH SUPP LONGITUD/META";
      break;
    case "L3070":
      returnvalue = "ARCH SUPRT ATT TO SHO LONGIT";
      break;
    case "L3080":
      returnvalue = "ARCH SUPP ATT TO SHOE METATA";
      break;
    case "L3090":
      returnvalue = "ARCH SUPP ATT TO SHOE LONG/M";
      break;
    case "L3100":
      returnvalue = "HALLUS-VALGUS NGHT DYNAMIC S";
      break;
    case "L3140":
      returnvalue = "ABDUCTION ROTATION BAR SHOE";
      break;
    case "L3150":
      returnvalue = "ABDUCT ROTATION BAR W/O SHOE";
      break;
    case "L3160":
      returnvalue = "SHOE STYLED POSITIONING DEV";
      break;
    case "L3170":
      returnvalue = "FOOT PLASTIC HEEL STABILIZER";
      break;
    case "L3201":
      returnvalue = "OXFORD W SUPINAT/PRONAT INF";
      break;
    case "L3202":
      returnvalue = "OXFORD W/ SUPINAT/PRONATOR C";
      break;
    case "L3203":
      returnvalue = "OXFORD W/ SUPINATOR/PRONATOR";
      break;
    case "L3204":
      returnvalue = "HIGHTOP W/ SUPP/PRONATOR INF";
      break;
    case "L3206":
      returnvalue = "HIGHTOP W/ SUPP/PRONATOR CHI";
      break;
    case "L3207":
      returnvalue = "HIGHTOP W/ SUPP/PRONATOR JUN";
      break;
    case "L3208":
      returnvalue = "SURGICAL BOOT EACH INFANT";
      break;
    case "L3209":
      returnvalue = "SURGICAL BOOT EACH CHILD";
      break;
    case "L3211":
      returnvalue = "SURGICAL BOOT EACH JUNIOR";
      break;
    case "L3212":
      returnvalue = "BENESCH BOOT PAIR INFANT";
      break;
    case "L3213":
      returnvalue = "BENESCH BOOT PAIR CHILD";
      break;
    case "L3214":
      returnvalue = "BENESCH BOOT PAIR JUNIOR";
      break;
    case "L3215":
      returnvalue = "ORTHOPEDIC FTWEAR LADIES OXF";
      break;
    case "L3216":
      returnvalue = "ORTHOPED LADIES SHOES DPTH I";
      break;
    case "L3217":
      returnvalue = "LADIES SHOES HIGHTOP DEPTH I";
      break;
    case "L3219":
      returnvalue = "ORTHOPEDIC MENS SHOES OXFORD";
      break;
    case "L3221":
      returnvalue = "ORTHOPEDIC MENS SHOES DPTH I";
      break;
    case "L3222":
      returnvalue = "MENS SHOES HIGHTOP DEPTH INL";
      break;
    case "L3224":
      returnvalue = "WOMAN'S SHOE OXFORD BRACE";
      break;
    case "L3225":
      returnvalue = "MAN'S SHOE OXFORD BRACE";
      break;
    case "L3230":
      returnvalue = "CUSTOM SHOES DEPTH INLAY";
      break;
    case "L3250":
      returnvalue = "CUSTOM MOLD SHOE REMOV PROST";
      break;
    case "L3251":
      returnvalue = "SHOE MOLDED TO PT SILICONE S";
      break;
    case "L3252":
      returnvalue = "SHOE MOLDED PLASTAZOTE CUST";
      break;
    case "L3253":
      returnvalue = "SHOE MOLDED PLASTAZOTE CUST";
      break;
    case "L3254":
      returnvalue = "ORTH FOOT NON-STNDARD SIZE/W";
      break;
    case "L3255":
      returnvalue = "ORTH FOOT NON-STANDARD SIZE/";
      break;
    case "L3257":
      returnvalue = "ORTH FOOT ADD CHARGE SPLIT S";
      break;
    case "L3260":
      returnvalue = "AMBULATORY SURGICAL BOOT EAC";
      break;
    case "L3265":
      returnvalue = "PLASTAZOTE SANDAL EACH";
      break;
    case "L3300":
      returnvalue = "SHO LIFT TAPER TO METATARSAL";
      break;
    case "L3310":
      returnvalue = "SHOE LIFT ELEV HEEL/SOLE NEO";
      break;
    case "L3320":
      returnvalue = "SHOE LIFT ELEV HEEL/SOLE COR";
      break;
    case "L3330":
      returnvalue = "LIFTS ELEVATION METAL EXTENS";
      break;
    case "L3332":
      returnvalue = "SHOE LIFTS TAPERED TO ONE-HA";
      break;
    case "L3334":
      returnvalue = "SHOE LIFTS ELEVATION HEEL /I";
      break;
    case "L3340":
      returnvalue = "SHOE WEDGE SACH";
      break;
    case "L3350":
      returnvalue = "SHOE HEEL WEDGE";
      break;
    case "L3360":
      returnvalue = "SHOE SOLE WEDGE OUTSIDE SOLE";
      break;
    case "L3370":
      returnvalue = "SHOE SOLE WEDGE BETWEEN SOLE";
      break;
    case "L3380":
      returnvalue = "SHOE CLUBFOOT WEDGE";
      break;
    case "L3390":
      returnvalue = "SHOE OUTFLARE WEDGE";
      break;
    case "L3400":
      returnvalue = "SHOE METATARSAL BAR WEDGE RO";
      break;
    case "L3410":
      returnvalue = "SHOE METATARSAL BAR BETWEEN";
      break;
    case "L3420":
      returnvalue = "FULL SOLE/HEEL WEDGE BTWEEN";
      break;
    case "L3430":
      returnvalue = "SHO HEEL COUNT PLAST REINFOR";
      break;
    case "L3440":
      returnvalue = "HEEL LEATHER REINFORCED";
      break;
    case "L3450":
      returnvalue = "SHOE HEEL SACH CUSHION TYPE";
      break;
    case "L3455":
      returnvalue = "SHOE HEEL NEW LEATHER STANDA";
      break;
    case "L3460":
      returnvalue = "SHOE HEEL NEW RUBBER STANDAR";
      break;
    case "L3465":
      returnvalue = "SHOE HEEL THOMAS WITH WEDGE";
      break;
    case "L3470":
      returnvalue = "SHOE HEEL THOMAS EXTEND TO B";
      break;
    case "L3480":
      returnvalue = "SHOE HEEL PAD & DEPRESS FOR";
      break;
    case "L3485":
      returnvalue = "SHOE HEEL PAD REMOVABLE FOR";
      break;
    case "L3500":
      returnvalue = "ORTHO SHOE ADD LEATHER INSOL";
      break;
    case "L3510":
      returnvalue = "ORTHOPEDIC SHOE ADD RUB INSL";
      break;
    case "L3520":
      returnvalue = "O SHOE ADD FELT W LEATH INSL";
      break;
    case "L3530":
      returnvalue = "ORTHO SHOE ADD HALF SOLE";
      break;
    case "L3540":
      returnvalue = "ORTHO SHOE ADD FULL SOLE";
      break;
    case "L3550":
      returnvalue = "O SHOE ADD STANDARD TOE TAP";
      break;
    case "L3560":
      returnvalue = "O SHOE ADD HORSESHOE TOE TAP";
      break;
    case "L3570":
      returnvalue = "O SHOE ADD INSTEP EXTENSION";
      break;
    case "L3580":
      returnvalue = "O SHOE ADD INSTEP VELCRO CLO";
      break;
    case "L3590":
      returnvalue = "O SHOE CONVERT TO SOF COUNTE";
      break;
    case "L3595":
      returnvalue = "ORTHO SHOE ADD MARCH BAR";
      break;
    case "L3600":
      returnvalue = "TRANS SHOE CALIP PLATE EXIST";
      break;
    case "L3610":
      returnvalue = "TRANS SHOE CALIPER PLATE NEW";
      break;
    case "L3620":
      returnvalue = "TRANS SHOE SOLID STIRRUP EXI";
      break;
    case "L3630":
      returnvalue = "TRANS SHOE SOLID STIRRUP NEW";
      break;
    case "L3640":
      returnvalue = "SHOE DENNIS BROWNE SPLINT BO";
      break;
    case "L3649":
      returnvalue = "ORTHOPEDIC SHOE MODIFICA NOS";
      break;
    case "L3650":
      returnvalue = "SHLDER FIG 8 ABDUCT RESTRAIN";
      break;
    case "L3651":
      returnvalue = "PREFAB SHOULDER ORTHOSIS";
      break;
    case "L3652":
      returnvalue = "PREFAB DBL SHOULDER ORTHOSIS";
      break;
    case "L3660":
      returnvalue = "ABDUCT RESTRAINER CANVAS&WEB";
      break;
    case "L3670":
      returnvalue = "ACROMIO/CLAVICULAR CANVAS&WE";
      break;
    case "L3671":
      returnvalue = "SO CAP DESIGN W/O JNTS CF";
      break;
    case "L3672":
      returnvalue = "SO AIRPLANE W/O JNTS CF";
      break;
    case "L3673":
      returnvalue = "SO AIRPLANE W/JOINT CF";
      break;
    case "L3675":
      returnvalue = "CANVAS VEST SO";
      break;
    case "L3677":
      returnvalue = "SO HARD PLASTIC STABILIZER";
      break;
    case "L3700":
      returnvalue = "ELBOW ORTHOSES ELAS W STAYS";
      break;
    case "L3701":
      returnvalue = "PREFAB ELBOW ORTHOSIS";
      break;
    case "L3702":
      returnvalue = "EO W/O JOINTS CF";
      break;
    case "L3710":
      returnvalue = "ELBOW ELASTIC WITH METAL JOI";
      break;
    case "L3720":
      returnvalue = "FOREARM/ARM CUFFS FREE MOTIO";
      break;
    case "L3730":
      returnvalue = "FOREARM/ARM CUFFS EXT/FLEX A";
      break;
    case "L3740":
      returnvalue = "CUFFS ADJ LOCK W/ ACTIVE CON";
      break;
    case "L3760":
      returnvalue = "EO WITHJOINT, PREFABRICATED";
      break;
    case "L3762":
      returnvalue = "RIGID EO WO JOINTS";
      break;
    case "L3763":
      returnvalue = "EWHO RIGID W/O JNTS CF";
      break;
    case "L3764":
      returnvalue = "EWHO W/JOINT(S) CF";
      break;
    case "L3765":
      returnvalue = "EWHFO RIGID W/O JNTS CF";
      break;
    case "L3766":
      returnvalue = "EWHFO W/JOINT(S) CF";
      break;
    case "L3800":
      returnvalue = "WHFO SHORT OPPONEN NO ATTACH";
      break;
    case "L3805":
      returnvalue = "WHFO LONG OPPONENS NO ATTACH";
      break;
    case "L3806":
      returnvalue = "WHFO W/JOINT(S) CUSTOM FAB";
      break;
    case "L3807":
      returnvalue = "WHFO,NO JOINT, PREFABRICATED";
      break;
    case "L3808":
      returnvalue = "WHFO, RIGID W/O JOINTS";
      break;
    case "L3810":
      returnvalue = "WHFO THUMB ABDUCTION BAR";
      break;
    case "L3815":
      returnvalue = "WHFO SECOND M.P. ABDUCTION A";
      break;
    case "L3820":
      returnvalue = "WHFO IP EXT ASST W/ MP EXT S";
      break;
    case "L3825":
      returnvalue = "WHFO M.P. EXTENSION STOP";
      break;
    case "L3830":
      returnvalue = "WHFO M.P. EXTENSION ASSIST";
      break;
    case "L3835":
      returnvalue = "WHFO M.P. SPRING EXTENSION A";
      break;
    case "L3840":
      returnvalue = "WHFO SPRING SWIVEL THUMB";
      break;
    case "L3845":
      returnvalue = "WHFO THUMB IP EXT ASS W/ MP";
      break;
    case "L3850":
      returnvalue = "ACTION WRIST W/ DORSIFLEX AS";
      break;
    case "L3855":
      returnvalue = "WHFO ADJ M.P. FLEXION CONTRO";
      break;
    case "L3860":
      returnvalue = "WHFO ADJ M.P. FLEX CTRL & I.";
      break;
    case "L3890":
      returnvalue = "TORSION MECHANISM WRIST/ELBO";
      break;
    case "L3891":
      returnvalue = "TORSION MECHANISM WRIST/ELBO";
      break;
    case "L3900":
      returnvalue = "HINGE EXTENSION/FLEX WRIST/F";
      break;
    case "L3901":
      returnvalue = "HINGE EXT/FLEX WRIST FINGER";
      break;
    case "L3902":
      returnvalue = "WHFO EXT POWER COMPRESS GAS";
      break;
    case "L3904":
      returnvalue = "WHFO ELECTRIC CUSTOM FITTED";
      break;
    case "L3905":
      returnvalue = "WHO W/NONTORSION JNT(S) CF";
      break;
    case "L3906":
      returnvalue = "WHO W/O JOINTS CF";
      break;
    case "L3907":
      returnvalue = "WHFO WRST GAUNTLT THMB SPICA";
      break;
    case "L3908":
      returnvalue = "WRIST COCK-UP NON-MOLDED";
      break;
    case "L3909":
      returnvalue = "PREFAB WRIST ORTHOSIS";
      break;
    case "L3910":
      returnvalue = "WHFO SWANSON DESIGN";
      break;
    case "L3911":
      returnvalue = "PREFAB HAND FINGER ORTHOSIS";
      break;
    case "L3912":
      returnvalue = "FLEX GLOVE W/ELASTIC FINGER";
      break;
    case "L3913":
      returnvalue = "HFO W/O JOINTS CF";
      break;
    case "L3914":
      returnvalue = "WHO WRIST EXTENSION COCK-UP";
      break;
    case "L3915":
      returnvalue = "WHO W NONTOR JNT(S) PREFAB";
      break;
    case "L3916":
      returnvalue = "WHFO WRIST EXTENS W/ OUTRIGG";
      break;
    case "L3917":
      returnvalue = "PREFAB METACARPL FX ORTHOSIS";
      break;
    case "L3918":
      returnvalue = "HFO KNUCKLE BENDER";
      break;
    case "L3919":
      returnvalue = "HO W/O JOINTS CF";
      break;
    case "L3920":
      returnvalue = "KNUCKLE BENDER WITH OUTRIGGE";
      break;
    case "L3921":
      returnvalue = "HFO W/JOINT(S) CF";
      break;
    case "L3922":
      returnvalue = "KNUCKLE BEND 2 SEG TO FLEX J";
      break;
    case "L3923":
      returnvalue = "HFO W/O JOINTS PF";
      break;
    case "L3924":
      returnvalue = "OPPENHEIMER";
      break;
    case "L3925":
      returnvalue = "FO PIP/DIP WITH JOINT/SPRING";
      break;
    case "L3926":
      returnvalue = "THOMAS SUSPENSION";
      break;
    case "L3927":
      returnvalue = "FO PIP/DIP W/O JOINT/SPRING";
      break;
    case "L3928":
      returnvalue = "FINGER EXTENSION W/ CLOCK SP";
      break;
    case "L3929":
      returnvalue = "HFO NONTORSION JOINT, PREFAB";
      break;
    case "L3930":
      returnvalue = "FINGER EXTENSION WITH WRIST";
      break;
    case "L3931":
      returnvalue = "WHFO NONTORSION JOINT PREFAB";
      break;
    case "L3932":
      returnvalue = "SAFETY PIN SPRING WIRE";
      break;
    case "L3933":
      returnvalue = "FO W/O JOINTS CF";
      break;
    case "L3934":
      returnvalue = "SAFETY PIN MODIFIED";
      break;
    case "L3935":
      returnvalue = "FO NONTORSION JOINT CF";
      break;
    case "L3936":
      returnvalue = "PALMER";
      break;
    case "L3938":
      returnvalue = "DORSAL WRIST";
      break;
    case "L3940":
      returnvalue = "DORSAL WRIST W/ OUTRIGGER AT";
      break;
    case "L3942":
      returnvalue = "REVERSE KNUCKLE BENDER";
      break;
    case "L3944":
      returnvalue = "REVERSE KNUCKLE BEND W/ OUTR";
      break;
    case "L3946":
      returnvalue = "HFO COMPOSITE ELASTIC";
      break;
    case "L3948":
      returnvalue = "FINGER KNUCKLE BENDER";
      break;
    case "L3950":
      returnvalue = "OPPENHEIMER W/ KNUCKLE BEND";
      break;
    case "L3952":
      returnvalue = "OPPENHEIMER W/ REV KNUCKLE 2";
      break;
    case "L3954":
      returnvalue = "SPREADING HAND";
      break;
    case "L3956":
      returnvalue = "ADD JOINT UPPER EXT ORTHOSIS";
      break;
    case "L3960":
      returnvalue = "SEWHO AIRPLAN DESIG ABDU POS";
      break;
    case "L3961":
      returnvalue = "SEWHO CAP DESIGN W/O JNTS CF";
      break;
    case "L3962":
      returnvalue = "SEWHO ERBS PALSEY DESIGN ABD";
      break;
    case "L3964":
      returnvalue = "SEO MOBILE ARM SUP ATT TO WC";
      break;
    case "L3965":
      returnvalue = "ARM SUPP ATT TO WC RANCHO TY";
      break;
    case "L3966":
      returnvalue = "MOBILE ARM SUPPORTS RECLININ";
      break;
    case "L3967":
      returnvalue = "SEWHO AIRPLANE W/O JNTS CF";
      break;
    case "L3968":
      returnvalue = "FRICTION DAMPENING ARM SUPP";
      break;
    case "L3969":
      returnvalue = "MONOSUSPENSION ARM/HAND SUPP";
      break;
    case "L3970":
      returnvalue = "ELEVAT PROXIMAL ARM SUPPORT";
      break;
    case "L3971":
      returnvalue = "SEWHO CAP DESIGN W/JNT(S) CF";
      break;
    case "L3972":
      returnvalue = "OFFSET/LAT ROCKER ARM W/ ELA";
      break;
    case "L3973":
      returnvalue = "SEWHO AIRPLANE W/JNT(S) CF";
      break;
    case "L3974":
      returnvalue = "MOBILE ARM SUPPORT SUPINATOR";
      break;
    case "L3975":
      returnvalue = "SEWHFO CAP DESIGN W/O JNT CF";
      break;
    case "L3976":
      returnvalue = "SEWHFO AIRPLANE W/O JNTS CF";
      break;
    case "L3977":
      returnvalue = "SEWHFO CAP DESGN W/JNT(S) CF";
      break;
    case "L3978":
      returnvalue = "SEWHFO AIRPLANE W/JNT(S) CF";
      break;
    case "L3980":
      returnvalue = "UPP EXT FX ORTHOSIS HUMERAL";
      break;
    case "L3982":
      returnvalue = "UPPER EXT FX ORTHOSIS RAD/UL";
      break;
    case "L3984":
      returnvalue = "UPPER EXT FX ORTHOSIS WRIST";
      break;
    case "L3985":
      returnvalue = "FOREARM HAND FX ORTH W/ WR H";
      break;
    case "L3986":
      returnvalue = "HUMERAL RAD/ULNA WRIST FX OR";
      break;
    case "L3995":
      returnvalue = "SOCK FRACTURE OR EQUAL EACH";
      break;
    case "L3999":
      returnvalue = "UPPER LIMB ORTHOSIS NOS";
      break;
    case "L4000":
      returnvalue = "REPL GIRDLE MILWAUKEE ORTH";
      break;
    case "L4002":
      returnvalue = "REPLACE STRAP, ANY ORTHOSIS";
      break;
    case "L4010":
      returnvalue = "REPLACE TRILATERAL SOCKET BR";
      break;
    case "L4020":
      returnvalue = "REPLACE QUADLAT SOCKET BRIM";
      break;
    case "L4030":
      returnvalue = "REPLACE SOCKET BRIM CUST FIT";
      break;
    case "L4040":
      returnvalue = "REPLACE MOLDED THIGH LACER";
      break;
    case "L4045":
      returnvalue = "REPLACE NON-MOLDED THIGH LAC";
      break;
    case "L4050":
      returnvalue = "REPLACE MOLDED CALF LACER";
      break;
    case "L4055":
      returnvalue = "REPLACE NON-MOLDED CALF LACE";
      break;
    case "L4060":
      returnvalue = "REPLACE HIGH ROLL CUFF";
      break;
    case "L4070":
      returnvalue = "REPLACE PROX & DIST UPRIGHT";
      break;
    case "L4080":
      returnvalue = "REPL MET BAND KAFO-AFO PROX";
      break;
    case "L4090":
      returnvalue = "REPL MET BAND KAFO-AFO CALF/";
      break;
    case "L4100":
      returnvalue = "REPL LEATH CUFF KAFO PROX TH";
      break;
    case "L4110":
      returnvalue = "REPL LEATH CUFF KAFO-AFO CAL";
      break;
    case "L4130":
      returnvalue = "REPLACE PRETIBIAL SHELL";
      break;
    case "L4205":
      returnvalue = "ORTHO DVC REPAIR PER 15 MIN";
      break;
    case "L4210":
      returnvalue = "ORTH DEV REPAIR/REPL MINOR P";
      break;
    case "L4350":
      returnvalue = "ANKLE CONTROL ORTHOSI PREFAB";
      break;
    case "L4360":
      returnvalue = "PNEUMATI WALKING BOOT PREFAB";
      break;
    case "L4370":
      returnvalue = "PNEUMATIC FULL LEG SPLINT";
      break;
    case "L4380":
      returnvalue = "PNEUMATIC KNEE SPLINT";
      break;
    case "L4386":
      returnvalue = "NON-PNEUM WALK BOOT PREFAB";
      break;
    case "L4392":
      returnvalue = "REPLACE AFO SOFT INTERFACE";
      break;
    case "L4394":
      returnvalue = "REPLACE FOOT DROP SPINT";
      break;
    case "L4396":
      returnvalue = "STATIC AFO";
      break;
    case "L4398":
      returnvalue = "FOOT DROP SPLINT RECUMBENT";
      break;
    case "L5000":
      returnvalue = "SHO INSERT W ARCH TOE FILLER";
      break;
    case "L5010":
      returnvalue = "MOLD SOCKET ANK HGT W/ TOE F";
      break;
    case "L5020":
      returnvalue = "TIBIAL TUBERCLE HGT W/ TOE F";
      break;
    case "L5050":
      returnvalue = "ANK SYMES MOLD SCKT SACH FT";
      break;
    case "L5060":
      returnvalue = "SYMES MET FR LEATH SOCKET AR";
      break;
    case "L5100":
      returnvalue = "MOLDED SOCKET SHIN SACH FOOT";
      break;
    case "L5105":
      returnvalue = "PLAST SOCKET JTS/THGH LACER";
      break;
    case "L5150":
      returnvalue = "MOLD SCKT EXT KNEE SHIN SACH";
      break;
    case "L5160":
      returnvalue = "MOLD SOCKET BENT KNEE SHIN S";
      break;
    case "L5200":
      returnvalue = "KNE SING AXIS FRIC SHIN SACH";
      break;
    case "L5210":
      returnvalue = "NO KNEE/ANKLE JOINTS W/ FT B";
      break;
    case "L5220":
      returnvalue = "NO KNEE JOINT WITH ARTIC ALI";
      break;
    case "L5230":
      returnvalue = "FEM FOCAL DEFIC CONSTANT FRI";
      break;
    case "L5250":
      returnvalue = "HIP CANAD SING AXI CONS FRIC";
      break;
    case "L5270":
      returnvalue = "TILT TABLE LOCKING HIP SING";
      break;
    case "L5280":
      returnvalue = "HEMIPELVECT CANAD SING AXIS";
      break;
    case "L5301":
      returnvalue = "BK MOLD SOCKET SACH FT ENDO";
      break;
    case "L5311":
      returnvalue = "KNEE DISART, SACH FT, ENDO";
      break;
    case "L5321":
      returnvalue = "AK OPEN END SACH";
      break;
    case "L5331":
      returnvalue = "HIP DISART CANADIAN SACH FT";
      break;
    case "L5341":
      returnvalue = "HEMIPELVECTOMY CANADIAN SACH";
      break;
    case "L5400":
      returnvalue = "POSTOP DRESS & 1 CAST CHG BK";
      break;
    case "L5410":
      returnvalue = "POSTOP DSG BK EA ADD CAST CH";
      break;
    case "L5420":
      returnvalue = "POSTOP DSG & 1 CAST CHG AK/D";
      break;
    case "L5430":
      returnvalue = "POSTOP DSG AK EA ADD CAST CH";
      break;
    case "L5450":
      returnvalue = "POSTOP APP NON-WGT BEAR DSG";
      break;
    case "L5460":
      returnvalue = "POSTOP APP NON-WGT BEAR DSG";
      break;
    case "L5500":
      returnvalue = "INIT BK PTB PLASTER DIRECT";
      break;
    case "L5505":
      returnvalue = "INIT AK ISCHAL PLSTR DIRECT";
      break;
    case "L5510":
      returnvalue = "PREP BK PTB PLASTER MOLDED";
      break;
    case "L5520":
      returnvalue = "PERP BK PTB THERMOPLS DIRECT";
      break;
    case "L5530":
      returnvalue = "PREP BK PTB THERMOPLS MOLDED";
      break;
    case "L5535":
      returnvalue = "PREP BK PTB OPEN END SOCKET";
      break;
    case "L5540":
      returnvalue = "PREP BK PTB LAMINATED SOCKET";
      break;
    case "L5560":
      returnvalue = "PREP AK ISCHIAL PLAST MOLDED";
      break;
    case "L5570":
      returnvalue = "PREP AK ISCHIAL DIRECT FORM";
      break;
    case "L5580":
      returnvalue = "PREP AK ISCHIAL THERMO MOLD";
      break;
    case "L5585":
      returnvalue = "PREP AK ISCHIAL OPEN END";
      break;
    case "L5590":
      returnvalue = "PREP AK ISCHIAL LAMINATED";
      break;
    case "L5595":
      returnvalue = "HIP DISARTIC SACH THERMOPLS";
      break;
    case "L5600":
      returnvalue = "HIP DISART SACH LAMINAT MOLD";
      break;
    case "L5610":
      returnvalue = "ABOVE KNEE HYDRACADENCE";
      break;
    case "L5611":
      returnvalue = "AK 4 BAR LINK W/FRIC SWING";
      break;
    case "L5613":
      returnvalue = "AK 4 BAR LING W/HYDRAUL SWIG";
      break;
    case "L5614":
      returnvalue = "4-BAR LINK ABOVE KNEE W/SWNG";
      break;
    case "L5616":
      returnvalue = "AK UNIV MULTIPLEX SYS FRICT";
      break;
    case "L5617":
      returnvalue = "AK/BK SELF-ALIGNING UNIT EA";
      break;
    case "L5618":
      returnvalue = "TEST SOCKET SYMES";
      break;
    case "L5620":
      returnvalue = "TEST SOCKET BELOW KNEE";
      break;
    case "L5622":
      returnvalue = "TEST SOCKET KNEE DISARTICULA";
      break;
    case "L5624":
      returnvalue = "TEST SOCKET ABOVE KNEE";
      break;
    case "L5626":
      returnvalue = "TEST SOCKET HIP DISARTICULAT";
      break;
    case "L5628":
      returnvalue = "TEST SOCKET HEMIPELVECTOMY";
      break;
    case "L5629":
      returnvalue = "BELOW KNEE ACRYLIC SOCKET";
      break;
    case "L5630":
      returnvalue = "SYME TYP EXPANDABL WALL SCKT";
      break;
    case "L5631":
      returnvalue = "AK/KNEE DISARTIC ACRYLIC SOC";
      break;
    case "L5632":
      returnvalue = "SYMES TYPE PTB BRIM DESIGN S";
      break;
    case "L5634":
      returnvalue = "SYMES TYPE POSTER OPENING SO";
      break;
    case "L5636":
      returnvalue = "SYMES TYPE MEDIAL OPENING SO";
      break;
    case "L5637":
      returnvalue = "BELOW KNEE TOTAL CONTACT";
      break;
    case "L5638":
      returnvalue = "BELOW KNEE LEATHER SOCKET";
      break;
    case "L5639":
      returnvalue = "BELOW KNEE WOOD SOCKET";
      break;
    case "L5640":
      returnvalue = "KNEE DISARTICULAT LEATHER SO";
      break;
    case "L5642":
      returnvalue = "ABOVE KNEE LEATHER SOCKET";
      break;
    case "L5643":
      returnvalue = "HIP FLEX INNER SOCKET EXT FR";
      break;
    case "L5644":
      returnvalue = "ABOVE KNEE WOOD SOCKET";
      break;
    case "L5645":
      returnvalue = "BK FLEX INNER SOCKET EXT FRA";
      break;
    case "L5646":
      returnvalue = "BELOW KNEE CUSHION SOCKET";
      break;
    case "L5647":
      returnvalue = "BELOW KNEE SUCTION SOCKET";
      break;
    case "L5648":
      returnvalue = "ABOVE KNEE CUSHION SOCKET";
      break;
    case "L5649":
      returnvalue = "ISCH CONTAINMT/NARROW M-L SO";
      break;
    case "L5650":
      returnvalue = "TOT CONTACT AK/KNEE DISART S";
      break;
    case "L5651":
      returnvalue = "AK FLEX INNER SOCKET EXT FRA";
      break;
    case "L5652":
      returnvalue = "SUCTION SUSP AK/KNEE DISART";
      break;
    case "L5653":
      returnvalue = "KNEE DISART EXPAND WALL SOCK";
      break;
    case "L5654":
      returnvalue = "SOCKET INSERT SYMES";
      break;
    case "L5655":
      returnvalue = "SOCKET INSERT BELOW KNEE";
      break;
    case "L5656":
      returnvalue = "SOCKET INSERT KNEE ARTICULAT";
      break;
    case "L5658":
      returnvalue = "SOCKET INSERT ABOVE KNEE";
      break;
    case "L5661":
      returnvalue = "MULTI-DUROMETER SYMES";
      break;
    case "L5665":
      returnvalue = "MULTI-DUROMETER BELOW KNEE";
      break;
    case "L5666":
      returnvalue = "BELOW KNEE CUFF SUSPENSION";
      break;
    case "L5668":
      returnvalue = "SOCKET INSERT W/O LOCK LOWER";
      break;
    case "L5670":
      returnvalue = "BK MOLDED SUPRACONDYLAR SUSP";
      break;
    case "L5671":
      returnvalue = "BK/AK LOCKING MECHANISM";
      break;
    case "L5672":
      returnvalue = "BK REMOVABLE MEDIAL BRIM SUS";
      break;
    case "L5673":
      returnvalue = "SOCKET INSERT W LOCK MECH";
      break;
    case "L5676":
      returnvalue = "BK KNEE JOINTS SINGLE AXIS P";
      break;
    case "L5677":
      returnvalue = "BK KNEE JOINTS POLYCENTRIC P";
      break;
    case "L5678":
      returnvalue = "BK JOINT COVERS PAIR";
      break;
    case "L5679":
      returnvalue = "SOCKET INSERT W/O LOCK MECH";
      break;
    case "L5680":
      returnvalue = "BK THIGH LACER NON-MOLDED";
      break;
    case "L5681":
      returnvalue = "INTL CUSTM CONG/LATYP INSERT";
      break;
    case "L5682":
      returnvalue = "BK THIGH LACER GLUT/ISCHIA M";
      break;
    case "L5683":
      returnvalue = "INITIAL CUSTOM SOCKET INSERT";
      break;
    case "L5684":
      returnvalue = "BK FORK STRAP";
      break;
    case "L5685":
      returnvalue = "BELOW KNEE SUS/SEAL SLEEVE";
      break;
    case "L5686":
      returnvalue = "BK BACK CHECK";
      break;
    case "L5688":
      returnvalue = "BK WAIST BELT WEBBING";
      break;
    case "L5690":
      returnvalue = "BK WAIST BELT PADDED AND LIN";
      break;
    case "L5692":
      returnvalue = "AK PELVIC CONTROL BELT LIGHT";
      break;
    case "L5694":
      returnvalue = "AK PELVIC CONTROL BELT PAD/L";
      break;
    case "L5695":
      returnvalue = "AK SLEEVE SUSP NEOPRENE/EQUA";
      break;
    case "L5696":
      returnvalue = "AK/KNEE DISARTIC PELVIC JOIN";
      break;
    case "L5697":
      returnvalue = "AK/KNEE DISARTIC PELVIC BAND";
      break;
    case "L5698":
      returnvalue = "AK/KNEE DISARTIC SILESIAN BA";
      break;
    case "L5699":
      returnvalue = "SHOULDER HARNESS";
      break;
    case "L5700":
      returnvalue = "REPLACE SOCKET BELOW KNEE";
      break;
    case "L5701":
      returnvalue = "REPLACE SOCKET ABOVE KNEE";
      break;
    case "L5702":
      returnvalue = "REPLACE SOCKET HIP";
      break;
    case "L5703":
      returnvalue = "SYMES ANKLE W/O (SACH) FOOT";
      break;
    case "L5704":
      returnvalue = "CUSTOM SHAPE COVER BK";
      break;
    case "L5705":
      returnvalue = "CUSTOM SHAPE COVER AK";
      break;
    case "L5706":
      returnvalue = "CUSTOM SHAPE CVR KNEE DISART";
      break;
    case "L5707":
      returnvalue = "CUSTOM SHAPE CVR HIP DISART";
      break;
    case "L5710":
      returnvalue = "KNE-SHIN EXO SNG AXI MNL LOC";
      break;
    case "L5711":
      returnvalue = "KNEE-SHIN EXO MNL LOCK ULTRA";
      break;
    case "L5712":
      returnvalue = "KNEE-SHIN EXO FRICT SWG & ST";
      break;
    case "L5714":
      returnvalue = "KNEE-SHIN EXO VARIABLE FRICT";
      break;
    case "L5716":
      returnvalue = "KNEE-SHIN EXO MECH STANCE PH";
      break;
    case "L5718":
      returnvalue = "KNEE-SHIN EXO FRCT SWG & STA";
      break;
    case "L5722":
      returnvalue = "KNEE-SHIN PNEUM SWG FRCT EXO";
      break;
    case "L5724":
      returnvalue = "KNEE-SHIN EXO FLUID SWING PH";
      break;
    case "L5726":
      returnvalue = "KNEE-SHIN EXT JNTS FLD SWG E";
      break;
    case "L5728":
      returnvalue = "KNEE-SHIN FLUID SWG & STANCE";
      break;
    case "L5780":
      returnvalue = "KNEE-SHIN PNEUM/HYDRA PNEUM";
      break;
    case "L5781":
      returnvalue = "LOWER LIMB PROS VACUUM PUMP";
      break;
    case "L5782":
      returnvalue = "HD LOW LIMB PROS VACUUM PUMP";
      break;
    case "L5785":
      returnvalue = "EXOSKELETAL BK ULTRALT MATER";
      break;
    case "L5790":
      returnvalue = "EXOSKELETAL AK ULTRA-LIGHT M";
      break;
    case "L5795":
      returnvalue = "EXOSKEL HIP ULTRA-LIGHT MATE";
      break;
    case "L5810":
      returnvalue = "ENDOSKEL KNEE-SHIN MNL LOCK";
      break;
    case "L5811":
      returnvalue = "ENDO KNEE-SHIN MNL LCK ULTRA";
      break;
    case "L5812":
      returnvalue = "ENDO KNEE-SHIN FRCT SWG & ST";
      break;
    case "L5814":
      returnvalue = "ENDO KNEE-SHIN HYDRAL SWG PH";
      break;
    case "L5816":
      returnvalue = "ENDO KNEE-SHIN POLYC MCH STA";
      break;
    case "L5818":
      returnvalue = "ENDO KNEE-SHIN FRCT SWG & ST";
      break;
    case "L5822":
      returnvalue = "ENDO KNEE-SHIN PNEUM SWG FRC";
      break;
    case "L5824":
      returnvalue = "ENDO KNEE-SHIN FLUID SWING P";
      break;
    case "L5826":
      returnvalue = "MINIATURE KNEE JOINT";
      break;
    case "L5828":
      returnvalue = "ENDO KNEE-SHIN FLUID SWG/STA";
      break;
    case "L5830":
      returnvalue = "ENDO KNEE-SHIN PNEUM/SWG PHA";
      break;
    case "L5840":
      returnvalue = "MULTI-AXIAL KNEE/SHIN SYSTEM";
      break;
    case "L5845":
      returnvalue = "KNEE-SHIN SYS STANCE FLEXION";
      break;
    case "L5848":
      returnvalue = "KNEE-SHIN SYS HYDRAUL STANCE";
      break;
    case "L5850":
      returnvalue = "ENDO AK/HIP KNEE EXTENS ASSI";
      break;
    case "L5855":
      returnvalue = "MECH HIP EXTENSION ASSIST";
      break;
    case "L5856":
      returnvalue = "ELEC KNEE-SHIN SWING/STANCE";
      break;
    case "L5857":
      returnvalue = "ELEC KNEE-SHIN SWING ONLY";
      break;
    case "L5858":
      returnvalue = "STANCE PHASE ONLY";
      break;
    case "L5910":
      returnvalue = "ENDO BELOW KNEE ALIGNABLE SY";
      break;
    case "L5920":
      returnvalue = "ENDO AK/HIP ALIGNABLE SYSTEM";
      break;
    case "L5925":
      returnvalue = "ABOVE KNEE MANUAL LOCK";
      break;
    case "L5930":
      returnvalue = "HIGH ACTIVITY KNEE FRAME";
      break;
    case "L5940":
      returnvalue = "ENDO BK ULTRA-LIGHT MATERIAL";
      break;
    case "L5950":
      returnvalue = "ENDO AK ULTRA-LIGHT MATERIAL";
      break;
    case "L5960":
      returnvalue = "ENDO HIP ULTRA-LIGHT MATERIA";
      break;
    case "L5962":
      returnvalue = "BELOW KNEE FLEX COVER SYSTEM";
      break;
    case "L5964":
      returnvalue = "ABOVE KNEE FLEX COVER SYSTEM";
      break;
    case "L5966":
      returnvalue = "HIP FLEXIBLE COVER SYSTEM";
      break;
    case "L5968":
      returnvalue = "MULTIAXIAL ANKLE W DORSIFLEX";
      break;
    case "L5970":
      returnvalue = "FOOT EXTERNAL KEEL SACH FOOT";
      break;
    case "L5971":
      returnvalue = "SACH FOOT, REPLACEMENT";
      break;
    case "L5972":
      returnvalue = "FLEXIBLE KEEL FOOT";
      break;
    case "L5973":
      returnvalue = "ANK-FOOT SYS DORS-PLANT FLEX";
      break;
    case "L5974":
      returnvalue = "FOOT SINGLE AXIS ANKLE/FOOT";
      break;
    case "L5975":
      returnvalue = "COMBO ANKLE/FOOT PROSTHESIS";
      break;
    case "L5976":
      returnvalue = "ENERGY STORING FOOT";
      break;
    case "L5978":
      returnvalue = "FT PROSTH MULTIAXIAL ANKL/FT";
      break;
    case "L5979":
      returnvalue = "MULTI-AXIAL ANKLE/FT PROSTH";
      break;
    case "L5980":
      returnvalue = "FLEX FOOT SYSTEM";
      break;
    case "L5981":
      returnvalue = "FLEX-WALK SYS LOW EXT PROSTH";
      break;
    case "L5982":
      returnvalue = "EXOSKELETAL AXIAL ROTATION U";
      break;
    case "L5984":
      returnvalue = "ENDOSKELETAL AXIAL ROTATION";
      break;
    case "L5985":
      returnvalue = "LWR EXT DYNAMIC PROSTH PYLON";
      break;
    case "L5986":
      returnvalue = "MULTI-AXIAL ROTATION UNIT";
      break;
    case "L5987":
      returnvalue = "SHANK FT W VERT LOAD PYLON";
      break;
    case "L5988":
      returnvalue = "VERTICAL SHOCK REDUCING PYLO";
      break;
    case "L5990":
      returnvalue = "USER ADJUSTABLE HEEL HEIGHT";
      break;
    case "L5993":
      returnvalue = "HEAVY DUTY FEATURE, FOOT";
      break;
    case "L5994":
      returnvalue = "HEAVY DUTY FEATURE, KNEE";
      break;
    case "L5995":
      returnvalue = "LOWER EXT PROS HEAVYDUTY FEA";
      break;
    case "L5999":
      returnvalue = "LOWR EXTREMITY PROSTHES NOS";
      break;
    case "L6000":
      returnvalue = "PAR HAND ROBIN-AIDS THUM REM";
      break;
    case "L6010":
      returnvalue = "HAND ROBIN-AIDS LITTLE/RING";
      break;
    case "L6020":
      returnvalue = "PART HAND ROBIN-AIDS NO FING";
      break;
    case "L6025":
      returnvalue = "PART HAND DISART MYOELECTRIC";
      break;
    case "L6050":
      returnvalue = "WRST MLD SCK FLX HNG TRI PAD";
      break;
    case "L6055":
      returnvalue = "WRST MOLD SOCK W/EXP INTERFA";
      break;
    case "L6100":
      returnvalue = "ELB MOLD SOCK FLEX HINGE PAD";
      break;
    case "L6110":
      returnvalue = "ELBOW MOLD SOCK SUSPENSION T";
      break;
    case "L6120":
      returnvalue = "ELBOW MOLD DOUB SPLT SOC STE";
      break;
    case "L6130":
      returnvalue = "ELBOW STUMP ACTIVATED LOCK H";
      break;
    case "L6200":
      returnvalue = "ELBOW MOLD OUTSID LOCK HINGE";
      break;
    case "L6205":
      returnvalue = "ELBOW MOLDED W/ EXPAND INTER";
      break;
    case "L6250":
      returnvalue = "ELBOW INTER LOC ELBOW FORARM";
      break;
    case "L6300":
      returnvalue = "SHLDER DISART INT LOCK ELBOW";
      break;
    case "L6310":
      returnvalue = "SHOULDER PASSIVE RESTOR COMP";
      break;
    case "L6320":
      returnvalue = "SHOULDER PASSIVE RESTOR CAP";
      break;
    case "L6350":
      returnvalue = "THORACIC INTERN LOCK ELBOW";
      break;
    case "L6360":
      returnvalue = "THORACIC PASSIVE RESTOR COMP";
      break;
    case "L6370":
      returnvalue = "THORACIC PASSIVE RESTOR CAP";
      break;
    case "L6380":
      returnvalue = "POSTOP DSG CAST CHG WRST/ELB";
      break;
    case "L6382":
      returnvalue = "POSTOP DSG CAST CHG ELB DIS/";
      break;
    case "L6384":
      returnvalue = "POSTOP DSG CAST CHG SHLDER/T";
      break;
    case "L6386":
      returnvalue = "POSTOP EA CAST CHG & REALIGN";
      break;
    case "L6388":
      returnvalue = "POSTOP APPLICAT RIGID DSG ON";
      break;
    case "L6400":
      returnvalue = "BELOW ELBOW PROSTH TISS SHAP";
      break;
    case "L6450":
      returnvalue = "ELB DISART PROSTH TISS SHAP";
      break;
    case "L6500":
      returnvalue = "ABOVE ELBOW PROSTH TISS SHAP";
      break;
    case "L6550":
      returnvalue = "SHLDR DISAR PROSTH TISS SHAP";
      break;
    case "L6570":
      returnvalue = "SCAP THORAC PROSTH TISS SHAP";
      break;
    case "L6580":
      returnvalue = "WRIST/ELBOW BOWDEN CABLE MOL";
      break;
    case "L6582":
      returnvalue = "WRIST/ELBOW BOWDEN CBL DIR F";
      break;
    case "L6584":
      returnvalue = "ELBOW FAIR LEAD CABLE MOLDED";
      break;
    case "L6586":
      returnvalue = "ELBOW FAIR LEAD CABLE DIR FO";
      break;
    case "L6588":
      returnvalue = "SHDR FAIR LEAD CABLE MOLDED";
      break;
    case "L6590":
      returnvalue = "SHDR FAIR LEAD CABLE DIRECT";
      break;
    case "L6600":
      returnvalue = "POLYCENTRIC HINGE PAIR";
      break;
    case "L6605":
      returnvalue = "SINGLE PIVOT HINGE PAIR";
      break;
    case "L6610":
      returnvalue = "FLEXIBLE METAL HINGE PAIR";
      break;
    case "L6611":
      returnvalue = "ADDITIONAL SWITCH, EXT POWER";
      break;
    case "L6615":
      returnvalue = "DISCONNECT LOCKING WRIST UNI";
      break;
    case "L6616":
      returnvalue = "DISCONNECT INSERT LOCKING WR";
      break;
    case "L6620":
      returnvalue = "FLEXION/EXTENSION WRIST UNIT";
      break;
    case "L6621":
      returnvalue = "FLEX/EXT WRIST W/WO FRICTION";
      break;
    case "L6623":
      returnvalue = "SPRING-ASS ROT WRST W/ LATCH";
      break;
    case "L6624":
      returnvalue = "FLEX/EXT/ROTATION WRIST UNIT";
      break;
    case "L6625":
      returnvalue = "ROTATION WRST W/ CABLE LOCK";
      break;
    case "L6628":
      returnvalue = "QUICK DISCONN HOOK ADAPTER O";
      break;
    case "L6629":
      returnvalue = "LAMINATION COLLAR W/ COUPLIN";
      break;
    case "L6630":
      returnvalue = "STAINLESS STEEL ANY WRIST";
      break;
    case "L6632":
      returnvalue = "LATEX SUSPENSION SLEEVE EACH";
      break;
    case "L6635":
      returnvalue = "LIFT ASSIST FOR ELBOW";
      break;
    case "L6637":
      returnvalue = "NUDGE CONTROL ELBOW LOCK";
      break;
    case "L6638":
      returnvalue = "ELEC LOCK ON MANUAL PW ELBOW";
      break;
    case "L6639":
      returnvalue = "HEAVY DUTY ELBOW FEATURE";
      break;
    case "L6640":
      returnvalue = "SHOULDER ABDUCTION JOINT PAI";
      break;
    case "L6641":
      returnvalue = "EXCURSION AMPLIFIER PULLEY T";
      break;
    case "L6642":
      returnvalue = "EXCURSION AMPLIFIER LEVER TY";
      break;
    case "L6645":
      returnvalue = "SHOULDER FLEXION-ABDUCTION J";
      break;
    case "L6646":
      returnvalue = "MULTIPO LOCKING SHOULDER JNT";
      break;
    case "L6647":
      returnvalue = "SHOULDER LOCK ACTUATOR";
      break;
    case "L6648":
      returnvalue = "EXT PWRD SHLDER LOCK/UNLOCK";
      break;
    case "L6650":
      returnvalue = "SHOULDER UNIVERSAL JOINT";
      break;
    case "L6655":
      returnvalue = "STANDARD CONTROL CABLE EXTRA";
      break;
    case "L6660":
      returnvalue = "HEAVY DUTY CONTROL CABLE";
      break;
    case "L6665":
      returnvalue = "TEFLON OR EQUAL CABLE LINING";
      break;
    case "L6670":
      returnvalue = "HOOK TO HAND CABLE ADAPTER";
      break;
    case "L6672":
      returnvalue = "HARNESS CHEST/SHLDER SADDLE";
      break;
    case "L6675":
      returnvalue = "HARNESS FIGURE OF 8 SING CON";
      break;
    case "L6676":
      returnvalue = "HARNESS FIGURE OF 8 DUAL CON";
      break;
    case "L6677":
      returnvalue = "UE TRIPLE CONTROL HARNESS";
      break;
    case "L6680":
      returnvalue = "TEST SOCK WRIST DISART/BEL E";
      break;
    case "L6682":
      returnvalue = "TEST SOCK ELBW DISART/ABOVE";
      break;
    case "L6684":
      returnvalue = "TEST SOCKET SHLDR DISART/THO";
      break;
    case "L6686":
      returnvalue = "SUCTION SOCKET";
      break;
    case "L6687":
      returnvalue = "FRAME TYP SOCKET BEL ELBOW/W";
      break;
    case "L6688":
      returnvalue = "FRAME TYP SOCK ABOVE ELB/DIS";
      break;
    case "L6689":
      returnvalue = "FRAME TYP SOCKET SHOULDER DI";
      break;
    case "L6690":
      returnvalue = "FRAME TYP SOCK INTERSCAP-THO";
      break;
    case "L6691":
      returnvalue = "REMOVABLE INSERT EACH";
      break;
    case "L6692":
      returnvalue = "SILICONE GEL INSERT OR EQUAL";
      break;
    case "L6693":
      returnvalue = "LOCKINGELBOW FOREARM CNTRBAL";
      break;
    case "L6694":
      returnvalue = "ELBOW SOCKET INS USE W/LOCK";
      break;
    case "L6695":
      returnvalue = "ELBOW SOCKET INS USE W/O LCK";
      break;
    case "L6696":
      returnvalue = "CUS ELBO SKT IN FOR CON/ATYP";
      break;
    case "L6697":
      returnvalue = "CUS ELBO SKT IN NOT CON/ATYP";
      break;
    case "L6698":
      returnvalue = "BELOW/ABOVE ELBOW LOCK MECH";
      break;
    case "L6700":
      returnvalue = "TERMINAL DEVICE MODEL #3";
      break;
    case "L6703":
      returnvalue = "TERM DEV, PASSIVE HAND MITT";
      break;
    case "L6704":
      returnvalue = "TERM DEV, SPORT/REC/WORK ATT";
      break;
    case "L6705":
      returnvalue = "TERMINAL DEVICE MODEL #5";
      break;
    case "L6706":
      returnvalue = "TERM DEV MECH HOOK VOL OPEN";
      break;
    case "L6707":
      returnvalue = "TERM DEV MECH HOOK VOL CLOSE";
      break;
    case "L6708":
      returnvalue = "TERM DEV MECH HAND VOL OPEN";
      break;
    case "L6709":
      returnvalue = "TERM DEV MECH HAND VOL CLOSE";
      break;
    case "L6710":
      returnvalue = "TERMINAL DEVICE MODEL #5X";
      break;
    case "L6711":
      returnvalue = "PED TERM DEV, HOOK, VOL OPEN";
      break;
    case "L6712":
      returnvalue = "PED TERM DEV, HOOK, VOL CLOS";
      break;
    case "L6713":
      returnvalue = "PED TERM DEV, HAND, VOL OPEN";
      break;
    case "L6714":
      returnvalue = "PED TERM DEV, HAND, VOL CLOS";
      break;
    case "L6715":
      returnvalue = "TERMINAL DEVICE MODEL #5XA";
      break;
    case "L6720":
      returnvalue = "TERMINAL DEVICE MODEL #6";
      break;
    case "L6721":
      returnvalue = "HOOK/HAND, HVY DTY, VOL OPEN";
      break;
    case "L6722":
      returnvalue = "HOOK/HAND, HVY DTY, VOL CLOS";
      break;
    case "L6725":
      returnvalue = "TERMINAL DEVICE MODEL #7";
      break;
    case "L6730":
      returnvalue = "TERMINAL DEVICE MODEL #7LO";
      break;
    case "L6735":
      returnvalue = "TERMINAL DEVICE MODEL #8";
      break;
    case "L6740":
      returnvalue = "TERMINAL DEVICE MODEL #8X";
      break;
    case "L6745":
      returnvalue = "TERMINAL DEVICE MODEL #88X";
      break;
    case "L6750":
      returnvalue = "TERMINAL DEVICE MODEL #10P";
      break;
    case "L6755":
      returnvalue = "TERMINAL DEVICE MODEL #10X";
      break;
    case "L6765":
      returnvalue = "TERMINAL DEVICE MODEL #12P";
      break;
    case "L6770":
      returnvalue = "TERMINAL DEVICE MODEL #99X";
      break;
    case "L6775":
      returnvalue = "TERMINAL DEVICE MODEL#555";
      break;
    case "L6780":
      returnvalue = "TERMINAL DEVICE MODEL #SS555";
      break;
    case "L6790":
      returnvalue = "HOOKS-ACCU HOOK OR EQUAL";
      break;
    case "L6795":
      returnvalue = "HOOKS-2 LOAD OR EQUAL";
      break;
    case "L6800":
      returnvalue = "HOOKS-APRL VC OR EQUAL";
      break;
    case "L6805":
      returnvalue = "TERM DEV MODIFIER WRIST UNIT";
      break;
    case "L6806":
      returnvalue = "TRS GRIP VC OR EQUAL";
      break;
    case "L6807":
      returnvalue = "TERM DEVICE GRIP1/2 OR EQUAL";
      break;
    case "L6808":
      returnvalue = "TERM DEVICE INFANT OR CHILD";
      break;
    case "L6809":
      returnvalue = "TRS SUPER SPORT PASSIVE";
      break;
    case "L6810":
      returnvalue = "TERM DEV PRECISION PINCH DEV";
      break;
    case "L6825":
      returnvalue = "HANDS DORRANCE VO";
      break;
    case "L6830":
      returnvalue = "HAND APRL VC";
      break;
    case "L6835":
      returnvalue = "HAND SIERRA VO";
      break;
    case "L6840":
      returnvalue = "HAND BECKER IMPERIAL";
      break;
    case "L6845":
      returnvalue = "HAND BECKER LOCK GRIP";
      break;
    case "L6850":
      returnvalue = "TERM DVC-HAND BECKER PLYLITE";
      break;
    case "L6855":
      returnvalue = "HAND ROBIN-AIDS VO";
      break;
    case "L6860":
      returnvalue = "HAND ROBIN-AIDS VO SOFT";
      break;
    case "L6865":
      returnvalue = "HAND PASSIVE HAND";
      break;
    case "L6867":
      returnvalue = "HAND DETROIT INFANT HAND";
      break;
    case "L6868":
      returnvalue = "PASSIVE INF HAND STEEPER/HOS";
      break;
    case "L6870":
      returnvalue = "HAND CHILD MITT";
      break;
    case "L6872":
      returnvalue = "HAND NYU CHILD HAND";
      break;
    case "L6873":
      returnvalue = "HAND MECH INF STEEPER OR EQU";
      break;
    case "L6875":
      returnvalue = "HAND BOCK VC";
      break;
    case "L6880":
      returnvalue = "HAND BOCK VO";
      break;
    case "L6881":
      returnvalue = "TERM DEV AUTO GRASP FEATURE";
      break;
    case "L6882":
      returnvalue = "MICROPROCESSOR CONTROL UPLMB";
      break;
    case "L6883":
      returnvalue = "REPLC SOCKT BELOW E/W DISA";
      break;
    case "L6884":
      returnvalue = "REPLC SOCKT ABOVE ELBOW DISA";
      break;
    case "L6885":
      returnvalue = "REPLC SOCKT SHLDR DIS/INTERC";
      break;
    case "L6890":
      returnvalue = "PREFAB GLOVE FOR TERM DEVICE";
      break;
    case "L6895":
      returnvalue = "CUSTOM GLOVE FOR TERM DEVICE";
      break;
    case "L6900":
      returnvalue = "HAND RESTORAT THUMB/1 FINGER";
      break;
    case "L6905":
      returnvalue = "HAND RESTORATION MULTIPLE FI";
      break;
    case "L6910":
      returnvalue = "HAND RESTORATION NO FINGERS";
      break;
    case "L6915":
      returnvalue = "HAND RESTORATION REPLACMNT G";
      break;
    case "L6920":
      returnvalue = "WRIST DISARTICUL SWITCH CTRL";
      break;
    case "L6925":
      returnvalue = "WRIST DISART MYOELECTRONIC C";
      break;
    case "L6930":
      returnvalue = "BELOW ELBOW SWITCH CONTROL";
      break;
    case "L6935":
      returnvalue = "BELOW ELBOW MYOELECTRONIC CT";
      break;
    case "L6940":
      returnvalue = "ELBOW DISARTICULATION SWITCH";
      break;
    case "L6945":
      returnvalue = "ELBOW DISART MYOELECTRONIC C";
      break;
    case "L6950":
      returnvalue = "ABOVE ELBOW SWITCH CONTROL";
      break;
    case "L6955":
      returnvalue = "ABOVE ELBOW MYOELECTRONIC CT";
      break;
    case "L6960":
      returnvalue = "SHLDR DISARTIC SWITCH CONTRO";
      break;
    case "L6965":
      returnvalue = "SHLDR DISARTIC MYOELECTRONIC";
      break;
    case "L6970":
      returnvalue = "INTERSCAPULAR-THOR SWITCH CT";
      break;
    case "L6975":
      returnvalue = "INTERSCAP-THOR MYOELECTRONIC";
      break;
    case "L7007":
      returnvalue = "ADULT ELECTRIC HAND";
      break;
    case "L7008":
      returnvalue = "PEDIATRIC ELECTRIC HAND";
      break;
    case "L7009":
      returnvalue = "ADULT ELECTRIC HOOK";
      break;
    case "L7010":
      returnvalue = "HAND OTTO BACK STEEPER/EQ SW";
      break;
    case "L7015":
      returnvalue = "HAND SYS TEKNIK VILLAGE SWIT";
      break;
    case "L7020":
      returnvalue = "ELECTRONIC GREIFER SWITCH CT";
      break;
    case "L7025":
      returnvalue = "ELECTRON HAND MYOELECTRONIC";
      break;
    case "L7030":
      returnvalue = "HAND SYS TEKNIK VILL MYOELEC";
      break;
    case "L7035":
      returnvalue = "ELECTRON GREIFER MYOELECTRO";
      break;
    case "L7040":
      returnvalue = "PREHENSILE ACTUATOR";
      break;
    case "L7045":
      returnvalue = "PEDIATRIC ELECTRIC HOOK";
      break;
    case "L7170":
      returnvalue = "ELECTRONIC ELBOW HOSMER SWIT";
      break;
    case "L7180":
      returnvalue = "ELECTRONIC ELBOW SEQUENTIAL";
      break;
    case "L7181":
      returnvalue = "ELECTRONIC ELBO SIMULTANEOUS";
      break;
    case "L7185":
      returnvalue = "ELECTRON ELBOW ADOLESCENT SW";
      break;
    case "L7186":
      returnvalue = "ELECTRON ELBOW CHILD SWITCH";
      break;
    case "L7190":
      returnvalue = "ELBOW ADOLESCENT MYOELECTRON";
      break;
    case "L7191":
      returnvalue = "ELBOW CHILD MYOELECTRONIC CT";
      break;
    case "L7260":
      returnvalue = "ELECTRON WRIST ROTATOR OTTO";
      break;
    case "L7261":
      returnvalue = "ELECTRON WRIST ROTATOR UTAH";
      break;
    case "L7266":
      returnvalue = "SERVO CONTROL STEEPER OR EQU";
      break;
    case "L7272":
      returnvalue = "ANALOGUE CONTROL UNB OR EQUA";
      break;
    case "L7274":
      returnvalue = "PROPORTIONAL CTL 12 VOLT UTA";
      break;
    case "L7360":
      returnvalue = "SIX VOLT BAT OTTO BOCK/EQ EA";
      break;
    case "L7362":
      returnvalue = "BATTERY CHRGR SIX VOLT OTTO";
      break;
    case "L7364":
      returnvalue = "TWELVE VOLT BATTERY UTAH/EQU";
      break;
    case "L7366":
      returnvalue = "BATTERY CHRGR 12 VOLT UTAH/E";
      break;
    case "L7367":
      returnvalue = "REPLACEMNT LITHIUM IONBATTER";
      break;
    case "L7368":
      returnvalue = "LITHIUM ION BATTERY CHARGER";
      break;
    case "L7400":
      returnvalue = "ADD UE PROST BE/WD, ULTLITE";
      break;
    case "L7401":
      returnvalue = "ADD UE PROST A/E ULTLITE MAT";
      break;
    case "L7402":
      returnvalue = "ADD UE PROST S/D ULTLITE MAT";
      break;
    case "L7403":
      returnvalue = "ADD UE PROST B/E ACRYLIC";
      break;
    case "L7404":
      returnvalue = "ADD UE PROST A/E ACRYLIC";
      break;
    case "L7405":
      returnvalue = "ADD UE PROST S/D ACRYLIC";
      break;
    case "L7499":
      returnvalue = "UPPER EXTREMITY PROSTHES NOS";
      break;
    case "L7500":
      returnvalue = "PROSTHETIC DVC REPAIR HOURLY";
      break;
    case "L7510":
      returnvalue = "PROSTHETIC DEVICE REPAIR REP";
      break;
    case "L7520":
      returnvalue = "REPAIR PROSTHESIS PER 15 MIN";
      break;
    case "L7600":
      returnvalue = "PROSTHETIC DONNING SLEEVE";
      break;
    case "L7611":
      returnvalue = "PED TERM DEV, HOOK, VOL OPEN";
      break;
    case "L7612":
      returnvalue = "PED TERM DEV, HOOK, VOL CLOS";
      break;
    case "L7613":
      returnvalue = "PED TERM DEV, HAND, VOL OPEN";
      break;
    case "L7614":
      returnvalue = "PED TERM DEV, HAND, VOL CLOS";
      break;
    case "L7621":
      returnvalue = "HOOK/HAND, HVY DTY, VOL OPEN";
      break;
    case "L7622":
      returnvalue = "HOOK/HAND, HVY DTY, VOL CLOS";
      break;
    case "L7900":
      returnvalue = "MALE VACUUM ERECTION SYSTEM";
      break;
    case "L8000":
      returnvalue = "MASTECTOMY BRA";
      break;
    case "L8001":
      returnvalue = "BREAST PROSTHESIS BRA & FORM";
      break;
    case "L8002":
      returnvalue = "BRST PRSTH BRA & BILAT FORM";
      break;
    case "L8010":
      returnvalue = "MASTECTOMY SLEEVE";
      break;
    case "L8015":
      returnvalue = "EXT BREASTPROSTHESIS GARMENT";
      break;
    case "L8020":
      returnvalue = "MASTECTOMY FORM";
      break;
    case "L8030":
      returnvalue = "BREAST PROSTHES W/O ADHESIVE";
      break;
    case "L8031":
      returnvalue = "BREAST PROSTHESIS W ADHESIVE";
      break;
    case "L8032":
      returnvalue = "REUSABLE NIPPLE PROSTHESIS";
      break;
    case "L8035":
      returnvalue = "CUSTOM BREAST PROSTHESIS";
      break;
    case "L8039":
      returnvalue = "BREAST PROSTHESIS NOS";
      break;
    case "L8040":
      returnvalue = "NASAL PROSTHESIS";
      break;
    case "L8041":
      returnvalue = "MIDFACIAL PROSTHESIS";
      break;
    case "L8042":
      returnvalue = "ORBITAL PROSTHESIS";
      break;
    case "L8043":
      returnvalue = "UPPER FACIAL PROSTHESIS";
      break;
    case "L8044":
      returnvalue = "HEMI-FACIAL PROSTHESIS";
      break;
    case "L8045":
      returnvalue = "AURICULAR PROSTHESIS";
      break;
    case "L8046":
      returnvalue = "PARTIAL FACIAL PROSTHESIS";
      break;
    case "L8047":
      returnvalue = "NASAL SEPTAL PROSTHESIS";
      break;
    case "L8048":
      returnvalue = "UNSPEC MAXILLOFACIAL PROSTH";
      break;
    case "L8049":
      returnvalue = "REPAIR MAXILLOFACIAL PROSTH";
      break;
    case "L8300":
      returnvalue = "TRUSS SINGLE W/ STANDARD PAD";
      break;
    case "L8310":
      returnvalue = "TRUSS DOUBLE W/ STANDARD PAD";
      break;
    case "L8320":
      returnvalue = "TRUSS ADDITION TO STD PAD WA";
      break;
    case "L8330":
      returnvalue = "TRUSS ADD TO STD PAD SCROTAL";
      break;
    case "L8400":
      returnvalue = "SHEATH BELOW KNEE";
      break;
    case "L8410":
      returnvalue = "SHEATH ABOVE KNEE";
      break;
    case "L8415":
      returnvalue = "SHEATH UPPER LIMB";
      break;
    case "L8417":
      returnvalue = "PROS SHEATH/SOCK W GEL CUSHN";
      break;
    case "L8420":
      returnvalue = "PROSTHETIC SOCK MULTI PLY BK";
      break;
    case "L8430":
      returnvalue = "PROSTHETIC SOCK MULTI PLY AK";
      break;
    case "L8435":
      returnvalue = "PROS SOCK MULTI PLY UPPER LM";
      break;
    case "L8440":
      returnvalue = "SHRINKER BELOW KNEE";
      break;
    case "L8460":
      returnvalue = "SHRINKER ABOVE KNEE";
      break;
    case "L8465":
      returnvalue = "SHRINKER UPPER LIMB";
      break;
    case "L8470":
      returnvalue = "PROS SOCK SINGLE PLY BK";
      break;
    case "L8480":
      returnvalue = "PROS SOCK SINGLE PLY AK";
      break;
    case "L8485":
      returnvalue = "PROS SOCK SINGLE PLY UPPER L";
      break;
    case "L8499":
      returnvalue = "UNLISTED MISC PROSTHETIC SER";
      break;
    case "L8500":
      returnvalue = "ARTIFICIAL LARYNX";
      break;
    case "L8501":
      returnvalue = "TRACHEOSTOMY SPEAKING VALVE";
      break;
    case "L8505":
      returnvalue = "ARTIFICIAL LARYNX, ACCESSORY";
      break;
    case "L8507":
      returnvalue = "TRACH-ESOPH VOICE PROS PT IN";
      break;
    case "L8509":
      returnvalue = "TRACH-ESOPH VOICE PROS MD IN";
      break;
    case "L8510":
      returnvalue = "VOICE AMPLIFIER";
      break;
    case "L8511":
      returnvalue = "INDWELLING TRACH INSERT";
      break;
    case "L8512":
      returnvalue = "GEL CAP FOR TRACH VOICE PROS";
      break;
    case "L8513":
      returnvalue = "TRACH PROS CLEANING DEVICE";
      break;
    case "L8514":
      returnvalue = "REPL TRACH PUNCTURE DILATOR";
      break;
    case "L8515":
      returnvalue = "GEL CAP APP DEVICE FOR TRACH";
      break;
    case "L8600":
      returnvalue = "IMPLANT BREAST SILICONE/EQ";
      break;
    case "L8603":
      returnvalue = "COLLAGEN IMP URINARY 2.5 ML";
      break;
    case "L8604":
      returnvalue = "DEXTRANOMER/HYALURONIC ACID";
      break;
    case "L8606":
      returnvalue = "SYNTHETIC IMPLNT URINARY 1ML";
      break;
    case "L8609":
      returnvalue = "ARTIFICIAL CORNEA";
      break;
    case "L8610":
      returnvalue = "OCULAR IMPLANT";
      break;
    case "L8612":
      returnvalue = "AQUEOUS SHUNT PROSTHESIS";
      break;
    case "L8613":
      returnvalue = "OSSICULAR IMPLANT";
      break;
    case "L8614":
      returnvalue = "COCHLEAR DEVICE";
      break;
    case "L8615":
      returnvalue = "COCH IMPLANT HEADSET REPLACE";
      break;
    case "L8616":
      returnvalue = "COCH IMPLANT MICROPHONE REPL";
      break;
    case "L8617":
      returnvalue = "COCH IMPLANT TRANS COIL REPL";
      break;
    case "L8618":
      returnvalue = "COCH IMPLANT TRAN CABLE REPL";
      break;
    case "L8619":
      returnvalue = "COCH IMP EXT PROC/CONTR RPLC";
      break;
    case "L8621":
      returnvalue = "REPL ZINC AIR BATTERY";
      break;
    case "L8622":
      returnvalue = "REPL ALKALINE BATTERY";
      break;
    case "L8623":
      returnvalue = "LITH ION BATT CID,NON-EARLVL";
      break;
    case "L8624":
      returnvalue = "LITH ION BATT CID, EAR LEVEL";
      break;
    case "L8627":
      returnvalue = "CID EXT SPEECH PROCESS REPL";
      break;
    case "L8628":
      returnvalue = "CID EXT CONTROLLER REPL";
      break;
    case "L8629":
      returnvalue = "CID TRANSMIT COIL AND CABLE";
      break;
    case "L8630":
      returnvalue = "METACARPOPHALANGEAL IMPLANT";
      break;
    case "L8631":
      returnvalue = "MCP JOINT REPL 2 PC OR MORE";
      break;
    case "L8641":
      returnvalue = "METATARSAL JOINT IMPLANT";
      break;
    case "L8642":
      returnvalue = "HALLUX IMPLANT";
      break;
    case "L8658":
      returnvalue = "INTERPHALANGEAL JOINT SPACER";
      break;
    case "L8659":
      returnvalue = "INTERPHALANGEAL JOINT REPL";
      break;
    case "L8670":
      returnvalue = "VASCULAR GRAFT, SYNTHETIC";
      break;
    case "L8680":
      returnvalue = "IMPLT NEUROSTIM ELCTR EACH";
      break;
    case "L8681":
      returnvalue = "PT PRGRM FOR IMPLT NEUROSTIM";
      break;
    case "L8682":
      returnvalue = "IMPLT NEUROSTIM RADIOFQ REC";
      break;
    case "L8683":
      returnvalue = "RADIOFQ TRSMTR FOR IMPLT NEU";
      break;
    case "L8684":
      returnvalue = "RADIOF TRSMTR IMPLT SCRL NEU";
      break;
    case "L8685":
      returnvalue = "IMPLT NROSTM PLS GEN SNG REC";
      break;
    case "L8686":
      returnvalue = "IMPLT NROSTM PLS GEN SNG NON";
      break;
    case "L8687":
      returnvalue = "IMPLT NROSTM PLS GEN DUA REC";
      break;
    case "L8688":
      returnvalue = "IMPLT NROSTM PLS GEN DUA NON";
      break;
    case "L8689":
      returnvalue = "EXTERNAL RECHARG SYS INTERN";
      break;
    case "L8690":
      returnvalue = "AUD OSSEO DEV, INT/EXT COMP";
      break;
    case "L8691":
      returnvalue = "OSSEOINTEGRATED SND PROC RPL";
      break;
    case "L8692":
      returnvalue = "NON-OSSEOINTEGRATED SND PROC";
      break;
    case "L8695":
      returnvalue = "EXTERNAL RECHARG SYS EXTERN";
      break;
    case "L8699":
      returnvalue = "PROSTHETIC IMPLANT NOS";
      break;
    case "L9900":
      returnvalue = "O&P SUPPLY/ACCESSORY/SERVICE";
      break;
    case "M0064":
      returnvalue = "VISIT FOR DRUG MONITORING";
      break;
    case "M0075":
      returnvalue = "CELLULAR THERAPY";
      break;
    case "M0076":
      returnvalue = "PROLOTHERAPY";
      break;
    case "M0100":
      returnvalue = "INTRAGASTRIC HYPOTHERMIA";
      break;
    case "M0300":
      returnvalue = "IV CHELATIONTHERAPY";
      break;
    case "M0301":
      returnvalue = "FABRIC WRAPPING OF ANEURYSM";
      break;
    case "P2028":
      returnvalue = "CEPHALIN FLOCULATION TEST";
      break;
    case "P2029":
      returnvalue = "CONGO RED BLOOD TEST";
      break;
    case "P2031":
      returnvalue = "HAIR ANALYSIS";
      break;
    case "P2033":
      returnvalue = "BLOOD THYMOL TURBIDITY";
      break;
    case "P2038":
      returnvalue = "BLOOD MUCOPROTEIN";
      break;
    case "P3000":
      returnvalue = "SCREEN PAP BY TECH W MD SUPV";
      break;
    case "P3001":
      returnvalue = "SCREENING PAP SMEAR BY PHYS";
      break;
    case "P7001":
      returnvalue = "CULTURE BACTERIAL URINE";
      break;
    case "P9010":
      returnvalue = "WHOLE BLOOD FOR TRANSFUSION";
      break;
    case "P9011":
      returnvalue = "BLOOD SPLIT UNIT";
      break;
    case "P9012":
      returnvalue = "CRYOPRECIPITATE EACH UNIT";
      break;
    case "P9016":
      returnvalue = "RBC LEUKOCYTES REDUCED";
      break;
    case "P9017":
      returnvalue = "PLASMA 1 DONOR FRZ W/IN 8 HR";
      break;
    case "P9019":
      returnvalue = "PLATELETS, EACH UNIT";
      break;
    case "P9020":
      returnvalue = "PLAELET RICH PLASMA UNIT";
      break;
    case "P9021":
      returnvalue = "RED BLOOD CELLS UNIT";
      break;
    case "P9022":
      returnvalue = "WASHED RED BLOOD CELLS UNIT";
      break;
    case "P9023":
      returnvalue = "FROZEN PLASMA, POOLED, SD";
      break;
    case "P9031":
      returnvalue = "PLATELETS LEUKOCYTES REDUCED";
      break;
    case "P9032":
      returnvalue = "PLATELETS, IRRADIATED";
      break;
    case "P9033":
      returnvalue = "PLATELETS LEUKOREDUCED IRRAD";
      break;
    case "P9034":
      returnvalue = "PLATELETS, PHERESIS";
      break;
    case "P9035":
      returnvalue = "PLATELET PHERES LEUKOREDUCED";
      break;
    case "P9036":
      returnvalue = "PLATELET PHERESIS IRRADIATED";
      break;
    case "P9037":
      returnvalue = "PLATE PHERES LEUKOREDU IRRAD";
      break;
    case "P9038":
      returnvalue = "RBC IRRADIATED";
      break;
    case "P9039":
      returnvalue = "RBC DEGLYCEROLIZED";
      break;
    case "P9040":
      returnvalue = "RBC LEUKOREDUCED IRRADIATED";
      break;
    case "P9041":
      returnvalue = "ALBUMIN (HUMAN),5%, 50ML";
      break;
    case "P9043":
      returnvalue = "PLASMA PROTEIN FRACT,5%,50ML";
      break;
    case "P9044":
      returnvalue = "CRYOPRECIPITATEREDUCEDPLASMA";
      break;
    case "P9045":
      returnvalue = "ALBUMIN (HUMAN), 5%, 250 ML";
      break;
    case "P9046":
      returnvalue = "ALBUMIN (HUMAN), 25%, 20 ML";
      break;
    case "P9047":
      returnvalue = "ALBUMIN (HUMAN), 25%, 50ML";
      break;
    case "P9048":
      returnvalue = "PLASMAPROTEIN FRACT,5%,250ML";
      break;
    case "P9050":
      returnvalue = "GRANULOCYTES, PHERESIS UNIT";
      break;
    case "P9051":
      returnvalue = "BLOOD, L/R, CMV-NEG";
      break;
    case "P9052":
      returnvalue = "PLATELETS, HLA-M, L/R, UNIT";
      break;
    case "P9053":
      returnvalue = "PLT, PHER, L/R CMV-NEG, IRR";
      break;
    case "P9054":
      returnvalue = "BLOOD, L/R, FROZ/DEGLY/WASH";
      break;
    case "P9055":
      returnvalue = "PLT, APH/PHER, L/R, CMV-NEG";
      break;
    case "P9056":
      returnvalue = "BLOOD, L/R, IRRADIATED";
      break;
    case "P9057":
      returnvalue = "RBC, FRZ/DEG/WSH, L/R, IRRAD";
      break;
    case "P9058":
      returnvalue = "RBC, L/R, CMV-NEG, IRRAD";
      break;
    case "P9059":
      returnvalue = "PLASMA, FRZ BETWEEN 8-24HOUR";
      break;
    case "P9060":
      returnvalue = "FR FRZ PLASMA DONOR RETESTED";
      break;
    case "P9603":
      returnvalue = "ONE-WAY ALLOW PRORATED MILES";
      break;
    case "P9604":
      returnvalue = "ONE-WAY ALLOW PRORATED TRIP";
      break;
    case "P9612":
      returnvalue = "CATHETERIZE FOR URINE SPEC";
      break;
    case "P9615":
      returnvalue = "URINE SPECIMEN COLLECT MULT";
      break;
    case "Q0035":
      returnvalue = "CARDIOKYMOGRAPHY";
      break;
    case "Q0081":
      returnvalue = "INFUSION THER OTHER THAN CHE";
      break;
    case "Q0083":
      returnvalue = "CHEMO BY OTHER THAN INFUSION";
      break;
    case "Q0084":
      returnvalue = "CHEMOTHERAPY BY INFUSION";
      break;
    case "Q0085":
      returnvalue = "CHEMO BY BOTH INFUSION AND O";
      break;
    case "Q0091":
      returnvalue = "OBTAINING SCREEN PAP SMEAR";
      break;
    case "Q0092":
      returnvalue = "SET UP PORT XRAY EQUIPMENT";
      break;
    case "Q0111":
      returnvalue = "WET MOUNTS/ W PREPARATIONS";
      break;
    case "Q0112":
      returnvalue = "POTASSIUM HYDROXIDE PREPS";
      break;
    case "Q0113":
      returnvalue = "PINWORM EXAMINATIONS";
      break;
    case "Q0114":
      returnvalue = "FERN TEST";
      break;
    case "Q0115":
      returnvalue = "POST-COITAL MUCOUS EXAM";
      break;
    case "Q0138":
      returnvalue = "FERUMOXYTOL, NON-ESRD";
      break;
    case "Q0139":
      returnvalue = "FERUMOXYTOL, ESRD USE";
      break;
    case "Q0144":
      returnvalue = "AZITHROMYCIN DIHYDRATE, ORAL";
      break;
    case "Q0163":
      returnvalue = "DIPHENHYDRAMINE HCL 50MG";
      break;
    case "Q0164":
      returnvalue = "PROCHLORPERAZINE MALEATE 5MG";
      break;
    case "Q0165":
      returnvalue = "PROCHLORPERAZINE MALEATE10MG";
      break;
    case "Q0166":
      returnvalue = "GRANISETRON HCL 1 MG ORAL";
      break;
    case "Q0167":
      returnvalue = "DRONABINOL 2.5MG ORAL";
      break;
    case "Q0168":
      returnvalue = "DRONABINOL 5MG ORAL";
      break;
    case "Q0169":
      returnvalue = "PROMETHAZINE HCL 12.5MG ORAL";
      break;
    case "Q0170":
      returnvalue = "PROMETHAZINE HCL 25 MG ORAL";
      break;
    case "Q0171":
      returnvalue = "CHLORPROMAZINE HCL 10MG ORAL";
      break;
    case "Q0172":
      returnvalue = "CHLORPROMAZINE HCL 25MG ORAL";
      break;
    case "Q0173":
      returnvalue = "TRIMETHOBENZAMIDE HCL 250MG";
      break;
    case "Q0174":
      returnvalue = "THIETHYLPERAZINE MALEATE10MG";
      break;
    case "Q0175":
      returnvalue = "PERPHENAZINE 4MG ORAL";
      break;
    case "Q0176":
      returnvalue = "PERPHENAZINE 8MG ORAL";
      break;
    case "Q0177":
      returnvalue = "HYDROXYZINE PAMOATE 25MG";
      break;
    case "Q0178":
      returnvalue = "HYDROXYZINE PAMOATE 50MG";
      break;
    case "Q0179":
      returnvalue = "ONDANSETRON HCL 8 MG ORAL";
      break;
    case "Q0180":
      returnvalue = "DOLASETRON MESYLATE ORAL";
      break;
    case "Q0181":
      returnvalue = "UNSPECIFIED ORAL ANTI-EMETIC";
      break;
    case "Q0480":
      returnvalue = "DRIVER PNEUMATIC VAD, REP";
      break;
    case "Q0481":
      returnvalue = "MICROPRCSR CU ELEC VAD, REP";
      break;
    case "Q0482":
      returnvalue = "MICROPRCSR CU COMBO VAD, REP";
      break;
    case "Q0483":
      returnvalue = "MONITOR ELEC VAD, REP";
      break;
    case "Q0484":
      returnvalue = "MONITOR ELEC OR COMB VAD REP";
      break;
    case "Q0485":
      returnvalue = "MONITOR CABLE ELEC VAD, REP";
      break;
    case "Q0486":
      returnvalue = "MON CABLE ELEC/PNEUM VAD REP";
      break;
    case "Q0487":
      returnvalue = "LEADS ANY TYPE VAD, REP ONLY";
      break;
    case "Q0488":
      returnvalue = "PWR PACK BASE ELEC VAD, REP";
      break;
    case "Q0489":
      returnvalue = "PWR PCK BASE COMBO VAD, REP";
      break;
    case "Q0490":
      returnvalue = "EMR PWR SOURCE ELEC VAD, REP";
      break;
    case "Q0491":
      returnvalue = "EMR PWR SOURCE COMBO VAD REP";
      break;
    case "Q0492":
      returnvalue = "EMR PWR CBL ELEC VAD, REP";
      break;
    case "Q0493":
      returnvalue = "EMR PWR CBL COMBO VAD, REP";
      break;
    case "Q0494":
      returnvalue = "EMR HD PMP ELEC/COMBO, REP";
      break;
    case "Q0495":
      returnvalue = "CHARGER ELEC/COMBO VAD, REP";
      break;
    case "Q0496":
      returnvalue = "BATTERY ELEC/COMBO VAD, REP";
      break;
    case "Q0497":
      returnvalue = "BAT CLPS ELEC/COMB VAD, REP";
      break;
    case "Q0498":
      returnvalue = "HOLSTER ELEC/COMBO VAD, REP";
      break;
    case "Q0499":
      returnvalue = "BELT/VEST ELEC/COMBO VAD REP";
      break;
    case "Q0500":
      returnvalue = "FILTERS ELEC/COMBO VAD, REP";
      break;
    case "Q0501":
      returnvalue = "SHWR COV ELEC/COMBO VAD, REP";
      break;
    case "Q0502":
      returnvalue = "MOBILITY CART PNEUM VAD, REP";
      break;
    case "Q0503":
      returnvalue = "BATTERY PNEUM VAD REPLACEMNT";
      break;
    case "Q0504":
      returnvalue = "PWR ADPT PNEUM VAD, REP VEH";
      break;
    case "Q0505":
      returnvalue = "MISCL SUPPLY/ACCESSORY VAD";
      break;
    case "Q0506":
      returnvalue = "LITH-ION BATT ELEC/PNEUM VAD";
      break;
    case "Q0510":
      returnvalue = "DISPENS FEE IMMUNOSUPRESSIVE";
      break;
    case "Q0511":
      returnvalue = "SUP FEE ANTIEM,ANTICA,IMMUNO";
      break;
    case "Q0512":
      returnvalue = "PX SUP FEE ANTI-CAN SUB PRES";
      break;
    case "Q0513":
      returnvalue = "DISP FEE INHAL DRUGS/30 DAYS";
      break;
    case "Q0514":
      returnvalue = "DISP FEE INHAL DRUGS/90 DAYS";
      break;
    case "Q0515":
      returnvalue = "SERMORELIN ACETATE INJECTION";
      break;
    case "Q1003":
      returnvalue = "NTIOL CATEGORY 3";
      break;
    case "Q1004":
      returnvalue = "NTIOL CATEGORY 4";
      break;
    case "Q1005":
      returnvalue = "NTIOL CATEGORY 5";
      break;
    case "Q2004":
      returnvalue = "BLADDER CALCULI IRRIG SOL";
      break;
    case "Q2009":
      returnvalue = "FOSPHENYTOIN INJ PE";
      break;
    case "Q2017":
      returnvalue = "TENIPOSIDE, 50 MG";
      break;
    case "Q2023":
      returnvalue = "XYNTHA, INJ";
      break;
    case "Q2024":
      returnvalue = "BEVACIZUMAB INJECTION";
      break;
    case "Q3001":
      returnvalue = "BRACHYTHERAPY RADIOELEMENTS";
      break;
    case "Q3014":
      returnvalue = "TELEHEALTH FACILITY FEE";
      break;
    case "Q3019":
      returnvalue = "ALS EMER TRANS NO ALS SERV";
      break;
    case "Q3020":
      returnvalue = "ALS NONEMER TRANS NO ALS SER";
      break;
    case "Q3025":
      returnvalue = "IM INJ INTERFERON BETA 1-A";
      break;
    case "Q3026":
      returnvalue = "SUBC INJ INTERFERON BETA-1A";
      break;
    case "Q3031":
      returnvalue = "COLLAGEN SKIN TEST";
      break;
    case "Q4001":
      returnvalue = "CAST SUP BODY CAST PLASTER";
      break;
    case "Q4002":
      returnvalue = "CAST SUP BODY CAST FIBERGLAS";
      break;
    case "Q4003":
      returnvalue = "CAST SUP SHOULDER CAST PLSTR";
      break;
    case "Q4004":
      returnvalue = "CAST SUP SHOULDER CAST FBRGL";
      break;
    case "Q4005":
      returnvalue = "CAST SUP LONG ARM ADULT PLST";
      break;
    case "Q4006":
      returnvalue = "CAST SUP LONG ARM ADULT FBRG";
      break;
    case "Q4007":
      returnvalue = "CAST SUP LONG ARM PED PLSTER";
      break;
    case "Q4008":
      returnvalue = "CAST SUP LONG ARM PED FBRGLS";
      break;
    case "Q4009":
      returnvalue = "CAST SUP SHT ARM ADULT PLSTR";
      break;
    case "Q4010":
      returnvalue = "CAST SUP SHT ARM ADULT FBRGL";
      break;
    case "Q4011":
      returnvalue = "CAST SUP SHT ARM PED PLASTER";
      break;
    case "Q4012":
      returnvalue = "CAST SUP SHT ARM PED FBRGLAS";
      break;
    case "Q4013":
      returnvalue = "CAST SUP GAUNTLET PLASTER";
      break;
    case "Q4014":
      returnvalue = "CAST SUP GAUNTLET FIBERGLASS";
      break;
    case "Q4015":
      returnvalue = "CAST SUP GAUNTLET PED PLSTER";
      break;
    case "Q4016":
      returnvalue = "CAST SUP GAUNTLET PED FBRGLS";
      break;
    case "Q4017":
      returnvalue = "CAST SUP LNG ARM SPLINT PLST";
      break;
    case "Q4018":
      returnvalue = "CAST SUP LNG ARM SPLINT FBRG";
      break;
    case "Q4019":
      returnvalue = "CAST SUP LNG ARM SPLNT PED P";
      break;
    case "Q4020":
      returnvalue = "CAST SUP LNG ARM SPLNT PED F";
      break;
    case "Q4021":
      returnvalue = "CAST SUP SHT ARM SPLINT PLST";
      break;
    case "Q4022":
      returnvalue = "CAST SUP SHT ARM SPLINT FBRG";
      break;
    case "Q4023":
      returnvalue = "CAST SUP SHT ARM SPLNT PED P";
      break;
    case "Q4024":
      returnvalue = "CAST SUP SHT ARM SPLNT PED F";
      break;
    case "Q4025":
      returnvalue = "CAST SUP HIP SPICA PLASTER";
      break;
    case "Q4026":
      returnvalue = "CAST SUP HIP SPICA FIBERGLAS";
      break;
    case "Q4027":
      returnvalue = "CAST SUP HIP SPICA PED PLSTR";
      break;
    case "Q4028":
      returnvalue = "CAST SUP HIP SPICA PED FBRGL";
      break;
    case "Q4029":
      returnvalue = "CAST SUP LONG LEG PLASTER";
      break;
    case "Q4030":
      returnvalue = "CAST SUP LONG LEG FIBERGLASS";
      break;
    case "Q4031":
      returnvalue = "CAST SUP LNG LEG PED PLASTER";
      break;
    case "Q4032":
      returnvalue = "CAST SUP LNG LEG PED FBRGLS";
      break;
    case "Q4033":
      returnvalue = "CAST SUP LNG LEG CYLINDER PL";
      break;
    case "Q4034":
      returnvalue = "CAST SUP LNG LEG CYLINDER FB";
      break;
    case "Q4035":
      returnvalue = "CAST SUP LNGLEG CYLNDR PED P";
      break;
    case "Q4036":
      returnvalue = "CAST SUP LNGLEG CYLNDR PED F";
      break;
    case "Q4037":
      returnvalue = "CAST SUP SHRT LEG PLASTER";
      break;
    case "Q4038":
      returnvalue = "CAST SUP SHRT LEG FIBERGLASS";
      break;
    case "Q4039":
      returnvalue = "CAST SUP SHRT LEG PED PLSTER";
      break;
    case "Q4040":
      returnvalue = "CAST SUP SHRT LEG PED FBRGLS";
      break;
    case "Q4041":
      returnvalue = "CAST SUP LNG LEG SPLNT PLSTR";
      break;
    case "Q4042":
      returnvalue = "CAST SUP LNG LEG SPLNT FBRGL";
      break;
    case "Q4043":
      returnvalue = "CAST SUP LNG LEG SPLNT PED P";
      break;
    case "Q4044":
      returnvalue = "CAST SUP LNG LEG SPLNT PED F";
      break;
    case "Q4045":
      returnvalue = "CAST SUP SHT LEG SPLNT PLSTR";
      break;
    case "Q4046":
      returnvalue = "CAST SUP SHT LEG SPLNT FBRGL";
      break;
    case "Q4047":
      returnvalue = "CAST SUP SHT LEG SPLNT PED P";
      break;
    case "Q4048":
      returnvalue = "CAST SUP SHT LEG SPLNT PED F";
      break;
    case "Q4049":
      returnvalue = "FINGER SPLINT, STATIC";
      break;
    case "Q4050":
      returnvalue = "CAST SUPPLIES UNLISTED";
      break;
    case "Q4051":
      returnvalue = "SPLINT SUPPLIES MISC";
      break;
    case "Q4074":
      returnvalue = "ILOPROST NON-COMP UNIT DOSE";
      break;
    case "Q4079":
      returnvalue = "NATALIZUMAB INJECTION";
      break;
    case "Q4080":
      returnvalue = "ILOPROST NON-COMP UNIT DOSE";
      break;
    case "Q4081":
      returnvalue = "EPOETIN ALFA, 100 UNITS ESRD";
      break;
    case "Q4082":
      returnvalue = "DRUG/BIO NOC PART B DRUG CAP";
      break;
    case "Q4083":
      returnvalue = "HYALGAN/SUPARTZ INJ PER DOSE";
      break;
    case "Q4084":
      returnvalue = "SYNVISC INJ PER DOSE";
      break;
    case "Q4085":
      returnvalue = "EUFLEXXA INJ PER DOSE";
      break;
    case "Q4086":
      returnvalue = "ORTHOVISC INJ PER DOSE";
      break;
    case "Q4087":
      returnvalue = "OCTAGAM INJECTION";
      break;
    case "Q4088":
      returnvalue = "GAMMAGARD LIQUID INJECTION";
      break;
    case "Q4089":
      returnvalue = "RHOPHYLAC INJECTION";
      break;
    case "Q4090":
      returnvalue = "HEPAGAM B IM INJECTION";
      break;
    case "Q4091":
      returnvalue = "FLEBOGAMMA INJECTION";
      break;
    case "Q4092":
      returnvalue = "GAMUNEX INJECTION";
      break;
    case "Q4093":
      returnvalue = "ALBUTEROL INH NON-COMP CON";
      break;
    case "Q4094":
      returnvalue = "ALBUTEROL INH NON-COMP U D";
      break;
    case "Q4095":
      returnvalue = "RECLAST INJECTION";
      break;
    case "Q4096":
      returnvalue = "VWF COMPLEX, NOS";
      break;
    case "Q4097":
      returnvalue = "INJ IVIG PRIVIGEN 500 MG";
      break;
    case "Q4098":
      returnvalue = "INJ IRON DEXTRAN";
      break;
    case "Q4099":
      returnvalue = "FORMOTEROL FUMARATE, INH";
      break;
    case "Q4100":
      returnvalue = "SKIN SUBSTITUTE, NOS";
      break;
    case "Q4101":
      returnvalue = "APLIGRAF SKIN SUB";
      break;
    case "Q4102":
      returnvalue = "OASIS WOUND MATRIX SKIN SUB";
      break;
    case "Q4103":
      returnvalue = "OASIS BURN MATRIX SKIN SUB";
      break;
    case "Q4104":
      returnvalue = "INTEGRA BMWD SKIN SUB";
      break;
    case "Q4105":
      returnvalue = "INTEGRA DRT SKIN SUB";
      break;
    case "Q4106":
      returnvalue = "DERMAGRAFT SKIN SUB";
      break;
    case "Q4107":
      returnvalue = "GRAFTJACKET SKIN SUB";
      break;
    case "Q4108":
      returnvalue = "INTEGRA MATRIX SKIN SUB";
      break;
    case "Q4109":
      returnvalue = "TISSUEMEND SKIN SUB";
      break;
    case "Q4110":
      returnvalue = "PRIMATRIX SKIN SUB";
      break;
    case "Q4111":
      returnvalue = "GAMMAGRAFT SKIN SUB";
      break;
    case "Q4112":
      returnvalue = "CYMETRA ALLOGRAFT";
      break;
    case "Q4113":
      returnvalue = "GRAFTJACKET EXPRESS ALLOGRAF";
      break;
    case "Q4114":
      returnvalue = "INTEGRA FLOWABLE WOUND MATRI";
      break;
    case "Q4115":
      returnvalue = "ALLOSKIN SKIN SUB";
      break;
    case "Q4116":
      returnvalue = "ALLODERM SKIN SUB";
      break;
    case "Q5001":
      returnvalue = "HOSPICE IN PATIENT HOME";
      break;
    case "Q5002":
      returnvalue = "HOSPICE IN ASSISTED LIVING";
      break;
    case "Q5003":
      returnvalue = "HOSPICE IN LT/NON-SKILLED NF";
      break;
    case "Q5004":
      returnvalue = "HOSPICE IN SNF";
      break;
    case "Q5005":
      returnvalue = "HOSPICE, INPATIENT HOSPITAL";
      break;
    case "Q5006":
      returnvalue = "HOSPICE IN HOSPICE FACILITY";
      break;
    case "Q5007":
      returnvalue = "HOSPICE IN LTCH";
      break;
    case "Q5008":
      returnvalue = "HOSPICE IN INPATIENT PSYCH";
      break;
    case "Q5009":
      returnvalue = "HOSPICE CARE, NOS";
      break;
    case "Q9945":
      returnvalue = "LOCM <=149 MG/ML IODINE, 1ML";
      break;
    case "Q9946":
      returnvalue = "LOCM 150-199MG/ML IODINE,1ML";
      break;
    case "Q9947":
      returnvalue = "LOCM 200-249MG/ML IODINE,1ML";
      break;
    case "Q9948":
      returnvalue = "LOCM 250-299MG/ML IODINE,1ML";
      break;
    case "Q9949":
      returnvalue = "LOCM 300-349MG/ML IODINE,1ML";
      break;
    case "Q9950":
      returnvalue = "LOCM 350-399MG/ML IODINE,1ML";
      break;
    case "Q9951":
      returnvalue = "LOCM >= 400 MG/ML IODINE,1ML";
      break;
    case "Q9952":
      returnvalue = "INJ GAD-BASE MR CONTRAST,1ML";
      break;
    case "Q9953":
      returnvalue = "INJ FE-BASED MR CONTRAST,1ML";
      break;
    case "Q9954":
      returnvalue = "ORAL MR CONTRAST, 100 ML";
      break;
    case "Q9955":
      returnvalue = "INJ PERFLEXANE LIP MICROS,ML";
      break;
    case "Q9956":
      returnvalue = "INJ OCTAFLUOROPROPANE MIC,ML";
      break;
    case "Q9957":
      returnvalue = "INJ PERFLUTREN LIP MICROS,ML";
      break;
    case "Q9958":
      returnvalue = "HOCM <=149 MG/ML IODINE, 1ML";
      break;
    case "Q9959":
      returnvalue = "HOCM 150-199MG/ML IODINE,1ML";
      break;
    case "Q9960":
      returnvalue = "HOCM 200-249MG/ML IODINE,1ML";
      break;
    case "Q9961":
      returnvalue = "HOCM 250-299MG/ML IODINE,1ML";
      break;
    case "Q9962":
      returnvalue = "HOCM 300-349MG/ML IODINE,1ML";
      break;
    case "Q9963":
      returnvalue = "HOCM 350-399MG/ML IODINE,1ML";
      break;
    case "Q9964":
      returnvalue = "HOCM>= 400MG/ML IODINE, 1ML";
      break;
    case "Q9965":
      returnvalue = "LOCM 100-199MG/ML IODINE,1ML";
      break;
    case "Q9966":
      returnvalue = "LOCM 200-299MG/ML IODINE,1ML";
      break;
    case "Q9967":
      returnvalue = "LOCM 300-399MG/ML IODINE,1ML";
      break;
    case "Q9968":
      returnvalue = "VISUALIZATION ADJUNCT";
      break;
    case "R0070":
      returnvalue = "TRANSPORT PORTABLE X-RAY";
      break;
    case "R0075":
      returnvalue = "TRANSPORT PORT X-RAY MULTIPL";
      break;
    case "R0076":
      returnvalue = "TRANSPORT PORTABLE EKG";
      break;
    case "S0012":
      returnvalue = "BUTORPHANOL TARTRATE, NASAL";
      break;
    case "S0014":
      returnvalue = "TACRINE HYDROCHLORIDE, 10 MG";
      break;
    case "S0017":
      returnvalue = "INJECTION, AMINOCAPROIC ACID";
      break;
    case "S0020":
      returnvalue = "INJECTION, BUPIVICAINE HYDRO";
      break;
    case "S0021":
      returnvalue = "INJECTION, CEFOPERAZONE SOD";
      break;
    case "S0023":
      returnvalue = "INJECTION, CIMETIDINE HYDROC";
      break;
    case "S0028":
      returnvalue = "INJECTION, FAMOTIDINE, 20 MG";
      break;
    case "S0030":
      returnvalue = "INJECTION, METRONIDAZOLE";
      break;
    case "S0032":
      returnvalue = "INJECTION, NAFCILLIN SODIUM";
      break;
    case "S0034":
      returnvalue = "INJECTION, OFLOXACIN, 400 MG";
      break;
    case "S0039":
      returnvalue = "INJECTION, SULFAMETHOXAZOLE";
      break;
    case "S0040":
      returnvalue = "INJECTION, TICARCILLIN DISOD";
      break;
    case "S0073":
      returnvalue = "INJECTION, AZTREONAM, 500 MG";
      break;
    case "S0074":
      returnvalue = "INJECTION, CEFOTETAN DISODIU";
      break;
    case "S0077":
      returnvalue = "INJECTION, CLINDAMYCIN PHOSP";
      break;
    case "S0078":
      returnvalue = "INJECTION, FOSPHENYTOIN SODI";
      break;
    case "S0080":
      returnvalue = "INJECTION, PENTAMIDINE ISETH";
      break;
    case "S0081":
      returnvalue = "INJECTION, PIPERACILLIN SODI";
      break;
    case "S0088":
      returnvalue = "IMATINIB 100 MG";
      break;
    case "S0090":
      returnvalue = "SILDENAFIL CITRATE, 25 MG";
      break;
    case "S0091":
      returnvalue = "GRANISETRON 1MG";
      break;
    case "S0092":
      returnvalue = "HYDROMORPHONE 250 MG";
      break;
    case "S0093":
      returnvalue = "MORPHINE 500 MG";
      break;
    case "S0104":
      returnvalue = "ZIDOVUDINE, ORAL, 100 MG";
      break;
    case "S0106":
      returnvalue = "BUPROPION HCL SR 60 TABLETS";
      break;
    case "S0108":
      returnvalue = "MERCAPTOPURINE 50 MG";
      break;
    case "S0109":
      returnvalue = "METHADONE ORAL 5MG";
      break;
    case "S0116":
      returnvalue = "BEVACIZUMAB 100 MG";
      break;
    case "S0117":
      returnvalue = "TRETINOIN TOPICAL 5 G";
      break;
    case "S0122":
      returnvalue = "INJ MENOTROPINS 75 IU";
      break;
    case "S0126":
      returnvalue = "INJ FOLLITROPIN ALFA 75 IU";
      break;
    case "S0128":
      returnvalue = "INJ FOLLITROPIN BETA 75 IU";
      break;
    case "S0132":
      returnvalue = "INJ GANIRELIX ACETAT 250 MCG";
      break;
    case "S0133":
      returnvalue = "HISTRELIN IMPLANT";
      break;
    case "S0136":
      returnvalue = "CLOZAPINE, 25 MG";
      break;
    case "S0137":
      returnvalue = "DIDANOSINE, 25 MG";
      break;
    case "S0138":
      returnvalue = "FINASTERIDE, 5 MG";
      break;
    case "S0139":
      returnvalue = "MINOXIDIL, 10 MG";
      break;
    case "S0140":
      returnvalue = "SAQUINAVIR, 200 MG";
      break;
    case "S0141":
      returnvalue = "ZALCITABINE, 0.375 MG";
      break;
    case "S0142":
      returnvalue = "COLISTIMETHATE INH SOL MG";
      break;
    case "S0143":
      returnvalue = "AZTREONAM, INH SOL GRAM";
      break;
    case "S0145":
      returnvalue = "PEG INTERFERON ALFA-2A/180";
      break;
    case "S0146":
      returnvalue = "PEG INTERFERON ALFA-2B/10";
      break;
    case "S0147":
      returnvalue = "ALGLUCOSIDASE ALFA 20 MG";
      break;
    case "S0155":
      returnvalue = "EPOPROSTENOL DILUTANT";
      break;
    case "S0156":
      returnvalue = "EXEMESTANE, 25 MG";
      break;
    case "S0157":
      returnvalue = "BECAPLERMIN GEL 1%, 0.5 GM";
      break;
    case "S0160":
      returnvalue = "DEXTROAMPHETAMINE";
      break;
    case "S0161":
      returnvalue = "CALCITROL";
      break;
    case "S0162":
      returnvalue = "INJECTION EFALIZUMAB";
      break;
    case "S0164":
      returnvalue = "INJECTION PANTROPRAZOLE";
      break;
    case "S0166":
      returnvalue = "INJ OLANZAPINE 2.5MG";
      break;
    case "S0167":
      returnvalue = "INJ APOMORPHINE HCL 1MG";
      break;
    case "S0170":
      returnvalue = "ANASTROZOLE 1 MG";
      break;
    case "S0171":
      returnvalue = "BUMETANIDE 0.5 MG";
      break;
    case "S0172":
      returnvalue = "CHLORAMBUCIL 2 MG";
      break;
    case "S0174":
      returnvalue = "DOLASETRON 50 MG";
      break;
    case "S0175":
      returnvalue = "FLUTAMIDE 125 MG";
      break;
    case "S0176":
      returnvalue = "HYDROXYUREA 500 MG";
      break;
    case "S0177":
      returnvalue = "LEVAMISOLE 50 MG";
      break;
    case "S0178":
      returnvalue = "LOMUSTINE 10 MG";
      break;
    case "S0179":
      returnvalue = "MEGESTROL 20 MG";
      break;
    case "S0180":
      returnvalue = "ETONOGESTREL IMPLANT SYSTEM";
      break;
    case "S0181":
      returnvalue = "ONDANSETRON 4 MG";
      break;
    case "S0182":
      returnvalue = "PROCARBAZINE 5 MG";
      break;
    case "S0183":
      returnvalue = "PROCHLORPERAZINE 5 MG";
      break;
    case "S0187":
      returnvalue = "TAMOXIFEN 10 MG";
      break;
    case "S0189":
      returnvalue = "TESTOSTERONE PELLET 75 MG";
      break;
    case "S0190":
      returnvalue = "MIFEPRISTONE, ORAL, 200 MG";
      break;
    case "S0191":
      returnvalue = "MISOPROSTOL, ORAL, 200 MCG";
      break;
    case "S0194":
      returnvalue = "VITAMIN SUPPL 100 CAPS";
      break;
    case "S0195":
      returnvalue = "PNEUMO VACCINE 5-9 YRS";
      break;
    case "S0196":
      returnvalue = "POLY-L-LACTIC ACID 1ML FACE";
      break;
    case "S0197":
      returnvalue = "PRENATAL VITAMINS 30 DAY";
      break;
    case "S0198":
      returnvalue = "INJ PEGAPTANIB 0.3 MG";
      break;
    case "S0199":
      returnvalue = "MED ABORTION INC ALL EX DRUG";
      break;
    case "S0201":
      returnvalue = "PARTIAL HOSPITALIZATION SERV";
      break;
    case "S0207":
      returnvalue = "PARAMEDICINTERCEP NONHOSPALS";
      break;
    case "S0208":
      returnvalue = "PARAMED INTRCEPT NONVOL";
      break;
    case "S0209":
      returnvalue = "WC VAN MILEAGE PER MI";
      break;
    case "S0215":
      returnvalue = "NONEMERG TRANSP MILEAGE";
      break;
    case "S0220":
      returnvalue = "MEDICAL CONFERENCE BY PHYSIC";
      break;
    case "S0221":
      returnvalue = "MEDICAL CONFERENCE, 60 MIN";
      break;
    case "S0250":
      returnvalue = "COMP GERIATR ASSMT TEAM";
      break;
    case "S0255":
      returnvalue = "HOSPICE REFER VISIT NONMD";
      break;
    case "S0257":
      returnvalue = "END OF LIFE COUNSELING";
      break;
    case "S0260":
      returnvalue = "H&P FOR SURGERY";
      break;
    case "S0265":
      returnvalue = "GENETIC COUNSEL 15 MINS";
      break;
    case "S0270":
      returnvalue = "HOME STD CASE RATE 30 DAYS";
      break;
    case "S0271":
      returnvalue = "HOME HOSPICE CASE 30 DAYS";
      break;
    case "S0272":
      returnvalue = "HOME EPISODIC CASE 30 DAYS";
      break;
    case "S0273":
      returnvalue = "MD HOME VISIT OUTSIDE CAP";
      break;
    case "S0274":
      returnvalue = "NURSE PRACTR VISIT OUTS CAP";
      break;
    case "S0280":
      returnvalue = "MEDICAL HOME, INITIAL PLAN";
      break;
    case "S0281":
      returnvalue = "MEDICAL HOME, MAINTENANCE";
      break;
    case "S0302":
      returnvalue = "COMPLETED EPSDT";
      break;
    case "S0310":
      returnvalue = "HOSPITALIST VISIT";
      break;
    case "S0315":
      returnvalue = "DISEASE MANAGEMENT PROGRAM";
      break;
    case "S0316":
      returnvalue = "FOLLOW-UP/REASSESSMENT";
      break;
    case "S0317":
      returnvalue = "DISEASE MGMT PER DIEM";
      break;
    case "S0320":
      returnvalue = "RN TELEPHONE CALLS TO DMP";
      break;
    case "S0340":
      returnvalue = "LIFESTYLE MOD 1ST STAGE";
      break;
    case "S0341":
      returnvalue = "LIFESTYLE MOD 2 OR 3 STAGE";
      break;
    case "S0342":
      returnvalue = "LIFESTYLE MOD 4TH STAGE";
      break;
    case "S0345":
      returnvalue = "HOME ECG MONITRNG GLOBAL 24H";
      break;
    case "S0346":
      returnvalue = "HOME ECG MONITRNG TECH 24HR";
      break;
    case "S0347":
      returnvalue = "HOME ECG MONITRNG PROF 24HR";
      break;
    case "S0390":
      returnvalue = "ROUT FOOT CARE PER VISIT";
      break;
    case "S0395":
      returnvalue = "IMPRESSION CASTING FT";
      break;
    case "S0400":
      returnvalue = "GLOBAL ESWL KIDNEY";
      break;
    case "S0500":
      returnvalue = "DISPOS CONT LENS";
      break;
    case "S0504":
      returnvalue = "SINGL PRSCRP LENS";
      break;
    case "S0506":
      returnvalue = "BIFOC PRSCP LENS";
      break;
    case "S0508":
      returnvalue = "TRIFOC PRSCRP LENS";
      break;
    case "S0510":
      returnvalue = "NON-PRSCRP LENS";
      break;
    case "S0512":
      returnvalue = "DAILY CONT LENS";
      break;
    case "S0514":
      returnvalue = "COLOR CONT LENS";
      break;
    case "S0515":
      returnvalue = "SCLERAL LENS LIQUID BANDAGE";
      break;
    case "S0516":
      returnvalue = "SAFETY FRAMES";
      break;
    case "S0518":
      returnvalue = "SUNGLASS FRAMES";
      break;
    case "S0580":
      returnvalue = "POLYCARB LENS";
      break;
    case "S0581":
      returnvalue = "NONSTND LENS";
      break;
    case "S0590":
      returnvalue = "MISC INTEGRAL LENS SERV";
      break;
    case "S0592":
      returnvalue = "COMP CONT LENS EVAL";
      break;
    case "S0595":
      returnvalue = "NEW LENSES IN PTS OLD FRAME";
      break;
    case "S0601":
      returnvalue = "SCREENING PROCTOSCOPY";
      break;
    case "S0605":
      returnvalue = "DIGITAL RECTAL EXAMINATION,";
      break;
    case "S0610":
      returnvalue = "ANNUAL GYNECOLOGICAL EXAMINA";
      break;
    case "S0612":
      returnvalue = "ANNUAL GYNECOLOGICAL EXAMINA";
      break;
    case "S0613":
      returnvalue = "ANN BREAST EXAM";
      break;
    case "S0618":
      returnvalue = "AUDIOMETRY FOR HEARING AID";
      break;
    case "S0620":
      returnvalue = "ROUTINE OPHTHALMOLOGICAL EXA";
      break;
    case "S0621":
      returnvalue = "ROUTINE OPHTHALMOLOGICAL EXA";
      break;
    case "S0622":
      returnvalue = "PHYS EXAM FOR COLLEGE";
      break;
    case "S0625":
      returnvalue = "DIGITAL SCREENING RETINA";
      break;
    case "S0630":
      returnvalue = "REMOVAL OF SUTURES";
      break;
    case "S0800":
      returnvalue = "LASER IN SITU KERATOMILEUSIS";
      break;
    case "S0810":
      returnvalue = "PHOTOREFRACTIVE KERATECTOMY";
      break;
    case "S0812":
      returnvalue = "PHOTOTHERAP KERATECT";
      break;
    case "S0820":
      returnvalue = "COMPUTERIZED CORNEAL TOPOGRA";
      break;
    case "S1001":
      returnvalue = "DELUXE ITEM";
      break;
    case "S1002":
      returnvalue = "CUSTOM ITEM";
      break;
    case "S1015":
      returnvalue = "IV TUBING EXTENSION SET";
      break;
    case "S1016":
      returnvalue = "NON-PVC INTRAVENOUS ADMINIST";
      break;
    case "S1025":
      returnvalue = "INHAL NITRIC OXIDE NEONATE";
      break;
    case "S1030":
      returnvalue = "GLUC MONITOR PURCHASE";
      break;
    case "S1031":
      returnvalue = "GLUC MONITOR RENTAL";
      break;
    case "S1040":
      returnvalue = "CRANIAL REMOLDING ORTHOSIS";
      break;
    case "S2053":
      returnvalue = "TRANSPLANTATION OF SMALL INT";
      break;
    case "S2054":
      returnvalue = "TRANSPLANTATION OF MULTIVISC";
      break;
    case "S2055":
      returnvalue = "HARVESTING OF DONOR MULTIVIS";
      break;
    case "S2060":
      returnvalue = "LOBAR LUNG TRANSPLANTATION";
      break;
    case "S2061":
      returnvalue = "DONOR LOBECTOMY (LUNG)";
      break;
    case "S2065":
      returnvalue = "SIMULT PANC KIDN TRANS";
      break;
    case "S2066":
      returnvalue = "BREAST GAP FLAP RECONST";
      break;
    case "S2067":
      returnvalue = "BREAST ?STACKED? DIEP/GAP";
      break;
    case "S2068":
      returnvalue = "BREAST DIEP OR SIEA FLAP";
      break;
    case "S2070":
      returnvalue = "CYSTO LASER TX URETERAL CALC";
      break;
    case "S2075":
      returnvalue = "LAP INC/VENT HERNIA REPAIR";
      break;
    case "S2076":
      returnvalue = "LAP UMBILICAL HERNIA REPAIR";
      break;
    case "S2077":
      returnvalue = "LAP MESH IMPLANT HERN REP";
      break;
    case "S2078":
      returnvalue = "LAP SUPRACERV HYSTERECTOMY";
      break;
    case "S2079":
      returnvalue = "LAP ESOPHAGOMYOTOMY";
      break;
    case "S2080":
      returnvalue = "LAUP";
      break;
    case "S2083":
      returnvalue = "ADJUSTMENT GASTRIC BAND";
      break;
    case "S2095":
      returnvalue = "TRANSCATH EMBOLIZ MICROSPHER";
      break;
    case "S2102":
      returnvalue = "ISLET CELL TISSUE TRANSPLANT";
      break;
    case "S2103":
      returnvalue = "ADRENAL TISSUE TRANSPLANT";
      break;
    case "S2107":
      returnvalue = "ADOPTIVE IMMUNOTHERAPY";
      break;
    case "S2112":
      returnvalue = "KNEE ARTHROSCP HARV";
      break;
    case "S2114":
      returnvalue = "ARTHROSC SH TENODESIS BICEPS";
      break;
    case "S2115":
      returnvalue = "PERIACETABULAR OSTEOTOMY";
      break;
    case "S2117":
      returnvalue = "ARTHROEREISIS, SUBTALAR";
      break;
    case "S2118":
      returnvalue = "TOTAL HIP RESURFACING";
      break;
    case "S2120":
      returnvalue = "LOW DENSITY LIPOPROTEIN(LDL)";
      break;
    case "S2135":
      returnvalue = "NEUROLYSIS INTERSPACE FOOT";
      break;
    case "S2140":
      returnvalue = "CORD BLOOD HARVESTING";
      break;
    case "S2142":
      returnvalue = "CORD BLOOD-DERIVED STEM-CELL";
      break;
    case "S2150":
      returnvalue = "BMT HARV/TRANSPL 28D PKG";
      break;
    case "S2152":
      returnvalue = "SOLID ORGAN TRANSPL PKG";
      break;
    case "S2202":
      returnvalue = "ECHOSCLEROTHERAPY";
      break;
    case "S2205":
      returnvalue = "MINIMALLY INVASIVE DIRECT CO";
      break;
    case "S2206":
      returnvalue = "MINIMALLY INVASIVE DIRECT CO";
      break;
    case "S2207":
      returnvalue = "MINIMALLY INVASIVE DIRECT CO";
      break;
    case "S2208":
      returnvalue = "MINIMALLY INVASIVE DIRECT CO";
      break;
    case "S2209":
      returnvalue = "MINIMALLY INVASIVE DIRECT CO";
      break;
    case "S2213":
      returnvalue = "IMPLANT GASTRIC STIM";
      break;
    case "S2225":
      returnvalue = "MYRINGOTOMY LASER-ASSIST";
      break;
    case "S2230":
      returnvalue = "IMPLANT SEMI-IMP HEAR";
      break;
    case "S2235":
      returnvalue = "IMPLANT AUDITORY BRAIN IMP";
      break;
    case "S2250":
      returnvalue = "UTERINE ARTERY EMBOLIZ";
      break;
    case "S2260":
      returnvalue = "INDUCED ABORTION 17-24 WEEKS";
      break;
    case "S2262":
      returnvalue = "ABORTION MATERNAL INDIC>=25W";
      break;
    case "S2265":
      returnvalue = "INDUCED ABORTION 25-28 WKS";
      break;
    case "S2266":
      returnvalue = "INDUCED ABORTION 29-31 WKS";
      break;
    case "S2267":
      returnvalue = "INDUCED ABORTION 32 OR MORE";
      break;
    case "S2270":
      returnvalue = "INSERTION VAGINAL CYLINDER";
      break;
    case "S2300":
      returnvalue = "ARTHROSCOPY, SHOULDER, SURGI";
      break;
    case "S2325":
      returnvalue = "HIP CORE DECOMPRESSION";
      break;
    case "S2340":
      returnvalue = "CHEMODENERVATION OF ABDUCTOR";
      break;
    case "S2341":
      returnvalue = "CHEMODENERV ADDUCT VOCAL";
      break;
    case "S2342":
      returnvalue = "NASAL ENDOSCOP PO DEBRID";
      break;
    case "S2344":
      returnvalue = "ENDOSC BALLOON SINUPLASTY";
      break;
    case "S2348":
      returnvalue = "DECOMPRESS DISC RF LUMBAR";
      break;
    case "S2350":
      returnvalue = "DISKECTOMY, ANTERIOR, WITH D";
      break;
    case "S2351":
      returnvalue = "DISKECTOMY, ANTERIOR, WITH D";
      break;
    case "S2360":
      returnvalue = "VERTEBROPLAST CERV 1ST";
      break;
    case "S2361":
      returnvalue = "VERTEBROPLAST CERV ADDL";
      break;
    case "S2362":
      returnvalue = "KYPHOPLASTY, FIRST VERTEBRA";
      break;
    case "S2363":
      returnvalue = "KYPHOPLASTY, EACH ADDL";
      break;
    case "S2400":
      returnvalue = "FETAL SURG CONGEN HERNIA";
      break;
    case "S2401":
      returnvalue = "FETAL SURG URIN TRAC OBSTR";
      break;
    case "S2402":
      returnvalue = "FETAL SURG CONG CYST MALF";
      break;
    case "S2403":
      returnvalue = "FETAL SURG PULMON SEQUEST";
      break;
    case "S2404":
      returnvalue = "FETAL SURG MYELOMENINGO";
      break;
    case "S2405":
      returnvalue = "FETAL SURG SACROCOC TERATOMA";
      break;
    case "S2409":
      returnvalue = "FETAL SURG NOC";
      break;
    case "S2411":
      returnvalue = "FETOSCOP LASER THER TTTS";
      break;
    case "S2900":
      returnvalue = "ROBOTIC SURGICAL SYSTEM";
      break;
    case "S3000":
      returnvalue = "BILAT DIL RETINAL EXAM";
      break;
    case "S3005":
      returnvalue = "EVAL SELF-ASSESS DEPRESSION";
      break;
    case "S3600":
      returnvalue = "STAT LAB";
      break;
    case "S3601":
      returnvalue = "STAT LAB HOME/NF";
      break;
    case "S3618":
      returnvalue = "FREE BETA HCG";
      break;
    case "S3620":
      returnvalue = "NEWBORN METABOLIC SCREENING";
      break;
    case "S3625":
      returnvalue = "MATERNAL TRIPLE SCREEN TEST";
      break;
    case "S3626":
      returnvalue = "MATERNAL SERUM QUAD SCREEN";
      break;
    case "S3628":
      returnvalue = "PAMG-1 RAPID ASSAY FOR ROM";
      break;
    case "S3630":
      returnvalue = "EOSINOPHIL BLOOD COUNT";
      break;
    case "S3645":
      returnvalue = "HIV-1 ANTIBODY TESTING OF OR";
      break;
    case "S3650":
      returnvalue = "SALIVA TEST, HORMONE LEVEL;";
      break;
    case "S3652":
      returnvalue = "SALIVA TEST, HORMONE LEVEL;";
      break;
    case "S3655":
      returnvalue = "ANTISPERM ANTIBODIES TEST";
      break;
    case "S3701":
      returnvalue = "NMP-22 ASSAY";
      break;
    case "S3708":
      returnvalue = "GASTROINTESTINAL FAT ABSORPT";
      break;
    case "S3711":
      returnvalue = "CIRCULATING TUMOR CELL TEST";
      break;
    case "S3713":
      returnvalue = "KRAS MUTATION ANALYSIS";
      break;
    case "S3800":
      returnvalue = "GENETIC TESTING ALS";
      break;
    case "S3818":
      returnvalue = "BRCA1 GENE ANAL";
      break;
    case "S3819":
      returnvalue = "BRCA2 GENE ANAL";
      break;
    case "S3820":
      returnvalue = "COMP BRCA1/BRCA2";
      break;
    case "S3822":
      returnvalue = "SING MUTATION BRST/OVAR";
      break;
    case "S3823":
      returnvalue = "3 MUTATION BRST/OVAR";
      break;
    case "S3828":
      returnvalue = "COMP MLH1 GENE";
      break;
    case "S3829":
      returnvalue = "COMP MLH2 GENE";
      break;
    case "S3830":
      returnvalue = "GENE TEST HNPCC COMP";
      break;
    case "S3831":
      returnvalue = "GENE TEST HNPCC SINGLE";
      break;
    case "S3833":
      returnvalue = "COMP APC SEQUENCE";
      break;
    case "S3834":
      returnvalue = "SING MUTATION APC";
      break;
    case "S3835":
      returnvalue = "GENE TEST CYSTIC FIBROSIS";
      break;
    case "S3837":
      returnvalue = "GENE TEST HEMOCHROMATO";
      break;
    case "S3840":
      returnvalue = "DNA ANALYSIS RET-ONCOGENE";
      break;
    case "S3841":
      returnvalue = "GENE TEST RETINOBLASTOMA";
      break;
    case "S3842":
      returnvalue = "GENE TEST HIPPEL-LINDAU";
      break;
    case "S3843":
      returnvalue = "DNA ANALYSIS FACTOR V";
      break;
    case "S3844":
      returnvalue = "DNA ANALYSIS DEAFNESS";
      break;
    case "S3845":
      returnvalue = "GENE TEST ALPHA-THALASSEMIA";
      break;
    case "S3846":
      returnvalue = "GENE TEST BETA-THALASSEMIA";
      break;
    case "S3847":
      returnvalue = "GENE TEST TAY-SACHS";
      break;
    case "S3848":
      returnvalue = "GENE TEST GAUCHER";
      break;
    case "S3849":
      returnvalue = "GENE TEST NIEMANN-PICK";
      break;
    case "S3850":
      returnvalue = "GENE TEST SICKLE CELL";
      break;
    case "S3851":
      returnvalue = "GENE TEST CANAVAN";
      break;
    case "S3852":
      returnvalue = "DNA ANALYSIS APOE ALZHEIMER";
      break;
    case "S3853":
      returnvalue = "GENE TEST MYO MUSCLR DYST";
      break;
    case "S3854":
      returnvalue = "GENE PROFILE PANEL BREAST";
      break;
    case "S3855":
      returnvalue = "GENE TEST PRESENILIN-1 GENE";
      break;
    case "S3860":
      returnvalue = "GENET TEST CARDIAC ION-COMP";
      break;
    case "S3861":
      returnvalue = "GENETIC TEST BRUGADA";
      break;
    case "S3862":
      returnvalue = "GENET TEST CARDIAC ION-SPEC";
      break;
    case "S3865":
      returnvalue = "COMP GENET TEST HYP CARDIOMY";
      break;
    case "S3866":
      returnvalue = "SPEC GENE TEST HYP CARDIOMY";
      break;
    case "S3870":
      returnvalue = "CGH TEST DEVELOPMENTAL DELAY";
      break;
    case "S3890":
      returnvalue = "FECAL DNA ANALYSIS";
      break;
    case "S3900":
      returnvalue = "SURFACE EMG";
      break;
    case "S3902":
      returnvalue = "BALLISTOCARDIOGRAM";
      break;
    case "S3904":
      returnvalue = "MASTERS TWO STEP";
      break;
    case "S3905":
      returnvalue = "AUTO HANDHELD DIAG NERV TEST";
      break;
    case "S4005":
      returnvalue = "INTERIM LABOR FACILITY GLOBA";
      break;
    case "S4011":
      returnvalue = "IVF PACKAGE";
      break;
    case "S4013":
      returnvalue = "COMPL GIFT CASE RATE";
      break;
    case "S4014":
      returnvalue = "COMPL ZIFT CASE RATE";
      break;
    case "S4015":
      returnvalue = "COMPLETE IVF NOS CASE RATE";
      break;
    case "S4016":
      returnvalue = "FROZEN IVF CASE RATE";
      break;
    case "S4017":
      returnvalue = "IVF CANC A STIM CASE RATE";
      break;
    case "S4018":
      returnvalue = "F EMB TRNS CANC CASE RATE";
      break;
    case "S4020":
      returnvalue = "IVF CANC A ASPIR CASE RATE";
      break;
    case "S4021":
      returnvalue = "IVF CANC P ASPIR CASE RATE";
      break;
    case "S4022":
      returnvalue = "ASST OOCYTE FERT CASE RATE";
      break;
    case "S4023":
      returnvalue = "INCOMPL DONOR EGG CASE RATE";
      break;
    case "S4025":
      returnvalue = "DONOR SERV IVF CASE RATE";
      break;
    case "S4026":
      returnvalue = "PROCURE DONOR SPERM";
      break;
    case "S4027":
      returnvalue = "STORE PREV FROZ EMBRYOS";
      break;
    case "S4028":
      returnvalue = "MICROSURG EPI SPERM ASP";
      break;
    case "S4030":
      returnvalue = "SPERM PROCURE INIT VISIT";
      break;
    case "S4031":
      returnvalue = "SPERM PROCURE SUBS VISIT";
      break;
    case "S4035":
      returnvalue = "STIMULATED IUI CASE RATE";
      break;
    case "S4036":
      returnvalue = "INTRAVAG CULT CASE RATE";
      break;
    case "S4037":
      returnvalue = "CRYO EMBRYO TRANSF CASE RATE";
      break;
    case "S4040":
      returnvalue = "MONIT STORE CRYO EMBRYO 30 D";
      break;
    case "S4042":
      returnvalue = "OVULATION MGMT PER CYCLE";
      break;
    case "S4981":
      returnvalue = "INSERT LEVONORGESTREL IUS";
      break;
    case "S4989":
      returnvalue = "CONTRACEPT IUD";
      break;
    case "S4990":
      returnvalue = "NICOTINE PATCH LEGEND";
      break;
    case "S4991":
      returnvalue = "NICOTINE PATCH NONLEGEND";
      break;
    case "S4993":
      returnvalue = "CONTRACEPTIVE PILLS FOR BC";
      break;
    case "S4995":
      returnvalue = "SMOKING CESSATION GUM";
      break;
    case "S5000":
      returnvalue = "PRESCRIPTION DRUG, GENERIC";
      break;
    case "S5001":
      returnvalue = "PRESCRIPTION DRUG,BRAND NAME";
      break;
    case "S5010":
      returnvalue = "5% DEXTROSE AND 0.45% SALINE";
      break;
    case "S5011":
      returnvalue = "5% DEXTROSE IN LACTATED RING";
      break;
    case "S5012":
      returnvalue = "5% DEXTROSE WITH POTASSIUM";
      break;
    case "S5013":
      returnvalue = "5%DEXTROSE/0.45%SALINE1000ML";
      break;
    case "S5014":
      returnvalue = "D5W/0.45NS W KCL AND MGS04";
      break;
    case "S5035":
      returnvalue = "HIT ROUTINE DEVICE MAINT";
      break;
    case "S5036":
      returnvalue = "HIT DEVICE REPAIR";
      break;
    case "S5100":
      returnvalue = "ADULT DAYCARE SERVICES 15MIN";
      break;
    case "S5101":
      returnvalue = "ADULT DAY CARE PER HALF DAY";
      break;
    case "S5102":
      returnvalue = "ADULT DAY CARE PER DIEM";
      break;
    case "S5105":
      returnvalue = "CENTERBASED DAY CARE PERDIEM";
      break;
    case "S5108":
      returnvalue = "HOMECARE TRAIN PT 15 MIN";
      break;
    case "S5109":
      returnvalue = "HOMECARE TRAIN PT SESSION";
      break;
    case "S5110":
      returnvalue = "FAMILY HOMECARE TRAINING 15M";
      break;
    case "S5111":
      returnvalue = "FAMILY HOMECARE TRAIN/SESSIO";
      break;
    case "S5115":
      returnvalue = "NONFAMILY HOMECARE TRAIN/15M";
      break;
    case "S5116":
      returnvalue = "NONFAMILY HC TRAIN/SESSION";
      break;
    case "S5120":
      returnvalue = "CHORE SERVICES PER 15 MIN";
      break;
    case "S5121":
      returnvalue = "CHORE SERVICES PER DIEM";
      break;
    case "S5125":
      returnvalue = "ATTENDANT CARE SERVICE /15M";
      break;
    case "S5126":
      returnvalue = "ATTENDANT CARE SERVICE /DIEM";
      break;
    case "S5130":
      returnvalue = "HOMAKER SERVICE NOS PER 15M";
      break;
    case "S5131":
      returnvalue = "HOMEMAKER SERVICE NOS /DIEM";
      break;
    case "S5135":
      returnvalue = "ADULT COMPANIONCARE PER 15M";
      break;
    case "S5136":
      returnvalue = "ADULT COMPANIONCARE PER DIEM";
      break;
    case "S5140":
      returnvalue = "ADULT FOSTER CARE PER DIEM";
      break;
    case "S5141":
      returnvalue = "ADULT FOSTER CARE PER MONTH";
      break;
    case "S5145":
      returnvalue = "CHILD FOSTERCARE TH PER DIEM";
      break;
    case "S5146":
      returnvalue = "THER FOSTERCARE CHILD /MONTH";
      break;
    case "S5150":
      returnvalue = "UNSKILLED RESPITE CARE /15M";
      break;
    case "S5151":
      returnvalue = "UNSKILLED RESPITECARE /DIEM";
      break;
    case "S5160":
      returnvalue = "EMER RESPONSE SYS INSTAL&TST";
      break;
    case "S5161":
      returnvalue = "EMER RSPNS SYS SERV PERMONTH";
      break;
    case "S5162":
      returnvalue = "EMER RSPNS SYSTEM PURCHASE";
      break;
    case "S5165":
      returnvalue = "HOME MODIFICATIONS PER SERV";
      break;
    case "S5170":
      returnvalue = "HOMEDELIVERED PREPARED MEAL";
      break;
    case "S5175":
      returnvalue = "LAUNDRY SERV,EXT,PROF,/ORDER";
      break;
    case "S5180":
      returnvalue = "HH RESPIRATORY THRPY IN EVAL";
      break;
    case "S5181":
      returnvalue = "HH RESPIRATORY THRPY NOS/DAY";
      break;
    case "S5185":
      returnvalue = "MED REMINDER SERV PER MONTH";
      break;
    case "S5190":
      returnvalue = "WELLNESS ASSESSMENT BY NONPH";
      break;
    case "S5199":
      returnvalue = "PERSONAL CARE ITEM NOS EACH";
      break;
    case "S5497":
      returnvalue = "HIT CATH CARE NOC";
      break;
    case "S5498":
      returnvalue = "HIT SIMPLE CATH CARE";
      break;
    case "S5501":
      returnvalue = "HIT COMPLEX CATH CARE";
      break;
    case "S5502":
      returnvalue = "HIT INTERIM CATH CARE";
      break;
    case "S5517":
      returnvalue = "HIT DECLOTTING KIT";
      break;
    case "S5518":
      returnvalue = "HIT CATH REPAIR KIT";
      break;
    case "S5520":
      returnvalue = "HIT PICC INSERT KIT";
      break;
    case "S5521":
      returnvalue = "HIT MIDLINE CATH INSERT KIT";
      break;
    case "S5522":
      returnvalue = "HIT PICC INSERT NO SUPP";
      break;
    case "S5523":
      returnvalue = "HIP MIDLINE CATH INSERT KIT";
      break;
    case "S5550":
      returnvalue = "INSULIN RAPID 5 U";
      break;
    case "S5551":
      returnvalue = "INSULIN MOST RAPID 5 U";
      break;
    case "S5552":
      returnvalue = "INSULIN INTERMED 5 U";
      break;
    case "S5553":
      returnvalue = "INSULIN LONG ACTING 5 U";
      break;
    case "S5560":
      returnvalue = "INSULIN REUSE PEN 1.5 ML";
      break;
    case "S5561":
      returnvalue = "INSULIN REUSE PEN 3 ML";
      break;
    case "S5565":
      returnvalue = "INSULIN CARTRIDGE 150 U";
      break;
    case "S5566":
      returnvalue = "INSULIN CARTRIDGE 300 U";
      break;
    case "S5570":
      returnvalue = "INSULIN DISPOS PEN 1.5 ML";
      break;
    case "S5571":
      returnvalue = "INSULIN DISPOS PEN 3 ML";
      break;
    case "S8030":
      returnvalue = "TANTALUM RING APPLICATION";
      break;
    case "S8035":
      returnvalue = "MAGNETIC SOURCE IMAGING";
      break;
    case "S8037":
      returnvalue = "MRCP";
      break;
    case "S8040":
      returnvalue = "TOPOGRAPHIC BRAIN MAPPING";
      break;
    case "S8042":
      returnvalue = "MRI LOW FIELD";
      break;
    case "S8049":
      returnvalue = "INTRAOPERATIVE RADIATION THE";
      break;
    case "S8055":
      returnvalue = "US GUIDANCE FETAL REDUCT";
      break;
    case "S8075":
      returnvalue = "CAD OF DIGITAL MAMMOGR";
      break;
    case "S8080":
      returnvalue = "SCINTIMAMMOGRAPHY";
      break;
    case "S8085":
      returnvalue = "FLUORINE-18 FLUORODEOXYGLUCO";
      break;
    case "S8092":
      returnvalue = "ELECTRON BEAM COMPUTED TOMOG";
      break;
    case "S8093":
      returnvalue = "CT ANGIOGRAPHY CORONARY";
      break;
    case "S8096":
      returnvalue = "PORTABLE PEAK FLOW METER";
      break;
    case "S8097":
      returnvalue = "ASTHMA KIT";
      break;
    case "S8100":
      returnvalue = "SPACER WITHOUT MASK";
      break;
    case "S8101":
      returnvalue = "SPACER WITH MASK";
      break;
    case "S8110":
      returnvalue = "PEAK EXPIRATORY FLOW RATE (P";
      break;
    case "S8120":
      returnvalue = "O2 CONTENTS GAS CUBIC FT";
      break;
    case "S8121":
      returnvalue = "O2 CONTENTS LIQUID LB";
      break;
    case "S8185":
      returnvalue = "FLUTTER DEVICE";
      break;
    case "S8186":
      returnvalue = "SWIVEL ADAPTOR";
      break;
    case "S8189":
      returnvalue = "TRACH SUPPLY NOC";
      break;
    case "S8190":
      returnvalue = "ELECTRONIC SPIROMETER";
      break;
    case "S8210":
      returnvalue = "MUCUS TRAP";
      break;
    case "S8260":
      returnvalue = "ORAL ORTHOTIC FOR TREATMENT";
      break;
    case "S8262":
      returnvalue = "MANDIB ORTHO REPOS DEVICE";
      break;
    case "S8265":
      returnvalue = "HABERMAN FEEDER";
      break;
    case "S8270":
      returnvalue = "ENURESIS ALARM";
      break;
    case "S8301":
      returnvalue = "INFECT CONTROL SUPPLIES NOS";
      break;
    case "S8415":
      returnvalue = "SUPPLIES FOR HOME DELIVERY";
      break;
    case "S8420":
      returnvalue = "CUSTOM GRADIENT SLEEV/GLOV";
      break;
    case "S8421":
      returnvalue = "READY GRADIENT SLEEV/GLOV";
      break;
    case "S8422":
      returnvalue = "CUSTOM GRAD SLEEVE MED";
      break;
    case "S8423":
      returnvalue = "CUSTOM GRAD SLEEVE HEAVY";
      break;
    case "S8424":
      returnvalue = "READY GRADIENT SLEEVE";
      break;
    case "S8425":
      returnvalue = "CUSTOM GRAD GLOVE MED";
      break;
    case "S8426":
      returnvalue = "CUSTOM GRAD GLOVE HEAVY";
      break;
    case "S8427":
      returnvalue = "READY GRADIENT GLOVE";
      break;
    case "S8428":
      returnvalue = "READY GRADIENT GAUNTLET";
      break;
    case "S8429":
      returnvalue = "GRADIENT PRESSURE WRAP";
      break;
    case "S8430":
      returnvalue = "PADDING FOR COMPRSSN BDG";
      break;
    case "S8431":
      returnvalue = "COMPRESSION BANDAGE";
      break;
    case "S8450":
      returnvalue = "SPLINT DIGIT";
      break;
    case "S8451":
      returnvalue = "SPLINT WRIST OR ANKLE";
      break;
    case "S8452":
      returnvalue = "SPLINT ELBOW";
      break;
    case "S8460":
      returnvalue = "CAMISOLE POST-MAST";
      break;
    case "S8490":
      returnvalue = "100 INSULIN SYRINGES";
      break;
    case "S8940":
      returnvalue = "HIPPOTHERAPY PER SESSION";
      break;
    case "S8948":
      returnvalue = "LOW-LEVEL LASER TRMT 15 MIN";
      break;
    case "S8950":
      returnvalue = "COMPLEX LYMPHEDEMA THERAPY,";
      break;
    case "S8990":
      returnvalue = "PT OR MANIP FOR MAINT";
      break;
    case "S8999":
      returnvalue = "RESUSCITATION BAG";
      break;
    case "S9001":
      returnvalue = "HOME UTERINE MONITOR WITH OR";
      break;
    case "S9007":
      returnvalue = "ULTRAFILTRATION MONITOR";
      break;
    case "S9015":
      returnvalue = "AUTOMATED EEG MONITORING";
      break;
    case "S9022":
      returnvalue = "DIGITAL SUBTRACTION ANGIOGRA";
      break;
    case "S9024":
      returnvalue = "PARANASAL SINUS ULTRASOUND";
      break;
    case "S9025":
      returnvalue = "OMNICARDIOGRAM/CARDIOINTEGRA";
      break;
    case "S9034":
      returnvalue = "ESWL FOR GALLSTONES";
      break;
    case "S9055":
      returnvalue = "PROCUREN OR OTHER GROWTH FAC";
      break;
    case "S9056":
      returnvalue = "COMA STIMULATION PER DIEM";
      break;
    case "S9061":
      returnvalue = "MEDICAL SUPPLIES AND EQUIPME";
      break;
    case "S9075":
      returnvalue = "SMOKING CESSATION TREATMENT";
      break;
    case "S9083":
      returnvalue = "URGENT CARE CENTER GLOBAL";
      break;
    case "S9088":
      returnvalue = "SERVICES PROVIDED IN URGENT";
      break;
    case "S9090":
      returnvalue = "VERTEBRAL AXIAL DECOMPRESSIO";
      break;
    case "S9092":
      returnvalue = "CANOLITH REPOSITIONING";
      break;
    case "S9097":
      returnvalue = "HOME VISIT WOUND CARE";
      break;
    case "S9098":
      returnvalue = "HOME PHOTOTHERAPY VISIT";
      break;
    case "S9109":
      returnvalue = "CHF TELEMONITORING MONTH";
      break;
    case "S9117":
      returnvalue = "BACK SCHOOL VISIT";
      break;
    case "S9122":
      returnvalue = "HOME HEALTH AIDE OR CERTIFIE";
      break;
    case "S9123":
      returnvalue = "NURSING CARE IN HOME RN";
      break;
    case "S9124":
      returnvalue = "NURSING CARE, IN THE HOME; B";
      break;
    case "S9125":
      returnvalue = "RESPITE CARE, IN THE HOME, P";
      break;
    case "S9126":
      returnvalue = "HOSPICE CARE, IN THE HOME, P";
      break;
    case "S9127":
      returnvalue = "SOCIAL WORK VISIT, IN THE HO";
      break;
    case "S9128":
      returnvalue = "SPEECH THERAPY, IN THE HOME,";
      break;
    case "S9129":
      returnvalue = "OCCUPATIONAL THERAPY, IN THE";
      break;
    case "S9131":
      returnvalue = "PT IN THE HOME PER DIEM";
      break;
    case "S9140":
      returnvalue = "DIABETIC MANAGEMENT PROGRAM,";
      break;
    case "S9141":
      returnvalue = "DIABETIC MANAGEMENT PROGRAM,";
      break;
    case "S9145":
      returnvalue = "INSULIN PUMP INITIATION";
      break;
    case "S9150":
      returnvalue = "EVALUATION BY OCULARIST";
      break;
    case "S9152":
      returnvalue = "SPEECH THERAPY, RE-EVAL";
      break;
    case "S9208":
      returnvalue = "HOME MGMT PRETERM LABOR";
      break;
    case "S9209":
      returnvalue = "HOME MGMT PPROM";
      break;
    case "S9211":
      returnvalue = "HOME MGMT GEST HYPERTENSION";
      break;
    case "S9212":
      returnvalue = "HM POSTPAR HYPER PER DIEM";
      break;
    case "S9213":
      returnvalue = "HM PREECLAMP PER DIEM";
      break;
    case "S9214":
      returnvalue = "HM GEST DM PER DIEM";
      break;
    case "S9325":
      returnvalue = "HIT PAIN MGMT PER DIEM";
      break;
    case "S9326":
      returnvalue = "HIT CONT PAIN PER DIEM";
      break;
    case "S9327":
      returnvalue = "HIT INT PAIN PER DIEM";
      break;
    case "S9328":
      returnvalue = "HIT PAIN IMP PUMP DIEM";
      break;
    case "S9329":
      returnvalue = "HIT CHEMO PER DIEM";
      break;
    case "S9330":
      returnvalue = "HIT CONT CHEM DIEM";
      break;
    case "S9331":
      returnvalue = "HIT INTERMIT CHEMO DIEM";
      break;
    case "S9335":
      returnvalue = "HT HEMODIALYSIS DIEM";
      break;
    case "S9336":
      returnvalue = "HIT CONT ANTICOAG DIEM";
      break;
    case "S9338":
      returnvalue = "HIT IMMUNOTHERAPY DIEM";
      break;
    case "S9339":
      returnvalue = "HIT PERITON DIALYSIS DIEM";
      break;
    case "S9340":
      returnvalue = "HIT ENTERAL PER DIEM";
      break;
    case "S9341":
      returnvalue = "HIT ENTERAL GRAV DIEM";
      break;
    case "S9342":
      returnvalue = "HIT ENTERAL PUMP DIEM";
      break;
    case "S9343":
      returnvalue = "HIT ENTERAL BOLUS NURS";
      break;
    case "S9345":
      returnvalue = "HIT ANTI-HEMOPHIL DIEM";
      break;
    case "S9346":
      returnvalue = "HIT ALPHA-1-PROTEINAS DIEM";
      break;
    case "S9347":
      returnvalue = "HIT LONGTERM INFUSION DIEM";
      break;
    case "S9348":
      returnvalue = "HIT SYMPATHOMIM DIEM";
      break;
    case "S9349":
      returnvalue = "HIT TOCOLYSIS DIEM";
      break;
    case "S9351":
      returnvalue = "HIT CONT ANTIEMETIC DIEM";
      break;
    case "S9353":
      returnvalue = "HIT CONT INSULIN DIEM";
      break;
    case "S9355":
      returnvalue = "HIT CHELATION DIEM";
      break;
    case "S9357":
      returnvalue = "HIT ENZYME REPLACE DIEM";
      break;
    case "S9359":
      returnvalue = "HIT ANTI-TNF PER DIEM";
      break;
    case "S9361":
      returnvalue = "HIT DIURETIC INFUS DIEM";
      break;
    case "S9363":
      returnvalue = "HIT ANTI-SPASMOTIC DIEM";
      break;
    case "S9364":
      returnvalue = "HIT TPN TOTAL DIEM";
      break;
    case "S9365":
      returnvalue = "HIT TPN 1 LITER DIEM";
      break;
    case "S9366":
      returnvalue = "HIT TPN 2 LITER DIEM";
      break;
    case "S9367":
      returnvalue = "HIT TPN 3 LITER DIEM";
      break;
    case "S9368":
      returnvalue = "HIT TPN OVER 3L DIEM";
      break;
    case "S9370":
      returnvalue = "HT INJ ANTIEMETIC DIEM";
      break;
    case "S9372":
      returnvalue = "HT INJ ANTICOAG DIEM";
      break;
    case "S9373":
      returnvalue = "HIT HYDRA TOTAL DIEM";
      break;
    case "S9374":
      returnvalue = "HIT HYDRA 1 LITER DIEM";
      break;
    case "S9375":
      returnvalue = "HIT HYDRA 2 LITER DIEM";
      break;
    case "S9376":
      returnvalue = "HIT HYDRA 3 LITER DIEM";
      break;
    case "S9377":
      returnvalue = "HIT HYDRA OVER 3L DIEM";
      break;
    case "S9379":
      returnvalue = "HIT NOC PER DIEM";
      break;
    case "S9381":
      returnvalue = "HIT HIGH RISK/ESCORT";
      break;
    case "S9401":
      returnvalue = "ANTICOAG CLINIC PER SESSION";
      break;
    case "S9430":
      returnvalue = "PHARMACY COMP/DISP SERV";
      break;
    case "S9433":
      returnvalue = "MEDICAL FOOD ORAL 100% NUTR";
      break;
    case "S9434":
      returnvalue = "MOD SOLID FOOD SUPPL";
      break;
    case "S9435":
      returnvalue = "MEDICAL FOODS FOR INBORN ERR";
      break;
    case "S9436":
      returnvalue = "LAMAZE CLASS";
      break;
    case "S9437":
      returnvalue = "CHILDBIRTH REFRESHER CLASS";
      break;
    case "S9438":
      returnvalue = "CESAREAN BIRTH CLASS";
      break;
    case "S9439":
      returnvalue = "VBAC CLASS";
      break;
    case "S9441":
      returnvalue = "ASTHMA EDUCATION";
      break;
    case "S9442":
      returnvalue = "BIRTHING CLASS";
      break;
    case "S9443":
      returnvalue = "LACTATION CLASS";
      break;
    case "S9444":
      returnvalue = "PARENTING CLASS";
      break;
    case "S9445":
      returnvalue = "PT EDUCATION NOC INDIVID";
      break;
    case "S9446":
      returnvalue = "PT EDUCATION NOC GROUP";
      break;
    case "S9447":
      returnvalue = "INFANT SAFETY CLASS";
      break;
    case "S9449":
      returnvalue = "WEIGHT MGMT CLASS";
      break;
    case "S9451":
      returnvalue = "EXERCISE CLASS";
      break;
    case "S9452":
      returnvalue = "NUTRITION CLASS";
      break;
    case "S9453":
      returnvalue = "SMOKING CESSATION CLASS";
      break;
    case "S9454":
      returnvalue = "STRESS MGMT CLASS";
      break;
    case "S9455":
      returnvalue = "DIABETIC MANAGEMENT PROGRAM,";
      break;
    case "S9460":
      returnvalue = "DIABETIC MANAGEMENT PROGRAM,";
      break;
    case "S9465":
      returnvalue = "DIABETIC MANAGEMENT PROGRAM,";
      break;
    case "S9470":
      returnvalue = "NUTRITIONAL COUNSELING, DIET";
      break;
    case "S9472":
      returnvalue = "CARDIAC REHABILITATION PROGR";
      break;
    case "S9473":
      returnvalue = "PULMONARY REHABILITATION PRO";
      break;
    case "S9474":
      returnvalue = "ENTEROSTOMAL THERAPY BY A RE";
      break;
    case "S9475":
      returnvalue = "AMBULATORY SETTING SUBSTANCE";
      break;
    case "S9476":
      returnvalue = "VESTIBULAR REHAB PER DIEM";
      break;
    case "S9480":
      returnvalue = "INTENSIVE OUTPATIENT PSYCHIA";
      break;
    case "S9482":
      returnvalue = "FAMILY STABILIZATION 15 MIN";
      break;
    case "S9484":
      returnvalue = "CRISIS INTERVENTION PER HOUR";
      break;
    case "S9485":
      returnvalue = "CRISIS INTERVENTION MENTAL H";
      break;
    case "S9490":
      returnvalue = "HIT CORTICOSTEROID/DIEM";
      break;
    case "S9494":
      returnvalue = "HIT ANTIBIOTIC TOTAL DIEM";
      break;
    case "S9497":
      returnvalue = "HIT ANTIBIOTIC Q3H DIEM";
      break;
    case "S9500":
      returnvalue = "HIT ANTIBIOTIC Q24H DIEM";
      break;
    case "S9501":
      returnvalue = "HIT ANTIBIOTIC Q12H DIEM";
      break;
    case "S9502":
      returnvalue = "HIT ANTIBIOTIC Q8H DIEM";
      break;
    case "S9503":
      returnvalue = "HIT ANTIBIOTIC Q6H DIEM";
      break;
    case "S9504":
      returnvalue = "HIT ANTIBIOTIC Q4H DIEM";
      break;
    case "S9529":
      returnvalue = "VENIPUNCTURE HOME/SNF";
      break;
    case "S9537":
      returnvalue = "HT HEM HORM INJ DIEM";
      break;
    case "S9538":
      returnvalue = "HIT BLOOD PRODUCTS DIEM";
      break;
    case "S9542":
      returnvalue = "HT INJ NOC PER DIEM";
      break;
    case "S9558":
      returnvalue = "HT INJ GROWTH HORM DIEM";
      break;
    case "S9559":
      returnvalue = "HIT INJ INTERFERON DIEM";
      break;
    case "S9560":
      returnvalue = "HT INJ HORMONE DIEM";
      break;
    case "S9562":
      returnvalue = "HT INJ PALIVIZUMAB DIEM";
      break;
    case "S9590":
      returnvalue = "HT IRRIGATION DIEM";
      break;
    case "S9810":
      returnvalue = "HT PHARM PER HOUR";
      break;
    case "S9900":
      returnvalue = "CHRISTIAN SCI PRACT VISIT";
      break;
    case "S9970":
      returnvalue = "HEALTH CLUB MEMBERSHIP YR";
      break;
    case "S9975":
      returnvalue = "TRANSPLANT RELATED PER DIEM";
      break;
    case "S9976":
      returnvalue = "LODGING PER DIEM";
      break;
    case "S9977":
      returnvalue = "MEALS PER DIEM";
      break;
    case "S9981":
      returnvalue = "MED RECORD COPY ADMIN";
      break;
    case "S9982":
      returnvalue = "MED RECORD COPY PER PAGE";
      break;
    case "S9986":
      returnvalue = "NOT MEDICALLY NECESSARY SVC";
      break;
    case "S9988":
      returnvalue = "SERV PART OF PHASE I TRIAL";
      break;
    case "S9989":
      returnvalue = "SERVICES OUTSIDE US";
      break;
    case "S9990":
      returnvalue = "SERVICES PROVIDED AS PART OF";
      break;
    case "S9991":
      returnvalue = "SERVICES PROVIDED AS PART OF";
      break;
    case "S9992":
      returnvalue = "TRANSPORTATION COSTS TO AND";
      break;
    case "S9994":
      returnvalue = "LODGING COSTS (E.G. HOTEL CH";
      break;
    case "S9996":
      returnvalue = "MEALS FOR CLINICAL TRIAL PAR";
      break;
    case "S9999":
      returnvalue = "SALES TAX";
      break;
    case "T1000":
      returnvalue = "PRIVATE DUTY/INDEPENDENT NSG";
      break;
    case "T1001":
      returnvalue = "NURSING ASSESSMENT/EVALUATN";
      break;
    case "T1002":
      returnvalue = "RN SERVICES UP TO 15 MINUTES";
      break;
    case "T1003":
      returnvalue = "LPN/LVN SERVICES UP TO 15MIN";
      break;
    case "T1004":
      returnvalue = "NSG AIDE SERVICE UP TO 15MIN";
      break;
    case "T1005":
      returnvalue = "RESPITE CARE SERVICE 15 MIN";
      break;
    case "T1006":
      returnvalue = "FAMILY/COUPLE COUNSELING";
      break;
    case "T1007":
      returnvalue = "TREATMENT PLAN DEVELOPMENT";
      break;
    case "T1009":
      returnvalue = "CHILD SITTING SERVICES";
      break;
    case "T1010":
      returnvalue = "MEALS WHEN RECEIVE SERVICES";
      break;
    case "T1012":
      returnvalue = "ALCOHOL/SUBSTANCE ABUSE SKIL";
      break;
    case "T1013":
      returnvalue = "SIGN LANG/ORAL INTERPRETER";
      break;
    case "T1014":
      returnvalue = "TELEHEALTH TRANSMIT, PER MIN";
      break;
    case "T1015":
      returnvalue = "CLINIC SERVICE";
      break;
    case "T1016":
      returnvalue = "CASE MANAGEMENT";
      break;
    case "T1017":
      returnvalue = "TARGETED CASE MANAGEMENT";
      break;
    case "T1018":
      returnvalue = "SCHOOL-BASED IEP SER BUNDLED";
      break;
    case "T1019":
      returnvalue = "PERSONAL CARE SER PER 15 MIN";
      break;
    case "T1020":
      returnvalue = "PERSONAL CARE SER PER DIEM";
      break;
    case "T1021":
      returnvalue = "HH AIDE OR CN AIDE PER VISIT";
      break;
    case "T1022":
      returnvalue = "CONTRACTED SERVICES PER DAY";
      break;
    case "T1023":
      returnvalue = "PROGRAM INTAKE ASSESSMENT";
      break;
    case "T1024":
      returnvalue = "TEAM EVALUATION & MANAGEMENT";
      break;
    case "T1025":
      returnvalue = "PED COMPR CARE PKG, PER DIEM";
      break;
    case "T1026":
      returnvalue = "PED COMPR CARE PKG, PER HOUR";
      break;
    case "T1027":
      returnvalue = "FAMILY TRAINING & COUNSELING";
      break;
    case "T1028":
      returnvalue = "HOME ENVIRONMENT ASSESSMENT";
      break;
    case "T1029":
      returnvalue = "DWELLING LEAD INVESTIGATION";
      break;
    case "T1030":
      returnvalue = "RN HOME CARE PER DIEM";
      break;
    case "T1031":
      returnvalue = "LPN HOME CARE PER DIEM";
      break;
    case "T1502":
      returnvalue = "MEDICATION ADMIN VISIT";
      break;
    case "T1503":
      returnvalue = "MED ADMIN, NOT ORAL/INJECT";
      break;
    case "T1999":
      returnvalue = "NOC RETAIL ITEMS ANDSUPPLIES";
      break;
    case "T2001":
      returnvalue = "N-ET; PATIENT ATTEND/ESCORT";
      break;
    case "T2002":
      returnvalue = "N-ET; PER DIEM";
      break;
    case "T2003":
      returnvalue = "N-ET; ENCOUNTER/TRIP";
      break;
    case "T2004":
      returnvalue = "N-ET; COMMERC CARRIER PASS";
      break;
    case "T2005":
      returnvalue = "N-ET; STRETCHER VAN";
      break;
    case "T2007":
      returnvalue = "NON-EMER TRANSPORT WAIT TIME";
      break;
    case "T2010":
      returnvalue = "PASRR LEVEL I";
      break;
    case "T2011":
      returnvalue = "PASRR LEVEL II";
      break;
    case "T2012":
      returnvalue = "HABIL ED WAIVER, PER DIEM";
      break;
    case "T2013":
      returnvalue = "HABIL ED WAIVER PER HOUR";
      break;
    case "T2014":
      returnvalue = "HABIL PREVOC WAIVER, PER D";
      break;
    case "T2015":
      returnvalue = "HABIL PREVOC WAIVER PER HR";
      break;
    case "T2016":
      returnvalue = "HABIL RES WAIVER PER DIEM";
      break;
    case "T2017":
      returnvalue = "HABIL RES WAIVER 15 MIN";
      break;
    case "T2018":
      returnvalue = "HABIL SUP EMPL WAIVER/DIEM";
      break;
    case "T2019":
      returnvalue = "HABIL SUP EMPL WAIVER 15MIN";
      break;
    case "T2020":
      returnvalue = "DAY HABIL WAIVER PER DIEM";
      break;
    case "T2021":
      returnvalue = "DAY HABIL WAIVER PER 15 MIN";
      break;
    case "T2022":
      returnvalue = "CASE MANAGEMENT, PER MONTH";
      break;
    case "T2023":
      returnvalue = "TARGETED CASE MGMT PER MONTH";
      break;
    case "T2024":
      returnvalue = "SERV ASMNT/CARE PLAN WAIVER";
      break;
    case "T2025":
      returnvalue = "WAIVER SERVICE, NOS";
      break;
    case "T2026":
      returnvalue = "SPECIAL CHILDCARE WAIVER/D";
      break;
    case "T2027":
      returnvalue = "SPEC CHILDCARE WAIVER 15 MIN";
      break;
    case "T2028":
      returnvalue = "SPECIAL SUPPLY, NOS WAIVER";
      break;
    case "T2029":
      returnvalue = "SPECIAL MED EQUIP, NOSWAIVER";
      break;
    case "T2030":
      returnvalue = "ASSIST LIVING WAIVER/MONTH";
      break;
    case "T2031":
      returnvalue = "ASSIST LIVING WAIVER/DIEM";
      break;
    case "T2032":
      returnvalue = "RES CARE, NOS WAIVER/MONTH";
      break;
    case "T2033":
      returnvalue = "RES, NOS WAIVER PER DIEM";
      break;
    case "T2034":
      returnvalue = "CRISIS INTERVEN WAIVER/DIEM";
      break;
    case "T2035":
      returnvalue = "UTILITY SERVICES WAIVER";
      break;
    case "T2036":
      returnvalue = "CAMP OVERNITE WAIVER/SESSION";
      break;
    case "T2037":
      returnvalue = "CAMP DAY WAIVER/SESSION";
      break;
    case "T2038":
      returnvalue = "COMM TRANS WAIVER/SERVICE";
      break;
    case "T2039":
      returnvalue = "VEHICLE MOD WAIVER/SERVICE";
      break;
    case "T2040":
      returnvalue = "FINANCIAL MGT WAIVER/15MIN";
      break;
    case "T2041":
      returnvalue = "SUPPORT BROKER WAIVER/15 MIN";
      break;
    case "T2042":
      returnvalue = "HOSPICE ROUTINE HOME CARE";
      break;
    case "T2043":
      returnvalue = "HOSPICE CONTINUOUS HOME CARE";
      break;
    case "T2044":
      returnvalue = "HOSPICE RESPITE CARE";
      break;
    case "T2045":
      returnvalue = "HOSPICE GENERAL CARE";
      break;
    case "T2046":
      returnvalue = "HOSPICE LONG TERM CARE, R&B";
      break;
    case "T2048":
      returnvalue = "BH LTC RES R&B, PER DIEM";
      break;
    case "T2049":
      returnvalue = "N-ET; STRETCHER VAN, MILEAGE";
      break;
    case "T2101":
      returnvalue = "BREAST MILK PROC/STORE/DIST";
      break;
    case "T4521":
      returnvalue = "ADULT SIZE BRIEF/DIAPER SM";
      break;
    case "T4522":
      returnvalue = "ADULT SIZE BRIEF/DIAPER MED";
      break;
    case "T4523":
      returnvalue = "ADULT SIZE BRIEF/DIAPER LG";
      break;
    case "T4524":
      returnvalue = "ADULT SIZE BRIEF/DIAPER XL";
      break;
    case "T4525":
      returnvalue = "ADULT SIZE PULL-ON SM";
      break;
    case "T4526":
      returnvalue = "ADULT SIZE PULL-ON MED";
      break;
    case "T4527":
      returnvalue = "ADULT SIZE PULL-ON LG";
      break;
    case "T4528":
      returnvalue = "ADULT SIZE PULL-ON XL";
      break;
    case "T4529":
      returnvalue = "PED SIZE BRIEF/DIAPER SM/MED";
      break;
    case "T4530":
      returnvalue = "PED SIZE BRIEF/DIAPER LG";
      break;
    case "T4531":
      returnvalue = "PED SIZE PULL-ON SM/MED";
      break;
    case "T4532":
      returnvalue = "PED SIZE PULL-ON LG";
      break;
    case "T4533":
      returnvalue = "YOUTH SIZE BRIEF/DIAPER";
      break;
    case "T4534":
      returnvalue = "YOUTH SIZE PULL-ON";
      break;
    case "T4535":
      returnvalue = "DISPOSABLE LINER/SHIELD/PAD";
      break;
    case "T4536":
      returnvalue = "REUSABLE PULL-ON ANY SIZE";
      break;
    case "T4537":
      returnvalue = "REUSABLE UNDERPAD BED SIZE";
      break;
    case "T4538":
      returnvalue = "DIAPER SERV REUSABLE DIAPER";
      break;
    case "T4539":
      returnvalue = "REUSE DIAPER/BRIEF ANY SIZE";
      break;
    case "T4540":
      returnvalue = "REUSABLE UNDERPAD CHAIR SIZE";
      break;
    case "T4541":
      returnvalue = "LARGE DISPOSABLE UNDERPAD";
      break;
    case "T4542":
      returnvalue = "SMALL DISPOSABLE UNDERPAD";
      break;
    case "T4543":
      returnvalue = "DISP BARIATRIC BRIEF/DIAPER";
      break;
    case "T5001":
      returnvalue = "POSITION SEAT SPEC ORTH NEED";
      break;
    case "T5999":
      returnvalue = "SUPPLY, NOS";
      break;
    case "V2020":
      returnvalue = "VISION SVCS FRAMES PURCHASES";
      break;
    case "V2025":
      returnvalue = "EYEGLASSES DELUX FRAMES";
      break;
    case "V2100":
      returnvalue = "LENS SPHER SINGLE PLANO 4.00";
      break;
    case "V2101":
      returnvalue = "SINGLE VISN SPHERE 4.12-7.00";
      break;
    case "V2102":
      returnvalue = "SINGL VISN SPHERE 7.12-20.00";
      break;
    case "V2103":
      returnvalue = "SPHEROCYLINDR 4.00D/12-2.00D";
      break;
    case "V2104":
      returnvalue = "SPHEROCYLINDR 4.00D/2.12-4D";
      break;
    case "V2105":
      returnvalue = "SPHEROCYLINDER 4.00D/4.25-6D";
      break;
    case "V2106":
      returnvalue = "SPHEROCYLINDER 4.00D/>6.00D";
      break;
    case "V2107":
      returnvalue = "SPHEROCYLINDER 4.25D/12-2D";
      break;
    case "V2108":
      returnvalue = "SPHEROCYLINDER 4.25D/2.12-4D";
      break;
    case "V2109":
      returnvalue = "SPHEROCYLINDER 4.25D/4.25-6D";
      break;
    case "V2110":
      returnvalue = "SPHEROCYLINDER 4.25D/OVER 6D";
      break;
    case "V2111":
      returnvalue = "SPHEROCYLINDR 7.25D/.25-2.25";
      break;
    case "V2112":
      returnvalue = "SPHEROCYLINDR 7.25D/2.25-4D";
      break;
    case "V2113":
      returnvalue = "SPHEROCYLINDR 7.25D/4.25-6D";
      break;
    case "V2114":
      returnvalue = "SPHEROCYLINDER OVER 12.00D";
      break;
    case "V2115":
      returnvalue = "LENS LENTICULAR BIFOCAL";
      break;
    case "V2118":
      returnvalue = "LENS ANISEIKONIC SINGLE";
      break;
    case "V2121":
      returnvalue = "LENTICULAR LENS, SINGLE";
      break;
    case "V2199":
      returnvalue = "LENS SINGLE VISION NOT OTH C";
      break;
    case "V2200":
      returnvalue = "LENS SPHER BIFOC PLANO 4.00D";
      break;
    case "V2201":
      returnvalue = "LENS SPHERE BIFOCAL 4.12-7.0";
      break;
    case "V2202":
      returnvalue = "LENS SPHERE BIFOCAL 7.12-20.";
      break;
    case "V2203":
      returnvalue = "LENS SPHCYL BIFOCAL 4.00D/.1";
      break;
    case "V2204":
      returnvalue = "LENS SPHCY BIFOCAL 4.00D/2.1";
      break;
    case "V2205":
      returnvalue = "LENS SPHCY BIFOCAL 4.00D/4.2";
      break;
    case "V2206":
      returnvalue = "LENS SPHCY BIFOCAL 4.00D/OVE";
      break;
    case "V2207":
      returnvalue = "LENS SPHCY BIFOCAL 4.25-7D/.";
      break;
    case "V2208":
      returnvalue = "LENS SPHCY BIFOCAL 4.25-7/2.";
      break;
    case "V2209":
      returnvalue = "LENS SPHCY BIFOCAL 4.25-7/4.";
      break;
    case "V2210":
      returnvalue = "LENS SPHCY BIFOCAL 4.25-7/OV";
      break;
    case "V2211":
      returnvalue = "LENS SPHCY BIFO 7.25-12/.25-";
      break;
    case "V2212":
      returnvalue = "LENS SPHCYL BIFO 7.25-12/2.2";
      break;
    case "V2213":
      returnvalue = "LENS SPHCYL BIFO 7.25-12/4.2";
      break;
    case "V2214":
      returnvalue = "LENS SPHCYL BIFOCAL OVER 12.";
      break;
    case "V2215":
      returnvalue = "LENS LENTICULAR BIFOCAL";
      break;
    case "V2218":
      returnvalue = "LENS ANISEIKONIC BIFOCAL";
      break;
    case "V2219":
      returnvalue = "LENS BIFOCAL SEG WIDTH OVER";
      break;
    case "V2220":
      returnvalue = "LENS BIFOCAL ADD OVER 3.25D";
      break;
    case "V2221":
      returnvalue = "LENTICULAR LENS, BIFOCAL";
      break;
    case "V2299":
      returnvalue = "LENS BIFOCAL SPECIALITY";
      break;
    case "V2300":
      returnvalue = "LENS SPHERE TRIFOCAL 4.00D";
      break;
    case "V2301":
      returnvalue = "LENS SPHERE TRIFOCAL 4.12-7.";
      break;
    case "V2302":
      returnvalue = "LENS SPHERE TRIFOCAL 7.12-20";
      break;
    case "V2303":
      returnvalue = "LENS SPHCY TRIFOCAL 4.0/.12-";
      break;
    case "V2304":
      returnvalue = "LENS SPHCY TRIFOCAL 4.0/2.25";
      break;
    case "V2305":
      returnvalue = "LENS SPHCY TRIFOCAL 4.0/4.25";
      break;
    case "V2306":
      returnvalue = "LENS SPHCYL TRIFOCAL 4.00/>6";
      break;
    case "V2307":
      returnvalue = "LENS SPHCY TRIFOCAL 4.25-7/.";
      break;
    case "V2308":
      returnvalue = "LENS SPHC TRIFOCAL 4.25-7/2.";
      break;
    case "V2309":
      returnvalue = "LENS SPHC TRIFOCAL 4.25-7/4.";
      break;
    case "V2310":
      returnvalue = "LENS SPHC TRIFOCAL 4.25-7/>6";
      break;
    case "V2311":
      returnvalue = "LENS SPHC TRIFO 7.25-12/.25-";
      break;
    case "V2312":
      returnvalue = "LENS SPHC TRIFO 7.25-12/2.25";
      break;
    case "V2313":
      returnvalue = "LENS SPHC TRIFO 7.25-12/4.25";
      break;
    case "V2314":
      returnvalue = "LENS SPHCYL TRIFOCAL OVER 12";
      break;
    case "V2315":
      returnvalue = "LENS LENTICULAR TRIFOCAL";
      break;
    case "V2318":
      returnvalue = "LENS ANISEIKONIC TRIFOCAL";
      break;
    case "V2319":
      returnvalue = "LENS TRIFOCAL SEG WIDTH > 28";
      break;
    case "V2320":
      returnvalue = "LENS TRIFOCAL ADD OVER 3.25D";
      break;
    case "V2321":
      returnvalue = "LENTICULAR LENS, TRIFOCAL";
      break;
    case "V2399":
      returnvalue = "LENS TRIFOCAL SPECIALITY";
      break;
    case "V2410":
      returnvalue = "LENS VARIAB ASPHERICITY SING";
      break;
    case "V2430":
      returnvalue = "LENS VARIABLE ASPHERICITY BI";
      break;
    case "V2499":
      returnvalue = "VARIABLE ASPHERICITY LENS";
      break;
    case "V2500":
      returnvalue = "CONTACT LENS PMMA SPHERICAL";
      break;
    case "V2501":
      returnvalue = "CNTCT LENS PMMA-TORIC/PRISM";
      break;
    case "V2502":
      returnvalue = "CONTACT LENS PMMA BIFOCAL";
      break;
    case "V2503":
      returnvalue = "CNTCT LENS PMMA COLOR VISION";
      break;
    case "V2510":
      returnvalue = "CNTCT GAS PERMEABLE SPHERICL";
      break;
    case "V2511":
      returnvalue = "CNTCT TORIC PRISM BALLAST";
      break;
    case "V2512":
      returnvalue = "CNTCT LENS GAS PERMBL BIFOCL";
      break;
    case "V2513":
      returnvalue = "CONTACT LENS EXTENDED WEAR";
      break;
    case "V2520":
      returnvalue = "CONTACT LENS HYDROPHILIC";
      break;
    case "V2521":
      returnvalue = "CNTCT LENS HYDROPHILIC TORIC";
      break;
    case "V2522":
      returnvalue = "CNTCT LENS HYDROPHIL BIFOCL";
      break;
    case "V2523":
      returnvalue = "CNTCT LENS HYDROPHIL EXTEND";
      break;
    case "V2530":
      returnvalue = "CONTACT LENS GAS IMPERMEABLE";
      break;
    case "V2531":
      returnvalue = "CONTACT LENS GAS PERMEABLE";
      break;
    case "V2599":
      returnvalue = "CONTACT LENS/ES OTHER TYPE";
      break;
    case "V2600":
      returnvalue = "HAND HELD LOW VISION AIDS";
      break;
    case "V2610":
      returnvalue = "SINGLE LENS SPECTACLE MOUNT";
      break;
    case "V2615":
      returnvalue = "TELESCOP/OTHR COMPOUND LENS";
      break;
    case "V2623":
      returnvalue = "PLASTIC EYE PROSTH CUSTOM";
      break;
    case "V2624":
      returnvalue = "POLISHING ARTIFICAL EYE";
      break;
    case "V2625":
      returnvalue = "ENLARGEMNT OF EYE PROSTHESIS";
      break;
    case "V2626":
      returnvalue = "REDUCTION OF EYE PROSTHESIS";
      break;
    case "V2627":
      returnvalue = "SCLERAL COVER SHELL";
      break;
    case "V2628":
      returnvalue = "FABRICATION & FITTING";
      break;
    case "V2629":
      returnvalue = "PROSTHETIC EYE OTHER TYPE";
      break;
    case "V2630":
      returnvalue = "ANTER CHAMBER INTRAOCUL LENS";
      break;
    case "V2631":
      returnvalue = "IRIS SUPPORT INTRAOCLR LENS";
      break;
    case "V2632":
      returnvalue = "POST CHMBR INTRAOCULAR LENS";
      break;
    case "V2700":
      returnvalue = "BALANCE LENS";
      break;
    case "V2702":
      returnvalue = "DELUXE LENS FEATURE";
      break;
    case "V2710":
      returnvalue = "GLASS/PLASTIC SLAB OFF PRISM";
      break;
    case "V2715":
      returnvalue = "PRISM LENS/ES";
      break;
    case "V2718":
      returnvalue = "FRESNELL PRISM PRESS-ON LENS";
      break;
    case "V2730":
      returnvalue = "SPECIAL BASE CURVE";
      break;
    case "V2744":
      returnvalue = "TINT PHOTOCHROMATIC LENS/ES";
      break;
    case "V2745":
      returnvalue = "TINT, ANY COLOR/SOLID/GRAD";
      break;
    case "V2750":
      returnvalue = "ANTI-REFLECTIVE COATING";
      break;
    case "V2755":
      returnvalue = "UV LENS/ES";
      break;
    case "V2756":
      returnvalue = "EYE GLASS CASE";
      break;
    case "V2760":
      returnvalue = "SCRATCH RESISTANT COATING";
      break;
    case "V2761":
      returnvalue = "MIRROR COATING";
      break;
    case "V2762":
      returnvalue = "POLARIZATION, ANY LENS";
      break;
    case "V2770":
      returnvalue = "OCCLUDER LENS/ES";
      break;
    case "V2780":
      returnvalue = "OVERSIZE LENS/ES";
      break;
    case "V2781":
      returnvalue = "PROGRESSIVE LENS PER LENS";
      break;
    case "V2782":
      returnvalue = "LENS, 1.54-1.65 P/1.60-1.79G";
      break;
    case "V2783":
      returnvalue = "LENS, >= 1.66 P/>=1.80 G";
      break;
    case "V2784":
      returnvalue = "LENS POLYCARB OR EQUAL";
      break;
    case "V2785":
      returnvalue = "CORNEAL TISSUE PROCESSING";
      break;
    case "V2786":
      returnvalue = "OCCUPATIONAL MULTIFOCAL LENS";
      break;
    case "V2787":
      returnvalue = "ASTIGMATISM-CORRECT FUNCTION";
      break;
    case "V2788":
      returnvalue = "PRESBYOPIA-CORRECT FUNCTION";
      break;
    case "V2790":
      returnvalue = "AMNIOTIC MEMBRANE";
      break;
    case "V2797":
      returnvalue = "VIS ITEM/SVC IN OTHER CODE";
      break;
    case "V2799":
      returnvalue = "MISCELLANEOUS VISION SERVICE";
      break;
    case "V5008":
      returnvalue = "HEARING SCREENING";
      break;
    case "V5010":
      returnvalue = "ASSESSMENT FOR HEARING AID";
      break;
    case "V5011":
      returnvalue = "HEARING AID FITTING/CHECKING";
      break;
    case "V5014":
      returnvalue = "HEARING AID REPAIR/MODIFYING";
      break;
    case "V5020":
      returnvalue = "CONFORMITY EVALUATION";
      break;
    case "V5030":
      returnvalue = "BODY-WORN HEARING AID AIR";
      break;
    case "V5040":
      returnvalue = "BODY-WORN HEARING AID BONE";
      break;
    case "V5050":
      returnvalue = "HEARING AID MONAURAL IN EAR";
      break;
    case "V5060":
      returnvalue = "BEHIND EAR HEARING AID";
      break;
    case "V5070":
      returnvalue = "GLASSES AIR CONDUCTION";
      break;
    case "V5080":
      returnvalue = "GLASSES BONE CONDUCTION";
      break;
    case "V5090":
      returnvalue = "HEARING AID DISPENSING FEE";
      break;
    case "V5095":
      returnvalue = "IMPLANT MID EAR HEARING PROS";
      break;
    case "V5100":
      returnvalue = "BODY-WORN BILAT HEARING AID";
      break;
    case "V5110":
      returnvalue = "HEARING AID DISPENSING FEE";
      break;
    case "V5120":
      returnvalue = "BODY-WORN BINAUR HEARING AID";
      break;
    case "V5130":
      returnvalue = "IN EAR BINAURAL HEARING AID";
      break;
    case "V5140":
      returnvalue = "BEHIND EAR BINAUR HEARING AI";
      break;
    case "V5150":
      returnvalue = "GLASSES BINAURAL HEARING AID";
      break;
    case "V5160":
      returnvalue = "DISPENSING FEE BINAURAL";
      break;
    case "V5170":
      returnvalue = "WITHIN EAR CROS HEARING AID";
      break;
    case "V5180":
      returnvalue = "BEHIND EAR CROS HEARING AID";
      break;
    case "V5190":
      returnvalue = "GLASSES CROS HEARING AID";
      break;
    case "V5200":
      returnvalue = "CROS HEARING AID DISPENS FEE";
      break;
    case "V5210":
      returnvalue = "IN EAR BICROS HEARING AID";
      break;
    case "V5220":
      returnvalue = "BEHIND EAR BICROS HEARING AI";
      break;
    case "V5230":
      returnvalue = "GLASSES BICROS HEARING AID";
      break;
    case "V5240":
      returnvalue = "DISPENSING FEE BICROS";
      break;
    case "V5241":
      returnvalue = "DISPENSING FEE, MONAURAL";
      break;
    case "V5242":
      returnvalue = "HEARING AID, MONAURAL, CIC";
      break;
    case "V5243":
      returnvalue = "HEARING AID, MONAURAL, ITC";
      break;
    case "V5244":
      returnvalue = "HEARING AID, PROG, MON, CIC";
      break;
    case "V5245":
      returnvalue = "HEARING AID, PROG, MON, ITC";
      break;
    case "V5246":
      returnvalue = "HEARING AID, PROG, MON, ITE";
      break;
    case "V5247":
      returnvalue = "HEARING AID, PROG, MON, BTE";
      break;
    case "V5248":
      returnvalue = "HEARING AID, BINAURAL, CIC";
      break;
    case "V5249":
      returnvalue = "HEARING AID, BINAURAL, ITC";
      break;
    case "V5250":
      returnvalue = "HEARING AID, PROG, BIN, CIC";
      break;
    case "V5251":
      returnvalue = "HEARING AID, PROG, BIN, ITC";
      break;
    case "V5252":
      returnvalue = "HEARING AID, PROG, BIN, ITE";
      break;
    case "V5253":
      returnvalue = "HEARING AID, PROG, BIN, BTE";
      break;
    case "V5254":
      returnvalue = "HEARING ID, DIGIT, MON, CIC";
      break;
    case "V5255":
      returnvalue = "HEARING AID, DIGIT, MON, ITC";
      break;
    case "V5256":
      returnvalue = "HEARING AID, DIGIT, MON, ITE";
      break;
    case "V5257":
      returnvalue = "HEARING AID, DIGIT, MON, BTE";
      break;
    case "V5258":
      returnvalue = "HEARING AID, DIGIT, BIN, CIC";
      break;
    case "V5259":
      returnvalue = "HEARING AID, DIGIT, BIN, ITC";
      break;
    case "V5260":
      returnvalue = "HEARING AID, DIGIT, BIN, ITE";
      break;
    case "V5261":
      returnvalue = "HEARING AID, DIGIT, BIN, BTE";
      break;
    case "V5262":
      returnvalue = "HEARING AID, DISP, MONAURAL";
      break;
    case "V5263":
      returnvalue = "HEARING AID, DISP, BINAURAL";
      break;
    case "V5264":
      returnvalue = "EAR MOLD/INSERT";
      break;
    case "V5265":
      returnvalue = "EAR MOLD/INSERT, DISP";
      break;
    case "V5266":
      returnvalue = "BATTERY FOR HEARING DEVICE";
      break;
    case "V5267":
      returnvalue = "HEARING AID SUPPLY/ACCESSORY";
      break;
    case "V5268":
      returnvalue = "ALD TELEPHONE AMPLIFIER";
      break;
    case "V5269":
      returnvalue = "ALERTING DEVICE, ANY TYPE";
      break;
    case "V5270":
      returnvalue = "ALD, TV AMPLIFIER, ANY TYPE";
      break;
    case "V5271":
      returnvalue = "ALD, TV CAPTION DECODER";
      break;
    case "V5272":
      returnvalue = "TDD";
      break;
    case "V5273":
      returnvalue = "ALD FOR COCHLEAR IMPLANT";
      break;
    case "V5274":
      returnvalue = "ALD UNSPECIFIED";
      break;
    case "V5275":
      returnvalue = "EAR IMPRESSION";
      break;
    case "V5298":
      returnvalue = "HEARING AID NOC";
      break;
    case "V5299":
      returnvalue = "HEARING SERVICE";
      break;
    case "V5336":
      returnvalue = "REPAIR COMMUNICATION DEVICE";
      break;
    case "V5362":
      returnvalue = "SPEECH SCREENING";
      break;
    case "V5363":
      returnvalue = "LANGUAGE SCREENING";
      break;
    case "V5364":
      returnvalue = "DYSPHAGIA SCREENING";
      break;
  }
  return returnvalue;
};

/// / Translate XXX01 ???????? Code
// export const TranslateXXX01Code = (typecode) =>
// {
//    let returnvalue = typecode
//    switch (typecode)
//    {

//    }
//    return returnvalue
// }
//

// Translate TA105
export const TranslateTA105Code = (typecode) => {
  let returnvalue = typecode;
  switch (typecode) {
    case "002":
      returnvalue =
        "This Standard as noted in the Control Standards Identifier is not supported.";
      break;
    case "003":
      returnvalue = "This Version of the controls is not supported";
      break;
    case "004":
      returnvalue = "The Segment Terminator is invalid";
      break;
    case "005":
      returnvalue = "Invalid Interchange ID Qualifier for sender";
      break;
    case "006":
      returnvalue = "Invalid Interchange Sender ID";
      break;
    case "007":
      returnvalue = "Invalid Interchange ID Qualifier for receiver";
      break;
    case "008":
      returnvalue = "Invalid Interchange Receiver ID";
      break;
    case "009":
      returnvalue = "Unknown Interchange Receiver ID";
      break;
    case "010":
      returnvalue = "Invalid Authorization Information Qualifier value";
      break;
    case "011":
      returnvalue = "Invalid Authorization Information value";
      break;
    case "012":
      returnvalue = "Invalid Security Information Qualifier value";
      break;
    case "013":
      returnvalue = "Invalid Security Information value";
      break;
    case "014":
      returnvalue = "Invalid Interchange Date value";
      break;
    case "015":
      returnvalue = "Invalid Interchange Time value";
      break;
    case "016":
      returnvalue = "Invalid Interchange Standards Identifier value";
      break;
    case "017":
      returnvalue = "Invalid Interchange Version ID value";
      break;
    case "018":
      returnvalue = "Invalid Interchange Control Number";
      break;
    case "019":
      returnvalue = "Invalid Acknowledgment Requested value";
      break;
    case "020":
      returnvalue = "Invalid Test Indicator value";
      break;
    case "021":
      returnvalue = "Invalid Number of Included Group value";
      break;
    case "022":
      returnvalue = "Invalid control structure";
      break;
    case "023":
      returnvalue = "Improper (Premature) end-of-file (Transmission)";
      break;
    case "024":
      returnvalue = "Invalid Interchange Content (e.g., invalid GS Segment)";
      break;
    case "025":
      returnvalue = "Duplicate Interchange Control Number";
      break;
    case "026":
      returnvalue = "Invalid Data Element Separator";
      break;
    case "027":
      returnvalue = "Invalid Component Element Separator";
      break;
    case "028":
      returnvalue = "Invalid delivery date in Deferred Delivery Request";
      break;
    case "029":
      returnvalue = "Invalid delivery time in Deferred Delivery Request";
      break;
    case "030":
      returnvalue = "Invalid delivery time Code in Deferred Delivery Request";
      break;
    case "031":
      returnvalue = "Invalid grade of Service Code";
      break;
    case "1":
      returnvalue = "Functional Group not supported";
      break;
    case "2":
      returnvalue = "Functional Group Version not supported";
      break;
    case "3":
      returnvalue = "Functional Group Trailer missing";
      break;
    case "4":
      returnvalue =
        "Group Control Number in the Functional Group Header and Trailer do not agree";
      break;
    case "5":
      returnvalue =
        "Number of included Transaction Sets does not match actual count";
      break;
    case "6":
      returnvalue = "Group Control Number violates syntax";
      break;
    case "10":
      returnvalue = "Authentication Key Name unknown";
      break;
    case "11":
      returnvalue = "Encryption Key Name unknown";
      break;
    case "12":
      returnvalue =
        "Requested Service (Authentication or Encryption) not available";
      break;
    case "13":
      returnvalue = "Unknown Security Recipient";
      break;
    case "14":
      returnvalue = "Unknown Security Originator";
      break;
    case "15":
      returnvalue = "Syntax Error in Decrypted Text";
      break;
    case "16":
      returnvalue = "Security not supported";
      break;
    case "17":
      returnvalue = "Incorrect Message Length (Encryption Only)";
      break;
    case "18":
      returnvalue = "Message Authentication Code failed";
      break;
    case "23":
      returnvalue =
        "S3E Security End Segment Missing for S3E Security Start Segment";
      break;
    case "24":
      returnvalue = "S3S Security Start Segment Missing for S3E End Segment";
      break;
    case "25":
      returnvalue =
        "S4E Security End Segment Missing for S4S Security Start Segment";
      break;
    case "26":
      returnvalue =
        "S4S Security Start Segment Missing for S4E Security End Segment";
      break;
  }
  return returnvalue;
};

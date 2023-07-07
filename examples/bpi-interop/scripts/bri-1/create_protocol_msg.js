import { Ident } from "provide-js";
import { Axiom } from "provide-js";
import { Vault } from "provide-js";
import 'dotenv/config';

//Use the stored refresh token to acquire access token
const REFRESH_TOKEN = process.env.AXIOM_USER_REFRESH_TOKEN;
const IDENT_PROXY = new Ident(REFRESH_TOKEN);
const ACCESS_TOKEN = await IDENT_PROXY.createToken(access_token_request);

//Create Axiom BPI proxy instance
const AXIOM_PROXY = new Axiom(ACCESS_TOKEN.accessToken);

//Map field values to the bank statement object schema
var bankStatementObject = {};
bankStatementObject.vendor_number = "3001";
bankStatementObject.routing_number = "2700001";
bankStatementObject.account_number = "1234888";
bankStatementObject.country = "US";
bankStatementObject.date = "20230623";
bankStatementObject.id = "";


//Create the PRVD Axiom Protocol message
const AXIOM_SUBJECTACCT = process.env.AXIOM_BPI_INTEROP_SUBJACCT_ID;
const AXIOM_WORKGROUP = process.env.AXIOM_BPI_INTEROP_WORKGROUP_ID;
const AXIOM_SCHEMA_ID = process.env.AXIOM_BPI_INTEROP_SCHEMA_ID;

var AXIOM_PROTOCOL_MSG = {};
AXIOM_PROTOCOL_MSG.id = bankStatementObject.id;
AXIOM_PROTOCOL_MSG.type = AXIOM_SCHEMA_ID; //use the name of the domain model of the Shuttle workflow
AXIOM_PROTOCOL_MSG.subject_account_id = AXIOM_SUBJECTACCT;
AXIOM_PROTOCOL_MSG.workgroup_id = AXIOM_WORKGROUP;
AXIOM_PROTOCOL_MSG.payload = bankStatementObject;

const AXIOM_ZK_PROOF = await AXIOM_PROXY.sendProtocolMessage(AXIOM_PROTOCOL_MSG);
console.log(AXIOM_ZK_PROOF);

//Additional details (e.g. verifying key) in Vault/Axiom
const VAULT_PROXY = new Vault(ACCESS_TOKEN.accessToken);
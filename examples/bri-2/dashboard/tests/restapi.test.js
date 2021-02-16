const request = require("supertest");
const path = require("path");
const dotenv = require("dotenv");
const { SingleEntryPlugin } = require("webpack");

const apiRequest = request("localhost:4001");

let account;
let shieldAddress;
let dididentity;
let phonebookId;

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const waitResponse = async function (url) {
    let statusOk = false
    while (!statusOk) {
      await sleep(33000);
      const res = await apiRequest.get(url);
      if (res.statusCode >= 200 && res.statusCode < 300) statusOk = true;
    }

    return statusOk;
}

jest.setTimeout(95000);
  
  describe("Check status and connectivity", () => {
  
    test("Dashboard GET /status returns 200", async () => {
      const res = await apiRequest.get("/status");
      expect(res.statusCode).toEqual(200);
    });

    test("GET /db-status returns connected db params", async () => {
        const res = await apiRequest.get("/db-status");
        expect(res.statusCode).toEqual(200);
        expect(res.body.error).toBeUndefined();
        expect(res.body.dbUrl).not.toBeUndefined();
    });

    test("GET /network-mode returns connected network chain info", async () => {
        const res = await apiRequest.get("/network-mode");
        expect(res.statusCode).toEqual(200);
        expect(res.body.error).toBeUndefined();
        expect(res.body.chainName).not.toBeUndefined();
    });      

  });


  describe("Deploy contracts and save info into database", () => {

    test("POST /deploy-contracts from rest-api", async () => {
      const res = await apiRequest.post("/deploy-contracts").send({
        network: "local",
        sender: "0xf17f52151EbEF6C7334FAD080c5704D77216b732"
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).toBeUndefined();
      expect(res.body).not.toBeUndefined();
      expect(res.body).toEqual(true);
    });

  });

  describe("Check querying contracts data from database", () => {

    test("GET /contracts-available returns all contracts data from database", async () => {
        const res = await apiRequest.get("/contracts-available");
        expect(res.statusCode).toEqual(200);
        expect(res.body.error).toBeUndefined();
        expect(res.body[0].address).not.toBeUndefined();
        shieldAddress = res.body[1].address;
    });

    test("GET /contracts-local returns local network contracts data from database", async () => {
        const res = await apiRequest.get("/contracts-local");
        expect(res.statusCode).toEqual(200);
        expect(res.body.error).toBeUndefined();
        expect(res.body[0].address).not.toBeUndefined();
    });

    test("GET /contracts/:networkId returns contracts data by network from database", async () => {
        const res = await apiRequest.get("/contracts/local");
        expect(res.statusCode).toEqual(200);
        expect(res.body.error).toBeUndefined();
        expect(res.body[0].address).not.toBeUndefined();
    });
    
  });
  

  describe("Send commitment to Shield contract and save info into database", () => {

    test("POST /send-commit to a shield contract", async () => {
      const res = await apiRequest.post("/send-commit").send({
        newCommitment: "Baseline is a huge SUCCESS!",
        sender: "0xf17f52151EbEF6C7334FAD080c5704D77216b732",
        shieldAddress: shieldAddress,
        network: "local"
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).not.toBeUndefined();
      const txHash = res.body.txHash;
      expect(txHash).toMatch(new RegExp("^0x[a-fA-F0-9]*"));
    });

  });


  describe("Check querying commitment and merkle tree data from database", () => {

    test("GET /get-commitments returns commitments data from database", async () => {
        const res = await apiRequest.get("/get-commiments");
        expect(res.statusCode).toEqual(200);
        expect(res.body.error).toBeUndefined();
        expect(res.body[0].commitment).not.toBeUndefined();
    });

    test("GET /getmerkletrees returns merkle tree data from database", async () => {
        const res = await apiRequest.get("/getmerkletrees");
        expect(res.statusCode).toEqual(200);
        expect(res.body.error).toBeUndefined();
        expect(res.body[0].nodes[0].hash).not.toBeUndefined();
    });

    test(`GET /getmerkletree/:addressId returns merkle tree data by contract address from database`, async () => {
        const res = await apiRequest.get(`/getmerkletree/${shieldAddress}_0`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.error).toBeUndefined();
        expect(res.body.nodes[0].hash).not.toBeUndefined();
    });

  });

  describe("Check DID generator / verifier", () => {

    test("POST /did-verify returns existent valid DID for a domain", async () => {
      const res = await apiRequest.post("/did-verify").send({
        domain: "identity.foundation",
      });
      expect(res.statusCode).toEqual(200);
      expect(res.text).not.toBeUndefined();
      const response = JSON.parse(res.text);
      const did = response.dids[0];
      expect(did).toMatch(new RegExp("^did:key:[a-fA-F0-9]*"));
    });

    test("POST /did-verify return non-valid DID", async () => {
        const res = await apiRequest.post("/did-verify").send({
          domain: "google.com"
        });
        expect(res.statusCode).toEqual(200);
        expect(res.text).not.toBeUndefined();
        expect(res.text).toEqual("{}");
      });


    test("POST /did-create-identity return valid DID identity", async () => {
        const res = await apiRequest.post("/did-create-identity").send({
            domain: "baseline-protocol.org"
        });
        expect(res.statusCode).toEqual(200);
        expect(res.text).not.toBeUndefined();
        const response = JSON.parse(res.text);
        dididentity = response.did;
        expect(dididentity).toMatch(new RegExp("^did:ethr:rinkeby:0x[a-fA-F0-9]*"));
    });


    test("POST /did-generate return valid DID configuration for a domain", async () => {
        const res = await apiRequest.post("/did-generate").send({
            domain: "baseline-protocol.org",
            did: dididentity
        });
        expect(res.statusCode).toEqual(200);
        expect(res.text).not.toBeUndefined();
        const response = JSON.parse(res.text);
        const linked_dids = response.linked_dids[0];
        expect(linked_dids).toMatch(new RegExp("^[a-fA-F0-9]*"));
    });


  });


  describe("Verify with success and add a phonebook entry into database", () => {

    test("POST /add-phonebook returns existent valid DID for a domain", async () => {
      const res = await apiRequest.post("/add-phonebook").send({
        domain: "tailwindpower.netlify.app"
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).not.toBeUndefined();
      const did = res.body.dids[0];
      expect(did).toMatch(new RegExp("^did:ethr:goerli:0x[a-fA-F0-9]*"));
    });

  });


  describe("Verify and return a error trying add a phonebook entry", () => {

    test("POST /add-phonebook return non-valid DID [404 error]", async () => {
      const res = await apiRequest.post("/add-phonebook").send({
        domain: "google.com"
      });
      expect(res.statusCode).toEqual(404);
      expect(res.body).not.toBeUndefined();
      expect(res.body).toEqual({});
    });

  });


  describe("Check querying phonebook data from database", () => {

    test("GET /get-phonebook returns phonebook entries from database", async () => {
        const res = await apiRequest.get("/get-phonebook");
        expect(res.statusCode).toEqual(200);
        expect(res.body.error).toBeUndefined();
        expect(res.body[0].dididentity).not.toBeUndefined();
        phonebookId = res.body[0]._id;
    });  

  });


  describe("Delete a phonebook entry from database", () => {

    test("POST /remove-phonebook/:entryId returns ok=1", async () => {
      const res = await apiRequest.post(`/remove-phonebook/${phonebookId}`).send();
      expect(res.statusCode).toEqual(200);
      expect(res.body).not.toBeUndefined();
      expect(res.body.ok).toEqual(1);
    });

  });

  describe("Delete contracts, commitments and merkle tree entries from database", () => {

    test("POST /reset-contracts returns ok=1", async () => {
      const res = await apiRequest.post("/reset-contracts").send();
      expect(res.statusCode).toEqual(200);
      expect(res.body).not.toBeUndefined();
      expect(res.body.ok).toEqual(1);
    });

  });


  describe("Save application settings to enviroment variables", () => {

    test("POST /save-settings return 200", async () => {
      const res = await apiRequest.post("/save-settings").send({
        NODE_ENV: "development",
        LOG_LEVEL: "debug",
        SERVER_PORT: "4001",
        DATABASE_USER: "admin", 
        DATABASE_NAME: "baseline", 
        DATABASE_PASSWORD: "password123", 
        DATABASE_HOST: "localhost:27117",
        ETH_CLIENT_TYPE: "infura",
        INFURA_ID: "5ffc47f65c4042ce847ef66a3fa70d4c",
        ETH_CLIENT_WS: "wss://goerli.infura.io/ws/v3/5ffc47f65c4042ce847ef66a3fa70d4c",
        ETH_CLIENT_HTTP: "https://goerli.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c",
        CHAIN_ID: 5,
        WALLET_PRIVATE_KEY: "0xde6cd58144d1a099ad5ea8db1e48603fe7416591f611c52eb5519fe78a513c57", //GOERLI TESTNET ONLY
        WALLET_PUBLIC_KEY: "0xa61FAb4709C0aBF26dA0b278C2EE6ff5a8e4F3a0", //GOERLI TESTNET ONLY
        LOCAL_ETH_CLIENT_TYPE: "besu",
        LOCAL_ETH_CLIENT_WS: "ws://localhost:8546",
        LOCAL_ETH_CLIENT_HTTP: "http://localhost:8545",
        LOCAL_CHAIN_ID: 101010,
        LOCAL_WALLET_PRIVATE_KEY: "0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
        LOCAL_WALLET_PUBLIC_KEY: "0xf17f52151EbEF6C7334FAD080c5704D77216b732",  
      });

      expect(res.statusCode).toEqual(200);
    });

  });


  describe("Switch chain network", () => {

    test("POST /switch-chain to GOERLI return true", async () => {
      const res = await apiRequest.post("/switch-chain").send({
        network: "5"
      });

      const isNetworkChanged = await waitResponse("/network-mode");

      if (isNetworkChanged) {
        expect(res.statusCode).toEqual(200);
        expect(res.body).not.toBeUndefined();
        expect(res.body).toBe("");
      }
    
    });

    //TODO - better way to wait for network switch response
    test("POST /switch-chain back to LOCAL return true", async () => {
        const res = await apiRequest.post("/switch-chain").send({
        network: "local"
        });

        const isNetworkChanged = await waitResponse("/network-mode");

        if (isNetworkChanged) {
            expect(res.statusCode).toEqual(200);
            expect(res.body).not.toBeUndefined();
            expect(res.body).toBe("");
        }

    });

  });

  afterAll(async () => {
    // Reset .env.network settings after tests conclude
    await apiRequest.post("/save-settings").send({
      NODE_ENV: "development",
      LOG_LEVEL: "debug",
      SERVER_PORT: "4001",
      DATABASE_USER: "admin", 
      DATABASE_NAME: "baseline", 
      DATABASE_PASSWORD: "password123", 
      DATABASE_HOST: "localhost:27117",
      ETH_CLIENT_TYPE: "infura",
      INFURA_ID: "",
      ETH_CLIENT_WS: "ws://localhost:8546",
      ETH_CLIENT_HTTP: "http://localhost:8545",
      CHAIN_ID: 101010,
      WALLET_PRIVATE_KEY: "0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
      WALLET_PUBLIC_KEY: "0xf17f52151EbEF6C7334FAD080c5704D77216b732",
      LOCAL_ETH_CLIENT_TYPE: "besu",
      LOCAL_ETH_CLIENT_WS: "ws://localhost:8546",
      LOCAL_ETH_CLIENT_HTTP: "http://localhost:8545",
      LOCAL_CHAIN_ID: 101010,
      LOCAL_WALLET_PRIVATE_KEY: "0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
      LOCAL_WALLET_PUBLIC_KEY: "0xf17f52151EbEF6C7334FAD080c5704D77216b732",  
    });

  });
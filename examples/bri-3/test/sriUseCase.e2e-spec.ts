import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';
import * as request from 'supertest';
import { v4 } from 'uuid';
import { AppModule } from '../src/app.module';
import {
  supplierBpiSubjectEcdsaPublicKey,
  supplierBpiSubjectEcdsaPrivateKey,
  buyerBpiSubjectEcdsaPublicKey,
  buyerBpiSubjectEcdsaPrivateKey,
  internalBpiSubjectEcdsaPublicKey,
  internalBpiSubjectEcdsaPrivateKey,
} from '../src/shared/testing/constants';
import {
  createEddsaPrivateKey,
  createEddsaPublicKey,
  createEddsaSignature,
} from '../src/shared/testing/utils';

jest.setTimeout(240000);
let accessToken: string;
let app: INestApplication;
let server: any;

let supplierBpiSubjectEddsaPublicKey: string;
let supplierBpiSubjectEddsaPrivateKey: string;
let buyerBpiSubjectEddsaPublicKey: string;
let buyerBpiSubjectEddsaPrivateKey: string;
let createdWorkgroupId: string;
let createdWorkstep1Id: string;
let createdWorkstep2Id: string;
let createdWorkflowId: string;
let createdBpiSubjectAccountSupplierId: string;
let createdBpiSubjectAccountBuyerId: string;

describe('SRI use-case end-to-end test', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();

    const supplierWallet = new ethers.Wallet(supplierBpiSubjectEcdsaPrivateKey);
    supplierBpiSubjectEddsaPrivateKey = await createEddsaPrivateKey(
      supplierBpiSubjectEcdsaPublicKey,
      supplierWallet,
    );

    supplierBpiSubjectEddsaPublicKey = await createEddsaPublicKey(
      supplierBpiSubjectEddsaPrivateKey,
    );

    const buyerWallet = new ethers.Wallet(
      buyerBpiSubjectEcdsaPrivateKey,
      undefined,
    );
    buyerBpiSubjectEddsaPrivateKey = await createEddsaPrivateKey(
      buyerBpiSubjectEcdsaPublicKey,
      buyerWallet,
    );

    buyerBpiSubjectEddsaPublicKey = await createEddsaPublicKey(
      buyerBpiSubjectEddsaPrivateKey,
    );
  });

  afterAll(async () => {
    await app.close();
    server.close();
  });

  // TODO: Add detailed explanation of the SRI use-case setup and necessary seed data
  it('Logs in an internal Bpi Subject, creates two external Bpi Subjects (Supplier and Buyer) and a Workgroup and adds the created Bpi Subjects as participants to the Workgroup', async () => {
    accessToken = await loginAsInternalBpiSubjectAndReturnAnAccessToken();

    const createdBpiSubjectSupplierId =
      await createExternalBpiSubjectAndReturnId(
        'External Bpi Subject - Supplier',
        [
          { type: 'ecdsa', value: supplierBpiSubjectEcdsaPublicKey },
          { type: 'eddsa', value: supplierBpiSubjectEddsaPublicKey },
        ],
      );

    createdBpiSubjectAccountSupplierId =
      await createBpiSubjectAccountAndReturnId(
        createdBpiSubjectSupplierId,
        createdBpiSubjectSupplierId,
      );

    const createdBpiSubjectBuyerId = await createExternalBpiSubjectAndReturnId(
      'External Bpi Subject 2 - Buyer',
      [
        { type: 'ecdsa', value: buyerBpiSubjectEcdsaPublicKey },
        { type: 'eddsa', value: buyerBpiSubjectEddsaPublicKey },
      ],
    );

    createdBpiSubjectAccountBuyerId = await createBpiSubjectAccountAndReturnId(
      createdBpiSubjectBuyerId,
      createdBpiSubjectBuyerId,
    );

    createdWorkgroupId = await createAWorkgroupAndReturnId();

    await updateWorkgroupAdminsAndParticipants(
      createdWorkgroupId,
      [createdBpiSubjectSupplierId],
      [createdBpiSubjectSupplierId, createdBpiSubjectBuyerId],
    );

    const resultWorkgroup = await fetchWorkgroup(createdWorkgroupId);

    expect(resultWorkgroup.participants.length).toBe(2);
    expect(resultWorkgroup.participants[0].id).toEqual(
      createdBpiSubjectSupplierId,
    );
    expect(resultWorkgroup.participants[1].id).toEqual(
      createdBpiSubjectBuyerId,
    );
  });

  it('Sets up a workflow with 2 worksteps in the previously created workgroup', async () => {
    // TODO: Auth as supplier?
    // TODO: Can we  listen and fire NATS messages here

    createdWorkstep1Id = await createWorkstepAndReturnId(
      'workstep1',
      createdWorkgroupId,
    );

    createdWorkstep2Id = await createWorkstepAndReturnId(
      'workstep2',
      createdWorkgroupId,
    );

    createdWorkflowId = await createWorkflowAndReturnId(
      'worksflow1',
      createdWorkgroupId,
      [createdWorkstep1Id, createdWorkstep2Id],
      [createdBpiSubjectAccountSupplierId, createdBpiSubjectAccountBuyerId],
    );
  });

  it('Add a circuit input translation schema to workstep 1', async () => {
    const schema = `{
          "mapping": [
            {
              "circuitInput": "invoiceStatus", 
              "description": "Invoice status", 
              "payloadJsonPath": "status", 
              "dataType": "string"
            },
            {
              "circuitInput": "invoiceAmount", 
              "description": "Total gross amount of the invoice", 
              "payloadJsonPath": "amount", 
              "dataType": "integer"
            },
            {
              "circuitInput": "itemPrices", 
              "description": "Invoice item prices", 
              "payloadJsonPath": "items", 
              "dataType": "array",
              "arrayType": "object",
              "arrayItemFieldName": "price",
              "arrayItemFieldType": "integer"
            },
            {
              "circuitInput": "itemAmount", 
              "description": "Invoice item amounts", 
              "payloadJsonPath": "items", 
              "dataType": "array",
              "arrayType": "object",
              "arrayItemFieldName": "amount",
              "arrayItemFieldType": "integer"
            }
          ]
        }`;
    await addCircuitInputsSchema(createdWorkstep1Id, schema);
  });

  it('Add a circuit input translation schema to workstep 2', async () => {
    const schema = `{
          "mapping": [
            {
              "circuitInput": "invoiceStatus", 
              "description": "Invoice status", 
              "payloadJsonPath": "status", 
              "dataType": "string"
            }
          ]
        }`;
    await addCircuitInputsSchema(createdWorkstep2Id, schema);
  });

  it('Submits transaction 1 for execution of the workstep 1', async () => {
    // TODO: CheckAuthz on createTransaction and in other places
    // TODO: Faking two items in the payload as the circuit is hardcoded to 4
    await createTransactionAndReturnId(
      v4(),
      1,
      createdWorkflowId,
      createdWorkstep1Id,
      createdBpiSubjectAccountSupplierId,
      supplierBpiSubjectEddsaPrivateKey,
      createdBpiSubjectAccountBuyerId,
      `{
        "supplierInvoiceID": "INV123",
        "amount": 300,
        "issueDate": "2023-06-15",
        "dueDate": "2023-07-15",
        "status": "NEW",
        "items": [
          { "id": 1, "productId": "product1", "price": 100, "amount": 1 },
          { "id": 2, "productId": "product2", "price": 200, "amount": 1 },
          { "id": 3, "productId": "placeholder", "price": 0, "amount": 0 },
          { "id": 4, "productId": "placeholder", "price": 0, "amount": 0 }
        ]
      }`,
    );
  });

  it('Waits for a single VSM cycle and then verifies that transaction 1 has been executed and that the state has been properly stored', async () => {
    await new Promise((r) => setTimeout(r, 50000));
    const resultWorkflow = await fetchWorkflow(createdWorkflowId);
    const resultBpiAccount = await fetchBpiAccount(resultWorkflow.bpiAccountId);

    const stateTree = JSON.parse(resultBpiAccount.stateTree.tree);
    const historyTree = JSON.parse(resultBpiAccount.historyTree.tree);

    expect(stateTree.leaves.length).toBe(1);
    expect(historyTree.leaves.length).toBe(1);
  });

  it('Submits transaction 2 for execution of the workstep 2', async () => {

    await createTransactionAndReturnId(
      v4(),
      1,
      createdWorkflowId,
      createdWorkstep2Id,
      createdBpiSubjectAccountSupplierId,
      supplierBpiSubjectEddsaPrivateKey,
      createdBpiSubjectAccountBuyerId,
      `{
        "supplierInvoiceID": "INV123",
        "amount": 300,
        "issueDate": "2023-06-15",
        "dueDate": "2023-07-15",
        "status": "VERIFIED",
        "items": [
          { "id": 1, "productId": "product1", "price": 100, "amount": 1 },
          { "id": 2, "productId": "product2", "price": 200, "amount": 1 },
          { "id": 3, "productId": "placeholder", "price": 0, "amount": 0 },
          { "id": 4, "productId": "placeholder", "price": 0, "amount": 0 }
        ]
      }`,
    );
  });

  it('Waits for a single VSM cycle and then verifies that the transaction 2 has been executed and that the state has been properly stored', async () => {
    await new Promise((r) => setTimeout(r, 50000));
    const resultWorkflow = await fetchWorkflow(createdWorkflowId);
    const resultBpiAccount = await fetchBpiAccount(resultWorkflow.bpiAccountId);

    const stateTree = JSON.parse(resultBpiAccount.stateTree.tree);
    const historyTree = JSON.parse(resultBpiAccount.historyTree.tree);

    expect(stateTree.leaves.length).toBe(2);
    expect(historyTree.leaves.length).toBe(2);
  });
});

async function loginAsInternalBpiSubjectAndReturnAnAccessToken(): Promise<string> {
  // internalBpiSubjectEcdsaPublicKey & internalBpiSubjectEcdsaPrivateKey must be inline with the value for the bpiAdmin from seed.ts
  // These values are used for testing purposes only

  const nonceResponse = await request(server)
    .post('/auth/nonce')
    .send({ publicKey: internalBpiSubjectEcdsaPublicKey })
    .expect(201);

  const signer = new ethers.Wallet(
    internalBpiSubjectEcdsaPrivateKey,
    undefined,
  );
  const signature = await signer.signMessage(nonceResponse.text);

  const loginResponse = await request(server)
    .post('/auth/login')
    .send({
      message: nonceResponse.text,
      signature: signature,
      publicKey: internalBpiSubjectEcdsaPublicKey,
    })
    .expect(201);

  return JSON.parse(loginResponse.text)['access_token'];
}

async function createExternalBpiSubjectAndReturnId(
  bpiSubjectName: string,
  pk: { type: string; value: string }[],
): Promise<string> {
  const createdBpiSubjectResponse = await request(server)
    .post('/subjects')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      name: bpiSubjectName,
      desc: 'A test Bpi Subject',
      publicKeys: pk,
    })
    .expect(201);

  return createdBpiSubjectResponse.text;
}

async function createBpiSubjectAccountAndReturnId(
  creatorBpiSubjectId: string,
  ownerBpiSubjectId: string,
): Promise<string> {
  const createdBpiSubjectAccountResponse = await request(server)
    .post('/subjectAccounts')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      creatorBpiSubjectId: creatorBpiSubjectId,
      ownerBpiSubjectId: ownerBpiSubjectId,
    })
    .expect(201);

  return createdBpiSubjectAccountResponse.text;
}

async function createAWorkgroupAndReturnId(): Promise<string> {
  const createdWorkgroupResponse = await request(server)
    .post('/workgroups')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      name: 'Test workgroup',
      securityPolicy: 'Dummy security policy',
      privacyPolicy: 'Dummy privacy policy',
    })
    .expect(201);

  return createdWorkgroupResponse.text;
}

async function updateWorkgroupAdminsAndParticipants(
  workgroupId: string,
  administratorIds: string[],
  participantIds: string[],
): Promise<void> {
  await request(server)
    .put(`/workgroups/${workgroupId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      name: 'Test workgroup',
      administratorIds: administratorIds,
      securityPolicy: 'Dummy security policy',
      privacyPolicy: 'Dummy privacy policy',
      participantIds: participantIds,
    })
    .expect(200);
}

async function fetchWorkgroup(workgroupId: string): Promise<any> {
  const getWorkgroupResponse = await request(server)
    .get(`/workgroups/${workgroupId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);

  return JSON.parse(getWorkgroupResponse.text);
}

async function createWorkstepAndReturnId(
  name: string,
  workgroupId: string,
): Promise<string> {
  const createdWorkstepResponse = await request(server)
    .post('/worksteps')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      name: name,
      version: '1',
      status: 'NEW',
      workgroupId: workgroupId,
      securityPolicy: 'Dummy security policy',
      privacyPolicy: 'Dummy privacy policy',
    })
    .expect(201);

  return createdWorkstepResponse.text;
}

async function addCircuitInputsSchema(
  workstepId: string,
  schema: string,
): Promise<string> {
  const addCircuitInputsSchemaResponse = await request(server)
    .put(`/worksteps/${workstepId}/circuitinputsschema`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      schema: schema,
    })
    .expect(200);

  return addCircuitInputsSchemaResponse.text;
}

async function createWorkflowAndReturnId(
  name: string,
  workgroupId: string,
  workstepIds: string[],
  ownerIds: string[],
): Promise<string> {
  const createdWorkflowResponse = await request(server)
    .post('/workflows')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      name: name,
      workgroupId: workgroupId,
      workstepIds: workstepIds,
      workflowBpiAccountSubjectAccountOwnersIds: ownerIds,
    })
    .expect(201);

  return createdWorkflowResponse.text;
}

async function createTransactionAndReturnId(
  id: string,
  nonce: number,
  workflowInstanceId: string,
  workstepInstanceId: string,
  fromSubjectAccountId: string,
  fromPrivatekey: string,
  toSubjectAccountId: string,
  payload: string,
): Promise<string> {
  //Eddsa signature
  const signature = await createEddsaSignature(payload, fromPrivatekey);

  const createdTransactionResponse = await request(server)
    .post('/transactions')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      id: id,
      nonce: nonce,
      workflowInstanceId: workflowInstanceId,
      workstepInstanceId: workstepInstanceId,
      fromSubjectAccountId: fromSubjectAccountId,
      toSubjectAccountId: toSubjectAccountId,
      payload: payload,
      signature: signature,
    })
    .expect(201);

  return createdTransactionResponse.text;
}

async function fetchWorkflow(workflowId: string): Promise<any> {
  const getWorkflowResponse = await request(server)
    .get(`/workflows/${workflowId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);

  return JSON.parse(getWorkflowResponse.text);
}

async function fetchBpiAccount(bpiAccountId: string): Promise<any> {
  const getBpiAccountResponse = await request(server)
    .get(`/accounts/${bpiAccountId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);

  return JSON.parse(getBpiAccountResponse.text);
}

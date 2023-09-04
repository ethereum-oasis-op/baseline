import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ethers } from 'ethers';
import { SubscriptionLoggable } from 'rxjs/internal/testing/SubscriptionLoggable';

jest.setTimeout(20000);

let accessToken: string;
let app: INestApplication;
let server: any;

let createdWorkgroupId: string;

describe('SRI use-case end-to-end test', () => {

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close()
    server.close()
  })

  // TODO: Add detailed explanation of the SRI use-case setup and necessary seed data
  it('Logs in an internal Bpi Subject, creates two external Bpi Subjects (Supplier and Buyer) and a Workgroup and adds the created Bpi Subjects as participants to the Workgroup', async () => {
    accessToken = await loginAsInternalBpiSubjectAndReturnAnAccessToken();

    const createdBpiSubjectSupplierId = await createExternalBpiSubjectAndReturnId(
      'External Bpi Subject - Supplier',
    );
    const createdBpiSubjectBuyerId = await createExternalBpiSubjectAndReturnId(
      'External Bpi Subject 2 - Buyer',
    );

    createdWorkgroupId = await createAWorkgroupAndReturnId();

    await updateWorkgroupAdminsAndParticipants(
      createdWorkgroupId,
      [createdBpiSubjectSupplierId],
      [createdBpiSubjectSupplierId, createdBpiSubjectBuyerId],
    );

    const resultWorkgroup = await fetchWorkgroup(
      createdWorkgroupId
    );

    expect(resultWorkgroup.participants.length).toBe(2);
    expect(resultWorkgroup.participants[0].id).toEqual(createdBpiSubjectSupplierId);
    expect(resultWorkgroup.participants[1].id).toEqual(createdBpiSubjectBuyerId);
  });

  it('Sets up a workflow with a workstep in the previously created workgroup', async () => {
    // TODO: Auth as supplier?
    // TODO: Can we  listen and fire NATS messages here
    
    const createdWorkstepId = await createWorkstep(
      "workstep1",
      createdWorkgroupId
    );

    // createWorkflow 
  });

  it('Submits a transaction for execution of the workstep 1', async () => {
    // TODO: CheckAuthz on createTransaction and in other places 
    // createTransaction
  });

  it('Verifies that the transaction has been executed and that the state has been properly stored', async () => {
    // wait 20 secs for the vsm to perform a loop
    // query the CAH retrieved from the transaction
  });
});

async function loginAsInternalBpiSubjectAndReturnAnAccessToken(): Promise<string> {
  // These two values must be inline with the value for the bpiAdmin from seed.ts
  // These values are used for testing purposes only
  const internalBpiSubjectPublicKey =
    '0x08872e27BC5d78F1FC4590803369492868A1FCCb';
  const internalBpiSubjectPrivateKey =
    '2c95d82bcd8851bd3a813c50afafb025228bf8d237e8fd37ba4adba3a7596d58';

  const nonceResponse = await request(server)
    .post('/auth/nonce')
    .send({ publicKey: internalBpiSubjectPublicKey })
    .expect(201);

  const signer = new ethers.Wallet(internalBpiSubjectPrivateKey, undefined);
  const signature = await signer.signMessage(nonceResponse.text);

  const loginResponse = await request(server)
    .post('/auth/login')
    .send({
      message: nonceResponse.text,
      signature: signature,
      publicKey: internalBpiSubjectPublicKey,
    })
    .expect(201);

  return JSON.parse(loginResponse.text)['access_token'];
}

async function createExternalBpiSubjectAndReturnId(
  bpiSubjectName: string,
): Promise<string> {
  const createdBpiSubjectResponse = await request(server)
    .post('/subjects')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      name: bpiSubjectName,
      desc: 'A test Bpi Subject',
      publicKey: 'Bpi Subject dummy public key',
    })
    .expect(201);

  return createdBpiSubjectResponse.text;
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

async function fetchWorkgroup(workgroupId: string,
): Promise<any> {
  const getWorkgroupResponse = await request(server)
    .get(`/workgroups/${workgroupId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);

  return JSON.parse(getWorkgroupResponse.text);
}

async function createWorkstep(
  name: string, 
  workgroupId: string
): Promise<string> {
  const createdWorkstepResponse = await request(server)
    .post('/worksteps')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      name: name,
      version: "1",
      status: "NEW",
      workgroupId: workgroupId,
      securityPolicy: 'Dummy security policy',
      privacyPolicy: 'Dummy privacy policy',
    })
    .expect(201);

  return createdWorkstepResponse.text;
}

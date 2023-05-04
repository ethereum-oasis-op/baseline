import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ethers } from 'ethers';

jest.setTimeout(20000);

describe('Workgroup administration', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Logs in an internal Bpi Subject, creates two external Bpi Subjects and a Workgroup and adds the created Bpi Subjects as participants to the Workgroup', async () => {
    const accessToken = await loginAsInternalBpiSubjectAndReturnAnAccessToken(
      app,
    );

    const createdBpiSubject1Id = await createExternalBpiSubjectAndReturnId(
      'External Bpi Subject 1',
      app,
      accessToken,
    );
    const createdBpiSubject2Id = await createExternalBpiSubjectAndReturnId(
      'External Bpi Subject 2',
      app,
      accessToken,
    );

    const createdWorkgroupId = await createAWorkgroupAndReturnId(
      app,
      accessToken,
    );

    await updateWorkgroupAdminsAndParticipants(
      createdWorkgroupId,
      [createdBpiSubject1Id],
      [createdBpiSubject1Id, createdBpiSubject2Id],
      app,
      accessToken,
    );

    const resultWorkgroup = await fetchWorkgroup(
      createdWorkgroupId,
      app,
      accessToken,
    );

    expect(resultWorkgroup.participants.length).toBe(2);
    expect(resultWorkgroup.participants[0].id).toEqual(createdBpiSubject1Id);
    expect(resultWorkgroup.participants[1].id).toEqual(createdBpiSubject2Id);
  });
});

async function loginAsInternalBpiSubjectAndReturnAnAccessToken(
  app: INestApplication,
): Promise<string> {
  // These two values must be inline with the value for the bpiAdmin from seed.ts
  // These values are used for testing purposes only
  const internalBpiSubjectPublicKey =
    '0x08872e27BC5d78F1FC4590803369492868A1FCCb';
  const internalBpiSubjectPrivateKey =
    '2c95d82bcd8851bd3a813c50afafb025228bf8d237e8fd37ba4adba3a7596d58';

  const nonceResponse = await request(app.getHttpServer())
    .post('/auth/nonce')
    .send({ publicKey: internalBpiSubjectPublicKey })
    .expect(201);

  const signer = new ethers.Wallet(internalBpiSubjectPrivateKey, null);
  const signature = await signer.signMessage(nonceResponse.text);

  const loginResponse = await request(app.getHttpServer())
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
  app: INestApplication,
  accessToken: string,
): Promise<string> {
  const createdBpiSubjectResponse = await request(app.getHttpServer())
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

async function createAWorkgroupAndReturnId(
  app: INestApplication,
  accessToken: string,
): Promise<string> {
  const createdWorkgroupResponse = await request(app.getHttpServer())
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
  app: INestApplication,
  accessToken: string,
): Promise<void> {
  await request(app.getHttpServer())
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

async function fetchWorkgroup(
  workgroupId: string,
  app: INestApplication,
  accessToken: string,
): Promise<any> {
  const getWorkgroupResponse = await request(app.getHttpServer())
    .get(`/workgroups/${workgroupId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);

  return JSON.parse(getWorkgroupResponse.text);
}

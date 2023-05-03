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

  it('Logs in an internal Bpi Subject, creates a Workgroup and two Bpi Subjects and adds them as participants to the Workgroup', async () => {
    // login as internal BPI subject
    var nonceResponse = await request(app.getHttpServer())
      .post('/auth/nonce')
      .send({publicKey: '0x08872e27BC5d78F1FC4590803369492868A1FCCb'})

    const signer = new ethers.Wallet("2c95d82bcd8851bd3a813c50afafb025228bf8d237e8fd37ba4adba3a7596d58", null);

    const signature = await signer.signMessage(nonceResponse.text);

    var loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        message: nonceResponse.text,
        signature: signature,
        publicKey: '0x08872e27BC5d78F1FC4590803369492868A1FCCb'
      })

    var accesstoken = JSON.parse(loginResponse.text)['access_token'];
    // create two bpi subjects

    const createdBpiSubject1Response = await request(app.getHttpServer())
      .post('/subjects')
      .set('Authorization', `Bearer ${accesstoken}`)
      .send({
        name: 'External Bpi Subject 1',
        desc: 'A test Bpi subject',
        publicKey: 'todo'
      })
      .expect(201);
    
    const createdBpiSubject1Id = createdBpiSubject1Response.text;
    
    const createdBpiSubject2Response = await request(app.getHttpServer())
      .post('/subjects')
      .set('Authorization', `Bearer ${accesstoken}`)
      .send({
        name: 'External Bpi Subject 2',
        desc: 'Another test Bpi subject',
        publicKey: 'todo'
      })
      .expect(201);
    
    const createdBpiSubject2Id = createdBpiSubject2Response.text;

    // create workgroup

    const createdWorkgroupResponse = await request(app.getHttpServer())
      .post('/workgroups')
      .set('Authorization', `Bearer ${accesstoken}`)
      .send({
        name: 'Test workgroup',
        securityPolicy: 'secPol',
        privacyPolicy: 'privPol'
      })
      .expect(201);
    
    const createdWorkgroupId = createdWorkgroupResponse.text;

    // update workgroup with participants
    
     await request(app.getHttpServer())
      .put(`/workgroups/${createdWorkgroupId}`)
      .set('Authorization', `Bearer ${accesstoken}`)
      .send({
        name: 'Test workgroup',
        administratorIds: [createdBpiSubject1Id],
        securityPolicy: 'secPol',
        privacyPolicy: 'privPol',
        participantIds: [createdBpiSubject1Id, createdBpiSubject2Id]
      })
      .expect(200);
  
    const getWorkgroupResponse = await request(app.getHttpServer())
      .get(`/workgroups/${createdWorkgroupId}`)
      .set('Authorization', `Bearer ${accesstoken}`)
      .expect(200);
      
    // verify participants

    const resultWorkgroup = JSON.parse(getWorkgroupResponse.text);

    expect(resultWorkgroup.participants.length).toBe(2);
    expect(resultWorkgroup.participants[0].id).toEqual(createdBpiSubject1Id);
    expect(resultWorkgroup.participants[1].id).toEqual(createdBpiSubject2Id);
  });
});

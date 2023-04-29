import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ethers } from 'ethers';

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

    // create two bpi subjects

    const createdBpiSubject1Id = await request(app.getHttpServer())
      .post('/subjects')
      .send({
        name: 'External Bpi Subject 1',
        desc: 'A test Bpi subject',
        publicKey: 'todo'
      })
    
    const createdBpiSubject2Id = await request(app.getHttpServer())
      .post('/subjects')
      .send({
        name: 'External Bpi Subject 2',
        desc: 'Another test Bpi subject',
        publicKey: 'todo'
      })

    // create workgroup

    const createdWorkgroupId = await request(app.getHttpServer())
      .post('/workgroups')
      .send({
        name: 'Test workgroup',
        securityPolicy: 'secPol',
        privacyPolicy: 'privPol'
      })
    
     await request(app.getHttpServer())
      .put(`/workgroups/${createdWorkgroupId}`)
      .send({
        participantIds: [createdBpiSubject1Id, createdBpiSubject2Id]
      })
      .expect(200);
  
    var res = await request(app.getHttpServer())
      .get('/workgroups/${createdWorkgroupId}`)')
      .expect(200);
      
    // verify participants

    return res;
  });
});

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
    var response = await request(app.getHttpServer())
      .post('/auth/nonce')
      .send({publicKey: '0x08872e27BC5d78F1FC4590803369492868A1FCCb'})

    const signer = new ethers.Wallet("2c95d82bcd8851bd3a813c50afafb025228bf8d237e8fd37ba4adba3a7596d58", null);

    const signature = signer.signMessage(response.text);


    // create two bpi subjects
    // create workgroup
    // add both bpi subjects to workgroup
    // verify participants

    return request(app.getHttpServer())
      .post('/messages/123')
      .expect(404);
  });
});

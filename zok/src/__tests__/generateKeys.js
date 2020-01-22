import SuperTest from 'supertest';
import fs from 'fs';
import zokrates from '@eyblockchain/zokrates.js';
import { saveVerificationKeyToDB } from '../utils/fileToDB';
import app from '../app';

jest.mock('../utils/fileToDB');
jest.mock('fs');
jest.mock('@eyblockchain/zokrates.js');

const supertest = SuperTest(app);

describe('Generate Keys', () => {
  describe('POST /generate-keys', () => {
    it('should respond with id of the newly created verification key', async () => {
      const dbResponse = {
        _id: 'test',
        vk: {
          alpha: [
            '0x1627f56e7486b2a7ca2fe6e9dc58d5983d36fac4cd9a281b474649d1ffa38494',
            '0x0f8e44bb39ca12cac82313d0eeb4c8b2ff3f3dda8dfd516f1f70068a2d600407',
          ],
          beta: [
            [
              '0x15c4171b5c8b41d5100541a46997dd6d5c24c54f402ac0c8411500f85b74c706',
              '0x2156fbe60b59dd333daa8440da7c58569d47cd6e1f2a0ddfef845c1f70321ba0',
            ],
            [
              '0x2fd4f3521bd87bc91da0d02ce05fb01b4d8092af5c77d561fd98b22f3074265c',
              '0x0cca0bdfe01f29a12bb586ac1058f406d9fbeb5e3de720a946a0f879b17b6335',
            ],
          ],
          delta: [
            [
              '0x088d1d5289e9fc438fe1b1a716f0f369836a698c2522427c59ebba730885a57b',
              '0x0018b5c99d1a5bbf282cc0d4ff4e87773b746db616aeed20a1e56a3ea143f962',
            ],
            [
              '0x00ff66a2ae632e70b5cc6ccab6bd02617e0d248d1b30d86c75fc6986af35c872',
              '0x26c3dcffafe58f84c3672b12e1347cd74fa13175d6e72acdb87dda0b8c4c383b',
            ],
          ],
          gamma: [
            [
              '0x0c19999a2aa23c3488c5e798b3d9a78247e7945f627119398dec882ed4f7ec65',
              '0x1654dbb642d966533b481d62580f4ea1f1380238d38b4b70fd30691f0918068f',
            ],
            [
              '0x0b342c1a4f31c7f98170ca7d39297b1b9755a6776ba7994fbbc985f9c9b54924',
              '0x1d4be16786e1723e70bbbb420dc352d7d8b664a07160d1fa7436fe00a683eb4f',
            ],
          ],
          gamma_abc: {
            'len()': '3',
          },
          'gamma_abc[0]': [
            '0x22a3b3ae89d9b5367d3631a4be76221c6708cd028e5a4f16e010b51a91fe12f0',
            '0x269b7e32f12e5b594f5a9a1c0f956d7624600e5741528048aaba700b1c9d0fd0',
          ],
          'gamma_abc[1]': [
            '0x19ee1dfedc29612c6f415ab1141ec93652171b6668a1a2e0d1f46e4933e019c7',
            '0x19525e6df253df54e1e0e3c91ab2ac9fe57127f251b6351bfa366d74c8587275',
          ],
          'gamma_abc[2]': [
            '0x0e62d58a5f771c474b7c6acead2bc3e65e6a84a5063ec1b3bfdb5fea711c3282',
            '0x1727c51ce0899381e53f6240de609a8c00f96e263c8876d8a62f1342dc09856f',
          ],
        },
      };
      const keyID = 'test';
      fs.mkdirSync.mockReturnValue(true);
      zokrates.compile.mockReturnValue(true);
      zokrates.setup.mockReturnValue(true);
      zokrates.exportVerifier.mockReturnValue(true);
      saveVerificationKeyToDB.mockReturnValue(dbResponse);
      const res = await supertest.post('/generate-keys').send({ filepath: 'examples/test.zok' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.verificationKeyID).toEqual(keyID);
    });

    it('should respond with 500 on other errors', async () => {
      fs.mkdirSync.mockReturnValue(true);
      zokrates.compile.mockReturnValue(true);
      zokrates.setup.mockReturnValue(true);
      zokrates.exportVerifier.mockReturnValue(true);
      saveVerificationKeyToDB.mockImplementation(() => {
        throw new Error();
      });
      await supertest
        .post('/generate-keys')
        .send({ filepath: 'examples/test.zok' })
        .expect(500);
    });
  });
});

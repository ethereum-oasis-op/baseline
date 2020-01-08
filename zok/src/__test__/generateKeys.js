import SuperTest from 'supertest';
import fs from 'fs';
import zokrates from '@eyblockchain/zokrates.js';
import { saveVerificationKeyToDB } from '../utils/fileToDB';
import app from '../app';

jest.mock('../../utils/fileToDB');
jest.mock('fs');
jest.mock('@eyblockchain/zokrates.js');

const supertest = SuperTest(app);

describe('Generate Keys', () => {
  describe('POST /generate-keys', () => {
    it('should respond with id of the newly created verification key', async () => {
      const testVk = { keyID: 'test' };
      fs.mkdirSync.mockReturnValue(true);
      zokrates.compile.mockReturnValue(true);
      zokrates.setup.mockReturnValue(true);
      zokrates.exportVerifier.mockReturnValue(true);
      saveVerificationKeyToDB.mockReturnValue(testVk);
      const res = await supertest.post('/generate-keys').send({ name: 'test' });

      expect(res.statusCode).toEqual(201);
      expect(res.body.keyID).toEqual(testVk);
    });

    // TODO: write a GET test and ensure values are returned correctly

    // TODO: return proper status codes for this instead of 500
    // TODO: set up error handling middleware and other validations
    // cases('should respond with a 422 when validations fail',
    //   async opts => {
    //     await supertest
    //       .post('/generate-keys')
    //       .send(opts.file)
    //       .expect(422)
    //   },
    //   [
    //     {
    //       name: 'Invalid file name',
    //       file: {
    //         name: "Invalid Name",
    //       },
    //     },
    //   ]
    // );

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
        .send({ name: 'test' })
        .expect(500);
    });
  });
});

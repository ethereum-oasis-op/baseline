import SuperTest from 'supertest';

const zokAPI = 'http://localhost:8080';

describe('Generate Zokrates Keys and Proof', () => {
  test('generate keys and return 200', async () => {
    const request = { name: 'test' };
    const response = await SuperTest(zokAPI)
      .post('/generate-keys')
      .send(request);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('verificationKeyID');
    expect(response.body).toHaveProperty('verificationKey.alpha');
    expect(response.body).toHaveProperty('verificationKey.beta');
    expect(response.body).toHaveProperty('verificationKey.delta');
  });
  test('generate proof and return 200', async () => {
    const request = {
      docId: 'test1234',
      name: 'test',
      witness: [5, 25],
    };
    const response = await SuperTest(zokAPI)
      .post('/generate-proof')
      .send(request);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('docID');
    expect(response.body).toHaveProperty('proof');
    expect(response.body).toHaveProperty('verificationKey');
    expect(response.body).toHaveProperty('verificationKeyID');
  });
});

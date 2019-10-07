import SuperTest from 'supertest';
import app from '../../app';

const supertest = SuperTest(app);

describe('Health Check', () => {
  describe('GET /health-check', () => {
    it('should resolve a 200 always', async () => {
      await supertest.get('/health-check').expect(200);
    });
  });
});

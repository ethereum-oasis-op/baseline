"use strict";

var _supertest = _interopRequireDefault(require("supertest"));

var _app = _interopRequireDefault(require("../../app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const supertest = (0, _supertest.default)(_app.default);
describe('Health Check', () => {
  describe('GET /health-check', () => {
    it('should resolve a 200 always', async () => {
      await supertest.get('/health-check').expect(200);
    });
  });
});
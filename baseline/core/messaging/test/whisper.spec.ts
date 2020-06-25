import { messagingProviderWhisper, messagingServiceFactory } from '../src/index';
import { promisedTimeout } from './utils';

let whisperService;

const whisperServiceFactory = async (cfg) => {
  return await messagingServiceFactory(messagingProviderWhisper, cfg);
};

const requireWhisperConnection = async () => {
  expect(whisperService.isConnected()).toBe(false);
  const conn = await whisperService.connect();
  expect(whisperService.isConnected()).toBe(true);
  return conn;
};

beforeEach(async () => {
  whisperService = await whisperServiceFactory({
    clientUrl: 'localhost:8546',
  });
  expect(whisperService).not.toBe(null);
});

afterEach(async () => {
  if (whisperService.isConnected()) {
    // FIXME-- cleanup... i.e. whisperService.disconnect();
  }
});

it('needs some actual tests ;)', async () => {
  console.log('FIXME! Whisper suite not implemented');
});

describe('connect', () => {
  it('should cache the Whisper connection for subsequent use by the service', async () => {
    expect(whisperService.isConnected()).toBe(false);
    await whisperService.connect();
    expect(whisperService.isConnected()).toBe(true);
  });
});

describe('disconnect', () => {

});

describe('publish', () => {

});

describe('subscribe', () => {

});

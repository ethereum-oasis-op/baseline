import { messagingProviderWhisper, messagingServiceFactory } from '../src/index';
import { promisedTimeout } from './utils';

let whisperService;
const callback = () => { };

const whisperServiceFactory = async (cfg) => {
  return await messagingServiceFactory(messagingProviderWhisper, cfg);
};

const requireWhisperConnection = async () => {
  expect(whisperService.isConnected()).toBe(false);
  const conn = await whisperService.connect();
  await whisperService.connect();
  for (let retry = 0; retry < 5; retry++) {
    if (whisperService.web3Connected) {
      break;
    }
    await promisedTimeout(1000);
  }
  expect(whisperService.isConnected()).toBe(true);
  return conn;
};

beforeEach(async () => {
  whisperService = await whisperServiceFactory({
    clientUrl: 'ws://localhost:8546',
  });
  expect(whisperService).not.toBe(null);
});

afterEach(async () => {
  if (whisperService.isConnected()) {
    whisperService.disconnect();
  }
});

describe('connect', () => {
  it('should establish and return a Whisper connection', async () => {
    const conn = await whisperService.connect();
    expect(conn).not.toBe(null);
  });

  it('should cache the Whisper connection for subsequent use by the service', async () => {
    await requireWhisperConnection();
  });
});

describe('disconnect', () => {
  describe('when the Whisper service has an active underlying connection', () => {
    beforeEach(async () => {
      await requireWhisperConnection();
      whisperService.disconnect();
      await promisedTimeout(1000);
    });

    it('should gracefully close the Whisper connection', async () => {
      expect(whisperService.isConnected()).toBe(false);
    });
  });
});

describe('publish', () => {
  let identity;
  beforeEach(async () => {
    identity = await whisperService.createIdentity(undefined, callback);
  });

  describe('when the Whisper service has an active underlying connection', () => {
    let subject;

    beforeEach(async () => {
      await requireWhisperConnection();
      subject = `hello.world.${new Date().getTime()}`;
    });

    describe('when no reply subject is provided', () => {
      it('should publish message', async () => {
        const res = await whisperService.publish(undefined, '0x01', undefined, identity.publicKey, identity.keyId);
        expect(res.payload).toBe('0x01');
      });
    });
  });
});

describe('subscribe', () => {
  describe('when the Whisper service has an active underlying connection', () => {
    let subscription;
    let identity;

    beforeEach(async () => {
      await requireWhisperConnection();
      identity = await whisperService.createIdentity(undefined, callback);
      subscription = await whisperService.subscribe(undefined, callback, identity.keyId);
    });

    it('should return the new subscription', async () => {
      expect(subscription).not.toBe(null);
    });
  });
});

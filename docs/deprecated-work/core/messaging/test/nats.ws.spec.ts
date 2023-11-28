import { messagingProviderNats, messagingServiceFactory } from '../src/index';
import { promisedTimeout } from './utils';

let natsService;

const natsServiceFactory = async (cfg) => {
  return await messagingServiceFactory(messagingProviderNats, cfg);
};

const requireNatsConnection = async () => {
  expect(natsService.isConnected()).toBe(false);
  const conn = await natsService.connect();
  expect(natsService.isConnected()).toBe(true);
  return conn;
};

beforeEach(async () => {
  natsService = await natsServiceFactory({
    natsServers: ['ws://localhost:4221'],
  });
  expect(natsService).not.toBe(null);
});

afterEach(async () => {
  if (natsService.isConnected()) {
    natsService.disconnect();
  }
});

describe('connect', () => {
  it('should establish and return a NATS connection', async () => {
    const conn = await natsService.connect();
    expect(conn).not.toBe(null);
  });

  it('should cache the NATS connection for subsequent use by the service', async () => {
    expect(natsService.isConnected()).toBe(false);
    await natsService.connect();
    expect(natsService.isConnected()).toBe(true);
  });
});

describe('disconnect', () => {
  describe('when the NATS service has an active underlying connection', () => {
    beforeEach(async () => {
      await requireNatsConnection();
      natsService.disconnect();
      await promisedTimeout(250);
    });

    it('should gracefully close the NATS connection', async () => {
      expect(natsService.isConnected()).toBe(false);
    });
  });
});

describe('request', () => {
  describe('when the NATS service has an active underlying connection', () => {
    let subject;
    let timeout;

    beforeEach(async () => {
      await requireNatsConnection();
      subject = `hello.world.request.${new Date().getTime()}`;
      timeout = 2500;
    });

    describe('when no response is received', () => {
      it('should timeout and throw', async () => {
        const req = natsService.request(subject, timeout);
        await expect(req).rejects.toEqual('timeout');
      });
    });

    // FIXME-- this test case is broken
    // describe('when a response is published', () => {
    //   let resp;

    //   beforeEach(async () => {
    //     resp = natsService.request(subject, timeout);
    //     await promisedTimeout(50);
    //     natsService.publish(subject, 'hello response!');
    //   });

    //   it('should receive the response', async () => {
    //   });
    // });
  });
});

describe('publish', () => {
  describe('when the NATS service has an active underlying connection', () => {
    let subject;

    beforeEach(async () => {
      await requireNatsConnection();
      subject = `hello.world.${new Date().getTime()}`;
    });

    describe('when no reply subject is provided', () => {
      it('should publish message', async () => {
        const res = await natsService.publish(subject, '0x01');
        expect(typeof res).toBe('undefined');
      });
    });

    describe('when a reply subject is provided', () => {
      let replySubject;

      beforeEach(async () => {
        replySubject = `hello.reply.${new Date().getTime()}`;
      });

      it('should publish the message', async () => {
        const res = await natsService.publish(subject, '0x02', replySubject);
        expect(typeof res).toBe('undefined');
      });
    });
  });
});

describe('subscribe', () => {
  describe('when the NATS service has an active underlying connection', () => {
    beforeEach(async () => {
      await requireNatsConnection();
    });

    describe('when the given subject is valid', () => {
      let subscription;
      let subject;

      beforeEach(async () => {
        subject = `hello.world.${new Date().getTime()}`;
        subscription = await natsService.subscribe(subject);
      });

      it('should return the new subscription', async () => {
        expect(subscription).not.toBe(null);
      });

      it('should cache the new subscription', async () => {
        const subscribedSubjects = await natsService.getSubscribedSubjects();
        expect(subscribedSubjects.indexOf(subject)).toBe(0);
      });
    });
  });
});

describe('unsubscribe', () => {
  describe('when the NATS service has an active underlying connection', () => {
    beforeEach(async () => {
      await requireNatsConnection();
    });

    describe('when the given subject is invalid', () => {
      it('should be a no-op', async () => {
        const res = await natsService.unsubscribe('this.subject.does.not.exist');
        expect(typeof res).toBe('undefined');
      });
    });

    describe('when the named subscription is valid', () => {
      let subscription;
      let subject;

      beforeEach(async () => {
        subject = `hello.world.${new Date().getTime()}`;
        subscription = await natsService.subscribe(subject);
        expect(subscription).not.toBe(null);
      });

      it('should unsubscribe and remove the subscription', async () => {
        const res = await natsService.unsubscribe(subject);
        expect(res).not.toBeNull();
      });

      it('should remove the cached subscription', async () => {
        expect((await natsService.getSubscribedSubjects()).indexOf(subject)).toBe(0);
        await natsService.unsubscribe(subject);
        expect((await natsService.getSubscribedSubjects()).indexOf(subject)).toBe(-1);
      });
    });
  });
});

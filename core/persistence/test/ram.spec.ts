import { assert } from 'chai';
import { persistenceServiceFactory, persistenceProviderRAM } from '../src/index';

let provider;

describe('RAM persistence provider', () => {
  describe('subscribe to', () => {
    beforeEach(async () => {
      provider = await persistenceServiceFactory(persistenceProviderRAM);
    });

    it('fields via RegExp', async () => {
      const params = {
        fields: new RegExp('0', 'g')
      }
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.expressions[0], params.fields);
    });

    it('fields via string', async () => {
      const params = {
        fields: '3'
      }
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.identifiers[0], params.fields);
    });

    it('fields via string[]', async () => {
      const params = {
        fields: ['0', '1', '2']
      }
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.identifiers, params.fields);
    });
  });

  describe('unsubscribe to', () => {
    beforeEach(async () => {
      provider = await persistenceServiceFactory(persistenceProviderRAM);
    });

    it('fields via RegExp', async () => {
      const params = {
        fields: new RegExp('0', 'g')
      }
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.expressions[0], params.fields);
      subscribed = await provider.unsubscribe(params);
      assert.deepEqual(subscribed.expressions, []);
    });

    it('fields via string', async () => {
      const params = {
        fields: '0'
      }
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.identifiers[0], params.fields);
      subscribed = await provider.unsubscribe(params);
      assert.deepEqual(subscribed.identifiers, []);
    });

    it('fields via string[]', async () => {
      const params = {
        fields: ['0', '1', '2']
      }
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.identifiers, params.fields);
      subscribed = await provider.unsubscribe({ fields: ['0', '1'] });
      assert.deepEqual(subscribed.identifiers, ['2']);
    });
  });

  describe('subscribe, publish and alert', () => {
    before(async () => {
      provider = await persistenceServiceFactory(persistenceProviderRAM);
    });

    it('subscribe to field via string[]', async () => {
      const params = {
        fields: ['0', '1', '2']
      }
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.identifiers, params.fields);
    });

    it('publish records', async () => {
      const params = {
        records: [{ identifier: '0', hash: '0' }, { identifier: '4', hash: '4' }]
      }
      let published = await provider.publish(params);
      assert.deepEqual(published, params.records);
    });

    it('publish same record with altered hash', async () => {
      const params = {
        records: [{ identifier: '0', hash: '00' }]
      }
      let published = await provider.publish(params);
      assert.deepEqual(published, params.records);
    });

    it('alert', async () => {
      let alerts = await provider.alert();
      assert.deepEqual(alerts, [{ identifier: '0', hash: '00' }]);
    });
  });
});

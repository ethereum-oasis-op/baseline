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
      };
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.expressions[0], params.fields);
    });

    it('fields via string', async () => {
      const params = {
        fields: '3'
      };
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.identifiers[0], params.fields);
    });

    it('fields via string[]', async () => {
      const params = {
        fields: ['0', '1', '2']
      };
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.identifiers, params.fields);
    });

    it('existing fields via RegExp', async () => {
      const params = {
        fields: new RegExp('0', 'g')
      };
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.expressions[0], params.fields);
      subscribed = await provider.subscribe(params);
      assert.lengthOf(subscribed.expressions, 1);
    });

    it('existing fields via string', async () => {
      const params = {
        fields: '3'
      };
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.identifiers[0], params.fields);
      subscribed = await provider.subscribe(params);
      assert.lengthOf(subscribed.identifiers, 1);
    });
  });

  describe('unsubscribe to', () => {
    beforeEach(async () => {
      provider = await persistenceServiceFactory(persistenceProviderRAM);
    });

    it('fields via RegExp', async () => {
      const params = {
        fields: new RegExp('0', 'g')
      };
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.expressions[0], params.fields);
      subscribed = await provider.unsubscribe(params);
      assert.deepEqual(subscribed.expressions, []);
    });

    it('fields via string', async () => {
      const params = {
        fields: '0'
      };
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.identifiers[0], params.fields);
      subscribed = await provider.unsubscribe(params);
      assert.deepEqual(subscribed.identifiers, []);
    });

    it('fields via string[]', async () => {
      const params = {
        fields: ['0', '1', '2']
      };
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.identifiers, params.fields);
      subscribed = await provider.unsubscribe({ fields: ['0', '1'] });
      assert.deepEqual(subscribed.identifiers, ['2']);
    });

    it('not existing fields', async () => {
      const paramsRegExp = {
        fields: new RegExp('0', 'g')
      };
      const paramsString = {
        fields: '0'
      };
      const paramsStringArray = {
        fields: ['0', '1', '2']
      };
      let subscribed = await provider.unsubscribe(paramsRegExp);
      assert.deepEqual(subscribed.identifiers, []);
      assert.deepEqual(subscribed.expressions, []);
      subscribed = await provider.unsubscribe(paramsString);
      assert.deepEqual(subscribed.identifiers, []);
      assert.deepEqual(subscribed.expressions, []);
      subscribed = await provider.unsubscribe(paramsStringArray);
      assert.deepEqual(subscribed.identifiers, []);
      assert.deepEqual(subscribed.expressions, []);
    });
  });

  describe('subscribe, publish and alert', () => {
    before(async () => {
      provider = await persistenceServiceFactory(persistenceProviderRAM);
    });

    it('subscribe to field via string[]', async () => {
      const params = {
        fields: ['0', '1', '2']
      };
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.identifiers, params.fields);
    });

    it('subscribe to field via RegExp', async () => {
      const params = {
        fields: new RegExp('4', '')
      }
      let subscribed = await provider.subscribe(params);
      assert.deepEqual(subscribed.expressions, [params.fields]);
    });

    it('publish records', async () => {
      const params = {
        records: [{ identifier: '0' }, { identifier: '4' }, { identifier: '5' }]
      }
      let published = await provider.publish(params);
      assert.deepEqual(published, params.records);
    });

    it('alert', async () => {
      const params = {
        alerts: [{identifier: '5', message: 'Not alerted!'}, {identifier: '4', message: 'Hello World!'}, {identifier: '0', message: 'This record needs to be baselined!'}]
      }
      let alerts = await provider.alert(params);
      assert.deepEqual(alerts, [params.alerts[1], params.alerts[2]]);
    });
  });
});

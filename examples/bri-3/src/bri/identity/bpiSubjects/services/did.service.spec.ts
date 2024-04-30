import { DidService } from './did.service';
import { supplierBpiSubjectEcdsaPublicKey } from '../../../../shared/testing/constants';

describe('DID service', () => {
  it('should create did', async () => {
    const didService = new DidService();

    const keypair = await didService.createKeypair();

    const provider = await didService.createProvider();

    const did = await didService.createDid(keypair, provider);

    // await didService.setAuthenticationPublicKey(
    //   did,
    //   supplierBpiSubjectEcdsaPublicKey,
    //   provider,
    // );

    const didResolver = await didService.getDidResolver(provider);

    const didDocument = await didResolver.resolve(did.did);

    expect(didDocument).toEqual(didDocument);
  });
});

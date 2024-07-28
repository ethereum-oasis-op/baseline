import { InfuraProvider, Provider } from 'ethers';
import { EthrDID, KeyPair } from 'ethr-did';
import { Resolver } from 'did-resolver';
import { getResolver } from 'ethr-did-resolver';
import 'dotenv/config';

export class DidService {
  // TODO: Hardcoded sepolia everywhere for DID resolution
  // This should be taken from the CCSM_NETWORK env value and
  // the service refactored to connect to locahost as well,
  // with  previous deployment of a did registry to local node.
  async createKeypair(): Promise<KeyPair> {
    const keypair = EthrDID.createKeyPair('sepolia');
    return keypair;
  }

  async createProvider(): Promise<Provider> {
    const provider = new InfuraProvider(
      'sepolia',
      process.env.INFURA_PROVIDER_API_KEY,
    );
    return provider;
  }

  async createDid(keypair: KeyPair, provider: Provider): Promise<EthrDID> {
    const did = new EthrDID({
      identifier: process.env.DID_BPI_OPERATOR_PUBLIC_KEY as string,
      provider,
      chainNameOrId: 'sepolia',
      registry: process.env.DID_REGISTRY,
    });
    return did;
  }

  async getDidResolver(provider): Promise<Resolver> {
    const didResolver = new Resolver({
      ...getResolver({
        name: 'sepolia',
        provider: provider,
        registry: process.env.DID_REGISTRY,
        chainId: 'sepolia',
      }),
    });

    return didResolver;
  }

  async setAuthenticationPublicKey(
    did: EthrDID,
    publicKey: string,
    provider: Provider,
  ): Promise<void> {
    const attributeTxHash = await did.setAttribute(
      'did/pub/Secp256k1/sigAuth/hex',
      publicKey,
    );
    await provider.waitForTransaction(attributeTxHash);
  }
}

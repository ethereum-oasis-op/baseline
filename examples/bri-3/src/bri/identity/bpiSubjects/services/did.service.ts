import { InfuraProvider, Provider } from 'ethers';
import { EthrDID, KeyPair } from 'ethr-did';
import { Resolver } from 'did-resolver';
import { getResolver } from 'ethr-did-resolver';
import 'dotenv/config';

export class DidService {
  async createKeypair(): Promise<KeyPair> {
    const keypair = EthrDID.createKeyPair(process.env.CCSM_NETWORK);
    return keypair;
  }

  async createProvider(): Promise<Provider> {
    const provider = new InfuraProvider(
      process.env.CCSM_NETWORK,
      process.env.INFURA_PROVIDER_API_KEY,
    );
    return provider;
  }

  async createDid(keypair: KeyPair, provider: Provider): Promise<EthrDID> {
    const did = new EthrDID({
      identifier: process.env.DID_BPI_OPERATOR_PUBLIC_KEY as string,
      provider,
      chainNameOrId: process.env.CCSM_NETWORK,
      registry: process.env.DID_REGISTRY,
    });
    return did;
  }

  async getDidResolver(provider): Promise<Resolver> {
    const didResolver = new Resolver({
      ...getResolver({
        name: process.env.CCSM_NETWORK,
        provider: provider,
        registry: process.env.DID_REGISTRY,
        chainId: process.env.CCSM_NETWORK,
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

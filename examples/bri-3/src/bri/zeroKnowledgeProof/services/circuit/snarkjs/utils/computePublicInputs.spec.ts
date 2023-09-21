import { computeEffectiveEcdsaSigPublicInputs } from './computePublicInputs';
import { ethers } from 'ethers';

describe('Compute public inputs utils', () => {
  it('should calculate public key x and y coordinates ', async () => {
    //Generate key pair
    const wallet = ethers.Wallet.createRandom();

    //Generate signature
    const message = 'Test';
    const messageHash = Buffer.from(
      ethers.utils.arrayify(ethers.utils.hashMessage(message)),
    );
    const signature = await wallet.signMessage(message);
    const expandedSignature = ethers.utils.splitSignature(signature);

    //Test
    const result = computeEffectiveEcdsaSigPublicInputs(
      expandedSignature,
      messageHash,
      wallet.publicKey,
    );

    expect(typeof result.signature).toBe('bigint');
    expect(typeof result.Tx).toBe('bigint');
    expect(typeof result.Ty).toBe('bigint');
    expect(typeof result.Ux).toBe('bigint');
    expect(typeof result.Uy).toBe('bigint');
    expect(typeof result.publicKeyX).toBe('string');
    expect(typeof result.publicKeyX).toBe('string');
  });
});

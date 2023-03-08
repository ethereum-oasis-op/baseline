import { Injectable } from '@nestjs/common';
import * as jose from 'jose';
import { initialize } from 'passport';

@Injectable()
export class EncryptionService {
  constructor() {}

  async encrypt(content: string): Promise<string> {
    const jwe = await new jose.CompactEncrypt(new TextEncoder().encode(content))
      .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
      .encrypt(
        await jose.importJWK({
          k: process.env.BPI_ENCRYPTION_KEY_K_PARAM,
          kty: process.env.BPI_ENCRYPTION_KEY_KTY_PARAM,
        }),
      );

    return jwe;
  }

  async decrypt(jwe: string): Promise<string> {
    const { plaintext, protectedHeader } = await jose.compactDecrypt(
      jwe,
      await jose.importJWK({
        k: process.env.BPI_ENCRYPTION_KEY_K_PARAM,
        kty: process.env.BPI_ENCRYPTION_KEY_KTY_PARAM,
      }),
    );

    return new TextDecoder().decode(plaintext);
  }
}

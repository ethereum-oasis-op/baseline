import { Proof } from './proof';

export class Witness {
  proof: Proof;

  publicInput?: string[];

  verificationKey: string;
}

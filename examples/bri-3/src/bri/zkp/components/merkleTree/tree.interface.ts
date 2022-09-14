import { PreciseProofs } from 'ew-precise-proofs-js';

export interface Tree {
  leaves: PreciseProofs.Leaf[];
  root: string;
}

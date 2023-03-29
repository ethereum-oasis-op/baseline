import { AutoMap } from '@automapper/classes';
import MerkleTree from 'merkletreejs';

export class MerkleTreeDto {
  @AutoMap()
  id: string;

  @AutoMap()
  merkleTree: MerkleTree;
}

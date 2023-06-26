import { AutoMap } from '@automapper/classes';

export class MerkleTreeDto {
  @AutoMap()
  id: string;

  @AutoMap()
  hashAlgName: string;

  @AutoMap()
  tree: string;
}

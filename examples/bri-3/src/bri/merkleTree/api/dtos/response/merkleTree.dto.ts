import { AutoMap } from '@automapper/classes';

export class MerkleTreeDto {
  @AutoMap()
  id: string;

  @AutoMap()
  hashAlgName: string;

  @AutoMap()
  tree: string;

  constructor(id: string, hashAlgName: string, tree: string) {
    this.id = id;
    this.hashAlgName = hashAlgName;
    this.tree = tree;
  }
}

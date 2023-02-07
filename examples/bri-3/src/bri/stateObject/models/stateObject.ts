import { AutoMap } from '@automapper/classes';

export class StateObject {
  @AutoMap()
  id: string; // TODO: Add uuid after #491

  @AutoMap()
  proof: string;

  @AutoMap()
  document: string;

  @AutoMap()
  proverSystem: string;

  @AutoMap()
  storage: string;

  constructor(
    id: string,
    proof: string,
    document: string,
    proverSystem: string,
    storage: string,
  ) {
    this.id = id;
    this.proof = proof;
    this.document = document;
    this.proverSystem = proverSystem;
    this.storage = storage;
  }
}

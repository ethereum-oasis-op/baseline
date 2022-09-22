export class BpiAccount {
  private id: string; // TODO: Add uuid after #491
  private nonce: string;
  private ownerBpiSubjectIds: string[];

  constructor(id: string, nonce: string, ownerBpiSubjectIds: string[]) {
    this.id = id;
    this.nonce = nonce;
    this.ownerBpiSubjectIds = ownerBpiSubjectIds;
  }
}

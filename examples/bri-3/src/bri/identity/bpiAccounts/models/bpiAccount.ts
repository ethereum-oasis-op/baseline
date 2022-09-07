export class BpiAccount {
    id: string; // TODO: Add uuid after #491
    nonce: string;
    ownerBpiSubjectIds: string[];

  constructor(id: string, nonce: string, ownerBpiSubjectIds: string[]) {
    this.id = id
    this.nonce = nonce
    this.ownerBpiSubjectIds = ownerBpiSubjectIds
  }   
}

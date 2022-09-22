import { BpiSubject } from '../../../identity/bpiSubjects/models/bpiSubject';

export class Invitation {
  private id: string; // TODO: Add uuid after #491
  private name: string;
  private sender: BpiSubject;
  private recipient: string;
  private workgroupId: string;

  constructor(
    id: string,
    name: string,
    sender: BpiSubject,
    recipient: string,
    workgroupId: string,
  ) {
    this.id = id;
    this.name = name;
    this.sender = sender;
    this.recipient = recipient;
    this.workgroupId = workgroupId;
  }
}

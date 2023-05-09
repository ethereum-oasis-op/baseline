import { AutoMap } from '@automapper/classes';
import { BpiSubject } from '../../identity/bpiSubjects/models/bpiSubject';
import { BpiMessageType } from './bpiMessageType.enum';

export class BpiMessage {
  @AutoMap()
  id: string;

  @AutoMap()
  fromBpiSubject: BpiSubject;

  @AutoMap()
  fromBpiSubjectId: string;

  @AutoMap()
  toBpiSubject: BpiSubject;

  @AutoMap()
  toBpiSubjectId: string;

  @AutoMap()
  content: string;

  @AutoMap()
  signature: string;

  @AutoMap()
  type: BpiMessageType;

  constructor(
    id: string,
    from: BpiSubject,
    to: BpiSubject,
    content: string,
    signature: string,
    type: BpiMessageType,
  ) {
    this.id = id;
    this.fromBpiSubject = from;
    this.toBpiSubject = to;
    this.content = content;
    this.signature = signature;
    this.type = type;
  }

  public updateContent(newContent: string): void {
    this.content = newContent;
  }

  public updateSignature(newSignature: string): void {
    this.signature = newSignature;
  }

  public isInfoMessage(): boolean {
    return this.type === BpiMessageType.Info;
  }

  public isTransactionMessage(): boolean {
    return this.type === BpiMessageType.Transaction;
  }
}

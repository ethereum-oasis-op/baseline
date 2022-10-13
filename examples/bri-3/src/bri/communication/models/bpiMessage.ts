import { BpiSubject } from 'src/bri/identity/bpiSubjects/models/bpiSubject';
import { BpiMessageType } from './bpiMessageType.enum';

export class BpiMessage {
  private _id: string;
  private _from: BpiSubject;
  private _to: BpiSubject;
  private _content: string;
  private _signature: string;
  private _type: BpiMessageType;

  constructor(
    id: string,
    from: BpiSubject,
    to: BpiSubject,
    content: string,
    signature: string,
    type: BpiMessageType,
  ) {
    this._id = id;
    this._from = from;
    this._to = to;
    this._content = content;
    this._signature = signature;
    this._type = type;
  }

  public get id(): string {
    return this._id;
  }

  public get from(): BpiSubject {
    return this._from;
  }

  public get to(): BpiSubject {
    return this._to;
  }

  public get content(): string {
    return this._content;
  }

  public get signature(): string {
    return this._signature;
  }

  public get type(): BpiMessageType {
    return this._type;
  }
}

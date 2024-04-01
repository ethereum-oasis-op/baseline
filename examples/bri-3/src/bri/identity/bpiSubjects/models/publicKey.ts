import { AutoMap } from '@automapper/classes';
import { BpiSubject } from './bpiSubject';

export enum PublicKeyType {
  ECDSA = 'ECDSA',
  EDDSA = 'EDDSA',
}
export class PublicKey {
  @AutoMap()
  id: string;

  @AutoMap()
  type: PublicKeyType;

  @AutoMap()
  value: string;

  @AutoMap()
  bpiSubjectId?: string;

  @AutoMap()
  bpiSubject?: BpiSubject;

  constructor(
    id: string,
    type: PublicKeyType,
    value: string,
    bpiSubjectId: string,
  ) {
    this.id = id;
    this.type = type;
    this.value = value;
    this.bpiSubjectId = bpiSubjectId;
  }

  public updateType(newType: PublicKeyType): void {
    this.type = newType;
  }

  public updateValue(newValue: string): void {
    this.value = newValue;
  }

  public updateBpiSubjectId(newBpiSubjectId: string): void {
    this.bpiSubjectId = newBpiSubjectId;
  }
}

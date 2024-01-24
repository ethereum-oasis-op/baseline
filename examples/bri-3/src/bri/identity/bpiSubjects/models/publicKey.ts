import { AutoMap } from '@automapper/classes';
import { BpiSubject } from './bpiSubject';

export class PublicKey {
  @AutoMap()
  id: string;

  @AutoMap()
  type: string;

  @AutoMap()
  value: string;

  @AutoMap()
  bpiSubjectId: string;

  @AutoMap()
  bpiSubject: BpiSubject;

  constructor(id: string, type: string, value: string, bpiSubjectId: string) {
    this.id = id;
    this.type = type;
    this.value = value;
    this.bpiSubjectId = bpiSubjectId;
  }

  public updateType(newType: string): void {
    this.type = newType;
  }

  public updateValue(newValue: string): void {
    this.value = newValue;
  }

  public updateBpiSubjectId(newBpiSubjectId: string): void {
    this.bpiSubjectId = newBpiSubjectId;
  }
}

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

  constructor(id: string, type: string, value: string, bpiSubject: BpiSubject) {
    this.id = id;
    this.type = type;
    this.value = value;
    this.bpiSubject = bpiSubject;
  }

  public updateType(newType: string): void {
    this.type = newType;
  }

  public updateValue(newValue: string): void {
    this.value = newValue;
  }

  public updateBpiSubject(newBpiSubject: BpiSubject): void {
    this.bpiSubject = newBpiSubject;
  }
}

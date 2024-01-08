import { AutoMap } from '@automapper/classes';

export enum BpiSubjectRoleName {
  INTERNAL_BPI_SUBJECT = 'INTERNAL_BPI_SUBJECT',
  EXTERNAL_BPI_SUBJECT = 'EXTERNAL_BPI_SUBJECT',
}

export class BpiSubjectRole {
  @AutoMap()
  id: string; // TODO: Add uuid after #491

  @AutoMap()
  name: BpiSubjectRoleName;

  @AutoMap()
  description: string;

  constructor(id: string, name: BpiSubjectRoleName, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

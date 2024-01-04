import { AutoMap } from '@automapper/classes';
import { IDomainObject } from '../../../../shared/domainObject.interface.js'

export enum BpiSubjectRoleName {
  INTERNAL_BPI_SUBJECT = 'INTERNAL_BPI_SUBJECT',
  EXTERNAL_BPI_SUBJECT = 'EXTERNAL_BPI_SUBJECT',
}

export class BpiSubjectRole implements IDomainObject {
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

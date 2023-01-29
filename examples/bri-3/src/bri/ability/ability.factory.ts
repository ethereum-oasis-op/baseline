import { PureAbility, InferSubjects, AbilityBuilder } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { BpiSubject } from '../identity/bpiSubjects/models/bpiSubject';
import { BpiSubjectType } from '../identity/bpiSubjects/models/bpiSubjectType.enum';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = InferSubjects<typeof BpiSubject | 'all'>;
export type AppAbility = PureAbility<[Action, Subjects]>;
@Injectable()
export class AbilityFactory {
  defineAbility(bpiSubject: BpiSubject) {
    const builder = new AbilityBuilder(PureAbility);
  }
}

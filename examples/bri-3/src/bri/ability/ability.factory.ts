import {
  Ability,
  ForcedSubject,
  AbilityClass,
  AbilityBuilder,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { BpiSubject } from '../identity/bpiSubjects/models/bpiSubject';
import { BpiSubjectRoleName } from '../identity/bpiSubjects/models/bpiSubjectRole';

const actions = ['manage', 'read'] as const;
const subjects = ['BpiSubject', 'all'] as const;
type AppAbilities = [
  typeof actions[number],
  (
    | typeof subjects[number]
    | ForcedSubject<Exclude<typeof subjects[number], 'all'>>
  ),
];
export type AppAbility = Ability<AppAbilities>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

type DefinePermissions = (
  user: BpiSubject,
  builder: AbilityBuilder<AppAbility>,
) => void;

const rolePermissions: Record<BpiSubjectRoleName, DefinePermissions> = {
  [BpiSubjectRoleName.EXTERNAL_BPI_SUBJECT](bpiSubject, { can }) {
    can('read', 'BpiSubject');
  },
  [BpiSubjectRoleName.INTERNAL_BPI_SUBJECT](bpiSubject, { can }) {
    can('manage', 'all');
  },
};

@Injectable()
export class AbilityFactory {
  defineAbilityFor(bpiSubject: BpiSubject): AppAbility {
    const builder = new AbilityBuilder(Ability as AbilityClass<AppAbility>);
    // this is just for start, once there are more roles, this should be modified a bit
    const role = bpiSubject.roles[0]?.name;
    if (typeof rolePermissions[role] === 'function') {
      rolePermissions[role](bpiSubject, builder);
    } else {
      throw new Error(`Trying to use unknown role "${role}"`);
    }
    return builder.build();
  }
}

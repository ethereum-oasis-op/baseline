import {
  Ability,
  ForcedSubject,
  AbilityClass,
  AbilityBuilder,
} from '@casl/ability';
import {
  BpiSubject,
  BpiSubjectRoleName,
} from '../identity/bpiSubjects/models/bpiSubject';

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
type Roles = 'internal' | 'external';

const rolePermissions: Record<Roles, DefinePermissions> = {
  external(bpiSubject, { can }) {
    can('read', 'BpiSubject');
  },
  internal(bpiSubject, { can }) {
    can('manage', 'all');
  },
};

export function defineAbilityFor(bpiSubject: BpiSubject): AppAbility {
  const builder = new AbilityBuilder(Ability as AbilityClass<AppAbility>);

  const role = bpiSubject.roles.find(
    (r) => r.name === BpiSubjectRoleName.INTERNAL_BPI_SUBJECT,
  )
    ? 'internal'
    : 'external';
  if (typeof rolePermissions[role] === 'function') {
    rolePermissions[role](bpiSubject, builder);
  } else {
    throw new Error(`Trying to use unknown role "${role}"`);
  }

  return builder.build();
}

import { faker } from '@faker-js/faker';
// DTO validation messages
export const SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE = 'should not be empty';
export const SHOULD_BE_OF_TYPE_NUMBER =
  'must be a number conforming to the specified constraints';

export const TOKEN_NOT_FOUND = 'access token not found';

// spec hardcoded values
export const TEST_VALUES = {
  id: faker.random.numeric(6),
  ownerId: faker.random.numeric(6),
  creatorId: faker.random.numeric(6),
  name: faker.name.fullName(),
  ownerName: faker.name.fullName(),
  creatorName: faker.name.fullName(),
  description: faker.lorem.sentence(5),
  publicKey: faker.datatype.uuid(),
  securityPolicy: faker.datatype.uuid(),
  privacyPolicy: faker.datatype.uuid(),
  signature: faker.datatype.uuid(),
  signature2: faker.datatype.uuid(),
  content: faker.lorem.sentence(4),
  content2: faker.lorem.sentence(4),
  authenticationPoliy: faker.datatype.uuid(),
  authorizationPolicy: faker.datatype.uuid(),
  workgroupId: faker.datatype.uuid(),
  workstepId: faker.datatype.uuid(),
};

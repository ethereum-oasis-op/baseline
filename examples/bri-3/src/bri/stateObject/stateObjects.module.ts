import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { StateObjectProfile } from './stateObject.profile';

export const CommandHandlers = [
  CreateSateObjectCommaneHandler,
  UpdateStateObjectCommandHandler,
  DeleteStateObjectCommandHandler,
];
export const QueryHandlers = [GetStateObjectByIdQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [StateObjectController],
  providers: [...CommandHandlers, ...QueryHandlers, StateObjectProfile],
})
export class StateObjectModule {}

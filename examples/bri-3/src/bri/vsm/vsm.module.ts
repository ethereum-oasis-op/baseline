import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';

export const CommandHandlers = [
];

export const QueryHandlers = [
];

@Module({
  imports: [
    CqrsModule,
    ScheduleModule.forRoot()
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class VsmModule {}

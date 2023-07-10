import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExecuteVsmCycleCommand } from '../capabilites/executeVsmCycle/executeVsmCycle.command';

@Injectable()
export class VsmTasksSchedulerAgent {
  constructor(private readonly commandBus: CommandBus) {}

  // TODO: How to pass env config value here?
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    return await this.commandBus.execute(new ExecuteVsmCycleCommand());
  }
}

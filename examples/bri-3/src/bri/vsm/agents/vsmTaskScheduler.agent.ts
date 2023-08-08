import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExecuteVsmCycleCommand } from '../capabilites/executeVsmCycle/executeVsmCycle.command';

@Injectable()
export class VsmTasksSchedulerAgent {
  constructor(private readonly commandBus: CommandBus) {}

  @Cron(`*/${process.env.VSM_CYCLE_PERIOD_IN_SECS} * * * * *`)
  async handleCron() {
    return await this.commandBus.execute(new ExecuteVsmCycleCommand());
  }
}

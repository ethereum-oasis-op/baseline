import { Controller, Get } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBpiSubjectCommand } from '../capabilities/createBpiSubject/createBpiSubject.command';

@Controller("subjects")
export class SubjectController {
  constructor(private commandBus: CommandBus) {}

  @Get()
  async getTest(): Promise<boolean> {
    return await this.commandBus.execute(new CreateBpiSubjectCommand("test1", "test2"));
  }
}

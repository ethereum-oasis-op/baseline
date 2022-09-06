import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Workstep } from '../models/workstep';
import { CreateWorkstepDTO } from './dtos/request/createWorkstep.dto';

@Controller('worksteps')
export class WorkstepController {
  constructor(private commandBus: CommandBus) {}

  // TODO: DTO validation
  // TODO: Response DTOs
  // TODO: DTO -> Command mapping
  @Post()
  async CreateWorkstep(
    @Body() requestDto: CreateWorkstepDTO,
  ): Promise<Workstep> {
    return await this.commandBus.execute(
      new CreateWorkstepCommand(
        requestDto.name,
        requestDto.id,
        requestDto.workgroupId,
      ),
    );
  }
}

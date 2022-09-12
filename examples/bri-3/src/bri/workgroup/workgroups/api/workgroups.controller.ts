import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';


@Controller('workgroups')
export class WorkgroupController {
  constructor(private commandBus: CommandBus) {}

  // TODO: DTO validation
  // TODO: Response DTOs
  // TODO: DTO -> Command mapping
  @Post()
  async CreateWorkgroup(
    @Body() requestDto: CreateWorkgroupDto,
  ): Promise<Workgroup> {
    return await this.commandBus.execute(
      new CreateWorkgroupCommand(
        requestDto.name,
        requestDto.desc,
        requestDto.publicKey,
      ),
    );
  }
}

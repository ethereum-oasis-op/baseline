import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AbilityFactory } from '../../../authz/ability.factory';
import { CreateBpiSubjectCommand } from '../capabilities/createBpiSubject/createBpiSubject.command';
import { DeleteBpiSubjectCommand } from '../capabilities/deleteBpiSubject/deleteBpiSubject.command';
import { GetAllBpiSubjectsQuery } from '../capabilities/getAllBpiSubjects/getAllBpiSubjects.query';
import { GetBpiSubjectByIdQuery } from '../capabilities/getBpiSubjectById/getBpiSubjectById.query';
import { UpdateBpiSubjectCommand } from '../capabilities/updateBpiSubject/updateBpiSubject.command';
import { CreateBpiSubjectDto } from './dtos/request/createBpiSubject.dto';
import { UpdateBpiSubjectDto } from './dtos/request/updateBpiSubject.dto';
import { BpiSubjectDto } from './dtos/response/bpiSubject.dto';
import { CheckAuthz } from '../../../authz/guards/authz.decorator';
import { AuthzGuard } from 'src/bri/authz/guards/authz.guard';

@Controller('subjects')
export class SubjectController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private abilityFactory: AbilityFactory,
  ) {}

  @Get('/:id')
  async getBpiSubjectById(@Param('id') id: string): Promise<BpiSubjectDto> {
    return await this.queryBus.execute(new GetBpiSubjectByIdQuery(id));
  }

  @Get()
  async getAllBpiSubjects(): Promise<BpiSubjectDto[]> {
    return await this.queryBus.execute(new GetAllBpiSubjectsQuery());
  }

  @Post()
  @CheckAuthz({ action: 'manage', subject: 'BpiSubject' })
  @UseGuards(AuthzGuard)
  async createBpiSubject(
    @Body() requestDto: CreateBpiSubjectDto,
  ): Promise<string> {
    return await this.commandBus.execute(
      new CreateBpiSubjectCommand(
        requestDto.name,
        requestDto.desc,
        requestDto.publicKey,
      ),
    );
  }

  @Put('/:id')
  async updateBpiSubject(
    @Param('id') id: string,
    @Body() requestDto: UpdateBpiSubjectDto,
  ): Promise<void> {
    return await this.commandBus.execute(
      new UpdateBpiSubjectCommand(
        id,
        requestDto.name,
        requestDto.desc,
        requestDto.publicKey,
      ),
    );
  }

  @Delete('/:id')
  async deleteBpiSubject(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteBpiSubjectCommand(id));
  }
}

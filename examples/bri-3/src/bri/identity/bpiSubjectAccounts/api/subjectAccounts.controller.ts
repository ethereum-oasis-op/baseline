import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CheckAuthz } from '../../../authz/guards/authz.decorator';
import { CreateBpiSubjectAccountCommand } from '../capabilities/createBpiSubjectAccount/createBpiSubjectAccount.command';
import { DeleteBpiSubjectAccountCommand } from '../capabilities/deleteBpiSubjectAccount/deleteBpiSubjectAccount.command';
import { GetAllBpiSubjectAccountsQuery } from '../capabilities/getAllBpiSubjectAccounts/getAllBpiSubjectAccounts.query';
import { GetBpiSubjectAccountByIdQuery } from '../capabilities/getBpiSubjectAccountById/getBpiSubjectAccountById.query';
import { UpdateBpiSubjectAccountCommand } from '../capabilities/updateBpiSubjectAccount/updateBpiSubjectAccount.command';
import { CreateBpiSubjectAccountDto } from './dtos/request/createBpiSubjectAccount.dto';
import { BpiSubjectAccountDto } from './dtos/response/bpiSubjectAccount.dto';

@Controller('subjectAccounts')
export class SubjectAccountController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  // TODO: DTO validation
  // TODO: Response DTOs
  // TODO: DTO -> Command mapping
  @Get('/:id')
  @CheckAuthz({ action: 'read', type: 'BpiSubjectAccount' })
  async getBpiSubjectAccountById(
    @Param('id') id: string,
  ): Promise<BpiSubjectAccountDto> {
    return await this.queryBus.execute(new GetBpiSubjectAccountByIdQuery(id));
  }

  @Get()
  @CheckAuthz({ action: 'read', type: 'BpiSubjectAccount' })
  async getAllBpiSubjectAccounts(): Promise<BpiSubjectAccountDto[]> {
    return await this.queryBus.execute(new GetAllBpiSubjectAccountsQuery());
  }

  @Post()
  @CheckAuthz({ action: 'create', type: 'BpiSubjectAccount' })
  async createBpiSubjectAccount(
    @Body() requestDto: CreateBpiSubjectAccountDto,
  ): Promise<string> {
    return await this.commandBus.execute(
      new CreateBpiSubjectAccountCommand(
        requestDto.creatorBpiSubjectId,
        requestDto.ownerBpiSubjectId,
      ),
    );
  }

  @Put('/:id')
  @CheckAuthz({ action: 'update', type: 'BpiSubjectAccount' })
  async updateBpiSubjectAccount(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(
      new UpdateBpiSubjectAccountCommand(id),
    );
  }

  @Delete('/:id')
  @CheckAuthz({ action: 'delete', type: 'BpiSubjectAccount' })
  async deleteBpiSubjectAccount(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(
      new DeleteBpiSubjectAccountCommand(id),
    );
  }
}

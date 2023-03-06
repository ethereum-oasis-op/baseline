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
import { CreateBpiAccountCommand } from '../capabilities/createBpiAccount/createBpiAccount.command';
import { DeleteBpiAccountCommand } from '../capabilities/deleteBpiAccount/deleteBpiAccount.command';
import { GetAllBpiAccountsQuery } from '../capabilities/getAllBpiAccounts/getAllBpiAccounts.query';
import { GetBpiAccountByIdQuery } from '../capabilities/getBpiAccountById/getBpiAccountById.query';
import { UpdateBpiAccountCommand } from '../capabilities/updateBpiAccount/updateBpiAccount.command';
import { CreateBpiAccountDto } from './dtos/request/createBpiAccount.dto';
import { BpiAccountDto } from './dtos/response/bpiAccount.dto';

@Controller('accounts')
export class AccountController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get('/:id')
  @CheckAuthz({ action: 'read', type: 'BpiAccount' })
  async getBpiAccountById(@Param('id') id: string): Promise<BpiAccountDto> {
    return await this.queryBus.execute(new GetBpiAccountByIdQuery(id));
  }

  @Get()
  @CheckAuthz({ action: 'read', type: 'BpiAccount' })
  async getAllBpiAccounts(): Promise<BpiAccountDto[]> {
    return await this.queryBus.execute(new GetAllBpiAccountsQuery());
  }

  @Post()
  @CheckAuthz({ action: 'manage', type: 'BpiAccount' })
  async createBpiAccount(
    @Body() requestDto: CreateBpiAccountDto,
  ): Promise<string> {
    return await this.commandBus.execute(
      new CreateBpiAccountCommand(requestDto.ownerBpiSubjectAccountsIds),
    );
  }

  @Put('/:id')
  @CheckAuthz({ action: 'update', type: 'BpiAccount' })
  async updateBpiAccount(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new UpdateBpiAccountCommand(id));
  }

  @Delete('/:id')
  @CheckAuthz({ action: 'delete', type: 'BpiAccount' })
  async deleteBpiAccount(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteBpiAccountCommand(id));
  }
}

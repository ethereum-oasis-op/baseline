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
import { CreateTransactionCommand } from '../capabilities/createTransaction/createTransaction.command';
import { DeleteTransactionCommand } from '../capabilities/deleteTransaction/deleteTransaction.command';
import { GetAllTransactionsQuery } from '../capabilities/getAllTransactions/getAllTransactions.query';
import { GetTransactionByIdQuery } from '../capabilities/getTransactionById/getTransactionById.query';
import { UpdateTransactionCommand } from '../capabilities/updateTransaction/updateTransaction.command';
import { CreateTransactionDto } from './dtos/request/createTransaction.dto';
import { UpdateTransactionDto } from './dtos/request/updateTransaction.dto';
import { TransactionDto } from './dtos/response/transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get()
  async getTransactions(): Promise<TransactionDto[]> {
    return await this.queryBus.execute(new GetAllTransactionsQuery());
  }

  @Get('/:id')
  async getTransactionById(@Param('id') id: string): Promise<TransactionDto> {
    return await this.queryBus.execute(new GetTransactionByIdQuery(id));
  }

  @Post()
  async createTransaction(
    @Body() requestDto: CreateTransactionDto,
  ): Promise<string> {
    return await this.commandBus.execute(
      new CreateTransactionCommand(
        requestDto.id,
        requestDto.nonce,
        requestDto.workflowInstanceId,
        requestDto.workstepInstanceId,
        requestDto.fromSubjectAccountId,
        requestDto.toSubjectAccountId,
        requestDto.payload,
        requestDto.signature,
      ),
    );
  }

  @Put('/:id')
  async updateTransaction(
    @Param('id') id: string,
    @Body() requestDto: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    return await this.commandBus.execute(
      new UpdateTransactionCommand(
        id,
        requestDto.payload,
        requestDto.signature,
      ),
    );
  }

  @Delete('/:id')
  async deleteTransaction(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteTransactionCommand(id));
  }
}

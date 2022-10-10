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
import { UpdateTransactionCommand } from '../capabilities/updateTransaction/updateTransaction.command';
import { CreateTransactionDto } from './dtos/request/createTransaction.dto';
import { UpdateTransactionDto } from './dtos/request/updateTransaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

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
        requestDto.fromAccountId,
        requestDto.toAccountId,
        requestDto.payload,
        requestDto.signature,
      ),
    );
  }

  @Put('/:id')
  async updateTransaction(
    @Param('id') id: string,
    @Body() requestDto: UpdateTransactionDto,
  ): Promise<void> {
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

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BpiMessageDto } from '../../api/dtos/response/bpiMessage.dto';
import { BpiMessageStorageAgent } from '../../agents/bpiMessagesStorage.agent';
import { GetBpiMessageByIdQuery } from './getBpiMessageById.query';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BpiMessage } from '../../models/bpiMessage';

@QueryHandler(GetBpiMessageByIdQuery)
export class GetBpiMessageByIdQueryHandler
  implements IQueryHandler<GetBpiMessageByIdQuery>
{
  constructor(
    @InjectMapper() private mapper: Mapper,
    private readonly storageAgent: BpiMessageStorageAgent,
  ) {}

  async execute(query: GetBpiMessageByIdQuery) {
    const bpiMessage = await this.storageAgent.getBpiMessageById(query.id);
    if (!bpiMessage) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return this.mapper.map(bpiMessage, BpiMessage, BpiMessageDto);
  }
}

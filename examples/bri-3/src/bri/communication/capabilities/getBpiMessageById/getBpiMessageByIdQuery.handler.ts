import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BpiMessageDto } from '../../api/dtos/response/bpiMessage.dto';
import { BpiMessageStorageAgent } from '../../agents/bpiMessagesStorage.agent';
import { GetBpiMessageByIdQuery } from './getBpiMessageById.query';
import { getType } from 'tst-reflect';
import Mapper from '../../../utils/mapper';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';

@QueryHandler(GetBpiMessageByIdQuery)
export class GetBpiMessageByIdQueryHandler
  implements IQueryHandler<GetBpiMessageByIdQuery>
{
  constructor(
    private readonly storageAgent: BpiMessageStorageAgent,
    private readonly mapper: Mapper,
  ) {}

  async execute(query: GetBpiMessageByIdQuery) {
    const bpiMessage = await this.storageAgent.getBpiMessageById(query.id);
    if (!bpiMessage) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return this.mapper.map(
      bpiMessage,
      getType<BpiMessageDto>(),
    ) as BpiMessageDto;
  }
}

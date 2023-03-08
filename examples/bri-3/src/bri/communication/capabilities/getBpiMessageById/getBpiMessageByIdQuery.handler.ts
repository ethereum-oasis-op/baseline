import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import * as jose from 'jose';
import { EncryptionService } from '../../../../shared/encryption/encryption.service';
import { BpiMessageStorageAgent } from '../../agents/bpiMessagesStorage.agent';
import { BpiMessageDto } from '../../api/dtos/response/bpiMessage.dto';
import { NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';
import { BpiMessage } from '../../models/bpiMessage';
import { GetBpiMessageByIdQuery } from './getBpiMessageById.query';

@QueryHandler(GetBpiMessageByIdQuery)
export class GetBpiMessageByIdQueryHandler
  implements IQueryHandler<GetBpiMessageByIdQuery>
{
  constructor(
    @InjectMapper() private mapper: Mapper,
    private readonly storageAgent: BpiMessageStorageAgent,
    private readonly cryptoService: EncryptionService,
  ) {}

  async execute(query: GetBpiMessageByIdQuery) {
    const bpiMessage = await this.storageAgent.getBpiMessageById(query.id);
    if (!bpiMessage) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    var dto = this.mapper.map(bpiMessage, BpiMessage, BpiMessageDto);

    dto.content = await this.cryptoService.decrypt(dto.content);

    return dto;
  }
}

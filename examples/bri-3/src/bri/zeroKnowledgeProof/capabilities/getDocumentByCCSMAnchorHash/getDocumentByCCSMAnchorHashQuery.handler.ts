import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DocumentDto } from '../../api/dtos/response/document.dto';
import { CCSMAnchorHashLocalStorageAgent } from '../../agents/ccsmAnchorHashLocalStorage.agent';
import { GetDocumentByCCSMAnchorHashQuery } from './getDocumentByCCSMAnchorHash.query';
import { NotFoundException } from '@nestjs/common';
import { DOCUMENT_NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Document } from '../../models/document';

@QueryHandler(GetDocumentByCCSMAnchorHashQuery)
export class GetDocumentByCCSMAnchorHashQueryHandler
  implements IQueryHandler<GetDocumentByCCSMAnchorHashQuery>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly localStorageAgent: CCSMAnchorHashLocalStorageAgent,
  ) {}

  async execute(query: GetDocumentByCCSMAnchorHashQuery) {
    const document = await this.localStorageAgent.getDocumentByCCSMAnchorHash(
      query.hash,
    );

    if (!document) {
      throw new NotFoundException(DOCUMENT_NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(document, Document, DocumentDto);
  }
}

import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Document } from './models/document';
import { DocumentDto } from './api/dtos/response/document.dto';

@Injectable()
export class DocumentProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, Document, DocumentDto);
      createMap(mapper, Document, Document);
    };
  }
}

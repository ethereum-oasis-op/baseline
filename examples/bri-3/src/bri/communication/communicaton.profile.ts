import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { BpiMessage } from './models/bpiMessage';
import { BpiMessageDto } from './api/dtos/response/bpiMessage.dto';

@Injectable()
export class CommunicationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, BpiMessage, BpiMessageDto);
    };
  }
}

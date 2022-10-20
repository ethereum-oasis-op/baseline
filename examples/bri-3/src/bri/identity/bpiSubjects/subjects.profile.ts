import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, namingConventions, PascalCaseNamingConvention, SnakeCaseNamingConvention } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { BpiSubject } from './models/bpiSubject';
import { BpiSubjectDto } from './api/dtos/response/bpiSubject.dto';

@Injectable()
export class SubjectsProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {

      createMap(
        mapper,
        BpiSubject,
        BpiSubjectDto,
        forMember(
          (d) => d.publicKey,
          mapFrom((s) => s.publicKey),
        ),
      );

      createMap(
        mapper,
        BpiSubject,
        BpiSubject,
        forMember(
            (d) => d.id,
            mapFrom((s) => s.id),
          ),
          forMember(
            (d) => d.name,
            mapFrom((s) => s.name),
          ),
          forMember(
            (d) => d.description,
            mapFrom((s) => s.description),
          ),
          forMember(
            (d) => d.type,
            mapFrom((s) => s.type),
          ),
          forMember(
            (d) => d.publicKey,
            mapFrom((s) => s.publicKey),
          ),
        //namingConventions(new SnakeCaseNamingConvention())
      );
    };
  }
}

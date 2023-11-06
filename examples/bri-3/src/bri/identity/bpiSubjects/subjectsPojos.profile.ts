import { Mapper, createMap } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { PojosMetadataMap } from '@automapper/pojos';
import { Injectable } from '@nestjs/common';
import { BpiSubject as BpiSubjectPrismaModel } from '@prisma/client';
import { BpiSubject } from './models/bpiSubject';

@Injectable()
export class SubjectsPojosProfile extends AutomapperProfile {
  constructor(@InjectMapper("pojos") mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    
    PojosMetadataMap.create<BpiSubjectPrismaModel>('JustAPojoTestPrismaModel', {
      id: String,
      name: String,
      description: String,
      publicKey: String,
      loginNonce: String,
      // roles: BpiSubjectRole[], TODO: 740
    });
    
    PojosMetadataMap.create<BpiSubject>('JustAPojoTestDomainObject', {
      id: String,
      name: String,
      description: String,
      publicKey: String,
      loginNonce: String,
      // roles: BpiSubjectRole[], TODO: 740
    });

    return (mapper) => {
      createMap<BpiSubjectPrismaModel, BpiSubject>(
        mapper,
        'JustAPojoTestPrismaModel',
        'JustAPojoTestDomainObject',
      );
    };
  }
}

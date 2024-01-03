import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { PojosMetadataMap } from '@automapper/pojos';
import { Injectable } from '@nestjs/common';
import { BpiSubject as BpiSubjectPrismaModel } from '@prisma/client';
import { BpiSubjectRole as BpiSubjectRolePrismaModel } from '@prisma/client';
import { BpiSubject } from './models/bpiSubject';
import { BpiSubjectRole } from './models/bpiSubjectRole';

@Injectable()
export class SubjectsPojosProfile extends AutomapperProfile {
  constructor(@InjectMapper("pojos") mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    
    PojosMetadataMap.create<BpiSubjectRolePrismaModel>('BpiSubjectRolePrismaModel', {
      id: String,
      name: String, // TODO enum
      description: String,
    });

    PojosMetadataMap.create<BpiSubjectRole>('BpiSubjectRoleDomainObject', {
      id: String,
      name: String, // TODO enum
      description: String,
    });


    PojosMetadataMap.create<BpiSubjectPrismaModel>('BpiSubjectPrismaModel', {
      id: String,
      name: String,
      description: String,
      publicKey: String,
      loginNonce: String,
    });

    
    PojosMetadataMap.create<BpiSubject>('BpiSubjectDomainObject', {
      id: String,
      name: String,
      description: String,
      publicKey: String,
      loginNonce: String,
      roles: ['BpiSubjectRoleDomainObject'],
    });

    return (mapper) => {
      createMap<BpiSubjectPrismaModel, BpiSubject>(
        mapper,
        'BpiSubjectPrismaModel',
        'BpiSubjectDomainObject',
      );

      createMap<BpiSubjectRolePrismaModel, BpiSubjectRole>(
        mapper,
        'BpiSubjectRolePrismaModel',
        'BpiSubjectRoleDomainObject',
      );
    };
  }
}

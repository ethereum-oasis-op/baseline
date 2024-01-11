import { Injectable } from '@nestjs/common';
import {
  BpiSubject as BpiSubjectPrismaModel,
  BpiSubjectRole as BpiSubjectRolePrismaModel,
  Prisma,
} from '@prisma/client';
import { BpiSubject } from '../src/bri/identity/bpiSubjects/models/bpiSubject';
import { BpiSubjectRole } from '../src/bri/identity/bpiSubjects/models/bpiSubjectRole';

// We do mapping from prisma models to domain objects using simple Object.assign
// since automapper is not happy working with types, which is how Prisma generates database entities.
// For these mappings to work, the convention is that the domain objects have the same properties as the
// prisma models. In case there is a need to do something custom during mapping, it can be implemented
// in the appropriate method below.

interface IConstructor<T> {
  new (...args: any[]): T;
}

@Injectable()
export class PrismaMapper {
  public mapBpiSubjectPrismaModelToDomainObject(
    source: BpiSubjectPrismaModel,
  ): BpiSubject {
    const target = this.activator(BpiSubject);

    Object.assign(target, source);

    target.publicKey = {
      ecdsa: (source.publicKey as Prisma.JsonObject)['ecdsa'] as string,
      eddsa: (source.publicKey as Prisma.JsonObject)['eddsa'] as string,
    };

    return target;
  }

  public mapBpiSubjectRolePrismaModelToDomainObject(
    source: BpiSubjectRolePrismaModel,
  ): BpiSubjectRole {
    const target = this.activator(BpiSubjectRole);

    Object.assign(target, source);

    return target;
  }

  private activator<T>(type: IConstructor<T>): T {
    return new type();
  }
}

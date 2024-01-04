import { Injectable } from '@nestjs/common';
import { BpiSubject as BpiSubjectPrismaModel, BpiSubjectRole as BpiSubjectRolePrismaModel } from '@prisma/client';
import { BpiSubject } from '../src/bri/identity/bpiSubjects/models/bpiSubject';
import { BpiSubjectRole, BpiSubjectRoleName } from '../src/bri/identity/bpiSubjects/models/bpiSubjectRole';

// We do mapping from prisma models to domain objects using simple Object.assing
// since automapper is not happy working with types, which is how Prisma generates database entities.
// For these mappings to work, the convention is that the domain objects have the same properties as the
// prisma models. In case there is a need to do something custom during mapping, it can be implemented 
// in the appropriate method below. 
@Injectable()
export class PrismaMapper {
    public mapBpiSubjectPrismaModelToDomainObject(source: BpiSubjectPrismaModel): BpiSubject {
        const target: BpiSubject = new BpiSubject("", "", "", "", [])

        Object.assign(target, source);

        return target;
    }

    public mapBpiSubjectRolePrismaModelToDomainObject(source: BpiSubjectRolePrismaModel): BpiSubjectRole {
        const target: BpiSubjectRole = new BpiSubjectRole("", BpiSubjectRoleName.EXTERNAL_BPI_SUBJECT, "")

        Object.assign(target, source);

        return target;
    }
}
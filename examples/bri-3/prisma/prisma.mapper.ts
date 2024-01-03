import { Injectable } from '@nestjs/common';
import { BpiSubject as BpiSubjectPrismaModel, BpiSubjectRole as BpiSubjectRolePrismaModel } from '@prisma/client';
import { BpiSubject } from 'src/bri/identity/bpiSubjects/models/bpiSubject';
import { BpiSubjectRole } from 'src/bri/identity/bpiSubjects/models/bpiSubjectRole';

@Injectable()
export class PrismaMapper {
    public mapBpiSubjectPrismaModelToDomainObject(bspm: BpiSubjectPrismaModel): BpiSubject {
        const bsdo: BpiSubject = {} as BpiSubject;

        Object.assign(bsdo, bspm);

        return bsdo;
    }

    public mapBpiSubjectRolePrismaModelToDomainObject(bspm: BpiSubjectRolePrismaModel): BpiSubjectRole {
        const bsdo: BpiSubjectRole = {} as BpiSubjectRole;

        Object.assign(bsdo, bspm);

        return bsdo;
    }
}
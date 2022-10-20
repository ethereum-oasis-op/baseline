import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
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
            createMap(mapper, BpiSubject, BpiSubjectDto, forMember(d => d.publicKey, mapFrom(s => s.publicKey)));
        };
    }
}
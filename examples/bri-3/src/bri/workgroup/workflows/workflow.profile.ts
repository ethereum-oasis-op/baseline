import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { WorkflowDto } from './api/dtos/response/workflow.dto';
import { Workflow } from './models/workflow';

@Injectable()
export class WorkflowProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, Workflow, WorkflowDto);
      createMap(mapper, Workflow, Workflow);
    };
  }
}

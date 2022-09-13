import { BadRequestException, Injectable } from '@nestjs/common';
import { BpiSubject } from 'src/bri/identity/bpiSubjects/models/bpiSubject';
import { Workflow } from '../../workflows/models/workflow';
import { Workstep } from '../../worksteps/models/workstep';

import { uuid } from 'uuidv4';
import { Workgroup } from '../models/workgroup';
import { Security } from 'src/bri/policy/models/security';
import { Privacy } from 'src/bri/policy/models/privacy';

@Injectable()
export class WorkgroupAgent {
  // Agent methods have extremely declarative names and perform a single task
  public throwIfCreateWorkgroupInputInvalid(
    name: string,
    administrator: BpiSubject[],
    securityPolicy: Security[],
    privacyPolicy: Privacy[],
    participants: BpiSubject[],
    worksteps: Workstep[],
    workflows: Workflow[],
  ) {
    // This is just an example, these fields will be validated on the DTO validation layer
    // This validation would check internal business rules (i.e. bpiSubject must have public key in the format defined by the participants..)
    if (!name) {
      // We stop execution in case of critical errors by throwing a simple exception
      throw new BadRequestException('Name cannot be empty.');
    }
  }

  public createNewWorkgroup(
    name: string,
    administrator: BpiSubject[],
    participants: BpiSubject[],
    securityPolicy: Security[],
    privacyPolicy: Privacy[],
    worksteps: Workstep[],
    workflows: Workflow[],
  ): Workgroup {
    return new Workgroup(
      uuid(),
      name,
      administrator,
      securityPolicy,
      privacyPolicy,
      participants,
      worksteps,
      workflows,
    );
  }
}

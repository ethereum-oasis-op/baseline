import { BadRequestException, Injectable } from '@nestjs/common';
import { Privacy } from 'src/bri/policy/models/privacy';
import { Security } from 'src/bri/policy/models/security';
import { Workstep } from '../models/workstep';

import { uuid } from 'uuidv4';

@Injectable()
export class WorkstepAgent {
  // Agent methods have extremely declarative names and perform a single task
  public throwIfCreateWorkstepInputInvalid(
    name: string,
    version: string,
    status: string,
    workgroupId: string,
    securityPolicy: Security,
    privacyPolicy: Privacy,
  ) {
    // This is just an example, these fields will be validated on the DTO validation layer
    // This validation would check internal business rules (i.e. bpiSubject must have public key in the format defined by the participants..)
    if (!name) {
      // We stop execution in case of critical errors by throwing a simple exception
      throw new BadRequestException('Name cannot be empty.');
    }
  }

  public createNewWorkstep(
    name: string,
    version: string,
    status: string,
    workgroupId: string,
    securityPolicy: Security,
    privacyPolicy: Privacy,
  ): Workstep {
    return new Workstep(
      uuid(),
      name,
      version,
      status,
      workgroupId,
      securityPolicy,
      privacyPolicy,
    );
  }

  throwIfDeleteWorkstepInputInvalid(
    name: string,
    version: string,
    status: string,
    workgroupId: string,
    securityPolicy: Security,
    privacyPolicy: Privacy,
  ) {
    throw new Error('Method not implemented.');
  }

  deleteWorkstep(name: string, id: string, workgroupId: string) {
    throw new Error('Method not implemented.');
  }

  throwIfUpdateWorkstepInputInvalid(
    name: string,
    version: string,
    status: string,
    workgroupId: string,
    securityPolicy: Security,
    privacyPolicy: Privacy,
  ) {
    throw new Error('Method not implemented.');
  }

  updateWorkstep(name: string, id: string, workgroupId: string) {
    throw new Error('Method not implemented.');
  }
}

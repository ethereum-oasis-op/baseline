import { BadRequestException, Injectable } from '@nestjs/common';
import { Privacy } from 'src/bri/policy/models/privacy';
import { Security } from 'src/bri/policy/models/security';
import { Workstep } from '../models/workstep';

import { uuid } from 'uuidv4';

@Injectable()
export class WorkstepAgent {
  public throwIfCreateWorkstepInputInvalid(
    name: string,
    version: string,
    status: string,
    workgroupId: string,
  ) {
    if (!name) {
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
  ) {
    throw new Error('Method not implemented.');
  }

  deleteWorkstep(
    name: string,
    version: string,
    status: string,
    workgroupId: string,
  ) {
    throw new Error('Method not implemented.');
  }

  throwIfUpdateWorkstepInputInvalid(
    name: string,
    version: string,
    status: string,
    workgroupId: string,
  ) {
    throw new Error('Method not implemented.');
  }

  updateWorkstep(
    name: string,
    version: string,
    status: string,
    workgroupId: string,
  ) {
    throw new Error('Method not implemented.');
  }
}

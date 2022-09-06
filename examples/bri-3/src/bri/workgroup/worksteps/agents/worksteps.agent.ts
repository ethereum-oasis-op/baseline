import { BadRequestException, Injectable } from '@nestjs/common';
import { Workstep } from '../models/workstep';

@Injectable()
export class WorkstepAgent {
  // Agent methods have extremely declarative names and perform a single task
  public throwIfCreateWorkstepInputInvalid(
    name: string,
    id: string,
    workgroupId: string,
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
    id: string,
    workgroupId: string,
  ): Workstep {
    return new Workstep(name, id, workgroupId);
  }

  throwIfDeleteWorkstepInputInvalid(
    name: string,
    id: string,
    workgroupId: string,
  ) {
    throw new Error('Method not implemented.');
  }

  deleteWorkstep(name: string, id: string, workgroupId: string) {
    throw new Error('Method not implemented.');
  }

  updateWorkstep(name: string, id: string, workgroupId: string) {
    throw new Error('Method not implemented.');
  }

  throwIfUpdateWorkstepInputInvalid(
    name: string,
    id: string,
    workgroupId: string,
  ) {
    throw new Error('Method not implemented.');
  }
}

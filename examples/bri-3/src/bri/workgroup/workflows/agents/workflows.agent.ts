import { BadRequestException, Injectable } from '@nestjs/common';
import { Workstep } from '../../worksteps/models/workstep';
import { Workflow } from '../models/workflow';

@Injectable()
export class WorkflowAgent {
  // Agent methods have extremely declarative names and perform a single task
  public throwIfCreateWorkflowInputInvalid(worksteps: Workstep[]) {
    // This is just an example, these fields will be validated on the DTO validation layer
    // This validation would check internal business rules (i.e. bpiSubject must have public key in the format defined by the participants..)
    if (!worksteps.length) {
      // We stop execution in case of critical errors by throwing a simple exception
      throw new BadRequestException('Worksteps cannot be empty.');
    }
  }

  public createNewWorkflow(worksteps: Workstep[]): Workflow {
    return new Workflow(worksteps);
  }
}

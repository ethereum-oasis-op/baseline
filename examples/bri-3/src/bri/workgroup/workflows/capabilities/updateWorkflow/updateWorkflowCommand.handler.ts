import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkflowAgent } from '../../agents/workflows.agent';
import { WorkflowStorageAgent } from '../../agents/workflowsStorage.agent';
import { UpdateWorkflowCommand } from './updateWorkflow.command';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Workflow } from '../../models/workflow';
import { WorkflowDto } from '../../api/dtos/response/workflow.dto';

@CommandHandler(UpdateWorkflowCommand)
export class UpdateWorkflowCommandHandler
  implements ICommandHandler<UpdateWorkflowCommand>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private agent: WorkflowAgent,
    private storageAgent: WorkflowStorageAgent,
  ) {}

  async execute(command: UpdateWorkflowCommand) {
    const workstepsToUpdate =
      await this.agent.fetchWorkstepCandidatesForWorkflowAndThrowIfExistenceValidationFails(
        command.workstepIds,
      );

    const workflowToUpdate =
      await this.agent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.id,
      );

    this.agent.updateWorkflow(
      workflowToUpdate,
      command.name,
      workstepsToUpdate,
      command.workgroupId,
    );

    const updatedWorkflow = await this.storageAgent.updateWorkflow(
      workflowToUpdate,
    );

    return this.mapper.map(updatedWorkflow, Workflow, WorkflowDto);
  }
}

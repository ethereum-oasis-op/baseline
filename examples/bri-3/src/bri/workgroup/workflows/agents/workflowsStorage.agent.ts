import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { Workflow } from '../models/workflow';

// Storage Agents are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class WorkflowStorageAgent extends PrismaService {
  async getWorkflowById(id: string): Promise<Workflow> {
    const workflowModel = await this.workflow.findUnique({ where: { id: id } });

    if (!workflowModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return new Workflow( // TODO: Write generic mapper prismaModel -> domainObject
      workflowModel.id,
      workflowModel.name,
      workflowModel.worksteps,
      workflowModel.workgroupId,
    );
  }

  async getAllWorkflows(): Promise<Workflow[]> {
    const workflowModels = await this.workflow.findMany();
    return workflowModels.map((w) => {
      return new Workflow(w.id, w.name, w.worksteps, w.workgroupId);
    });
  }

  async createNewWorkflow(workflow: Workflow): Promise<Workflow> {
    const newWorkflowModel = await this.workflow.create({
      // TODO: Write generic mapper domainObject -> prismaModel
      data: {
        id: workflow.id,
        name: workflow.name,
        worksteps: workflow.worksteps,
        workgroupId: workflow.workgroupId,
      },
    });

    return new Workflow(
      newWorkflowModel.id,
      newWorkflowModel.name,
      newWorkflowModel.worksteps,
      newWorkflowModel.workgroupId,
    );
  }

  async updateWorkflow(workflow: Workflow): Promise<Workflow> {
    const newWorkflowModel = await this.workflow.update({
      where: { id: workflow.id },
      data: {
        name: workflow.name,
        worksteps: workflow.worksteps,
        workgroupId: workflow.workgroupId,
      },
    });

    return new Workflow(
      newWorkflowModel.id,
      newWorkflowModel.name,
      newWorkflowModel.worksteps,
      newWorkflowModel.workgroupId,
    );
  }

  async deleteWorkflow(workflow: Workflow): Promise<void> {
    await this.workflow.delete({
      where: { id: workflow.id },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaMapper } from '../../../../shared/prisma/prisma.mapper';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { WORKFLOW_NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { Workflow } from '../models/workflow';

@Injectable()
export class WorkflowStorageAgent {
  constructor(
    private mapper: PrismaMapper,
    private readonly prisma: PrismaService,
  ) {}

  async getWorkflowById(id: string): Promise<Workflow | undefined> {
    const workflowModel = await this.prisma.workflow.findUnique({
      where: { id: id },
      include: {
        worksteps: true,
        bpiAccount: true,
      },
    });

    if (!workflowModel) {
      throw new NotFoundException(WORKFLOW_NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.mapWorkflowPrismaModelToDomainObject(workflowModel);
  }

  async getAllWorkflows(): Promise<Workflow[]> {
    const workflowModels = await this.prisma.workflow.findMany({
      include: { worksteps: true },
    });
    return workflowModels.map((w) => {
      return this.mapper.mapWorkflowPrismaModelToDomainObject(w);
    });
  }

  async getWorkflowsByIds(ids: string[]): Promise<Workflow[]> {
    const workflowModels = await this.prisma.workflow.findMany({
      where: {
        id: { in: ids },
      },
      include: { worksteps: true },
    });
    return workflowModels.map((w) => {
      return this.mapper.mapWorkflowPrismaModelToDomainObject(w);
    });
  }

  async storeNewWorkflow(workflow: Workflow): Promise<Workflow> {
    const workstepIds = workflow.worksteps.map((w) => {
      return {
        id: w.id,
      };
    });

    const newWorkflowModel = await this.prisma.workflow.create({
      data: {
        id: workflow.id,
        name: workflow.name,
        worksteps: {
          connect: workstepIds,
        },
        workgroupId: workflow.workgroupId,
        bpiAccountId: workflow.bpiAccountId,
      },
      include: {
        worksteps: true,
        bpiAccount: true,
      },
    });

    return this.mapper.mapWorkflowPrismaModelToDomainObject(newWorkflowModel);
  }

  async updateWorkflow(workflow: Workflow): Promise<Workflow> {
    const workstepIds = workflow.worksteps.map((w) => {
      return {
        id: w.id,
      };
    });

    const updatedWorkflowModel = await this.prisma.workflow.update({
      where: { id: workflow.id },
      data: {
        name: workflow.name,
        worksteps: {
          set: workstepIds,
        },
        workgroupId: workflow.workgroupId,
      },
      include: {
        worksteps: true,
      },
    });

    return this.mapper.mapWorkflowPrismaModelToDomainObject(
      updatedWorkflowModel,
    );
  }

  async deleteWorkflow(workflow: Workflow): Promise<void> {
    await this.prisma.workflow.delete({
      where: { id: workflow.id },
    });
  }
}

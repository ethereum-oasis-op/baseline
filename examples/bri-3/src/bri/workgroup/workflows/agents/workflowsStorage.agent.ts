import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { Workstep } from '../../worksteps/models/workstep';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { Workflow } from '../models/workflow';

// Storage Agents are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class WorkflowStorageAgent extends PrismaService {
  async getWorkflowById(id: string): Promise<Workflow> {
    const workflowModel = await this.workflow.findUnique({
      where: { id: id },
      include: { worksteps: true },
    });

    if (!workflowModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return new Workflow( // TODO: Write generic mapper prismaModel -> domainObject
      workflowModel.id,
      workflowModel.name,
      workflowModel.worksteps.map((w) => {
        return new Workstep(
          w.id,
          w.name,
          w.version,
          w.status,
          w.workgroupId,
          w.securityPolicy,
          w.privacyPolicy,
        );
      }),
      workflowModel.workgroupId,
    );
  }

  async getAllWorkflows(): Promise<Workflow[]> {
    const workflowModels = await this.workflow.findMany({
      include: { worksteps: true },
    });
    return workflowModels.map((w) => {
      return new Workflow(
        w.id,
        w.name,
        w.worksteps.map((ws) => {
          return new Workstep(
            ws.id,
            ws.name,
            ws.version,
            ws.status,
            ws.workgroupId,
            ws.securityPolicy,
            ws.privacyPolicy,
          );
        }),
        w.workgroupId,
      );
    });
  }

  async createNewWorkflow(workflow: Workflow): Promise<Workflow> {
    const workstepsData = workflow.worksteps?.map((w) => {
      return {
        id: w.id,
        name: w.name,
        version: w.version,
        status: w.status,
        workgroupId: w.workgroupId,
        securityPolicy: w.securityPolicy,
        privacyPolicy: w.privacyPolicy,
      };
    });
    const newWorkflowModel = await this.workflow.create({
      data: {
        id: workflow.id,
        name: workflow.name,
        worksteps: {
          connect: workstepsData,
        },
        workgroupId: workflow.workgroupId,
      },
      include: {
        worksteps: true,
      },
    });

    return new Workflow(
      newWorkflowModel.id,
      newWorkflowModel.name,
      newWorkflowModel.worksteps.map((w) => {
        return new Workstep(
          w.id,
          w.name,
          w.version,
          w.version,
          w.workgroupId,
          w.securityPolicy,
          w.privacyPolicy,
        );
      }),
      newWorkflowModel.workgroupId,
    );
  }

  async updateWorkflow(workflow: Workflow): Promise<Workflow> {
    const workstepsData = workflow.worksteps?.map((w) => {
      return {
        id: w.id,
        name: w.name,
        version: w.version,
        status: w.status,
        workgroupId: w.workgroupId,
        securityPolicy: w.securityPolicy,
        privacyPolicy: w.privacyPolicy,
      };
    });

    const newWorkflowModel = await this.workflow.update({
      where: { id: workflow.id },
      data: {
        name: workflow.name,
        worksteps: {
          connect: workstepsData,
        },
        workgroupId: workflow.workgroupId,
      },
      include: {
        worksteps: true,
      },
    });

    return new Workflow(
      newWorkflowModel.id,
      newWorkflowModel.name,
      newWorkflowModel.worksteps.map((ws) => {
        return new Workstep(
          ws.id,
          ws.name,
          ws.version,
          ws.status,
          ws.workgroupId,
          ws.securityPolicy,
          ws.privacyPolicy,
        );
      }),
      newWorkflowModel.workgroupId,
    );
  }

  async deleteWorkflow(workflow: Workflow): Promise<void> {
    await this.workflow.delete({
      where: { id: workflow.id },
    });
  }
}

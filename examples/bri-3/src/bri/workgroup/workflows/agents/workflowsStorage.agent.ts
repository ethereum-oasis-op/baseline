import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaMapper } from '../../../../shared/prisma/prisma.mapper';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { Workflow } from '../models/workflow';
import MerkleTree from 'merkletreejs';

@Injectable()
export class WorkflowStorageAgent {
  constructor(
    private readonly mapper: PrismaMapper,
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
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(workflowModel, Workflow);
  }

  async getAllWorkflows(): Promise<Workflow[]> {
    const workflowModels = await this.prisma.workflow.findMany({
      include: { worksteps: true },
    });
    return workflowModels.map((w) => {
      return this.mapper.map(w, Workflow);
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
      return this.mapper.map(w, Workflow);
    });
  }

  async storeNewWorkflow(workflow: Workflow): Promise<Workflow> {
    const workstepIds = workflow.worksteps.map((w) => {
      return {
        id: w.id,
      };
    });

    const connectedOwnerBpiAccounts =
      workflow.bpiAccount.ownerBpiSubjectAccounts.map((o) => {
        return {
          id: o.id,
        };
      });

    const newBpiAccountModel = await this.prisma.bpiAccount.create({
      data: {
        nonce: workflow.bpiAccount.nonce,
        ownerBpiSubjectAccounts: {
          connect: connectedOwnerBpiAccounts,
        },
        authorizationCondition: workflow.bpiAccount.authorizationCondition,
        stateObjectProverSystem: workflow.bpiAccount.stateObjectProverSystem,
        stateTree: {
          create: {
            id: workflow.bpiAccount.stateTreeId,
            hashAlgName: workflow.bpiAccount.stateTree.hashAlgName,
            tree: MerkleTree.marshalTree(workflow.bpiAccount.stateTree.tree),
          },
        },
        historyTree: {
          create: {
            id: workflow.bpiAccount.historyTreeId,
            hashAlgName: workflow.bpiAccount.historyTree.hashAlgName,
            tree: MerkleTree.marshalTree(workflow.bpiAccount.historyTree.tree),
          },
        },
        Workflow: {
          create: [
            {
              name: workflow.name,
              worksteps: {
                connect: workstepIds,
              },
              workgroupId: workflow.workgroupId,
            },
          ],
        },
      },
      include: {
        Workflow: true,
      },
    });

    return this.mapper.map(newBpiAccountModel.Workflow[0], Workflow);
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

    return this.mapper.map(updatedWorkflowModel, Workflow);
  }

  async deleteWorkflow(workflow: Workflow): Promise<void> {
    await this.prisma.workflow.delete({
      where: { id: workflow.id },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { BpiSubject } from 'src/bri/identity/bpiSubjects/models/bpiSubject';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { Workflow } from '../../workflows/models/workflow';
import { Workstep } from '../../worksteps/models/workstep';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { Workgroup } from '../models/workgroup';

@Injectable()
export class WorkgroupStorageAgent extends PrismaService {
  async getWorkgroupById(id: string): Promise<Workgroup> {
    const workgroupModel = await this.workgroup.findUnique({
      where: { id: id },
      include: {
        worksteps: true,
        administrators: {
          include: { administrator: true },
        },
        participants: {
          include: { participant: true },
        },
        workflows: {
          include: { worksteps: true },
        },
      },
    });

    if (!workgroupModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return new Workgroup(
      workgroupModel.id,
      workgroupModel.name,
      workgroupModel.administrators.map((w) => {
        return new BpiSubject(
          w.administrator.id,
          w.administrator.name,
          w.administrator.description,
          w.administrator.type,
          w.administrator.publicKey,
        );
      }),
      workgroupModel.securityPolicy,
      workgroupModel.privacyPolicy,
      workgroupModel.participants.map((w) => {
        return new BpiSubject(
          w.participant.id,
          w.participant.name,
          w.participant.description,
          w.participant.type,
          w.participant.publicKey,
        );
      }),
      workgroupModel.worksteps.map((w) => {
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
      workgroupModel.workflows.map((w) => {
        const worksteps = w.worksteps.map((ws) => {
          return new Workstep(
            ws.id,
            ws.name,
            ws.version,
            ws.status,
            ws.workgroupId,
            ws.securityPolicy,
            ws.privacyPolicy,
          );
        });
        return new Workflow(w.id, w.name, worksteps, w.workgroupId);
      }),
    );
  }

  async createNewWorkgroup(workgroup: Workgroup): Promise<Workgroup> {
    const administratorIds = workgroup.administrator.map((a) => {
      return {
        id: a.id,
      };
    });

    const participantIds = workgroup.participants.map((p) => {
      return {
        id: p.id,
      };
    });

    const workstepIds = workgroup.worksteps.map((w) => {
      return {
        id: w.id,
      };
    });

    const workflowIds = workgroup.workflows.map((w) => {
      return {
        id: w.id,
      };
    });

    const newWorkgroupModel = await this.workgroup.create({
      data: {
        id: workgroup.id,
        name: workgroup.name,
        administrators: {
          create: [
            {
              administrator: {
                connect: administratorIds,
              },
            },
          ],
        },
        securityPolicy: workgroup.securityPolicy,
        privacyPolicy: workgroup.privacyPolicy,
        participants: {
          create: [
            {
              participant: {
                connect: participantIds,
              },
            },
          ],
        },
        worksteps: {
          connect: workstepIds,
        },
        workflows: {
          connect: workflowIds,
        },
      },
      include: {
        worksteps: true,
        administrators: {
          include: {
            administrator: true,
          },
        },
        participants: {
          include: { participant: true },
        },
        workflows: {
          include: { worksteps: true },
        },
      },
    });

    return new Workgroup(
      newWorkgroupModel.id,
      newWorkgroupModel.name,
      newWorkgroupModel.administrators.map((w) => {
        return new BpiSubject(
          w.administrator.id,
          w.administrator.name,
          w.administrator.description,
          w.administrator.type,
          w.administrator.publicKey,
        );
      }),
      newWorkgroupModel.securityPolicy,
      newWorkgroupModel.privacyPolicy,
      newWorkgroupModel.participants.map((w) => {
        return new BpiSubject(
          w.participant.id,
          w.participant.name,
          w.participant.description,
          w.participant.type,
          w.participant.publicKey,
        );
      }),
      newWorkgroupModel.worksteps.map((w) => {
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
      newWorkgroupModel.workflows.map((w) => {
        const worksteps = w.worksteps.map((ws) => {
          return new Workstep(
            ws.id,
            ws.name,
            ws.version,
            ws.status,
            ws.workgroupId,
            ws.securityPolicy,
            ws.privacyPolicy,
          );
        });
        return new Workflow(w.id, w.name, worksteps, w.workgroupId);
      }),
    );
  }

  async updateWorkgroup(workgroup: Workgroup): Promise<Workgroup> {
    const administratorIds = workgroup.administrator.map((a) => {
      return {
        id: a.id,
      };
    });

    const participantIds = workgroup.participants.map((p) => {
      return {
        id: p.id,
      };
    });

    const workstepIds = workgroup.worksteps.map((w) => {
      return {
        id: w.id,
      };
    });

    const workflowIds = workgroup.workflows.map((w) => {
      return {
        id: w.id,
      };
    });

    const updatedWorkgroupModel = await this.workgroup.update({
      where: { id: workgroup.id },
      data: {
        name: workgroup.name,
        administrators: {
          create: [
            {
              administrator: {
                set: administratorIds,
              },
            },
          ],
        },
        participants: {
          create: [
            {
              participant: {
                set: participantIds,
              },
            },
          ],
        },
        worksteps: {
          set: workstepIds,
        },
        workflows: {
          set: workflowIds,
        },
      },
      include: {
        worksteps: true,
        administrators: {
          include: { administrator: true },
        },
        participants: {
          include: { participant: true },
        },
        workflows: {
          include: { worksteps: true },
        },
      },
    });

    return new Workgroup(
      updatedWorkgroupModel.id,
      updatedWorkgroupModel.name,
      updatedWorkgroupModel.administrators.map((w) => {
        return new BpiSubject(
          w.administrator.id,
          w.administrator.name,
          w.administrator.description,
          w.administrator.type,
          w.administrator.publicKey,
        );
      }),
      updatedWorkgroupModel.securityPolicy,
      updatedWorkgroupModel.privacyPolicy,
      updatedWorkgroupModel.participants.map((w) => {
        return new BpiSubject(
          w.participant.id,
          w.participant.name,
          w.participant.description,
          w.participant.type,
          w.participant.publicKey,
        );
      }),
      updatedWorkgroupModel.worksteps.map((w) => {
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
      updatedWorkgroupModel.workflows.map((w) => {
        const worksteps = w.worksteps.map((ws) => {
          return new Workstep(
            ws.id,
            ws.name,
            ws.version,
            ws.status,
            ws.workgroupId,
            ws.securityPolicy,
            ws.privacyPolicy,
          );
        });
        return new Workflow(w.id, w.name, worksteps, w.workgroupId);
      }),
    );
  }

  async deleteWorkgroup(workgroup: Workgroup): Promise<void> {
    await this.workgroup.delete({
      where: { id: workgroup.id },
    });
  }
}

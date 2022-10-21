import { Injectable, NotFoundException } from '@nestjs/common';
import { BpiSubject } from '../../../identity/bpiSubjects/models/bpiSubject';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { Workflow } from '../../workflows/models/workflow';
import { Workstep } from '../../worksteps/models/workstep';
import { Workgroup } from '../models/workgroup';
import { WORKGROUP_NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';

@Injectable()
export class WorkgroupStorageAgent extends PrismaService {
  async getWorkgroupById(id: string): Promise<Workgroup> {
    const workgroupModel = await this.workgroup.findUnique({
      where: { id: id },
      include: {
        worksteps: true,
        administrators: true,
        participants: true,
        workflows: {
          include: { worksteps: true },
        },
      },
    });

    if (!workgroupModel) {
      throw new NotFoundException(WORKGROUP_NOT_FOUND_ERR_MESSAGE);
    }

    return new Workgroup(
      workgroupModel.id,
      workgroupModel.name,
      workgroupModel.administrators.map((w) => {
        return new BpiSubject(w.id, w.name, w.description, w.type, w.publicKey);
      }),
      workgroupModel.securityPolicy,
      workgroupModel.privacyPolicy,
      workgroupModel.participants.map((w) => {
        return new BpiSubject(w.id, w.name, w.description, w.type, w.publicKey);
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
    const administratorIds = workgroup.administrators.map((a) => {
      return {
        id: a.id,
      };
    });

    const participantIds = workgroup.participants.map((p) => {
      return {
        id: p.id,
      };
    });

    const newWorkgroupModel = await this.workgroup.create({
      data: {
        id: workgroup.id,
        name: workgroup.name,
        administrators: {
          connect: administratorIds,
        },
        securityPolicy: workgroup.securityPolicy,
        privacyPolicy: workgroup.privacyPolicy,
        participants: {
          connect: participantIds,
        },
      },
      include: {
        worksteps: true,
        administrators: true,
        participants: true,
        workflows: {
          include: { worksteps: true },
        },
      },
    });

    return new Workgroup(
      newWorkgroupModel.id,
      newWorkgroupModel.name,
      newWorkgroupModel.administrators.map((w) => {
        return new BpiSubject(w.id, w.name, w.description, w.type, w.publicKey);
      }),
      newWorkgroupModel.securityPolicy,
      newWorkgroupModel.privacyPolicy,
      newWorkgroupModel.participants.map((w) => {
        return new BpiSubject(w.id, w.name, w.description, w.type, w.publicKey);
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
    const administratorIds = workgroup.administrators.map((a) => {
      return {
        id: a.id,
      };
    });

    const participantIds = workgroup.participants.map((p) => {
      return {
        id: p.id,
      };
    });

    const updatedWorkgroupModel = await this.workgroup.update({
      where: { id: workgroup.id },
      data: {
        name: workgroup.name,
        administrators: {
          set: administratorIds,
        },
        participants: {
          set: participantIds,
        },
      },
      include: {
        worksteps: true,
        administrators: true,
        participants: true,
        workflows: {
          include: { worksteps: true },
        },
      },
    });

    return new Workgroup(
      updatedWorkgroupModel.id,
      updatedWorkgroupModel.name,
      updatedWorkgroupModel.administrators.map((w) => {
        return new BpiSubject(w.id, w.name, w.description, w.type, w.publicKey);
      }),
      updatedWorkgroupModel.securityPolicy,
      updatedWorkgroupModel.privacyPolicy,
      updatedWorkgroupModel.participants.map((w) => {
        return new BpiSubject(w.id, w.name, w.description, w.type, w.publicKey);
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

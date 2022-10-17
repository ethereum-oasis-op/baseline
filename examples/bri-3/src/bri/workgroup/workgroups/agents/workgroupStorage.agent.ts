import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { Workstep } from '../../worksteps/models/workstep';
import { Workgroup } from '../models/workgroup';

@Injectable()
export class WorkgroupStorageAgent extends PrismaService {
  async getworkgroupById(id: string): Promise<Workgroup> {
    const workgroupModel = await this.workgroup.findUnique({
      where: { id: id },
      include: { worksteps: true },
    });

    if (!workgroupModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return new Workgroup(
      workgroupModel.id,
      workgroupModel.name,
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
      workgroupModel.workgroupId,
    );
  }

  async getAllWorkgroups(): Promise<Workgroup[]> {
    const workgroupModels = await this.workgroup.findMany({
      include: { worksteps: true },
    });
    return workgroupModels.map((w) => {
      return new Workgroup(
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

  async createNewWorkgroup(workgroup: Workgroup): Promise<Workgroup> {
    const workstepIds = workgroup.worksteps.map((w) => {
      return {
        id: w.id,
      };
    });

    const newWorkgroupModel = await this.workgroup.create({
      data: {
        id: workgroup.id,
        name: workgroup.name,
        worksteps: {
          connect: workstepIds,
        },
        workgroupId: workgroup.workgroupId,
      },
      include: {
        worksteps: true,
      },
    });

    return new Workgroup(
      newWorkgroupModel.id,
      newWorkgroupModel.name,
      newWorkgroupModel.worksteps.map((w) => {
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
      newWorkgroupModel.workgroupId,
    );
  }

  async updateWorkgroup(workgroup: Workgroup): Promise<Workgroup> {
    const workstepIds = workgroup.worksteps.map((w) => {
      return {
        id: w.id,
      };
    });

    const updatedWorkgroupModel = await this.workgroup.update({
      where: { id: workgroup.id },
      data: {
        name: workgroup.name,
        worksteps: {
          set: workstepIds,
        },
        workgroupId: workgroup.workgroupId,
      },
      include: {
        worksteps: true,
      },
    });

    return new Workgroup(
      updatedWorkgroupModel.id,
      updatedWorkgroupModel.name,
      updatedWorkgroupModel.worksteps.map((ws) => {
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
      updatedWorkgroupModel.workgroupId,
    );
  }

  async deleteWorkgroup(workgroup: Workgroup): Promise<void> {
    await this.workgroup.delete({
      where: { id: workgroup.id },
    });
  }
}

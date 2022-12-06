import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { Workgroup } from '../models/workgroup';
import { WORKGROUP_NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class WorkgroupStorageAgent extends PrismaService {
  constructor(@InjectMapper() private mapper: Mapper) {
    super();
  }

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

    return this.mapper.map(workgroupModel, Workgroup, Workgroup);
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

    return this.mapper.map(newWorkgroupModel, Workgroup, Workgroup);
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

    return this.mapper.map(updatedWorkgroupModel, Workgroup, Workgroup);
  }

  async deleteWorkgroup(workgroup: Workgroup): Promise<void> {
    await this.workgroup.delete({
      where: { id: workgroup.id },
    });
  }
}

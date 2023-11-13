import { Injectable, NotFoundException } from '@nestjs/common';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { Workstep } from '../models/workstep';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { PrismaService } from '../../../../shared/prisma/prisma.service';

// Storage Agents are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class WorkstepStorageAgent {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly prisma: PrismaService,
  ) {}

  async getWorkstepById(id: string): Promise<Workstep | undefined> {
    const workstepModel = await this.prisma.workstep.findUnique({
      where: { id },
    });

    if (!workstepModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(workstepModel, Workstep, Workstep);
  }

  async getAllWorksteps(): Promise<Workstep[]> {
    const workstepModels = await this.prisma.workstep.findMany();
    return workstepModels.map((workstepModel) => {
      return this.mapper.map(workstepModel, Workstep, Workstep);
    });
  }

  async getMatchingWorkstepsById(ids: string[]): Promise<Workstep[]> {
    const workstepModels = await this.prisma.workstep.findMany({
      where: {
        id: { in: ids },
      },
    });
    return workstepModels.map((w) => {
      return this.mapper.map(w, Workstep, Workstep);
    });
  }

  async storeNewWorkstep(workstep: Workstep): Promise<Workstep> {
    const newWorkstepModel = await this.prisma.workstep.create({
      data: workstep,
    });
    return this.mapper.map(newWorkstepModel, Workstep, Workstep);
  }

  async updateWorkstep(workstep: Workstep): Promise<Workstep> {
    const updatedWorkstepModel = await this.prisma.workstep.update({
      where: { id: workstep.id },
      data: workstep,
    });
    return this.mapper.map(updatedWorkstepModel, Workstep, Workstep);
  }

  async deleteWorkstep(workstep: Workstep): Promise<void> {
    await this.prisma.workstep.delete({
      where: { id: workstep.id },
    });
  }
}

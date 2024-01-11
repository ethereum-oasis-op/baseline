import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaMapper } from '../../../../shared/prisma/prisma.mapper';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { Workstep } from '../models/workstep';

// Storage Agents are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class WorkstepStorageAgent {
  constructor(
    private readonly mapper: PrismaMapper,
    private readonly prisma: PrismaService,
  ) {}

  async getWorkstepById(id: string): Promise<Workstep | undefined> {
    const workstepModel = await this.prisma.workstep.findUnique({
      where: { id },
    });

    if (!workstepModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.mapWorkstepPrismaModelToDomainObject(workstepModel);
  }

  async getAllWorksteps(): Promise<Workstep[]> {
    const workstepModels = await this.prisma.workstep.findMany();
    return workstepModels.map((workstepModel) => {
      return this.mapper.mapWorkstepPrismaModelToDomainObject(workstepModel);
    });
  }

  async getMatchingWorkstepsById(ids: string[]): Promise<Workstep[]> {
    const workstepModels = await this.prisma.workstep.findMany({
      where: {
        id: { in: ids },
      },
    });
    return workstepModels.map((w) => {
      return this.mapper.mapWorkstepPrismaModelToDomainObject(w);
    });
  }

  async storeNewWorkstep(workstep: Workstep): Promise<Workstep> {
    const newWorkstepModel = await this.prisma.workstep.create({
      data: workstep,
    });
    return this.mapper.mapWorkstepPrismaModelToDomainObject(newWorkstepModel);
  }

  async updateWorkstep(workstep: Workstep): Promise<Workstep> {
    const updatedWorkstepModel = await this.prisma.workstep.update({
      where: { id: workstep.id },
      data: workstep,
    });
    return this.mapper.mapWorkstepPrismaModelToDomainObject(
      updatedWorkstepModel,
    );
  }

  async deleteWorkstep(workstep: Workstep): Promise<void> {
    await this.prisma.workstep.delete({
      where: { id: workstep.id },
    });
  }
}

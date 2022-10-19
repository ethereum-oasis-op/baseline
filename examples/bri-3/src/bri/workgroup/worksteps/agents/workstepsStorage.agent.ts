import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { Workstep } from '../models/workstep';
import { getType } from 'tst-reflect';
import Mapper from '../../../utils/mapper';
import { LoggingService } from '../../../../../src/shared/logging/logging.service';

// Storage Agents are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class WorkstepStorageAgent extends PrismaService {
  constructor(private readonly mapper: Mapper, private log: LoggingService) {
    super();
  }

  async getWorkstepById(id: string): Promise<Workstep> {
    const workstepModel = await this.workstep.findUnique({ where: { id } });

    if (!workstepModel) {
      //Example error log string
      this.log.logError('Workstep for given ID not found');
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(workstepModel, getType<Workstep>()) as Workstep;
  }

  async getAllWorksteps(): Promise<Workstep[]> {
    const workstepModels = await this.workstep.findMany();
    return workstepModels.map((workstepModel) => {
      return this.mapper.map(workstepModel, getType<Workstep>()) as Workstep;
    });
  }

  async getMatchingWorkstepsById(ids: string[]): Promise<Workstep[]> {
    const workstepModels = await this.workstep.findMany({
      where: {
        id: { in: ids },
      },
    });
    return workstepModels.map((w) => {
      return new Workstep(
        w.id,
        w.name,
        w.version,
        w.status,
        w.workgroupId,
        w.securityPolicy,
        w.privacyPolicy,
      );
    });
  }

  async createNewWorkstep(workstep: Workstep): Promise<Workstep> {
    const newWorkstepModel = await this.workstep.create({
      data: this.mapper.map(workstep, getType<Workstep>()) as Workstep,
    });
    return this.mapper.map(newWorkstepModel, getType<Workstep>()) as Workstep;
  }

  async updateWorkstep(workstep: Workstep): Promise<Workstep> {
    const updatedWorkstepModel = await this.workstep.update({
      where: { id: workstep.id },
      data: this.mapper.map(workstep, getType<Workstep>(), {
        exclude: ['id'],
      }) as Workstep,
    });
    return this.mapper.map(
      updatedWorkstepModel,
      getType<Workstep>(),
    ) as Workstep;
  }

  async deleteWorkstep(workstep: Workstep): Promise<void> {
    await this.workstep.delete({
      where: { id: workstep.id },
    });
  }
}

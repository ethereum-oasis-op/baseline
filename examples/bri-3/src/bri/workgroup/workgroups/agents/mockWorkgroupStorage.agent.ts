import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { WORKGROUP_NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { Workgroup, WorkgroupStatus } from '../models/workgroup';

@Injectable()
export class MockWorkgroupStorageAgent {
  private workgroupsStore: Workgroup[] = [];

  async getWorkgroupById(id: string): Promise<Workgroup> {
    const workgroup = this.workgroupsStore.find((ws) => ws.id === id);
    if (!workgroup) {
      throw new NotFoundException(WORKGROUP_NOT_FOUND_ERR_MESSAGE);
    }
    return workgroup;
  }

  async createNewWorkgroup(workgroup: Workgroup): Promise<Workgroup> {
    const createdWg = new Workgroup(
      uuidv4(),
      workgroup.name,
      workgroup.administrators,
      workgroup.securityPolicy,
      workgroup.privacyPolicy,
      workgroup.participants,
      workgroup.worksteps,
      workgroup.workflows,
    );

    createdWg.status = WorkgroupStatus.ACTIVE;
    this.workgroupsStore.push(createdWg);
    return Promise.resolve(createdWg);
  }

  async updateWorkgroup(workgroup: Workgroup): Promise<Workgroup> {
    const wgToUpdate = this.workgroupsStore.find(
      (wg) => wg.id === workgroup.id,
    );
    Object.assign(wgToUpdate, workgroup);
    return Promise.resolve(wgToUpdate);
  }

  async deleteWorkgroup(workgroup: Workgroup): Promise<void> {
    const wgToDeleteIndex = this.workgroupsStore.findIndex(
      (wg) => wg.id === workgroup.id,
    );
    this.workgroupsStore.splice(wgToDeleteIndex, 1);
  }
}

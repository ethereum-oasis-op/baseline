import { Injectable, NotFoundException } from '@nestjs/common';
import Mapper from '../../../utils/mapper';
import { v4 } from 'uuid';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiSubject } from '../models/bpiSubject';
import { getType } from 'tst-reflect';

@Injectable()
export class MockBpiSubjectStorageAgent {

  constructor(private readonly mapper: Mapper) {
  }

  private bpiSubjectsStore: BpiSubject[] = [];

  async getBpiSubjectById(id: string): Promise<BpiSubject> {    
    const bpiSubject = this.bpiSubjectsStore.find((bp) => bp.id === id);
    if (!bpiSubject) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return this.mapper.map(bpiSubject, getType<BpiSubject>()) as BpiSubject;
  }

  async getAllBpiSubjects(): Promise<BpiSubject[]> {
    return Promise.resolve(this.bpiSubjectsStore.map(bpiSubject => this.mapper.map(bpiSubject, getType<BpiSubject>()) as BpiSubject));
  }

  async createNewBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
    const createdBp = new BpiSubject(
      v4(),
      bpiSubject.name,
      bpiSubject.description,
      bpiSubject.type,
      bpiSubject.publicKey,
    );

    this.bpiSubjectsStore.push(createdBp);
    return Promise.resolve(createdBp);
  }

  async updateBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
    const bpToUpdate = this.mapper.map(this.bpiSubjectsStore.find(
      (bp) => bp.id === bpiSubject.id,
    ), getType<BpiSubject>()) as BpiSubject

    const index = this.bpiSubjectsStore.findIndex(bp => bp.id === bpiSubject.id)

    Object.assign(bpToUpdate, bpiSubject) as BpiSubject
    this.bpiSubjectsStore[index] = bpToUpdate
    return Promise.resolve(this.bpiSubjectsStore[index]);
  }

  async deleteBpiSubject(bpiSubject: BpiSubject): Promise<void> {
    const bpToDeleteIndex = this.bpiSubjectsStore.findIndex(
      (bp) => bp.id === bpiSubject.id,
    );
    this.bpiSubjectsStore.splice(bpToDeleteIndex, 1);
  }
}

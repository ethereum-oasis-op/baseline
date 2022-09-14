import { Injectable } from '@nestjs/common'
import { uuid } from 'uuidv4';
import { BpiSubject } from '../models/bpiSubject';

@Injectable()
export class MockBpiSubjectRepository {
    private bpiSubjectsStore: BpiSubject[] = [];

    async getBpiSubjectById(id: string): Promise<BpiSubject> {
        return this.bpiSubjectsStore.find(bp => bp.id === id);
    }

    async createNewBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
        const createdBp = new BpiSubject(
            uuid(),
            bpiSubject.name, 
            bpiSubject.description, 
            bpiSubject.type, 
            bpiSubject.publicKey);
        
        this.bpiSubjectsStore.push(createdBp);

        return Promise.resolve(createdBp);
    }

    async updateBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
        const bpToUpdate = this.bpiSubjectsStore.find(bp => bp.id === bpiSubject.id);
        Object.assign(bpToUpdate, bpiSubject);
        return Promise.resolve(bpToUpdate);
    }
}
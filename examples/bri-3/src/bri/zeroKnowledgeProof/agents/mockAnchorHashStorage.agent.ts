import { Injectable, NotFoundException } from '@nestjs/common';
import { ANCHOR_HASH_NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { AnchorHash } from '../models/anchorHash';
import { State } from '../models/state';

@Injectable()
export class MockAnchorHashStorageAgent {
  private anchorHashesStore: AnchorHash[] = [];
  private statesStore: State[] = [];

  async getStateByAnchorHash(hash: string): Promise<State> {
    const anchorHash = this.anchorHashesStore.find(
      (anchorHash) => anchorHash.hash === hash,
    );
    if (!anchorHash) {
      throw new NotFoundException(ANCHOR_HASH_NOT_FOUND_ERR_MESSAGE);
    }

    const state = this.statesStore.find(
      (state) => state.id === anchorHash.stateId,
    );
    return state;
  }

  async createNewAnchorHash(anchorHash: AnchorHash): Promise<AnchorHash> {
    const createdHash = new AnchorHash(
      anchorHash.id,
      anchorHash.ownerBpiSubjectId,
      anchorHash.hash,
      anchorHash.stateId,
    );

    this.anchorHashesStore.push(createdHash);

    return Promise.resolve(createdHash);
  }

  async createNewState(text: string): Promise<State> {
    const stateId = this.statesStore.length + 1;
    const createdState = new State(stateId, text);

    this.statesStore.push(createdState);

    return Promise.resolve(createdState);
  }

  async deleteAnchorHash(anchorHash: AnchorHash): Promise<void> {
    const hashToDeleteIndex = this.anchorHashesStore.findIndex(
      (hash) => hash.id === anchorHash.id,
    );
    this.anchorHashesStore.splice(hashToDeleteIndex, 1);
  }

  async deleteState(state: State): Promise<void> {
    const stateToDeleteIndex = this.statesStore.findIndex(
      (doc) => doc.id === state.id,
    );
    this.statesStore.splice(stateToDeleteIndex, 1);
  }
}

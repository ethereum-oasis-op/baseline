import { Injectable, NotFoundException } from '@nestjs/common';
import { CCSM_ANCHOR_HASH_NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { CCSMAnchorHash } from '../models/ccsmAnchorHash';
import { Document } from '../models/document';

@Injectable()
export class MockCCSMAnchorHashLocalStorageAgent {
  private ccsmAnchorHashesStore: CCSMAnchorHash[] = [];
  private documentsStore: Document[] = [];

  async getDocumentByCCSMAnchorHash(hash: string): Promise<Document> {
    const ccsmAnchorHash = this.ccsmAnchorHashesStore.find(
      (ccsmAnchorHash) => ccsmAnchorHash.hash === hash,
    );
    if (!ccsmAnchorHash) {
      throw new NotFoundException(CCSM_ANCHOR_HASH_NOT_FOUND_ERR_MESSAGE);
    }

    const document = this.documentsStore.find(
      (document) => document.id === ccsmAnchorHash.documentId,
    );
    return document;
  }

  async createNewCCSMAnchorHash(
    ccsmAnchorHash: CCSMAnchorHash,
  ): Promise<CCSMAnchorHash> {
    const createdHash = new CCSMAnchorHash(
      ccsmAnchorHash.id,
      ccsmAnchorHash.ownerBpiSubjectId,
      ccsmAnchorHash.hash,
      ccsmAnchorHash.documentId,
    );

    this.ccsmAnchorHashesStore.push(createdHash);

    return Promise.resolve(createdHash);
  }

  async createNewDocument(text: string): Promise<Document> {
    const documentId = this.documentsStore.length + 1;
    const createdDocument = new Document(documentId, text);

    this.documentsStore.push(createdDocument);

    return Promise.resolve(createdDocument);
  }

  async deleteTransaction(ccsmAnchorHash: CCSMAnchorHash): Promise<void> {
    const hashToDeleteIndex = this.ccsmAnchorHashesStore.findIndex(
      (hash) => hash.id === ccsmAnchorHash.id,
    );
    this.ccsmAnchorHashesStore.splice(hashToDeleteIndex, 1);
  }
}

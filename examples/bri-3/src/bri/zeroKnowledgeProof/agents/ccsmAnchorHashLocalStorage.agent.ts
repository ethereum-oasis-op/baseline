import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CCSMAnchorHash } from '../models/ccsmAnchorHash';
import { Document } from '../models/document';
import { CCSM_ANCHOR_HASH_NOT_FOUND_ERR_MESSAGE } from '..//api/err.messages';

@Injectable()
export class CCSMAnchorHashLocalStorageAgent extends PrismaService {
  constructor(@InjectMapper() private mapper: Mapper) {
    super();
  }

  async getDocumentByCCSMAnchorHash(hash: string): Promise<Document> {
    const ccsmAnchorHashModel = await this.cCSMAnchorHash.findUnique({
      where: { hash },
      include: {
        ownerBpiSubject: {
          include: {
            ownedCCSMAnchorHash: true,
          },
        },
        document: {
          include: {
            contentAddressableHash: true,
          },
        },
      },
    });

    if (!ccsmAnchorHashModel) {
      throw new NotFoundException(CCSM_ANCHOR_HASH_NOT_FOUND_ERR_MESSAGE);
    }

    const documentModel = ccsmAnchorHashModel.document;
    return this.mapper.map(documentModel, Document, Document);
  }

  async createNewCCSMAnchorHash(
    ccsmAnchorHash: CCSMAnchorHash,
  ): Promise<CCSMAnchorHash> {
    const newCCSMAnchorHashModel = await this.cCSMAnchorHash.create({
      data: {
        id: ccsmAnchorHash.id,
        ownerBpiSubjectId: ccsmAnchorHash.ownerBpiSubjectId,
        hash: ccsmAnchorHash.hash,
        documentId: ccsmAnchorHash.documentId,
      },
      include: {
        ownerBpiSubject: {
          include: {
            ownedCCSMAnchorHash: true,
          },
        },
        document: {
          include: {
            contentAddressableHash: true,
          },
        },
      },
    });

    return this.mapper.map(
      newCCSMAnchorHashModel,
      CCSMAnchorHash,
      CCSMAnchorHash,
    );
  }

  async createNewDocument(text: string): Promise<Document> {
    const newDocumentModel = await this.document.create({
      data: {
        text: text,
      },
    });

    return this.mapper.map(newDocumentModel, Document, Document);
  }

  async deleteCCSMAnchorHash(CCSMAnchorHash: CCSMAnchorHash): Promise<void> {
    await this.cCSMAnchorHash.delete({
      where: { id: CCSMAnchorHash.id },
    });
  }
}

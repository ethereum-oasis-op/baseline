import { Injectable } from '@nestjs/common';
import { PrismaClient, PrismaPromise } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({ log: ['info'] });
  }

  public async executeTransaction(...operations: PrismaPromise<any>[]) {
    if (operations.length === 0) return;

    try {
      await this.$transaction(operations);
    } catch (e) {
      // TODO: Add transaction error message
      throw e;
    }
  }
}

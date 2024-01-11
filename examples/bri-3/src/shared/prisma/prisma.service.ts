import { Injectable } from '@nestjs/common';
import { PrismaClient, PrismaPromise } from '@prisma/client';

type DbOperation = () => Promise<any> | PrismaPromise<any>;

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({ log: ['info'] });
  }

  public async executeTransaction(
    ...operations: DbOperation[]
  ): Promise<any[]> {
    return await this.$transaction(async () => {
      const results: any[] = [];
      for (const operation of operations) {
        results.push(await operation());
      }
      return results;
    });
  }
}

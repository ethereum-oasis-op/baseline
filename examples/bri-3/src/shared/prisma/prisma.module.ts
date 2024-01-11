import { Module } from '@nestjs/common';
import { PrismaMapper } from './prisma.mapper';
import { PrismaService } from './prisma.service';
import { MerkleTreeService } from '../../bri/merkleTree/services/merkleTree.service';

@Module({
  providers: [PrismaService, PrismaMapper, MerkleTreeService],
  exports: [PrismaService, PrismaMapper],
})
export class PrismaModule {}

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EncryptionModule } from '../../shared/encryption/encryption.module';
import { LoggingModule } from '../../shared/logging/logging.module';
import { AuthModule } from '../auth/auth.module';
import { MerkleTreeAgent } from './agents/merkleTree.agent';
import { MerkleTreeStorageAgent } from './agents/merkleTreeStorage.agent';
import { MerkleProfile } from './merkle.profile';
import { MerkleTreeService } from './services/merkleTree.service';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [
    CqrsModule,
    AuthModule,
    LoggingModule,
    EncryptionModule,
    PrismaModule,
  ],
  providers: [
    MerkleTreeAgent,
    MerkleTreeStorageAgent,
    MerkleTreeService,
    MerkleProfile,
  ],

  exports: [MerkleTreeService, MerkleTreeAgent, MerkleTreeStorageAgent],
})
export class MerkleModule {}

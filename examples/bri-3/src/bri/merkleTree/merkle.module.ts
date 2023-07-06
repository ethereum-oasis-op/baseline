import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EncryptionModule } from '../../shared/encryption/encryption.module';
import { LoggingModule } from '../../shared/logging/logging.module';
import { AuthModule } from '../auth/auth.module';
import { MerkleTreeAgent } from './agents/merkleTree.agent';
import { MerkleTreeStorageAgent } from './agents/merkleTreeStorage.agent';
import { MerkleProfile } from './merkle.profile';
import { MerkleTreeService } from './services/merkleTree.service';

@Module({
  imports: [CqrsModule, AuthModule, LoggingModule, EncryptionModule],
  providers: [
    MerkleTreeAgent,
    MerkleTreeStorageAgent,
    MerkleTreeService,
    MerkleProfile,
  ],
})
export class MerkleModule {}

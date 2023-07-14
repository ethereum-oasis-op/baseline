import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EncryptionModule } from '../../shared/encryption/encryption.module';
import { LoggingModule } from '../../shared/logging/logging.module';
import { AuthModule } from '../auth/auth.module';
import { MerkleTreeAgent } from './agents/merkleTree.agent';
import { MerkleTreeStorageAgent } from './agents/merkleTreeStorage.agent';
import { MerkleTreeController } from './api/merkleTree.controller';
import { CreateMerkleTreeCommandHandler } from './capabilities/createMerkleTree/createMerkleTreeCommand.handler';
import { DeleteMerkleTreeCommandHandler } from './capabilities/deleteMerkleTree/deleteMerkleTreeCommand.handler';
import { GetMerkleTreeByIdQueryHandler } from './capabilities/getMerkleTreeById/getMerkleTreeByIdQuery.handler';
import { MerkleProfile } from './merkle.profile';
import { MerkleTreeService } from './services/merkleTree.service';

export const CommandHandlers = [
  CreateMerkleTreeCommandHandler,
  DeleteMerkleTreeCommandHandler,
];
export const QueryHandlers = [GetMerkleTreeByIdQueryHandler];

@Module({
  imports: [CqrsModule, AuthModule, LoggingModule, EncryptionModule],
  controllers: [MerkleTreeController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    MerkleTreeAgent,
    MerkleTreeStorageAgent,
    MerkleTreeService,
    MerkleProfile,
  ],
})
export class MerkleModule {}

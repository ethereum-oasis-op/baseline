import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProofAgent } from './agents/proof.agent';
import { ProofStorageAgent } from './agents/proofStorage.agent';
import { ProofController } from './api/proof.controller';
import { CreateProofCommandHandler } from './capabilities/createProof/createProofCommand.handler';
import { VerifyProofCommandHandler } from './capabilities/verifyProof/verifyProofCommand.handler';

export const CommandHandlers = [
  CreateProofCommandHandler,
  VerifyProofCommandHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [ProofController],
  providers: [...CommandHandlers, ProofAgent, ProofStorageAgent],
})
export class ProofModule {}

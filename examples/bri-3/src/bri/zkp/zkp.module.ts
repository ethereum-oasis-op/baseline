import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProofAgent } from './agents/proof.agent';
import { ProofStorageAgent } from './agents/proofStorage.agent';
import { ProofController } from './api/transactions.controller';
import { CreateProofCommandHandler } from './capabilities/createTransaction/createTransactionCommand.handler';
import { VerifyProofCommandHandler } from './capabilities/deleteTransaction/deleteTransactionCommand.handler';

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

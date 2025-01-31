import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggingModule } from '../../shared/logging/logging.module';
import { CircuitInputsParserService } from './services/circuit/circuitInputsParser/circuitInputParser.service';
import { SnarkjsCircuitService } from './services/circuit/snarkjs/snarkjs.service';

@Module({
  imports: [CqrsModule, LoggingModule],

  providers: [
    CircuitInputsParserService,
    {
      provide: 'ICircuitService',
      useClass: SnarkjsCircuitService,
    },
  ],
  exports: ['ICircuitService', CircuitInputsParserService],
})
export class ZeroKnowledgeProofModule {}

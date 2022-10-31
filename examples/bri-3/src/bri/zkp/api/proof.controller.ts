import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProofCommand } from '../capabilities/createProof/createProof.command';
import { VerifyProofCommand } from '../capabilities/verifyProof/verifyProof.command';
import { CreateProofDto } from './dtos/request/createProof.dto';
import { VerifyProofDto } from './dtos/request/verifyProof.dto';
import { ProofDto } from './dtos/response/proof.dto';

@Controller('proof')
export class ProofController {
  constructor(private commandBus: CommandBus) {}

  @Post('/create')
  async createProof(@Body() requestDto: CreateProofDto): Promise<ProofDto> {
    return await this.commandBus.execute(
      new CreateProofCommand(
        requestDto.ownerAccountId,
        requestDto.document,
        requestDto.signature,
      ),
    );
  }

  @Post('/verify')
  async verifyProof(@Body() requestDto: VerifyProofDto): Promise<boolean> {
    return await this.commandBus.execute(
      new VerifyProofCommand(requestDto.document, requestDto.signature),
    );
  }
}

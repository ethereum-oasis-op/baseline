import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProofCommand } from '../capabilities/createProof/createProof.command';
import { VerifyProofCommand } from '../capabilities/verifyProof/verifyProof.command';
import { CreateProofDto } from './dtos/request/createProof.dto';
import { VerifyProofDto } from './dtos/request/verifyProof.dto';

@Controller('proof')
export class ProofController {
  constructor(private commandBus: CommandBus) {}

  @Post('/create')
  async createProof(@Body() requestDto: CreateProofDto): Promise<string> {
    return await this.commandBus.execute(
      new CreateProofCommand(
        requestDto.id,
        requestDto.ownerAccountId,
        requestDto.document,
        requestDto.signature,
      ),
    );
  }

  @Post('/verify')
  async verifyProof(@Body() requestDto: VerifyProofDto): Promise<string> {
    return await this.commandBus.execute(
      new VerifyProofCommand(requestDto.document, requestDto.signature),
    );
  }
}

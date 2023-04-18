import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { VerifyAnchorHashCommand } from '../capabilities/verifyAnchorHash/verifyAnchorHash.command';
import { VerifyAnchorHashDto } from './dtos/request/verifyAnchorHash.dto';

@Controller('anchorHash')
export class AnchorHashController {
  constructor(private commandBus: CommandBus) {}

  @Post('/verify')
  async verifyAnchorHash(
    @Body() requestDto: VerifyAnchorHashDto,
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new VerifyAnchorHashCommand(requestDto.inputForProofVerification),
    );
  }
}

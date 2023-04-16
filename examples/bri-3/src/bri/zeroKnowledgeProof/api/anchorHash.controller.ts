import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateAnchorHashCommand } from '../capabilities/createAnchorHash/createAnchorHash.command';
import { VerifyAnchorHashCommand } from '../capabilities/verifyAnchorHash/verifyAnchorHash.command';
import { CreateAnchorHashDto } from './dtos/request/createAnchorHash.dto';
import { VerifyAnchorHashDto } from './dtos/request/verifyAnchorHash.dto';
import { AnchorHashDto } from './dtos/response/anchorHash.dto';

@Controller('anchorHash')
export class AnchorHashController {
  constructor(private commandBus: CommandBus) {}

  async createAnchorHash(
    @Body() requestDto: CreateAnchorHashDto,
  ): Promise<AnchorHashDto> {
    return await this.commandBus.execute(
      new CreateAnchorHashCommand(requestDto.ownerAccount, requestDto.state),
    );
  }

  @Post('/verify')
  async verifyAnchorHash(
    @Body() requestDto: VerifyAnchorHashDto,
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new VerifyAnchorHashCommand(requestDto.inputForProofVerification),
    );
  }
}

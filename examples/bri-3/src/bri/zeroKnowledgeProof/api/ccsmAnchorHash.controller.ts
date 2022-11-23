import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCcsmAnchorHashCommand } from '../capabilities/createCcsmAnchorHash/createCcsmAnchorHash.command';
import { VerifyCcsmAnchorHashCommand } from '../capabilities/verifyCcsmAnchorHash/verifyCcsmAnchorHash.command';
import { CreateCcsmAnchorHashDto } from './dtos/request/createCcsmAnchorHash.dto';
import { VerifyCcsmAnchorHashDto } from './dtos/request/verifyCcsmAnchorHash.dto';
import { CcsmAnchorHashDto } from './dtos/response/ccsmAnchorHash.dto';

@Controller('ccsmAnchorHash')
export class CcsmAnchorHashController {
  constructor(private commandBus: CommandBus) {}

  @Post('/create')
  async createCcsmAnchorHash(
    @Body() requestDto: CreateCcsmAnchorHashDto,
  ): Promise<CcsmAnchorHashDto> {
    return await this.commandBus.execute(
      new CreateCcsmAnchorHashCommand(
        requestDto.ownerAccount,
        requestDto.document,
      ),
    );
  }

  @Post('/verify')
  async verifyCcsmAnchorHash(
    @Body() requestDto: VerifyCcsmAnchorHashDto,
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new VerifyCcsmAnchorHashCommand(requestDto.inputForProofVerification),
    );
  }
}

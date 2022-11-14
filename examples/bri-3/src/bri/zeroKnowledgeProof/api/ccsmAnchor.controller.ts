import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCCSMAnchorCommand } from '../capabilities/createCCSMAnchor/createCCSMAnchor.command';
import { VerifyCCSMAnchorCommand } from '../capabilities/verifyCCSMAnchor/verifyCCSMAnchor.command';
import { CreateCCSMAnchorDto } from './dtos/request/createCCSMAnchor.dto';
import { VerifyCCSMAnchorDto } from './dtos/request/verifyCCSMAnchor.dto';
import { CCSMAnchorDto } from './dtos/response/ccsmAnchor.dto';

@Controller('ccsmAnchor')
export class CCSMAnchorController {
  constructor(private commandBus: CommandBus) {}

  @Post('/create')
  async createCCSMAnchor(
    @Body() requestDto: CreateCCSMAnchorDto,
  ): Promise<CCSMAnchorDto> {
    return await this.commandBus.execute(
      new CreateCCSMAnchorCommand(
        requestDto.ownerAccount,
        requestDto.agreementState,
        requestDto.document,
        requestDto.signature,
      ),
    );
  }

  @Post('/verify')
  async verifyCCSMAnchor(
    @Body() requestDto: VerifyCCSMAnchorDto,
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new VerifyCCSMAnchorCommand(
        requestDto.inputForProofVerification,
        requestDto.signature,
      ),
    );
  }
}

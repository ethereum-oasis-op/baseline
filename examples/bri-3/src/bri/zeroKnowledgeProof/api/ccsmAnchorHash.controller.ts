import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCCSMAnchorHashCommand } from '../capabilities/createCCSMAnchorHash/createCCSMAnchorHash.command';
import { VerifyCCSMAnchorHashCommand } from '../capabilities/verifyCCSMAnchorHash/verifyCCSMAnchorHash.command';
import { CreateCCSMAnchorHashDto } from './dtos/request/createCCSMAnchorHash.dto';
import { VerifyCCSMAnchorHashDto } from './dtos/request/verifyCCSMAnchorHash.dto';
import { CCSMAnchorHashDto } from './dtos/response/ccsmAnchorHash.dto';
import { DocumentDto } from './dtos/response/document.dto';

@Controller('ccsmAnchorHash')
export class CCSMAnchorHashController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get('document/:hash')
  async getDocumentByCCSMAnchorHash(
    @Param('hash') hash: string,
  ): Promise<DocumentDto> {
    return await this.queryBus.execute(
      new GetDocumentByCCSMAnchorHashQuery(hash),
    );
  }

  @Post('/create')
  async createCCSMAnchorHash(
    @Body() requestDto: CreateCCSMAnchorHashDto,
  ): Promise<CCSMAnchorHashDto> {
    return await this.commandBus.execute(
      new CreateCCSMAnchorHashCommand(
        requestDto.ownerAccount,
        requestDto.document,
      ),
    );
  }

  @Post('/verify')
  async verifyCCSMAnchorHash(
    @Body() requestDto: VerifyCCSMAnchorHashDto,
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new VerifyCCSMAnchorHashCommand(requestDto.inputForProofVerification),
    );
  }
}

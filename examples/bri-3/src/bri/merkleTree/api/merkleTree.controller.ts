import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateMerkleTreeCommand } from '../capabilities/createMerkleTree/createMerkleTree.command';
import { DeleteMerkleTreeCommand } from '../capabilities/deleteMerkleTree/deleteMerkleTree.command';
import { GetMerkleTreeByIdQuery } from '../capabilities/getMerkleTreeById/getMerkleTreeById.query';
import { UpdateMerkleTreeCommand } from '../capabilities/updateMerkleTree/updateMerkleTree.command';
import { CreateMerkleTreeDto } from './dtos/request/createMerkleTree.dto';
import { UpdateMerkleTreeDto } from './dtos/request/updateMerkleTree.dto';
import { MerkleTreeDto } from './dtos/response/merkleTree.dto';
import { Public } from '../../decorators/public-endpoint';

@Controller('merkle')
export class MerkleTreeController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Public()
  @Get('/:id')
  async getMerkleTreeById(@Param('id') id: string): Promise<MerkleTreeDto> {
    return await this.queryBus.execute(new GetMerkleTreeByIdQuery(id));
  }

  @Public()
  @Post()
  async createMerkleTree(
    @Body() requestDto: CreateMerkleTreeDto,
  ): Promise<string> {
    return await this.commandBus.execute(
      new CreateMerkleTreeCommand(requestDto.leaves, requestDto.hashAlgName),
    );
  }

  @Public()
  @Put('/:id')
  async updateMerkleTree(
    @Param('id') id: string,
    @Body() requestDto: UpdateMerkleTreeDto,
  ): Promise<void> {
    return await this.commandBus.execute(
      new UpdateMerkleTreeCommand(
        id,
        requestDto.leaves,
        requestDto.hashAlgName,
      ),
    );
  }

  @Public()
  @Delete('/:id')
  async deleteMerkleTree(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteMerkleTreeCommand(id));
  }
}

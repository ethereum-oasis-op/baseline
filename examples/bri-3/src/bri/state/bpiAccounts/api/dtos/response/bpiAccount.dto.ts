import { AutoMap } from '@automapper/classes';
import { MerkleTreeDto } from '../../../../../merkleTree/api/dtos/response/merkleTree.dto';
import { BpiSubjectAccountDto } from '../../../../../identity/bpiSubjectAccounts/api/dtos/response/bpiSubjectAccount.dto';

export class BpiAccountDto {
  @AutoMap()
  id: string;

  @AutoMap()
  nonce: number;

  @AutoMap(() => [BpiSubjectAccountDto])
  ownerBpiSubjectAccounts: BpiSubjectAccountDto[];

  @AutoMap()
  authorizationCondition: string;

  @AutoMap()
  stateObjectProverSystem: string;

  @AutoMap()
  stateTree: MerkleTreeDto;

  @AutoMap()
  historyTree: MerkleTreeDto;
}

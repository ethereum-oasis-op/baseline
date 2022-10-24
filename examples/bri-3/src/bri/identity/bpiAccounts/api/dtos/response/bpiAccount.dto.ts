import { AutoMap } from '@automapper/classes';
import { BpiSubjectAccountDto } from '../../../../bpiSubjectAccounts/api/dtos/response/bpiSubjectAccount.dto';

export class BpiAccountDto {

  @AutoMap()
  id: string;

  @AutoMap()
  nonce: number;

  @AutoMap(() => [BpiSubjectAccountDto])
  ownerBpiSubjectAccounts: BpiSubjectAccountDto[];
}

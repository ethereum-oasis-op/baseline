import { BpiSubjectAccountDto } from 'src/bri/identity/bpiSubjectAccounts/api/dtos/response/bpiSubjectAccount.dto';

export interface BpiAccountDto {
  id: string;
  nonce: number;
  ownerBpiSubjectAccounts: BpiSubjectAccountDto[];
}

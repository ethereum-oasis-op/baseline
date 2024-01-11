import { AutoMap } from '@automapper/classes';
import { PublicKey } from '../../../models/publicKey';

export class BpiSubjectDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  publicKey: PublicKey;
}

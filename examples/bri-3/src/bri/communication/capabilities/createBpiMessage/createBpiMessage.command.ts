import { BpiMessageType } from '../../models/bpiMessageType.enum';

export class CreateBpiMessageCommand {
  constructor(
    public readonly id: string,
    public readonly from: string,
    public readonly to: string,
    public readonly content: string,
    public readonly signature: string,
    public readonly type: BpiMessageType,
  ) {}
}

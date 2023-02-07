import { BpiMessage } from '../../models/bpiMessage';

export class ProcessInboundBpiMessageCommand {
  constructor(public readonly bpiMessage: BpiMessage) {}
}

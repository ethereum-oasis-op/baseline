import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MessagingAgent } from '../../../communication/agents/messaging.agent';
import { BpiMessage } from '../../../communication/models/bpiMessage';
import { BpiMessageType } from '../../../communication/models/bpiMessageType.enum';
import { HandleWorkstepFailuresCommand } from './handleWorkstepFailures.command';
import { TransactionStorageAgent } from '../../../transactions/agents/transactionStorage.agent';

@CommandHandler(HandleWorkstepFailuresCommand)
export class HandleWorkstepFailuresCommandHandler
  implements ICommandHandler<HandleWorkstepFailuresCommand>
{
  constructor(
    private readonly messagingAgent: MessagingAgent,
    private txStorageAgent: TransactionStorageAgent,
  ) {}

  async execute(command: HandleWorkstepFailuresCommand) {
    const errPayload = {
      errorCode: 'xxx',
      errorMessage: 'Execution fails',
    };

    const tx = await this.txStorageAgent.getTransactionById(command.id);

    if (tx != undefined) {
      const errorBpiMessage = new BpiMessage(
        tx.id,
        tx.fromBpiSubjectAccountId,
        tx.toBpiSubjectAccountId,
        JSON.stringify(errPayload),
        tx.signature,
        BpiMessageType.Err,
      );

      const initiatorChannel =
        tx.fromBpiSubjectAccount.ownerBpiSubject.publicKey;
      await this.messagingAgent.publishMessage(
        initiatorChannel,
        JSON.stringify(errorBpiMessage),
      );
      tx.updateStatusToAborted();
      this.txStorageAgent.updateTransactionStatus(tx);
    }
  }
}

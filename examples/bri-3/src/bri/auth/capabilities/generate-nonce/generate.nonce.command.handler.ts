import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { GenerateNonceCommand } from './generate.nonce.command';
import { v4 } from 'uuid';
import { AuthAgent } from '../../agent/auth.agent';
import { errorMessage } from '../../constants';

@CommandHandler(GenerateNonceCommand)
export class GenerateNonceCommandHandler
  implements ICommandHandler<GenerateNonceCommand>
{
  constructor(private readonly authAgent: AuthAgent) {}

  async execute(command: GenerateNonceCommand) {
    const bpiSubject = await this.authAgent.getBpiSubjectByPublicKey(
      command.publicKey,
    );

    if (!bpiSubject.loginNonce || bpiSubject.loginNonce === '') {
      bpiSubject.loginNonce = v4();
      await this.authAgent.updateLoginNonce(bpiSubject);
      return bpiSubject.loginNonce;
    } else {
      throw new Error(errorMessage.RELOGIN_FAILED);
    }
  }
}

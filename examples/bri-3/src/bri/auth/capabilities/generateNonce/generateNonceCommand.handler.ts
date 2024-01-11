import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { GenerateNonceCommand } from './generateNonceCommand';
import { AuthAgent } from '../../agent/auth.agent';

@CommandHandler(GenerateNonceCommand)
export class GenerateNonceCommandHandler
  implements ICommandHandler<GenerateNonceCommand>
{
  constructor(private readonly authAgent: AuthAgent) {}

  async execute(command: GenerateNonceCommand) {
    const bpiSubject = await this.authAgent.getBpiSubjectByPublicKey(
      command.ecdsaPublicKey,
    );

    await this.authAgent.updateLoginNonce(bpiSubject);
    return bpiSubject.loginNonce;
  }
}

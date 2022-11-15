import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { AuthAgent } from '../../agent/auth.agent';
import { errorMessage } from '../../constants';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(private readonly authAgent: AuthAgent) {}

  async execute(command: LoginCommand): Promise<{ access_token: string }> {
    const { message, signature, publicKey } = command;

    const bpiSubject = await this.authAgent.getBpiSubjectByPublicKey(publicKey);
    if (
      bpiSubject &&
      bpiSubject.publicKey === publicKey &&
      bpiSubject.loginNonce === message
    ) {
      if (this.authAgent.verify(message, signature, publicKey)) {
        const bpiSubject = await this.authAgent.getBpiSubjectByPublicKey(
          publicKey,
        );
        const payload = {
          username: bpiSubject.name,
          sub: bpiSubject.id,
        };
        bpiSubject.loginNonce = '';
        await this.authAgent.updateLoginNonce(bpiSubject);
        return this.authAgent.generateJwt(payload);
      }
      throw new Error(errorMessage.USER_NOT_AUTHORIZED);
    }
    throw new Error(errorMessage.USER_NOT_AUTHORIZED);
  }
}

import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { AuthAgent } from '../../agent/auth.agent';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(private readonly authAgent: AuthAgent) {}

  async execute(command: LoginCommand): Promise<{ access_token: string }> {
    const { message, signature, publicKey } = command;

    const bpiSubject = await this.authAgent.getBpiSubjectByPublicKey(
      publicKey.ecdsa,
    );

    this.authAgent.throwIfLoginNonceMismatch(bpiSubject, message);

    this.authAgent.throwIfSignatureVerificationFails(
      message,
      signature,
      publicKey.ecdsa,
    );

    return this.authAgent.generateDidJwt(bpiSubject);
  }
}

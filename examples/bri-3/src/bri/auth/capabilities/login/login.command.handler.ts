import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { AuthAgent } from '../../agent/auth.agent';
import { errorMessage, jwtConstants } from '../../constants';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(private readonly authAgent: AuthAgent) {}

  async execute(command: LoginCommand): Promise<{ access_token: string }> {
    const { message, signature, publicKey } = command;

    const bpiSubject = await this.authAgent.getBpiSubjectByPublicKey(publicKey);
    if (bpiSubject.loginNonce !== message) {
      throw new Error(errorMessage.USER_NOT_AUTHORIZED);
    }

    const verifySignature = this.authAgent.verify(
      message,
      signature,
      publicKey,
    );
    if (!verifySignature) {
      throw new Error(errorMessage.USER_NOT_AUTHORIZED);
    }

    const serviceUrl = process.env.SERVICE_URL;
    const subjectDid = `did:ethr:0x5:${publicKey}`;
    const now = Math.floor(Date.now() / 1000);
    const didJwtPayload = {
      aud: serviceUrl,
      sub: subjectDid,
      exp: `${now + Math.floor(jwtConstants.expiresIn / 1000)}`,
      nbf: `${now}`,
      iat: `${now}`,
    };

    return this.authAgent.generateDidJwt(didJwtPayload);
  }
}

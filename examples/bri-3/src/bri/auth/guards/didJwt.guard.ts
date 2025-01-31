import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JWTVerified, verifyJWT } from 'did-jwt';
import { LoggingService } from '../../../shared/logging/logging.service';
import { IS_PUBLIC_ENDPOINT_METADATA_KEY } from '../../decorators/public-endpoint';
import { BpiSubjectStorageAgent } from '../../identity/bpiSubjects/agents/bpiSubjectsStorage.agent';
import { DidService } from '../../identity/bpiSubjects/services/did.service';
import 'dotenv/config';

@Injectable()
export class DidJwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private log: LoggingService,
    private bpiSubjectStorageAgent: BpiSubjectStorageAgent,
    private didService: DidService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ENDPOINT_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }
    const request = this.getRequest<any>(context);
    try {
      const token = this.getToken(request);
      const verified = await this.verifyJwt(token);
      await this.attachBpiSubjectToCurrentRequestContext(verified, context);
      return verified.verified;
    } catch (e) {
      this.log.logError(`Jwt verification error: ${e}`);
      return false;
    }
  }

  private async attachBpiSubjectToCurrentRequestContext(
    verified: JWTVerified,
    context: ExecutionContext,
  ) {
    // TODO: store did in bpi subject and remove constant
    const didSubstrLength = 20;
    const bpiSubject =
      await this.bpiSubjectStorageAgent.getBpiSubjectByPublicKey(
        verified.payload.sub!.substring(didSubstrLength),
      );
    const req = context.switchToHttp().getRequest();
    req.bpiSubject = bpiSubject;
  }

  private async getDidResolver() {
    const provider = await this.didService.createProvider();
    const ethrDidResolver = await this.didService.getDidResolver(provider);
    return ethrDidResolver;
  }

  private async verifyJwt(jwt: string) {
    const serviceUrl = process.env.SERVICE_URL;

    const resolver = await this.getDidResolver();

    const verified = await verifyJWT(jwt, { audience: serviceUrl, resolver });

    const now = Math.floor(Date.now() / 1000);
    if (!verified.payload.exp || verified.payload.exp < now) {
      throw new Error('Token expired!');
    }
    if (!verified.payload.nbf || verified.payload.nbf > now) {
      throw new Error('Token invalid!');
    }

    return verified;
  }

  private getRequest<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }

  private getToken(request: {
    headers: Record<string, string | string[]>;
  }): string {
    const authorization = request.headers['authorization'];
    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }
    const [, token] = authorization.split(' ');
    return token;
  }
}

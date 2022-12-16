import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ENDPOINT_KEY } from 'src/bri/decorators/public-endpoint';
import { Resolver } from 'did-resolver';
import { getResolver } from 'ethr-did-resolver';
import { verifyJWT } from 'did-jwt';
import { LoggingService } from 'src/shared/logging/logging.service';
import { didResolverProviderConfig } from '../constants';

@Injectable()
export class DidJwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private log: LoggingService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ENDPOINT_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }
    const request = this.getRequest<any>(context);
    try {
      const token = this.getToken(request);
      const verified = await this.verifyJwt(token);
      return verified.verified;
    } catch (e) {
      this.log.logError(`Jwt verification error: ${e}`);
      return false;
    }
  }

  private async getDidResolver() {
    const ethrDidResolver = getResolver(didResolverProviderConfig);
    return new Resolver(ethrDidResolver);
  }

  private async verifyJwt(jwt: string) {
    const serviceUrl = process.env.SERVICE_URL;

    const resolver = await this.getDidResolver();

    const verified = await verifyJWT(jwt, { audience: serviceUrl, resolver });

    const now = Math.floor(Date.now() / 1000);
    if (verified.payload.exp < now) {
      throw new Error('Token expired!');
    }
    if (verified.payload.nbf > now) {
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
    const [_, token] = authorization.split(' ');
    return token;
  }
}

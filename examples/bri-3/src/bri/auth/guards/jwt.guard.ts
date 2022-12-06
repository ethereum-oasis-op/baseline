import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_ENDPOINT_KEY } from 'src/bri/decorators/public-endpoint';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  //ignore public endpoints for any jwt token check
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ENDPOINT_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}

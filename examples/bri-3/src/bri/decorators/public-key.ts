import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { decodeJWT } from 'did-jwt';

export const PublicKey = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const bearerToken = request.headers['authorization'];
    const token = bearerToken.split(' ')[1];
    const publicKey = decodeJWT(token).payload.sub.split(':')[3];
    return publicKey;
  },
);

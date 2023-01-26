import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { decodeJWT } from 'did-jwt';
import { TOKEN_NOT_FOUND } from '../shared/constants';

//TODO implement command using request-context - retrieve bpiSubject by publicKey
export const PublicKey = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const bearerToken = request.headers['authorization'];
    if (!bearerToken) {
      throw new NotFoundException(TOKEN_NOT_FOUND);
    }
    const token = bearerToken.split(' ')[1];
    const publicKey = decodeJWT(token).payload.sub.split(':')[3];
    return publicKey;
  },
);

import { ForbiddenError } from '@casl/ability/dist/types/ForbiddenError';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../ability.factory';
import { CHECK_AUTHZ, IRequirement } from './authz.decorator';

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirements =
      this.reflector.get<IRequirement[]>(CHECK_AUTHZ, context.getHandler()) ||
      [];

    const req = context.switchToHttp().getRequest();
    const ability = this.abilityFactory.defineAbilityFor(req.bpiSubject);

    try {
      for (const requirement of requirements) {
        ForbiddenError.from(ability).throwUnlessCan(
          requirement.action,
          requirement.subject,
        );
      }
      return true;
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }
  }
}

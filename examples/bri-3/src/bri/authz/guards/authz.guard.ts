import { ForbiddenError, subject } from '@casl/ability';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'prisma/prisma.service';
import { AuthzFactory } from '../authz.factory';
import { CHECK_AUTHZ_METADATA_KEY, IRequirement } from './authz.decorator';
import { IS_PUBLIC_ENDPOINT_METADATA_KEY } from '../../decorators/public-endpoint';

// helper map to know which relations to include in generic prisma query
const prismaTypeToQueryIncludeMap = {
  BpiSubject: {},
  Workgroup: {
    administrators: true,
  },
  Workflow: {
    workgroup: {
      include: { administrators: true },
    },
  },
  Workstep: {
    workgroup: {
      include: { administrators: true },
    },
  },
};

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authzFactory: AuthzFactory,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_ENDPOINT_METADATA_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    const requirements =
      this.reflector.get<IRequirement[]>(
        CHECK_AUTHZ_METADATA_KEY,
        context.getHandler(),
      ) || [];

    const req = context.switchToHttp().getRequest();
    const subjectToAccessId = req.params.id;
    const authz = this.authzFactory.buildAuthzFor(req.bpiSubject);

    try {
      for (const requirement of requirements) {
        // if there is subject id in request route, we get it from database and check
        // if logged in user can perform specified action on it
        // if there is no subject, we can assume that subject is 'all'
        const subjectToAccess = subjectToAccessId
          ? subject(
              requirement.type,
              await this.prisma[requirement.type].findUnique({
                where: { id: subjectToAccessId },
                include: prismaTypeToQueryIncludeMap[requirement.type],
              }),
            )
          : 'all';
        ForbiddenError.from(authz).throwUnlessCan(
          requirement.action,
          subjectToAccess,
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

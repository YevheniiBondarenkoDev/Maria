import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../../users/helpers/types';
import { VerifiedToken } from '../helpers/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  mathScope(validRoles: Roles[], userRole: Roles): boolean {
    if (!validRoles?.length) return true;
    return validRoles.includes(userRole);
  }
  canActivate(context: ExecutionContext): boolean {
    const validRoles = this.reflector.get<Roles[]>(
      'roles',
      context.getHandler(),
    );
    if (!validRoles?.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: VerifiedToken = request.user;
    return this.mathScope(validRoles, user.role);
  }
}

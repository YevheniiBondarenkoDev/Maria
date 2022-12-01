import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard } from './jwt.guard';
import { Roles } from '../../users/helpers/types';
import { ValidRoles } from './role.decorator';
import { RolesGuard } from './roles.guard';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function Auth(...roles: Roles[]) {
  return applyDecorators(
    UseGuards(JwtGuard, RolesGuard),
    ValidRoles(...roles),
    ApiBearerAuth('JWT'),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden resource' }),
  );
}

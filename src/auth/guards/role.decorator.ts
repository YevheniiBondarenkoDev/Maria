import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../users/helpers/types';
export const ValidRoles = (...roles: Roles[]) => SetMetadata('roles', roles);

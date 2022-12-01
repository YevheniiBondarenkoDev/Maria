import { Roles } from './types';
import { User } from '../user.schema';
import { Require_id } from 'mongoose';

export const RolesEnum: Roles[] = ['user', 'admin'];
type PublicUserKeysType = keyof Require_id<User>;
export const PublicUserKeys: PublicUserKeysType[] = ['_id', 'name', 'surname'];

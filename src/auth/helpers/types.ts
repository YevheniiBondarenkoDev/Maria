import { Roles } from '../../users/helpers/types';

export type TokenInfo = { userId: string; sessionToken: string };
export type VerifiedToken = { userId: string; role: Roles };
export type SuccessfulAuth = {
  accessToken: string;
  user: {
    _id: string;
    role: Roles;
  };
};

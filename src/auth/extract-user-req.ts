import { VerifiedToken } from './helpers/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (
    key: keyof VerifiedToken,
    ctx: ExecutionContext,
  ): VerifiedToken[keyof VerifiedToken] | VerifiedToken => {
    const request = ctx.switchToHttp().getRequest();
    const user: VerifiedToken = request.user;
    return key ? user?.[key] : user;
  },
);

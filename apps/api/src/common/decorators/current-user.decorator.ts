import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

/** What the access token guard attaches to the request. */
export type AuthenticatedUser = {
  userId: string;
  email: string;
};

type RequestWithUser = Request & { user?: AuthenticatedUser };

/**
 * Reads the user the guard put on the request.
 *
 * Controllers never touch `request.user` directly: that would spread knowledge
 * of the auth mechanism across every handler. They ask for @CurrentUser()
 * and receive a typed value.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      // A programming error, not a client error: a route used @CurrentUser()
      // without being behind the guard.
      throw new Error('@CurrentUser() used on a route with no access token guard');
    }

    return request.user;
  },
);

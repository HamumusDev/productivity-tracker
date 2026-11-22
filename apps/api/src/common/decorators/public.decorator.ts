import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'auth:isPublic';

/**
 * Marks a route as reachable without an access token.
 *
 * The guard is registered globally, so the DEFAULT is "authentication
 * required" and opening a route is an explicit, greppable act. The opposite
 * default — guard each route individually — means a forgotten decorator
 * silently exposes an endpoint.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

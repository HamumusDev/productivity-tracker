import { z } from 'zod';

/**
 * Everything in process.env is a string. This schema is the single place where
 * those strings are parsed into a typed object, and the only place the app is
 * allowed to be uncertain about configuration. If it fails, the process dies.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  DATABASE_URL: z.url(),

  /** Signing key for short-lived access tokens. */
  JWT_ACCESS_SECRET: z.string().min(32),
  /** Separate key for refresh tokens: compromise of one must not forge the other. */
  JWT_REFRESH_SECRET: z.string().min(32),

  /** Access token lifetime, as an ms-style duration string. */
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  /** Refresh token lifetime in days. */
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
});

export type Env = z.infer<typeof envSchema>;

export function validate(raw: Record<string, unknown>): Env {
  const result = envSchema.safeParse(raw);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment variables:\n${issues}`);
  }

  return result.data;
}

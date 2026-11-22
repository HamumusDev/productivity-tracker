import { z } from 'zod';

/**
 * A kérés testének sémája.
 *
 * A transform miatt a use case már mindig trimmelt, kisbetűs e-mailt kap:
 * a normalizálás a határon történik, egy helyen.
 *
 * A max(128) nem esztétika. Az argon2 bármilyen hosszú jelszót elhashel,
 * de 19 MB memóriával — egy több megabájtos "jelszó" így DoS eszköz lenne.
 */
export const registerSchema = z.object({
  email: z.email().transform((value) => value.trim().toLowerCase()),
  password: z.string().min(12).max(128),
});

export type RegisterInput = z.infer<typeof registerSchema>;

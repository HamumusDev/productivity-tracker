import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/**
 * One row per issued refresh token.
 *
 * We store a HASH of the token, never the token. If this table leaks, nobody
 * can authenticate with its contents — same reasoning as password storage.
 *
 * `familyId` groups every token descended from one login. Rotation issues a
 * new row in the same family and marks the old one replaced. If a token that
 * has already been replaced is presented again, the family is compromised
 * (someone replayed a stolen token) and the whole family is revoked.
 */
@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  /** SHA-256 of the raw token. Unique so a hash can never be registered twice. */
  @Column({ type: 'text', name: 'token_hash' })
  tokenHash: string;

  @Index()
  @Column({ type: 'uuid', name: 'family_id' })
  familyId: string;

  @Column({ type: 'timestamptz', name: 'expires_at' })
  expiresAt: Date;

  /** Set when the token is rotated or revoked. NULL means still usable. */
  @Column({ type: 'timestamptz', name: 'revoked_at', nullable: true })
  revokedAt: Date | null;

  /** The token that replaced this one, for audit and reuse detection. */
  @Column({ type: 'uuid', name: 'replaced_by_id', nullable: true })
  replacedById: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}

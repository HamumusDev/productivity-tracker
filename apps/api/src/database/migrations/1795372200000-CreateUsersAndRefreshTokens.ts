import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersAndRefreshTokens1795372200000 implements MigrationInterface {
  name = 'CreateUsersAndRefreshTokens1795372200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email         text NOT NULL,
        password_hash text NOT NULL,
        created_at    timestamptz NOT NULL DEFAULT now(),
        updated_at    timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX users_email_lower_uq ON users (lower(email))
    `);

    await queryRunner.query(`
      CREATE TABLE refresh_tokens (
        id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id        uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        token_hash     text NOT NULL,
        family_id      uuid NOT NULL,
        expires_at     timestamptz NOT NULL,
        revoked_at     timestamptz,
        replaced_by_id uuid REFERENCES refresh_tokens (id) ON DELETE SET NULL,
        created_at     timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX refresh_tokens_token_hash_uq ON refresh_tokens (token_hash)
    `);
    await queryRunner.query(`
      CREATE INDEX refresh_tokens_user_id_idx ON refresh_tokens (user_id)
    `);
    await queryRunner.query(`
      CREATE INDEX refresh_tokens_family_id_idx ON refresh_tokens (family_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE refresh_tokens`);
    await queryRunner.query(`DROP TABLE users`);
  }
}

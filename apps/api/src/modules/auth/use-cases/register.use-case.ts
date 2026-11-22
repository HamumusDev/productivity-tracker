import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailAlreadyRegistered } from '../../../common/errors/domain-error';
import { UserEntity } from '../../../database/entities/user.entity';
import type { RegisterInput } from '../dto/register.dto';
import { PasswordHasher } from '../services/password-hasher';

/** Postgres hibakód: unique constraint megsértése. */
const PG_UNIQUE_VIOLATION = '23505';

export type RegisteredUser = { id: string; email: string; createdAt: Date };

@Injectable()
export class RegisterUseCase {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(input: RegisterInput): Promise<RegisteredUser> {
    const passwordHash = await this.hasher.hash(input.password);

    // Nincs "nézzük meg, létezik-e már" ellenőrzés. Két egyidejű kérés
    // mindkettő azt látná, hogy nem létezik, és mindkettő beírná.
    // Beírunk, és elkapjuk a hibát: az egyediséget az adatbázis garantálja.
    try {
      const saved = await this.users.save(
        this.users.create({ email: input.email, passwordHash }),
      );

      return { id: saved.id, email: saved.email, createdAt: saved.createdAt };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new EmailAlreadyRegistered(input.email);
      }

      // Nem unique violation volt: nem nyeljük el. Egy lekapcsolt
      // adatbázisból nem lesz "ez az e-mail már foglalt".
      throw error;
    }
  }
}

function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;

  // A TypeORM becsomagolja a pg hibáját, és a kód hol az egyiken,
  // hol a másikon van.
  const candidate = error as { code?: unknown; driverError?: { code?: unknown } };

  return (
    candidate.code === PG_UNIQUE_VIOLATION ||
    candidate.driverError?.code === PG_UNIQUE_VIOLATION
  );
}

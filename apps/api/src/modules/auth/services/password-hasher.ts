import { Injectable } from '@nestjs/common';
import { hash, verify } from '@node-rs/argon2';

const HASH_OPTIONS = { memoryCost: 19456, timeCost: 2, parallelism: 1 };

@Injectable()
export class PasswordHasher {
  async hash(plaintext: string): Promise<string> {
    return hash(plaintext, HASH_OPTIONS);
  }

  async verify(storedHash: string, plaintext: string): Promise<boolean> {
    try {
      return await verify(storedHash, plaintext);
    } catch {
      return false;
    }
  }
}

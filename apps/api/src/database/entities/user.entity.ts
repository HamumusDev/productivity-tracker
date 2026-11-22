import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Stored lowercased. Uniqueness is enforced by the database, not by a lookup-then-insert. */
  @Column({ type: 'text' })
  email: string;

  /** An argon2id hash. The plaintext password never exists outside one function. */
  @Column({ type: 'text', name: 'password_hash' })
  passwordHash: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}

import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'habits' })
export class HabitEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'integer', name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ type: 'timestamptz', name: 'archived_at', nullable: true })
  archivedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}

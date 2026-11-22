import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'text' })
  name: string;

  /** Hex colour, e.g. #5B9DFF. Validated at the edge, stored as text. */
  @Column({ type: 'text' })
  color: string;

  @Column({ type: 'integer', name: 'sort_order', default: 0 })
  sortOrder: number;

  /**
   * Archive rather than delete. Historical sessions reference this category,
   * and deleting it would either orphan them or silently destroy history.
   * NULL means active.
   */
  @Column({ type: 'timestamptz', name: 'archived_at', nullable: true })
  archivedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}

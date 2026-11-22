import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/**
 * One row per habit per day it was completed.
 *
 * `localDate` is a DATE, not a timestamp, and it is the user's LOCAL calendar
 * day as the device computed it. This is the single most important modelling
 * decision in the schema: a session is an absolute instant, but "did I read
 * today" is a question about a wall calendar. Store it as UTC and a tick at
 * 23:40 lands on tomorrow and breaks the streak.
 *
 * The column type maps to a 'YYYY-MM-DD' string in JavaScript, which is
 * exactly right — there is no timezone to get wrong.
 */
@Entity({ name: 'habit_logs' })
export class HabitLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'habit_id' })
  habitId: string;

  @Column({ type: 'date', name: 'local_date' })
  localDate: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}

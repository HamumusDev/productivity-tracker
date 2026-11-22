import { CategoryEntity } from './category.entity';
import { HabitEntity } from './habit.entity';
import { HabitLogEntity } from './habit-log.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { SessionEntity } from './session.entity';
import { UserEntity } from './user.entity';

export { CategoryEntity, HabitEntity, HabitLogEntity, RefreshTokenEntity, SessionEntity, UserEntity };

export const entities = [
  UserEntity,
  RefreshTokenEntity,
  CategoryEntity,
  SessionEntity,
  HabitEntity,
  HabitLogEntity,
];

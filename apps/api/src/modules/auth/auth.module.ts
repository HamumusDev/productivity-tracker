import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { AuthController } from './auth.controller';
import { PasswordHasher } from './services/password-hasher';
import { RegisterUseCase } from './use-cases/register.use-case';

/**
 * A forFeature az, ami miatt az @InjectRepository(UserEntity) feloldható.
 * A forRoot (DatabaseModule) adta a kapcsolatot; a forFeature ebben a
 * modulban regisztrál egy Repository<UserEntity> providert.
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [PasswordHasher, RegisterUseCase],
})
export class AuthModule {}

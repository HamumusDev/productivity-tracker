import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { registerSchema, type RegisterInput } from './dto/register.dto';
import { RegisterUseCase } from './use-cases/register.use-case';

@Controller('auth')
export class AuthController {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  /**
   * Nincs try/catch. A use case hibái átmennek ezen a rétegen,
   * és az AllExceptionsFilter fordítja le HTTP válaszra.
   *
   * A @Public() most még nem csinál semmit, mert guard sincs. Amikor
   * a guard felkerül, ez az egy sor lesz a különbség a működő
   * regisztráció és egy 401 között.
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body(new ZodValidationPipe(registerSchema)) body: RegisterInput) {
    return this.registerUseCase.execute(body);
  }
}

import { type ArgumentMetadata, Injectable, type PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod';

/**
 * Validates and PARSES a request payload with a zod schema.
 *
 * The parsing half matters as much as the validating half: the value this
 * returns is the schema's output, so defaults are applied and strings are
 * coerced before anything downstream sees them. Everything past this pipe can
 * trust its input completely.
 */
@Injectable()
export class ZodValidationPipe<TSchema extends ZodType> implements PipeTransform {
  constructor(private readonly schema: TSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata): unknown {
    // Throws ZodError, which AllExceptionsFilter turns into a 400 with
    // a per-field details array.
    return this.schema.parse(value);
  }
}

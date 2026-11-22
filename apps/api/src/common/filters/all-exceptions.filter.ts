import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { DomainError, type DomainErrorKind } from '../errors/domain-error';

/**
 * Every error leaving this API has the same shape. One place decides it.
 *
 * {
 *   "error": {
 *     "code": "SESSION_ALREADY_RUNNING",
 *     "message": "A session is already running...",
 *     "details": [ ... ]        // optional
 *   },
 *   "path": "/v1/sessions/start",
 *   "timestamp": "2026-11-22T15:00:00.000Z"
 * }
 *
 * A client can switch on `error.code` forever, while `message` stays free to
 * be reworded. That distinction is the whole point of having a code.
 */
const KIND_TO_STATUS: Record<DomainErrorKind, HttpStatus> = {
  conflict: HttpStatus.CONFLICT,
  not_found: HttpStatus.NOT_FOUND,
  unauthorized: HttpStatus.UNAUTHORIZED,
  forbidden: HttpStatus.FORBIDDEN,
  invalid: HttpStatus.UNPROCESSABLE_ENTITY,
};

type ErrorBody = {
  error: { code: string; message: string; details?: unknown };
  path: string;
  timestamp: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, code, message, details } = this.describe(exception);

    // 5xx means we broke something: log the whole thing, including the stack.
    // 4xx means the caller broke something: no stack, it is not our bug.
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status} ${code}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} -> ${status} ${code}`);
    }

    const body: ErrorBody = {
      error: { code, message, ...(details === undefined ? {} : { details }) },
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(body);
  }

  private describe(exception: unknown): {
    status: number;
    code: string;
    message: string;
    details?: unknown;
  } {
    if (exception instanceof DomainError) {
      return {
        status: KIND_TO_STATUS[exception.kind],
        code: exception.code,
        message: exception.message,
        details: exception.details,
      };
    }

    if (exception instanceof ZodError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        code: 'VALIDATION_FAILED',
        message: 'Request validation failed',
        details: exception.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      };
    }

    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      return {
        status: exception.getStatus(),
        code: 'HTTP_ERROR',
        message:
          typeof payload === 'string'
            ? payload
            : ((payload as { message?: string }).message ?? exception.message),
      };
    }

    // Anything unrecognised is a bug. Never leak its message to the client:
    // it may contain a connection string, a query, or a file path.
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    };
  }
}

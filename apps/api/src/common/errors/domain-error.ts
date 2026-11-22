/**
 * Domain errors describe things that went wrong in business terms. They know
 * nothing about HTTP — no status codes, no response bodies. The exception
 * filter is the single place that translates them into an HTTP response.
 *
 * This is what keeps the application layer testable without a web framework.
 */
export type DomainErrorKind =
  | 'conflict'
  | 'not_found'
  | 'unauthorized'
  | 'forbidden'
  | 'invalid';

export class DomainError extends Error {
  constructor(
    /** Stable, machine-readable identifier. Clients may switch on this. */
    readonly code: string,
    /** Human-readable message. Safe to show a developer, not necessarily a user. */
    message: string,
    /** Category the HTTP layer maps to a status code. */
    readonly kind: DomainErrorKind,
    /** Optional structured context. Never put secrets in here. */
    readonly details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

/* Concrete errors. One per thing that can actually go wrong. */

export class EmailAlreadyRegistered extends DomainError {
  constructor(email: string) {
    super('EMAIL_ALREADY_REGISTERED', `Email ${email} is already registered`, 'conflict');
  }
}

export class InvalidCredentials extends DomainError {
  constructor() {
    // Deliberately vague: never reveal whether the email or the password was wrong.
    super('INVALID_CREDENTIALS', 'Email or password is incorrect', 'unauthorized');
  }
}

export class RefreshTokenInvalid extends DomainError {
  constructor(reason: string) {
    super('REFRESH_TOKEN_INVALID', `Refresh token rejected: ${reason}`, 'unauthorized');
  }
}

export class ResourceNotFound extends DomainError {
  constructor(resource: string, id: string) {
    super('NOT_FOUND', `${resource} ${id} was not found`, 'not_found');
  }
}

export class SessionAlreadyRunning extends DomainError {
  constructor() {
    super(
      'SESSION_ALREADY_RUNNING',
      'A session is already running. Stop it before starting another.',
      'conflict',
    );
  }
}

export class NoSessionRunning extends DomainError {
  constructor() {
    super('NO_SESSION_RUNNING', 'There is no running session to stop', 'conflict');
  }
}

export class InvalidTimeRange extends DomainError {
  constructor(message: string) {
    super('INVALID_TIME_RANGE', message, 'invalid');
  }
}

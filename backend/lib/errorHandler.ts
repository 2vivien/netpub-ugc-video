import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentification requise') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Accès non autorisé') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Ressource') {
    super(`${resource} non trouvée`, 404);
  }
}

interface PrismaError extends Error {
  code: string;
}

export function handleError(error: Error, res?: Response): void {
  if (error instanceof AppError) {
    if (res) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
    return;
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as PrismaError;
    let message = 'Erreur de base de données';

    switch (prismaError.code) {
      case 'P2002':
        message = 'Cette valeur existe déjà';
        break;
      case 'P2025':
        message = 'Enregistrement non trouvé';
        break;
      default:
        message = 'Erreur de base de données';
    }

    if (res) {
      res.status(400).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { details: prismaError })
      });
    }
    return;
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    if (res) {
      res.status(400).json({
        success: false,
        message: 'Données de validation invalides',
        errors: error.message
      });
    }
    return;
  }

  // Generic error
  if (res) {
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production'
        ? 'Une erreur interne est survenue'
        : error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
}

export const wrapAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any> | any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// GraphQL error formatter
export function formatGraphQLError(error: { message: string; stack?: string; originalError?: Error }) {
  const originalError = error.originalError;

  if (originalError instanceof AppError) {
    return {
      message: originalError.message,
      extensions: {
        code: originalError.statusCode,
        exception: {
          stacktrace: originalError.stack
        }
      }
    };
  }

  return {
    message: error.message,
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
      exception: {
        stacktrace: error.stack
      }
    }
  };
}

import csrf from 'csurf';

// Create CSRF protection middleware
export const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 3600000 // 1 hour
  }
});

// Middleware to add CSRF token to GraphQL context
export const csrfApolloMiddleware = (req: any, res: any, next: any) => {
  // Add CSRF token to request object for GraphQL resolvers
  req.csrfToken = req.csrfToken ? req.csrfToken() : null;
  next();
};

export default {
  csrfProtection,
  csrfApolloMiddleware
};
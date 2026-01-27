export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

export interface ResolverContext {
  user?: User;
  req: {
    ip: string;
    connection: {
      remoteAddress: string;
    };
  };
}

export interface AuthPayload {
  token: string;
  user: User;
}

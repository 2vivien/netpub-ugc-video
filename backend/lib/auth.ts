import { AuthUser } from './types.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma.js';
import { SecurityUtils } from './security.js';


const JWT_SECRET = process.env.JWT_SECRET;

// Validate that required environment variables are present
if (!JWT_SECRET) {
  
  
  process.exit(1);
}

export class AuthService {
  private static failedAttempts: Map<string, { count: number; lastAttempt: number; blockedUntil: number }> = new Map();

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(user: AuthUser): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET as string,
      { expiresIn: '7d' }
    );
  }

  static verifyToken(token: string): AuthUser | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET as string) as { userId: string; email: string; name: string | null; role: string };
      return {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role
      };
    } catch {
      return null;
    }
  }

  static async createAdminUser(): Promise<AuthUser | null> {
    try {
      const adminPassword = process.env.ADMIN_PASSWORD || 'NetpubAdmin2024!';
      const hashedPassword = await this.hashPassword(adminPassword);

      let adminUser = await prisma.user.findFirst({
        where: { role: 'admin' }
      });

      if (!adminUser) {
        adminUser = await prisma.user.create({
          data: {
            email: process.env.ADMIN_EMAIL || 'admin@netpub.agency',
            name: 'Admin NetPub',
            password: hashedPassword,
            role: 'admin'
          }
        });
      }
      return {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name || null,
        role: adminUser.role
      };
    } catch {
      return null;
    }
  }

  static async authenticateUser(email: string, password: string, ip: string): Promise<AuthUser | null> {
    try {
      // IP blocking logic
      const now = Date.now();
      const attempts = AuthService.failedAttempts.get(ip) || { count: 0, lastAttempt: 0, blockedUntil: 0 };

      if (attempts.blockedUntil > now) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        attempts.count++;
        attempts.lastAttempt = now;
        if (attempts.count >= 3) {
          attempts.blockedUntil = now + 24 * 60 * 60 * 1000; // Block for 24 hours
        }
        AuthService.failedAttempts.set(ip, attempts);
        return null;
      }

      const isValidPassword = await this.verifyPassword(password, user.password);
      if (!isValidPassword) {
        attempts.count++;
        attempts.lastAttempt = now;
        if (attempts.count >= 3) {
          attempts.blockedUntil = now + 24 * 60 * 60 * 1000; // Block for 24 hours
        }
        AuthService.failedAttempts.set(ip, attempts);
        SecurityUtils.logSecurityEvent('failed_login_attempt', { email, ip });
        return null;
      }

      // Authentication successful, reset attempts for this IP
      AuthService.failedAttempts.delete(ip);
      
      return {
        id: user.id,
        email: user.email,
        name: user.name || null,
        role: user.role
      };
    } catch {
      return null;
    }
  }

  static async registerUser(email: string, password: string, name?: string): Promise<AuthUser | null> {
    try {
      // Validate input
      if (!email || !password) {
        return null;
      }

      // Validate email format
      const emailRegex = /^[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(email)) {
        return null;
      }

      // Validate password strength
      if (password.length < 8) {
        return null;
      }

      const hashedPassword = await this.hashPassword(password);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
          role: 'user'
        }
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name || null,
        role: user.role
      };
    } catch {
      return null;
    }
  }
}
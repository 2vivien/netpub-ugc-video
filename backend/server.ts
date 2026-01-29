
// @ts-expect-error - Ignore type conflicts on Vercel build
import express, { Request, Response, NextFunction } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { prisma } from './lib/prisma.js';
import { AuthService } from './lib/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET is not set. Authentication will fail.');
}

const PORT = process.env.PORT || 4000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_session_secret';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export async function bootstrap() {
    const app = express();
    const httpServer = createServer(app);

    app.use(helmet({
        contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
        crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production' ? true : false,
    }));

    const allowedOrigins = [FRONTEND_URL, 'http://localhost:3000', 'https://studio.apollographql.com'];
    app.use(cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    }));

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use('/graphql', limiter);

    app.use(session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        }
    }));

    app.use(express.json());

    app.get('/health', (req: Request, res: Response) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.get('/csrf-token', (req: Request, res: Response) => {
        res.json({ csrfToken: 'csrf-token-placeholder-or-uuid' });
    });

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const server = new ApolloServer({
        schema,
        context: async ({ req, res }: { req: Request; res: Response }) => {
            const token = req.headers.authorization || '';
            let user = null;
            if (token) {
                try {
                    const bearerToken = token.replace('Bearer ', '');
                    user = AuthService.verifyToken(bearerToken);
                } catch {
                    // Ignore token verification errors
                }
            }
            return { req, res, prisma, user };
        },
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();
    server.applyMiddleware({
        app: app as any,
        path: '/graphql',
        cors: false
    });

    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
        const distPath = path.join(__dirname, '../../dist');
        app.use(express.static(distPath));
        app.get('*', (req: Request, res: Response, next: NextFunction) => {
            if (req.path.startsWith('/graphql') || req.path.startsWith('/health') || req.path.startsWith('/csrf-token')) {
                return next();
            }
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }

    console.log('Bootstrap completed successfully');
    return { app, httpServer };
}

if (process.argv[1] === fileURLToPath(import.meta.url) && !process.env.VERCEL) {
    bootstrap().then(async ({ httpServer }) => {
        await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve));
        console.log(`Server ready at http://localhost:${PORT}/graphql`);
    }).catch(err => {
        console.error('Failed to start server:', err);
    });
}

import { bootstrap } from '../backend/server';
import type { Request, Response } from 'express';

let appPromise: Promise<any> | null = null;

export default async function handler(req: Request, res: Response) {
  if (!appPromise) {
    appPromise = bootstrap().then(data => data.app);
  }
  const app = await appPromise;
  return app(req, res);
}

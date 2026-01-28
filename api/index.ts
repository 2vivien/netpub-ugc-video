import { bootstrap } from '../backend/server';
import type { Request, Response } from 'express';

let appPromise: Promise<any> | null = null;

export default async function handler(req: Request, res: Response) {
  try {
    if (!appPromise) {
      console.log('Starting bootstrap process...');
      appPromise = bootstrap().then(data => data.app);
    }
    const app = await appPromise;
    return app(req, res);
  } catch (error) {
    console.error('Vercel Handler Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
}

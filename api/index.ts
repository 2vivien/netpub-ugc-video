import { bootstrap } from '../backend/server';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Use any for the promise to handle mixed Express type versions during bootstrap
let appPromise: Promise<any> | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!appPromise) {
      console.log('Starting bootstrap process...');
      appPromise = bootstrap().then(data => data.app);
    }
    const app = await appPromise;
    // L'application Express est une fonction (req, res) => void
    return (app as any)(req, res);
  } catch (error) {
    console.error('Vercel Handler Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
}
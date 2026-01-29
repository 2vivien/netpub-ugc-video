import { bootstrap } from '../backend/server';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Define a structural type for the Express app to avoid version-specific property conflicts
type ExpressApp = (req: VercelRequest, res: VercelResponse) => void;

let appPromise: Promise<ExpressApp> | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!appPromise) {
      console.log('Starting bootstrap process...');
      // We cast the result of bootstrap to our structural interface
      appPromise = bootstrap().then(data => data.app as unknown as ExpressApp);
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

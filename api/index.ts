import { bootstrap } from '../backend/server';

let appPromise: Promise<any> | null = null;

export default async function handler(req: any, res: any) {
  try {
    if (!appPromise) {
      console.log('Starting bootstrap process...');
      appPromise = bootstrap().then(data => data.app);
    }
    const app = await appPromise;
    return app(req, res);
  } catch (error) {
    console.error('Vercel Handler Error:', error);
    // On utilise status et json sans types restrictifs pour éviter le conflit avec les types DOM
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
}
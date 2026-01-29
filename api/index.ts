import { bootstrap } from '../backend/server';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let appPromise: Promise<any> | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!appPromise) {
      console.log('Starting bootstrap process...');
      appPromise = bootstrap().then(data => data.app);
    }
    const app = await appPromise;
    // On passe les objets directement à Express qui gère la compatibilité
    return app(req, res);
  } catch (error) {
    console.error('Vercel Handler Error:', error);
    // On utilise une syntaxe qui force le type Response d'Express pour Vercel
    (res as any).status(500).json({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
}
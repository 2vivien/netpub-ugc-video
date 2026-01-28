import { bootstrap } from '../backend/server';

let appPromise: Promise<any> | null = null;

export default async function handler(req: any, res: any) {
  if (!appPromise) {
    appPromise = bootstrap().then(data => data.app);
  }
  const app = await appPromise;
  return app(req, res);
}

// Catch-all function so every /api/* route is handled by Express app
import type { IncomingMessage, ServerResponse } from 'http';
import app from '../back-end/server';

export default function handler(req: IncomingMessage & { url?: string }, res: ServerResponse) {
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  // @ts-ignore Express app is compatible with (req, res)
  return (app as unknown as (req: IncomingMessage, res: ServerResponse) => void)(req, res);
}


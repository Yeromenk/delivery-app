// Vercel Serverless Function entrypoint that proxies to our Express app
import type { IncomingMessage, ServerResponse } from 'http';
import app from '../back-end/server';

export default function handler(req: IncomingMessage & { url?: string }, res: ServerResponse) {
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  // Delegate to the Express app
  // @ts-ignore Express app is a request handler compatible with (req, res)
  return (app as unknown as (req: IncomingMessage, res: ServerResponse) => void)(req, res);
}


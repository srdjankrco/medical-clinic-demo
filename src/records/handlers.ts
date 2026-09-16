import type { IncomingMessage, ServerResponse } from 'node:http';
import { parseCreateRecordBody } from './schema';
import type { RecordStore } from './store';

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (raw === '') {
    return null;
  }

  return JSON.parse(raw) as unknown;
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export function createRecordsHandler(store: RecordStore) {
  return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const method = req.method ?? 'GET';
    const url = req.url ?? '/';

    if (method === 'POST' && url === '/records') {
      try {
        const body = await readJsonBody(req);
        const parsed = parseCreateRecordBody(body);

        if (parsed === null) {
          sendJson(res, 400, { error: 'Invalid request body' });
          return;
        }

        const stored = store.create(parsed.identifier, parsed.payload);
        sendJson(res, 201, stored);
      } catch {
        sendJson(res, 400, { error: 'Invalid request body' });
      }
      return;
    }

    const getMatch = /^\/records\/([^/]+)$/.exec(url);
    if (method === 'GET' && getMatch) {
      const identifier = decodeURIComponent(getMatch[1]);
      const payload = store.getPayload(identifier);

      if (payload === undefined) {
        sendJson(res, 404, { error: 'Record not found' });
        return;
      }

      sendJson(res, 200, payload);
      return;
    }

    sendJson(res, 404, { error: 'Not found' });
  };
}

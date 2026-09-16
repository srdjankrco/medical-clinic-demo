import type { Server } from 'node:http';
import { startRecordsServer } from '../../src/records/server';
import type { RecordStore } from '../../src/records/store';

export interface TestServer {
  server: Server;
  baseUrl: string;
  store: RecordStore;
  close: () => Promise<void>;
}

export async function startTestServer(store?: RecordStore): Promise<TestServer> {
  const { server, port, store: activeStore } = await startRecordsServer(0, store);

  return {
    server,
    baseUrl: `http://127.0.0.1:${port}`,
    store: activeStore,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      }),
  };
}

export async function requestJson(
  baseUrl: string,
  path: string,
  init?: RequestInit,
): Promise<{ status: number; body: unknown }> {
  const response = await fetch(`${baseUrl}${path}`, init);
  const text = await response.text();
  const body = text === '' ? null : (JSON.parse(text) as unknown);

  return { status: response.status, body };
}

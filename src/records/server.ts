import { createServer, type Server } from 'node:http';
import { createRecordsHandler } from './handlers';
import { RecordStore } from './store';

export function createRecordsServer(store = new RecordStore()): Server {
  const handler = createRecordsHandler(store);
  return createServer((req, res) => {
    void handler(req, res);
  });
}

export function startRecordsServer(port = 0, store = new RecordStore()): Promise<{
  server: Server;
  port: number;
  store: RecordStore;
}> {
  const server = createRecordsServer(store);

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, () => {
      const address = server.address();
      if (address === null || typeof address === 'string') {
        reject(new Error('Unable to determine server port'));
        return;
      }

      resolve({ server, port: address.port, store });
    });
  });
}

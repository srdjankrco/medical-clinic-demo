import { afterEach, describe, expect, it } from 'vitest';
import { requestJson, startTestServer, type TestServer } from '../helpers/http';

describe('records API integration tests', () => {
  let testServer: TestServer | undefined;

  afterEach(async () => {
    if (testServer) {
      await testServer.close();
      testServer = undefined;
    }
  });

  it('[AC-001.2] [AC-001.2] P0 R-LAB-001', async () => {
    testServer = await startTestServer();
    const payload = { lab: 'integration', verified: true };

    const createResponse = await requestJson(testServer.baseUrl, '/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'lab-record-1', payload }),
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toEqual({
      identifier: 'lab-record-1',
      payload,
    });

    const readResponse = await requestJson(testServer.baseUrl, '/records/lab-record-1');

    expect(readResponse.status).toBe(200);
    expect(readResponse.body).toEqual(payload);
  });
});

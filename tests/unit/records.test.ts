import { afterEach, describe, expect, it } from 'vitest';
import { requestJson, startTestServer, type TestServer } from '../helpers/http';

describe('records API unit tests', () => {
  let testServer: TestServer | undefined;

  afterEach(async () => {
    if (testServer) {
      await testServer.close();
      testServer = undefined;
    }
  });

  it('[AC-001] [AC-001] POST /records with a valid identifier and payload returns 201 and the stored record.', async () => {
    testServer = await startTestServer();
    const payload = { name: 'Example', value: 42 };

    const response = await requestJson(testServer.baseUrl, '/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'record-1', payload }),
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      identifier: 'record-1',
      payload,
    });
    expect(testServer.store.has('record-1')).toBe(true);
  });

  it('[AC-002] [AC-002] GET /records/:id returns 200 and the payload previously created for that id.', async () => {
    testServer = await startTestServer();
    const payload = { status: 'active', count: 3 };

    await requestJson(testServer.baseUrl, '/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'record-2', payload }),
    });

    const response = await requestJson(testServer.baseUrl, '/records/record-2');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(payload);
  });

  it('[AC-003] [AC-003] POST /records with a missing identifier or non-object payload returns 400 and does not store a record.', async () => {
    testServer = await startTestServer();

    const missingIdentifier = await requestJson(testServer.baseUrl, '/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload: { ok: true } }),
    });

    expect(missingIdentifier.status).toBe(400);
    expect(testServer.store.size()).toBe(0);

    const nonObjectPayload = await requestJson(testServer.baseUrl, '/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'record-3', payload: 'not-an-object' }),
    });

    expect(nonObjectPayload.status).toBe(400);
    expect(testServer.store.size()).toBe(0);
    expect(testServer.store.has('record-3')).toBe(false);
  });
});

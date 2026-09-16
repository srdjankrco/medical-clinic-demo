import type { CreateRecordBody } from './types';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseCreateRecordBody(body: unknown): CreateRecordBody | null {
  if (!isPlainObject(body)) {
    return null;
  }

  const { identifier, payload } = body;

  if (typeof identifier !== 'string' || identifier.trim() === '') {
    return null;
  }

  if (!isPlainObject(payload)) {
    return null;
  }

  return { identifier, payload };
}

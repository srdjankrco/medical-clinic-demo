import type { StoredRecord } from './types';

export class RecordStore {
  private readonly records = new Map<string, Record<string, unknown>>();

  create(identifier: string, payload: Record<string, unknown>): StoredRecord {
    this.records.set(identifier, payload);
    return { identifier, payload };
  }

  getPayload(identifier: string): Record<string, unknown> | undefined {
    return this.records.get(identifier);
  }

  has(identifier: string): boolean {
    return this.records.has(identifier);
  }

  size(): number {
    return this.records.size;
  }
}

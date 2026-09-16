export interface StoredRecord {
  identifier: string;
  payload: Record<string, unknown>;
}

export interface CreateRecordBody {
  identifier: string;
  payload: Record<string, unknown>;
}

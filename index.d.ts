export interface IdMetadata {
  type: string;
  version?: string;
  canonical?: string;
  raw?: string;
  length?: number;
  bits?: number;
  timestampMs?: number;
  isoDate?: string;
  timeOrdered?: boolean;
  randomBits?: number;
}

export declare function generateUuidV4(): string;
export declare function generateUuidV7(timestampMs?: number): string;
export declare function generateUlid(timestampMs?: number): string;
export declare function generateNanoId(size?: number): string;
export declare function inspectId(id: string): IdMetadata;
export declare function ulidToUuid(ulid: string): string;


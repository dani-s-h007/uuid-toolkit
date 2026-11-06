import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateUuidV4, generateUuidV7, generateUlid, generateNanoId } from '../src/generators.js';
import { inspectId, ulidToUuid } from '../src/inspector.js';

describe('uuid-toolkit', () => {
  describe('generators', () => {
    it('generates standard compliant UUIDv4', () => {
      const id = generateUuidV4();
      assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('generates compliant UUIDv7 with embedded timestamp', () => {
      const now = 1700000000000;
      const id = generateUuidV7(now);
      assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);

      const inspected = inspectId(id);
      assert.equal(inspected.type, 'UUID');
      assert.equal(inspected.version, 'v7');
      assert.equal(inspected.timestampMs, now);
      assert.equal(inspected.timeOrdered, true);
    });

    it('generates 26-character Base32 ULID and decodes timestamp', () => {
      const now = 1700000000000;
      const ulid = generateUlid(now);
      assert.equal(ulid.length, 26);

      const inspected = inspectId(ulid);
      assert.equal(inspected.type, 'ULID');
      assert.equal(inspected.timestampMs, now);
      assert.equal(inspected.timeOrdered, true);
    });

    it('generates specified length NanoID', () => {
      const nano21 = generateNanoId(21);
      const nano32 = generateNanoId(32);
      assert.equal(nano21.length, 21);
      assert.equal(nano32.length, 32);
    });
  });

  describe('conversions', () => {
    it('converts ULID to valid 128-bit UUID format', () => {
      const ulid = generateUlid();
      const uuid = ulidToUuid(ulid);
      assert.match(uuid, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
  });
});


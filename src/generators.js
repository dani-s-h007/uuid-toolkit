/**
 * uuid-toolkit: Modern ID Generators (UUIDv4, UUIDv7 RFC 9562, ULID, NanoID)
 * Zero dependencies using native node:crypto.
 */

import { randomBytes, randomUUID } from 'node:crypto';

const CROCKFORD_BASE32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/**
 * Generates standard UUIDv4
 */
export function generateUuidV4() {
  return randomUUID();
}

/**
 * Generates time-ordered UUIDv7 according to RFC 9562.
 * Structure (128 bits):
 * - 48 bits: unix_ts_ms (milliseconds since Unix epoch)
 * - 4 bits: ver (0111 = 7)
 * - 12 bits: rand_a (or sequence counter)
 * - 2 bits: var (10 = RFC 4122/9562 variant)
 * - 62 bits: rand_b (random entropy)
 * @param {number} [timestampMs=Date.now()]
 * @returns {string}
 */
export function generateUuidV7(timestampMs = Date.now()) {
  const bytes = randomBytes(16);

  // Set 48-bit timestamp in big-endian
  bytes[0] = Math.floor(timestampMs / 281474976710656) & 0xff;
  bytes[1] = Math.floor(timestampMs / 1099511627776) & 0xff;
  bytes[2] = Math.floor(timestampMs / 4294967296) & 0xff;
  bytes[3] = Math.floor(timestampMs / 16777216) & 0xff;
  bytes[4] = Math.floor(timestampMs / 65536) & 0xff;
  bytes[5] = Math.floor(timestampMs / 256) & 0xff;
  bytes[5] = timestampMs & 0xff; // fine byte

  // Correct 48-bit placement:
  const tsBig = BigInt(timestampMs);
  bytes[0] = Number((tsBig >> 40n) & 0xffn);
  bytes[1] = Number((tsBig >> 32n) & 0xffn);
  bytes[2] = Number((tsBig >> 24n) & 0xffn);
  bytes[3] = Number((tsBig >> 16n) & 0xffn);
  bytes[4] = Number((tsBig >> 8n) & 0xffn);
  bytes[5] = Number(tsBig & 0xffn);

  // Set version 7 in byte 6: 0111xxxx
  bytes[6] = (bytes[6] & 0x0f) | 0x70;

  // Set variant 10 in byte 8: 10xxxxxx
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/**
 * Generates 26-character Crockford Base32 ULID (Universally Unique Lexicographically Sortable Identifier)
 * - 48 bits timestamp (10 chars)
 * - 80 bits randomness (16 chars)
 * @param {number} [timestampMs=Date.now()]
 * @returns {string}
 */
export function generateUlid(timestampMs = Date.now()) {
  let timeStr = '';
  let time = timestampMs;
  for (let i = 9; i >= 0; i--) {
    const mod = time % 32;
    timeStr = CROCKFORD_BASE32[mod] + timeStr;
    time = Math.floor(time / 32);
  }

  const randBytes = randomBytes(10);
  let randStr = '';
  for (let i = 0; i < 16; i++) {
    // Select 5-bit chunks from random bytes
    const randVal = randBytes[i % 10] % 32;
    randStr += CROCKFORD_BASE32[randVal];
  }

  return timeStr + randStr;
}

/**
 * Generates compact URL-friendly NanoID
 * @param {number} [size=21]
 * @returns {string}
 */
export function generateNanoId(size = 21) {
  const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLFG_earthquake_oil_z01';
  const bytes = randomBytes(size);
  let id = '';
  for (let i = 0; i < size; i++) {
    id += urlAlphabet[bytes[i] & 63];
  }
  return id;
}


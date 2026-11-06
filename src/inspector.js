/**
 * uuid-toolkit: ID Inspector, Timestamp Decoder & Converter
 */

const CROCKFORD_BASE32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const CROCKFORD_MAP = new Map();
for (let i = 0; i < CROCKFORD_BASE32.length; i++) {
  CROCKFORD_MAP.set(CROCKFORD_BASE32[i], i);
  // Also support lowercase
  CROCKFORD_MAP.set(CROCKFORD_BASE32[i].toLowerCase(), i);
}

/**
 * Inspects any given ID string and decodes its metadata
 * @param {string} id
 */
export function inspectId(id) {
  if (!id || typeof id !== 'string') {
    throw new Error('ID must be a non-empty string');
  }

  const clean = id.trim();

  // 1. UUID Format (8-4-4-4-12)
  const uuidMatch = clean.match(/^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i);
  if (uuidMatch) {
    const versionDigit = clean[14];
    const version = parseInt(versionDigit, 16);
    const hexClean = clean.replace(/-/g, '');

    const result = {
      type: 'UUID',
      version: `v${version}`,
      canonical: clean.toLowerCase(),
      bits: 128
    };

    // If UUIDv7, extract 48-bit timestamp
    if (version === 7) {
      const tsHex = hexClean.slice(0, 12);
      const timestampMs = parseInt(tsHex, 16);
      result.timestampMs = timestampMs;
      result.isoDate = new Date(timestampMs).toISOString();
      result.timeOrdered = true;
    } else if (version === 4) {
      result.timeOrdered = false;
      result.randomBits = 122;
    } else if (version === 1) {
      result.timeOrdered = true;
      result.type = 'UUIDv1 (MAC address & Gregorian epoch)';
    }

    return result;
  }

  // 2. ULID Format (26 chars Base32 Crockford)
  if (clean.length === 26 && /^[0123456789ABCDEFGHJKMNPQRSTVWXYZabcdefghjkmnpqrstvwxyz]{26}$/.test(clean)) {
    const timePart = clean.slice(0, 10);
    let timestampMs = 0;
    for (let i = 0; i < 10; i++) {
      const val = CROCKFORD_MAP.get(timePart[i]) || 0;
      timestampMs = timestampMs * 32 + val;
    }

    return {
      type: 'ULID',
      version: 'Canonical Crockford Base32',
      canonical: clean.toUpperCase(),
      bits: 128,
      timestampMs,
      isoDate: new Date(timestampMs).toISOString(),
      timeOrdered: true
    };
  }

  // 3. NanoID (usually 21 chars URL safe)
  if (/^[A-Za-z0-9_-]{10,64}$/.test(clean)) {
    return {
      type: 'NanoID / Compact Random ID',
      length: clean.length,
      canonical: clean,
      timeOrdered: false
    };
  }

  return {
    type: 'Unknown Identifier Format',
    raw: clean,
    length: clean.length
  };
}

/**
 * Converts ULID to standard UUID format
 * @param {string} ulid
 * @returns {string}
 */
export function ulidToUuid(ulid) {
  const clean = ulid.trim().toUpperCase();
  if (clean.length !== 26) throw new Error('Invalid ULID length: expected 26 characters');

  // Decode 26 Base32 characters into a 16-byte buffer
  const bytes = new Uint8Array(16);
  let bitBuffer = 0n;
  let bitCount = 0;
  let byteIndex = 0;

  for (let i = 0; i < 26; i++) {
    const val = BigInt(CROCKFORD_MAP.get(clean[i]) ?? 0);
    bitBuffer = (bitBuffer << 5n) | val;
    bitCount += 5;

    while (bitCount >= 8 && byteIndex < 16) {
      bitCount -= 8;
      bytes[byteIndex++] = Number((bitBuffer >> BigInt(bitCount)) & 0xffn);
    }
  }

  const hex = Buffer.from(bytes).toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}


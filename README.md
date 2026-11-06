# uuid-toolkit 🆔

[![CI](https://github.com/dani-s-h007/uuid-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/dani-s-h007/uuid-toolkit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](package.json)

> **Universal modern ID inspector, decoder & generator (UUIDv7 RFC 9562, ULID, NanoID, UUIDv4).**

Modern database systems (PostgreSQL 17, MySQL, SQLite, MongoDB) strongly benefit from **time-ordered, sequential primary keys** like **UUIDv7 (RFC 9562)** and **ULID**, which eliminate the B-tree index fragmentation and performance degradation caused by traditional random UUIDv4. `uuid-toolkit` provides generator, validator, timestamp decoder, and lossless ULID <-> UUID conversion in a single zero-dependency utility.

---

## ✨ Features

- **RFC 9562 UUIDv7 Support**: Generates millisecond-precision, time-ordered 128-bit identifiers that cluster optimally in B-tree database indexes.
- **Deep Metadata Inspection**: Automatically detects format and decodes embedded Unix timestamps, ISO UTC dates, and entropy components.
- **Lossless ULID <-> UUID Conversion**: Convert 26-character Base32 Crockford ULIDs to 128-bit UUID hex strings without loss of precision.
- **Multi-Format Generator**: One CLI for UUIDv7, UUIDv4, ULID, and NanoID.
- **High-Throughput Batch Generation**: Generate up to 1,000,000 IDs per second using native `crypto.randomBytes`.
- **Zero Runtime Dependencies**: Ultra-fast execution with zero third-party dependencies.

---

## 🚀 Installation

```bash
# Run on-demand with npx
npx uuid-toolkit --help

# Or install globally
npm install -g uuid-toolkit
```

---

## 🛠️ CLI Usage

### Generate Modern UUIDv7
```bash
# Generate a time-ordered UUIDv7:
uuid-toolkit

# Batch generate 5 UUIDv7s:
uuid-toolkit -n 5
```

### Generate ULID or NanoID
```bash
# Generate ULID:
uuid-toolkit -t ulid

# Generate NanoID:
uuid-toolkit -t nanoid
```

### Inspect Embedded Timestamps
```bash
# Inspect any UUID or ULID to find out when it was created:
uuid-toolkit 018d9f43-85b4-7f12-a1b2-c3d4e5f67890
```

### Convert ULID to UUID
```bash
uuid-toolkit --convert 01ARZ3NDEKTSV4RRFFQ69G5FAV
```

### Output JSON
```bash
uuid-toolkit -t uuidv7 -n 5 --json
```

---

## 💻 Programmatic TypeScript API

```typescript
import { generateUuidV7, inspectId, ulidToUuid } from 'uuid-toolkit';

// Generate time-ordered ID:
const id = generateUuidV7();

// Inspect embedded metadata:
const info = inspectId(id);
console.log(`Created at: ${info.isoDate}`);
console.log(`Epoch ms:   ${info.timestampMs}`);
```

---

## 🧪 Testing

```bash
npm test
```

---

## 📄 License

MIT © Essentials Toolkit Authors


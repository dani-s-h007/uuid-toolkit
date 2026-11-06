/**
 * uuid-toolkit: CLI Interface
 */

import { parseArgs } from 'node:util';
import { generateUuidV4, generateUuidV7, generateUlid, generateNanoId } from './generators.js';
import { inspectId, ulidToUuid } from './inspector.js';

export async function runCli(argv = process.argv.slice(2)) {
  const options = {
    help: { type: 'boolean', short: 'h', default: false },
    version: { type: 'boolean', short: 'v', default: false },
    type: { type: 'string', short: 't', default: 'uuidv7' },
    count: { type: 'string', short: 'n', default: '1' },
    inspect: { type: 'string', short: 'i' },
    convert: { type: 'string', short: 'c' },
    json: { type: 'boolean', default: false }
  };

  let parsed;
  try {
    parsed = parseArgs({ args: argv, options, allowPositionals: true });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const { values, positionals } = parsed;

  if (values.help) {
    printHelp();
    return 0;
  }

  if (values.version) {
    console.log('uuid-toolkit v1.0.0');
    return 0;
  }

  // Case 1: Inspect an ID
  const targetToInspect = values.inspect || (positionals[0] && positionals[0] !== 'inspect' && positionals[0].length >= 10 ? positionals[0] : null);
  if (targetToInspect) {
    try {
      const info = inspectId(targetToInspect);
      if (values.json) {
        console.log(JSON.stringify(info, null, 2));
      } else {
        console.log('\n🔍 Identifier Inspection');
        console.log('============================================================');
        console.log(`Canonical:     ${info.canonical || info.raw}`);
        console.log(`Type:          ${info.type} ${info.version || ''}`);
        if (info.timestampMs) {
          console.log(`Timestamp:     ${info.timestampMs} ms`);
          console.log(`Decoded Date:  ${info.isoDate} (UTC)`);
          console.log(`Time-Ordered:  Yes (Index-friendly)`);
        } else {
          console.log(`Time-Ordered:  No (Pure random entropy)`);
        }
        console.log('============================================================\n');
      }
      return 0;
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  }

  // Case 2: Convert ULID to UUID
  if (values.convert) {
    try {
      const converted = ulidToUuid(values.convert);
      if (values.json) {
        console.log(JSON.stringify({ ulid: values.convert, uuid: converted }, null, 2));
      } else {
        console.log(converted);
      }
      return 0;
    } catch (err) {
      console.error(`Conversion error: ${err.message}`);
      process.exit(1);
    }
  }

  // Case 3: Generate IDs
  const count = parseInt(values.count, 10) || 1;
  const genType = values.type.toLowerCase();
  const generated = [];

  for (let i = 0; i < count; i++) {
    let id = '';
    if (genType === 'uuidv7' || genType === 'v7') {
      id = generateUuidV7();
    } else if (genType === 'uuidv4' || genType === 'v4') {
      id = generateUuidV4();
    } else if (genType === 'ulid') {
      id = generateUlid();
    } else if (genType === 'nanoid' || genType === 'nano') {
      id = generateNanoId();
    } else {
      console.error(`Unknown ID format: "${values.type}". Available: uuidv7, uuidv4, ulid, nanoid`);
      process.exit(1);
    }
    generated.push(id);
  }

  if (values.json) {
    console.log(JSON.stringify({ type: genType, count, ids: generated }, null, 2));
  } else {
    for (const id of generated) {
      console.log(id);
    }
  }

  return 0;
}

function printHelp() {
  console.log(`
uuid-toolkit - Universal Modern ID Inspector, Decoder & Generator (UUIDv7, ULID, NanoID)

USAGE:
  $ uuid-toolkit [flags]
  $ uuid-toolkit <id-to-inspect>

FLAGS:
  -t, --type <format>     Generator format: "uuidv7" (default), "uuidv4", "ulid", "nanoid"
  -n, --count <num>       Number of IDs to generate in batch (default: 1)
  -i, --inspect <id>      Inspect and decode embedded timestamp and version metadata
  -c, --convert <ulid>    Convert ULID into equivalent UUIDv7 format
      --json              Output structured JSON
  -v, --version           Show version
  -h, --help              Show help

EXAMPLES:
  # Generate a modern RFC 9562 time-ordered UUIDv7:
  $ uuid-toolkit

  # Generate 10 database-friendly ULIDs:
  $ uuid-toolkit -t ulid -n 10

  # Inspect a UUIDv7 to see exactly when it was minted:
  $ uuid-toolkit 018d9f43-85b4-7f12-a1b2-c3d4e5f67890

  # Convert ULID to 128-bit UUID representation:
  $ uuid-toolkit --convert 01ARZ3NDEKTSV4RRFFQ69G5FAV
`);
}


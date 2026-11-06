#!/usr/bin/env node
/**
 * uuid-toolkit: Interactive Live Demo
 */

import { generateUuidV7, generateUlid, generateNanoId } from '../src/generators.js';
import { inspectId, ulidToUuid } from '../src/inspector.js';

console.log('\n🚀 Starting uuid-toolkit Interactive Demo...\n');

console.log('1. Generating Time-Ordered Identifiers:');
const v7 = generateUuidV7();
const ulid = generateUlid();
const nano = generateNanoId();

console.log(` • UUIDv7 (RFC 9562): ${v7}`);
console.log(` • ULID (Base32):     ${ulid}`);
console.log(` • NanoID:            ${nano}\n`);

console.log('2. Inspecting Embedded Timestamp from UUIDv7:');
const info = inspectId(v7);
console.log('------------------------------------------------------------');
console.log(`Type:         ${info.type} ${info.version}`);
console.log(`Timestamp Ms: ${info.timestampMs}`);
console.log(`Decoded Date: ${info.isoDate} (UTC)`);
console.log(`Time-Ordered: ${info.timeOrdered}`);
console.log('------------------------------------------------------------\n');

console.log('3. Lossless Conversion ULID -> UUID:');
const converted = ulidToUuid(ulid);
console.log(`ULID: ${ulid} -> UUID: ${converted}`);
console.log('\n🎉 Demo completed successfully!\n');


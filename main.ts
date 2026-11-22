// bring-the-humans-03 entrypoint, written for this entry.
//
// The deliverable is the TikTok video named in VIDEO.json; this program's
// whole job is to hand that file to the gate: read VIDEO.json from the bot
// directory, sanity-check that it names a full canonical TikTok video URL
// (the gate refuses short links and placeholders), then copy it into the
// output directory unchanged.
//
// Local run, standing in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const CANONICAL = /^https:\/\/www\.tiktok\.com\/@[\w.]+\/video\/\d+$/;

const source = join(BOT_DIR, 'VIDEO.json');
let parsed: { url?: unknown };
try {
  parsed = JSON.parse(readFileSync(source, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json unreadable at ${source}: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof parsed.url !== 'string' || !CANONICAL.test(parsed.url)) {
  console.error(`VIDEO.json must name a full canonical TikTok URL, got: ${String(parsed.url)}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(source, join(OUTPUT_DIR, 'VIDEO.json'));
console.log(`VIDEO.json -> ${join(OUTPUT_DIR, 'VIDEO.json')} (${parsed.url})`);

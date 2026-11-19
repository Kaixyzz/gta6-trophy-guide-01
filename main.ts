// Leonida Legend — the hand-in program for the gta6-trophy-guide-01 entry.
//
// The guide itself is app/: plain static files (index.html, style.css, app.js
// and data/trophies.json) with no build step and no network use at runtime.
// This program copies app/ and screenshots/ from beside this file into the
// output directory and writes dossier.json there with the vendored make.fun
// library, so the judge gets the same summary the scorer produces.
// vendor/makefun-frontend.ts is the kit's copy, byte for byte, and must not
// be retyped or edited.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Inside the grader MAKEFUN_OUTPUT_DIR is unset and /output is used.
// Serve the guide locally with `node serve.ts` (http://localhost:8080).

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Start from a clean output so stale files from an earlier run never ship.
mkdirSync(outDir, { recursive: true });
for (const name of ['app', 'screenshots']) {
  const target = join(outDir, name);
  if (existsSync(target)) rmSync(target, { recursive: true, force: true });
}

cpSync(join(here, 'app'), join(outDir, 'app'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// Caps from the bounty gate: text at most 163,840 bytes, at most 4
// screenshots of at most 256 KiB each, app/ at most 993 entries and 48 MiB.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log(`dossier written: ${join(outDir, 'dossier.json')} (${dossier.length} bytes)`);

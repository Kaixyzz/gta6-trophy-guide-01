// Leonida Legend — the entrypoint the make.fun grader runs.
// It gathers the finished guide (app/) and its screenshots (screenshots/)
// from beside this file and hands them to the output directory, together
// with the dossier the judge reads. Run it with no flags and no arguments:
//   MAKEFUN_OUTPUT_DIR=out node main.ts
// Inside the grader's container the output directory is /output; outside
// it, MAKEFUN_OUTPUT_DIR stands in for that path.
//
// The repo root is derived from this file's own URL, never from the
// process working directory, because the grader runs this file from a
// different cwd. The dossier is written by the vendored make.fun library
// (vendor/makefun-frontend.ts), which must stay untouched: the scorer
// requires dossier.json to be byte for byte what its own copy writes.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });

const appSource = join(repoRoot, 'app');
if (existsSync(appSource)) {
  cpSync(appSource, join(outputDir, 'app'), { recursive: true });
}

const shotsSource = join(repoRoot, 'screenshots');
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(shotsSource)) {
  cpSync(shotsSource, join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's caps: at most 4 screenshots, each at most 256 KiB; app/
// at most 993 files and directories and 48 MiB; the first-load text
// budget is 160 KiB. These mirror the starter's reference gate.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);

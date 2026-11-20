# Leonida Legend — GTA 6 Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Kaixyzz/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Kaixyzz/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and checklist for all **55 Grand Theft Auto VI trophies** on PlayStation 5 — 1 platinum, 2 gold, 6 silver, 46 bronze — with a roadmap to the platinum, a missable-trophy warning, and a guide for every trophy that cites its sources.

## What it does

- **All 55 trophies, official names and descriptions verbatim**, cross-checked across Push Square, Insider Gaming, PowerPyx, GameTrek, gamemapa, Mobalytics, Radio Times, KeenGamer and GamesFuze (November 2026). Guide text is original to this page.
- **Checklist with progress**: tick trophies off, watch the progress bar and the per-grade counts move. Your checklist is stored in the browser (localStorage) — nothing leaves your machine.
- **Export / import**: download your checklist as JSON and restore it later on any device.
- **Filters**: story, activities, collectibles, missable, plus text search and an earned-only view.
- **Spoiler setting**: hide the guide text (and the official descriptions) until you want to see them. 28 of the 55 trophies are hidden on PS5.
- **Platinum roadmap**: the order to play in, from the story first to the 100% completion endgame.
- **Missable warning**: *Positive Mental Attitude* is the one trophy that can be missed — the guide explains why and when to do it.
- **Honest uncertainty**: ten trophies have methods the community is still confirming. Their guides are labelled *Strategy from the description* instead of presented as fact.

## Run it

No build step, no network: plain static files (HTML, CSS, ES modules).

```sh
node serve.ts
# then open http://localhost:8080
```

Or open `app/index.html` directly in a browser.

## Hand it in

`main.ts` is the entrypoint the make.fun grader runs. It copies `app/` and `screenshots/` beside it to the output directory and writes `out/dossier.json` with the vendored make.fun library:

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

| Path | What it is |
| --- | --- |
| `app/index.html` | The guide page: roadmap, filters, checklist, sources |
| `app/style.css` | Dark Vice City theme |
| `app/app.js` | Checklist, filters, search, spoiler setting, export/import |
| `app/data/trophies.json` | All 55 trophies: name, description, grade, kind, hidden, missable, guide, sources |
| `screenshots/` | Four screenshots of the finished app (1280×800) |
| `shots.json` | Which view each screenshot shows |
| `serve.ts` | Tiny local static server for `app/` |
| `main.ts` | Entrypoint: copies the app and screenshots, writes `dossier.json` |
| `vendor/makefun-frontend.ts` | Vendored make.fun library (do not modify) |

## Sources

Official trophy names, descriptions and grades are quoted verbatim from the published PS5 trophy list. This is an unofficial fan guide. Grand Theft Auto and GTA are trademarks of Take-Two Interactive.

Built by an AI agent for make.fun's “Build the best GTA 6 trophy guide” bounty, $250 in USDC.

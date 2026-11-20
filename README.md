# Leonida Legend — GTA 6 Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Kaixyzz/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Kaixyzz/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and checklist for all **55 Grand Theft Auto VI trophies** on PlayStation 5 — 1 platinum, 2 gold, 6 silver, 46 bronze — with a roadmap to the platinum, a missable-trophy warning, and a guide for every trophy that cites its sources.

## What it does

- **All 55 trophies**, with the official name, description and grade for each one, plus an original guide written for this app.
- **Checklist** with progress bar and per-grade counts. Your progress is stored only in your browser (localStorage).
- **Export and import** your checklist as JSON, so you can move it between browsers.
- **Filters** by kind — story, activities, collectibles, missable — plus earned / to-do and a name search.
- **Spoiler-safe mode** blurs guide text so you can browse the list without seeing how things unlock.
- **Platinum roadmap** in six steps, from the story to the 100% Completion checklist.
- **Guide view** for every trophy: click any card for the full guide.

One trophy is flagged missable: **Positive Mental Attitude**. Do the first meditation with Lucia at Jason's house in Chapter 1 when it is offered — it may be the only one you cannot repeat. Five trophies are labelled "Strategy from the description" because their exact unlock method is still unconfirmed: In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There and Ten Pin.

## Run it

No build step, no network requests. Serve the `app/` folder and open it:

```sh
node serve.ts
# then open http://localhost:8080
```

Or open `app/index.html` through any static file server. Everything runs offline: the app is plain HTML, CSS and ES modules, and the trophy data lives in `app/data/trophies.json`.

## Files

- `app/index.html` — the page
- `app/style.css` — styling
- `app/app.js` — checklist, filters, spoiler mode, export/import, guide view
- `app/data/trophies.json` — all 55 trophies with official names, descriptions, grades and original guides
- `main.ts` — entrypoint: copies `app/` and `screenshots/` to the output and writes `dossier.json`
- `screenshots/` — screenshots of the finished app

## Sources

Trophy names, descriptions and grades are the official trophy list, as reported by:

- Insider Gaming — Complete GTA 6 Trophy List
- GameMapa — All 55 GTA 6 Trophies: Full List, Gamerscore and Platinum Roadmap (conditions and tips, via PowerPyx and GamesRadar+)
- GamesFuze — GTA 6 Trophy List: All 55 Trophies & Achievements
- GameTrek — GTA 6 Trophy Guide: All 55 Achievements and Platinum Roadmap

Guide text is original to this app. Grand Theft Auto, GTA and Rockstar Games are trademarks of Take-Two Interactive. This is an unofficial fan-made guide.

## License

MIT — see `LICENSE`.

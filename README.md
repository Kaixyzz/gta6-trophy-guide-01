# Leonida Legend — GTA 6 Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Kaixyzz/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Kaixyzz/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![repo](https://img.shields.io/badge/repo-Kaixyzz%2Fgta6--trophy--guide--01-39e6c3)](https://github.com/Kaixyzz/gta6-trophy-guide-01)

An offline guide and checklist for all **55 Grand Theft Auto VI trophies** on PlayStation 5 — 1 platinum, 2 gold, 6 silver, 46 bronze — with a roadmap to the platinum, a missable-trophy warning, and a guide for every trophy that cites its sources.

## What it is

- **Every trophy, exactly as published.** Names, descriptions and grades match the published PSN trophy list, cross-checked between Exophase and PSNProfiles. All 55 are single-player and offline — there are no online trophies on this list.
- **A guide for each trophy, in my own words.** What to do, where and how, and when it can be missed. Where no outside guide had confirmed a method at launch, the guide says so plainly and works from the official description alone, labelled “Strategy from the description”.
- **A tracker that remembers.** Tick trophies off and progress is saved in your browser (localStorage). Export it to a file and import it back on another machine.
- **Filters and a spoiler setting.** Filter by kind (story / missable / collectibles / activities), grade, earned state, or free-text search. The spoiler toggle hides story-trophy names and descriptions until you earn them.
- **A roadmap to the platinum.** Four phases in order: story first (and the one missable), then robberies and partner jobs, then collectibles and the long grinds, then the 100% checklist cleanup.
- **The missable, flagged honestly.** Only one trophy is reported as possibly missable — Positive Mental Attitude, whose first meditation spot is offered in Chapter 1. The guide says why, and the app reminds you to keep a manual save at the start of every chapter, since there is no mission replay.
- **Fully offline.** Static files only, no network requests at runtime, no Rockstar artwork, logos or game images — the look is a CSS-only Vice City neon sunset.

## How to run it

```sh
node serve.ts
```

Then open http://localhost:8080. Any static file server works too — `app/` is just HTML, CSS, JavaScript and one JSON data file.

## The numbers

PowerPyx rates this platinum 4/10 in difficulty and about 200 hours, with one playthrough enough. The time goes on A Long Road (100% completion), the 250 stunts and the 100 WAiNK spots. Cheats disable trophies and saving, so keep them off during a trophy run.

## Sources

- [PowerPyx — GTA 6 Trophy Guide & Roadmap](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/) — roadmap, difficulty and time estimates, the missable warning, no mission replay, cheats
- [Exophase — Grand Theft Auto VI trophies (PSN)](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) — names, descriptions, grades
- [PSNProfiles — Grand Theft Auto VI trophies](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi) — names, descriptions, grades
- [OutputLag — GTA 6 Trophy List](https://outputlag.com/guides/gta-6-trophy-list/) — no mission replay, manual saves, the Chapter 1 meditation
- [KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap](https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/)
- [GTA Zone — GTA 6 Trophy List](https://gta-zone.com/news/gta-6-trophies-achievements/)

## Building the hand-in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `app/` and `screenshots/` into `out/` and writes `out/dossier.json` with the vendored make.fun library.

## License

MIT — see [LICENSE](LICENSE). This is an unofficial fan guide; Grand Theft Auto and GTA are trademarks of Take-Two Interactive.

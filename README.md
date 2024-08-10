# ytcha

A CLI to scape a list of recent videos from a specific YouTube channel to allow
them to be piped to tools like `grep` and `jq`.

See `ytcha --help` for details.

## Demo

```sh
ytcha ethoslab
```

Output (including [OSC 8 links](https://github.com/Alhadis/OSC8-Adoption)):

```txt
🔗 Secret Life #1 - Everyone Must Sleep! • 9 months ago
🔗 Hermitcraft Vault Hunters #1 - My First Playthrough • 9 months ago
🔗 Secret Life #2 - Server Full of Weirdos • 9 months ago
🔗 HermitCraft S9#18: Decked Out - Phase 5: Clumsy Ninja • 9 months ago
🔗 Secret Life #3 - Fail Them or Fail Me • 9 months ago
🔗 Etho Plays Minecraft - Episode 584: Endless Redstone Ocean • 9 months ago
🔗 HermitCraft S9#19: Decked Out - Phase 6: Greedy Boy • 9 months ago
🔗 Secret Life #4 - Listening Comprehension Skills • 8 months ago
🔗 Hermitcraft Vault Hunters #2 - Bounty Hunter • 8 months ago
🔗 Secret Life #5 - Bdubs Is Amazing! • 8 months ago
🔗 Secret Life #6 - Warden vs. Wither • 8 months ago
🔗 Hermitcraft Vault Hunters #3 - Training Wheels Off • 8 months ago
🔗 HermitCraft S9#20: Decked Out - Phase 7: Rage Week • 8 months ago
🔗 Secret Life #7 - Everyone Be Running • 8 months ago
🔗 HermitCraft S9#21: Decked Out - Phase 8: Tryhard Mode • 7 months ago
🔗 Secret Life #8 & 9 - Etho Shows Up • 7 months ago
🔗 HermitCraft S9#22: Decked Out - Phase 9: End Game • 7 months ago
🔗 Hermitcraft Vault Hunters #4 - Treasure Hunter • 7 months ago
🔗 Etho Plays Minecraft - Episode 585: Ender Chest Storage V2 • 6 months ago
🔗 Hermitcraft S10#1: Welcome To Season 10 • 6 months ago
🔗 Hermitcraft S10#2: Creepers Gone Fission • 5 months ago
🔗 Hermitcraft S10#3: Exterior Be Finishing • 5 months ago
🔗 Hermitcraft S10#4: Permit My Frog Storage • 5 months ago
🔗 Hermitcraft S10#5: Dispensing Deals & Frog Paths • 4 months ago
🔗 Hermitcraft S10#6: Ravager Wrangling • 4 months ago
🔗 Hermitcraft S10#7: Bamboo Frog Storage • 3 months ago
🔗 Hermitcraft S10#8: Making Frogger In Minecraft • 3 months ago
🔗 Etho Plays Minecraft - Episode 586: Chaos To Order • 2 months ago
🔗 Hermitcraft S10#9: Walking To The Horizon • 1 month ago
🔗 Etho Plays Minecraft - Episode 587: Trial Chambers • 2 weeks ago
```

## Installation

Requires [Bun](https://bun.sh), for now; adjust `--outfile` as needed:

```sh
git clone https://github.com/zqianem/ytcha
cd ytcha
bun build ./index.ts --compile --outfile ~/.local/bin/ytcha
```

Might make this installable via NPM later.

## Why

The Formula 1 channel kept putting out videos with titles that would spoil the
outcome of their highlights (e.g. Max Verstappen's Qualifying Lap), so I made
this so I could run:

```sh
ytcha formula1 | rg highlights
```

where `rg` is [ripgrep](https://github.com/BurntSushi/ripgrep) with
`--smart-case` enabled by default in config.

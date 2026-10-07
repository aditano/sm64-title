# Super Mario 64 Title Screen

A browser recreation of the Super Mario 64 title screen. Mario's face sits in the Peach's Castle courtyard, and you can grab it and stretch it the way the original PRESS START screen does.

**Play it:** [https://aditano.github.io/sm64-title/](https://aditano.github.io/sm64-title/)

GitHub Pages publishes that site from `main` through [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

## Features

- A 320x240 title frame with a pixelated N64 look. The frame scales with the window and stays centered on taller screens.
- Peach's Castle courtyard: the castle and its towers, the moat, the bridge, trees, hills, and sky.
- Mario's head on a stone pedestal. The face appears first, then the SUPER MARIO 64 logo fades in.
- A blinking PRESS START prompt on a 30 Hz timer, and the Nintendo copyright line along the bottom.
- Drag the cap, either ear, the nose, either side of the mustache, or the mouth. The face springs back when you let go.
- A Mario glove follows the pointer and pinches while you drag. On a touch screen, a hint shows a grab on the nose.
- Pupils follow the pointer, and Mario blinks.
- A hard pull throws a red sparkle burst.
- Three camera distances.

## Controls

| Action | Input |
| --- | --- |
| Stretch a feature | Click or touch it, then drag |
| Hold the stretch | Shift |
| Reset the face | R |
| Cycle the camera | B |
| Full screen | F |
| Leave full screen | F or Escape |

## Run locally

Use Node.js 22, the version the Pages workflow installs.

```bash
npm ci
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

| Script | What it does |
| --- | --- |
| `npm test` | Runs the tests in `scripts/` |
| `npm run typecheck` | Type-checks the project |
| `npm run lint` | Runs ESLint |
| `npm run build:pages` | Builds the static site GitHub Pages deploys, into `dist/` |

## Tech stack

- React 19 and TypeScript
- Vite 8
- Three.js and React Three Fiber for the scene
- Zustand for the face, zoom, and pointer
- Tailwind CSS 4
- TanStack Start and TanStack Router for the local app (`npm run dev`)
- A static Vite build ([`vite.pages.config.ts`](vite.pages.config.ts) and [`pages/`](pages/)) for GitHub Pages, deployed by GitHub Actions

The published site and the local title screen render the same scene.

## License

Copyright 2026 Anthony DiTano.

Anthony's original source code in this repository is licensed under the GNU General Public License, version 3 or any later version (`GPL-3.0-or-later`). The full official GNU GPL version 3 text is in [LICENSE](LICENSE).

This is an unofficial fan project. Nintendo owns Super Mario, Super Mario 64, Mario, Peach's Castle, and the related names, assets, and likenesses. Those names, assets, and likenesses are excluded from this GPL grant.

Other third-party assets keep their own licenses. Dependencies in `package.json` remain under the licenses published with those packages.

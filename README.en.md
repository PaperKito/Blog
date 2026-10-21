# PaperKito's Blog

A personal static blog built with Astro — tech notes, experiments, and daily thoughts.

Live at: <https://paperkito.github.io>

## Tech Stack

- [Astro](https://astro.build/) 7 — static site generation
- Svelte 5 — interactive islands
- Tailwind CSS v4 — styling
- [Pagefind](https://pagefind.app/) — static full-text search
- Swup — smooth page transitions
- Biome — formatting & linting

## Local Development

Requires Node ≥ 22 and pnpm ≥ 9.

```bash
pnpm install
pnpm dev            # dev server, default http://localhost:4321/
pnpm build          # full build (output in dist/)
pnpm preview        # preview the production build
pnpm check          # Astro diagnostics
pnpm type-check     # TypeScript check
```

> On some setups `astro dev` binds IPv6 only. If `127.0.0.1` doesn't work, run
> `pnpm dev --host`.

## Deployment

GitHub Pages via CI on push. The `dist/` folder can also be dropped onto any static host.

## Layout Notes

- No top navigation bar. Site-level actions live in the **bottom-right floating dock**:
  nav menu (full-screen drawer), search, theme color (palette), light/dark mode,
  background video toggle
- Preferences (theme color, light/dark, post list layout) are stored in localStorage

## Credits

Customized from the [Firefly](https://github.com/CuteLeaf/Firefly) theme
(MIT License, Copyright (c) 2024 saicaca / 2025 CuteLeaf). Thanks to the original author.
Original attribution markers (e.g. the "Powered by Astro & Firefly" footer) are kept
as requested by the theme license.

See [docs/HANDOVER.md](docs/HANDOVER.md) for architecture and maintenance notes.

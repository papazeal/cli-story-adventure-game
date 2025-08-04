# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

All commands use `pnpm` as the package manager:

- `pnpm dev` - Start development server (usually runs on localhost:4321, auto-finds available port)
- `pnpm build` - Build production site to `./dist/`
- `pnpm preview` - Preview built site locally
- `pnpm astro add <integration>` - Add Astro integrations (e.g., `pnpm astro add svelte`)

## Architecture Overview

**Forest Friends** is a CLI-style storytelling game built with Astro + Svelte + TailwindCSS that simulates a terminal interface for interactive fiction. It's a magical forest adventure game designed for kids, featuring talking animals, fun puzzles, and gentle humor throughout the story.

### Technology Stack
- **Astro v5**: Static site generator with islands architecture for selective hydration
- **Svelte v5**: Reactive UI components (not SvelteKit - just Svelte components in Astro)
- **TailwindCSS v4**: Utility-first CSS via `@tailwindcss/vite` plugin (not the deprecated `@astrojs/tailwind`)
- **TypeScript**: Full type safety throughout

### Key Architecture Decisions

**State Management**: Uses Svelte's writable store pattern with custom game-specific methods in `src/stores/gameStore.ts`. The store manages:
- Current scene navigation
- Game state (started, visited scenes)
- Scene data with branching choices

**Component Structure**: 
- `Terminal.svelte` - Main game interface handling command input and terminal display
- `TypeWriter.svelte` - Typewriter animation effect for story text
- Single-page application via `src/pages/index.astro`

**Story Content**: Hardcoded as array of scene objects in `gameStore.ts` with branching narrative structure. Each scene has text content and choice objects that reference next scene IDs. The story features kid-friendly language, gentle humor, talking animals, and multiple puzzle types including rainbow color sequences, math riddles, and rhyming games. There are 12+ different ending scenes based on player choices.

**Terminal Simulation**: Authentic CLI appearance with:
- Terminal header with macOS-style window controls
- Command processing (`start`, `choice [number]`, `help`, `clear`)
- Typewriter text effects for immersion
- Gray/white color scheme mimicking real terminals

### Integration Setup Notes

The project uses the modern Astro v5 integration approach:
- Svelte integration via `@astrojs/svelte` in `astro.config.mjs`
- TailwindCSS via Vite plugin (not the deprecated Astro integration)
- Components use `client:load` directive for hydration

### File Structure Context

```
src/
├── components/     # Svelte components only
├── pages/         # Astro pages (just index.astro)
└── stores/        # Svelte stores for state management
```

The `src/stores/` directory is custom - not standard Astro but follows Svelte conventions for centralized state management.
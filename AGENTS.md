# Repository Guidelines

## Project Structure & Module Organization

- `src/main` contains the Electron main process: IPC handlers, database access, cron, channels/plugins, updater, and SSH/MCP integrations.
- `src/preload` exposes the secure renderer bridge APIs.
- `src/renderer/src` contains the React app (`components/`, `stores/`, `hooks/`, `lib/`, `locales/`).
- `src/components`, `src/hooks`, `src/lib` are shared modules used across main and renderer processes.
- `src/shared` contains TypeScript types shared between main and renderer.
- `src/dotnet` houses the .NET sidecar agent project (`OpenCowork.Agent`).
- Bundled agent assets live under `resources/agents`, `resources/skills`, `resources/prompts`, and `resources/commands`.
- The docs site is a separate Next.js workspace under `docs/` with its own `package.json`.
- Generated output goes to `out/` and `dist/`; do not edit those directories manually.

## Build, Test, and Development Commands

- `npm install`: install root dependencies.
- `npm run dev`: start Electron + Vite with hot reload.
- `npm run start`: preview the built app.
- `npm run lint`: run ESLint across the workspace.
- `npm run typecheck`: run both node and web TypeScript checks.
- `npm run format`: format the repo with Prettier.
- `npm run build`: typecheck, then build the app.
- `npm run build:win`, `npm run build:mac`, `npm run build:linux`: create platform-specific packages (includes sidecar build).
- `npm run build:sidecar`: build the .NET sidecar for the current platform.
- `npm run build:sidecar:win`, `npm run build:sidecar:mac`, `npm run build:sidecar:linux`: build sidecar for specific platforms.
- `npm run benchmark:sidecar`: run performance benchmarks on the sidecar.
- Docs workspace: `npm --prefix docs run dev`, `npm --prefix docs run build`, `npm --prefix docs run types:check`.

## Coding Style & Naming Conventions

- Follow `.editorconfig`: UTF-8, LF, 2-space indentation, trim trailing whitespace.
- Follow `.prettierrc.yaml`: single quotes, no semicolons, 100-column width, no trailing commas.
- Respect `eslint.config.mjs`, especially the TypeScript, React, and hooks rules.
- Use PascalCase for React component files such as `Layout.tsx`; use kebab-case for most non-component modules such as `settings-store.ts`.

## Testing Guidelines

- There is no root `npm test` script or dedicated `*.test.ts` suite today.
- Minimum validation for code changes is `npm run lint` and `npm run typecheck`.
- For UI or workflow changes, do a manual smoke test in `npm run dev`.
- For packaging/runtime changes, validate with the relevant `npm run build:<platform>` command.

## Commit & Pull Request Guidelines

- Match recent commit style: concise, imperative subjects such as `Add ...`, `Fix ...`, `Update ...`, or `Refactor ...`.
- Keep commits focused and avoid mixing unrelated refactors.
- PRs should include a short summary, linked issues, verification steps, screenshots for UI changes, and platform impact notes when packaging behavior changes.

## Release & Security Notes

- When bumping the app version, also update the docs homepage version in `docs/src/app/(home)/page.tsx` and keep download links aligned with release assets.
- Never commit secrets, API keys, or local user data. Runtime config lives under `~/.open-cowork/` and should stay out of version control.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:3030 (for installing in Pulse Editor)
npm run preview    # Start browser preview (no IMC/Pulse Editor integration)
npm run build      # Full build
npm run build-client   # Client-only build
npm run build-server   # Server-only build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run clean      # Clean build artifacts
```

## Architecture

This is a **Pulse Editor extension app** — a full-stack React app loaded inside [Pulse Editor](https://github.com/claypulse/pulse-editor) via Webpack Module Federation.

### Entry points

- **`src/main.tsx`** — React UI entry point. Pulse Editor loads this as the extension's frontend.
- **`src/server-function/`** — Backend HTTP handlers. Each file exports a default `async function(req: Request): Promise<Response>`. File path maps directly to URL: `src/server-function/echo.ts` → `/server-function/echo`, `src/server-function/hello/hello-world.ts` → `/server-function/hello/hello-world`.
- **`src/skill/`** — Agentic skills usable by AI agents in Pulse Editor. Each skill folder contains a skill definition based on Anthropic's SKILL format. In addition, Pulse Editor adds an `action.ts` file that allows agents to run it in both frontend and backend and allows frontend to subscribe to its execution via `useActionEffect`. 
- **`pulse.config.ts`** — Extension metadata (id, version, displayName, visibility, dimensions). The `id` must match `package.json` `name` and must not contain hyphens.

### Key Pulse Editor APIs (`@pulse-editor/react-api` and `@pulse-editor/shared-utils`)
Pulse Editor exposes a set of APIs for extension apps to interact with the editor environment, both in the frontend and backend.

`@pulse-editor/react-api` provides React hooks for interacting with Pulse Editor's frontend environment:
- `useLoading()` — Controls the loading state shown by Pulse Editor while the app initializes.
- `useActionEffect(config, deps)` — Registers an App Action handler. The `actionName` must match the skill's `action.ts` filename convention. Returns `runAppAction` for invoking the action from the UI.
- and more...

### Server functions
Server functions are backend HTTP handlers that can be called from the frontend or by external services. They are defined as default exports in files under `src/server-function/`. The file path determines the URL endpoint. For example:
- `src/server-function/echo.ts` → `/server-function/echo` (POST)
- `src/server-function/hello/hello-world.ts` → `/server-function/hello/hello-world` (GET)


### Skills / App Actions

A skill folder under `src/skill/` pairs a `SKILL.md` (Anthropic skill format with YAML frontmatter) with an `action.ts` default export. App Actions are exposed and callable from three places:

1. **AI agents** — Pulse Editor agents can invoke the skill directly.
2. **Frontend** — via `runAppAction` from `useActionEffect` in any React component.
3. **Backend** — server-side logic on the Pulse Editor automation platform at https://pulse-editor.com/api/skill/{appId}/{version}/{skillName}. For example, the `example-skill` in this repo can be called at `https://pulse-editor.com/api/skill/pulse_app_template/0.0.1/exampleSkill`.

This makes App Actions the primary integration point for features that need UI interaction in the canvas workspace or automated backend execution.

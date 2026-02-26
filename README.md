# Pulse App Template

This is a React full-stack template which you can use to make your own Pulse Editor app. It uses Module Federation to share modules with Pulse Editor, which enables full-stack app collaboration in a canvas workflow (see [Pulse Editor](https://github.com/claypulse/pulse-editor)).

For more information about Pulse Editor core and its ecosystem, visit our [Pulse Editor GitHub](https://github.com/claypulse/pulse-editor) and [documentation](https://docs.pulse-editor.com).

## Get Started

### Create a Pulse Editor extension app using the CLI

```bash
# Install Pulse Editor CLI
npm i -g @pulse-editor/cli
# Use CLI to create a React template project (based on this repository)
pulse create
```

### Start development

#### Method 1: Install your extension in Pulse Editor as a dev extension

Run the following to start a dev server locally:

```bash
npm run dev
```

This will host your extension at `http://localhost:3030`. To install the local app in dev mode, go to Settings in Pulse Editor UI; then fill in your extension dev server's information. You will need:

- **Dev server:** e.g. `http://localhost:3030`
- **Extension ID:** `name` in `package.json` (this field must not contain hyphens '-') 
- **Version:** `version` in `package.json`

#### Method 2: Preview your extension in the browser

If you'd like to quickly develop your extension without installing it inside Pulse Editor, you can run a browser preview:

```bash
npm run preview
```

> **Note:** Your extension won't be able to use IMC (Inter-Module-Communication) to communicate with Pulse Editor in preview mode.

---

## Project Structure

### Frontend (`src/main.tsx`)

`main.tsx` is the main entry point for your extension's React UI. Pulse Editor loads this as the extension's frontend.

Add React components inside `/src` to build your extension's UI.

### Backend (`src/server-function/`)

Server functions are backend HTTP handlers defined as default exports in files under `src/server-function/`. Each file must export a default `async function(req: Request): Promise<Response>`. The file path maps directly to its URL endpoint:

- `src/server-function/echo.ts` → `POST /server-function/echo`
- `src/server-function/hello/hello-world.ts` → `GET /server-function/hello/hello-world`

### Skills & App Actions (`src/skill/`)

Anthropic skill format with YAML frontmatter can be used to define agentic capabilities in Pulse Editor. In addition,
Pulse Editor adds an `action.ts` file that allows agents to run in frontend by subscribing to its execution via `useActionEffect`, and backend execution via the Pulse Editor automation platform or AI agents. 

App Actions are callable from three places:

1. **AI agents** — Pulse Editor agents can invoke the skill directly.
2. **Frontend** — via `runAppAction` returned from `useActionEffect` in any React component.
3. **Backend** — via the Pulse Editor automation platform at `https://pulse-editor.com/api/skill/{appId}/{version}/{skillName}`. For example, the `example-skill` in this repo is accessible at `https://pulse-editor.com/api/skill/pulse_app_template/0.0.1/exampleSkill`.

---

## Pulse Editor Libraries

### `@pulse-editor/shared-utils`

Provides shared utilities such as types used across your extension.

### `@pulse-editor/react-api`

Provides React hooks for interacting with Pulse Editor's frontend environment:

- **`useLoading()`** — Controls the loading state shown by Pulse Editor while the app initializes.
- **`useActionEffect(config, deps)`** — Registers an App Action handler. The `actionName` must match the skill's `action.ts` filename convention. Returns `runAppAction` for invoking the action from the UI.
- and more...

Additional capabilities available through the API include:

- Load/write the currently opened file
- Invoke Pulse Editor agents
- Use AI models
- Use agentic tools installed in Pulse Editor
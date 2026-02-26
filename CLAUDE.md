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
2. **Frontend** — via `runAppAction` returned from `useActionEffect` in any React component. To display and produce UI results in the Pulse Editor workflow canvas view, it is recommended to use useActionEffect to perform UI updates before and after the action execution. Generally speaking, useActionEffect should handle similar UI logics as if the action is invoked from the frontend. For example, normally a user might interact with a button to trigger an action; useActionEffect allows an AI agent to trigger the same action without directly interacting with the button, but the UI needs to update accordingly as if the button is clicked with `beforeAction` and `afterAction`.
3. **Backend** — via the Pulse Editor automation platform at `https://pulse-editor.com/api/skill/{appId}/{version}/{skillName}`. For example, the `example-skill` in this repo is accessible at `https://pulse-editor.com/api/skill/pulse_app_template/0.0.1/exampleSkill`.

This makes App Actions the primary integration point for features that need UI interaction in the canvas workspace or automated backend execution.


**Skill**
Skill definition is based on Anthropic's SKILL format with YAML frontmatter. 

**App Action**
The `action.ts` file in each skill folder defines the App Action associated with the skill.
It has the following requirements:
- must define a default export function that takes an input object and returns an output object. 
- can define any input/output types as an object, as needed for the skill's functionality.
- must use JSDoc comments to document the input parameters and output with @typedef and @property annotations.
- must use JSDoc comments to document the function with a description and @param and @returns annotations.

Exqample `action.ts` structure:
```ts
/**
 * @typedef {Object} Input - The input parameters for the example action.
 * @property {string} arg1 - The first argument for the example action.
 * @property {number} arg2 - The second argument for the example action (optional).
 */
type Input = {
  arg1: string;
  arg2?: number;
};

/**
 * @typedef {Object} Output - The output of the example action.
 * @property {string} result1 - The first result of the example action.
 * @property {string} result2 - The second result of the example action.
 */
type Output = {
  result1: string;
  result2: string;
};

/**
 * This is an example action function. You can replace this with your own action logic.
 *
 * @param {Input} input - The input parameters for the example action.
 *
 * @returns {Output} The output of the example action.
 */
export default function exampleSkill({ arg1, arg2 = 1 }: Input): Output {
  return {
    result1: `Received arg1: ${arg1}`,
    result2: `Received arg2: ${arg2}`,
  };
}
```


**useActionEffect**
Think of `useActionEffect` as a way to "link" an App Action to the frontend UI. It will have `beforeAction` and `afterAction` functions that pipe the action's input and output, allowing you to perform UI updates accordingly. Note that `beforeAction` and `afterAction` functionally behave like pipelines that process the args and optionally transform them before passing. 
They can also make side effects in the UI via React such as showing loading states, updating components, etc.

Example usage of `useActionEffect` in `main.tsx`:
```tsx
  const { runAppAction } = useActionEffect(
    {
      actionName: "exampleAction",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      beforeAction: async (args: any) => {
        console.log("Before action, action's args:", args);
        return args;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      afterAction: async (result: any) => {
        console.log("After action, action's result:", result);
        return result;
      },
    },
    [],
  );
```

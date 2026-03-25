import React, { useEffect, useState } from "react";
import "./tailwind.css";
import { useLoading, useActionEffect } from "@pulse-editor/react-api";

export default function Main() {
  const [count, setCount] = useState<number>(0);
  const { isReady, toggleLoading } = useLoading();
  const [inputValue, setInputValue] = useState<string>("");
  const [apiResult, setApiResult] = useState<string>("");
  const [actionResult, setActionResult] = useState<string>("");

  useEffect(() => {
    if (isReady) {
      toggleLoading(false);
    }
  }, [isReady, toggleLoading]);

  const { runAppAction } = useActionEffect(
    {
      actionName: "example-skill",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      beforeAction: async (args: any) => {
        // Return if args is empty when not loaded in Pulse Editor
        if (!args) return;

        console.log("Before action, action's args:", args);
        return args;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      afterAction: async (result: any) => {
        // Return if result is empty when not loaded in Pulse Editor
        if (!result) return;

        console.log("After action, action's result:", result);
        return result;
      },
    },
    [],
  );

  return (
    <div className="flex flex-col w-full h-full overflow-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 p-6 gap-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Pulse App Template
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            The Runtime Where AI Agents Build, Ship, and Evolve
          </p>
        </div>
        <button
          className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 p-2 hover:bg-white/10 transition-colors"
          onClick={() => {
            window.open(
              "https://github.com/claypulse/pulse-app-template",
              "_blank",
            );
          }}
        >
          <img
            src="assets/github-mark-light.svg"
            alt="GitHub"
            className="w-full h-full opacity-70"
          />
        </button>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-4">
        <p className="text-sm text-gray-300 leading-relaxed">
          An <span className="text-indigo-400 font-medium">agent-first capability factory</span> powered
          by module federation. AI agents dynamically discover, load, and hot-swap verified modules at
          runtime — no compilation, no installation.
        </p>
      </div>

      {/* Counter Card */}
      <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Counter</p>
          <p className="text-3xl font-light text-white tabular-nums">{count}</p>
        </div>
        <button
          className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
      </div>

      {/* Echo Server Function */}
      <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 space-y-3">
        <p className="text-xs uppercase tracking-wider text-gray-500">Server Function</p>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20 whitespace-nowrap"
            onClick={() => {
              fetch("/server-function/echo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: inputValue }),
              }).then(async (response) => {
                const data = await response.json();
                setApiResult(data.message);
              });
            }}
          >
            Echo
          </button>
        </div>
        {apiResult && (
          <div className="rounded-lg bg-white/5 px-3 py-2 text-sm text-indigo-300 font-mono">
            {apiResult}
          </div>
        )}
      </div>

      {/* App Action */}
      <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 space-y-3">
        <p className="text-xs uppercase tracking-wider text-gray-500">App Action</p>
        <button
          className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
          onClick={async () => {
            if (runAppAction) {
              const result = await runAppAction({
                arg1: "test",
                arg2: 2,
              });
              setActionResult(JSON.stringify(result));
            }
          }}
        >
          Run example-skill
        </button>
        {actionResult && (
          <div className="rounded-lg bg-white/5 px-3 py-2 text-sm text-purple-300 font-mono break-all">
            {actionResult}
          </div>
        )}
      </div>

      {/* Footer Features */}
      <div className="grid grid-cols-3 gap-3 mt-auto">
        {[
          { label: "Dynamic Discovery", desc: "Runtime module loading" },
          { label: "Hot-Swap", desc: "Live verified modules" },
          { label: "Visual Sandbox", desc: "Human-agent collab" },
        ].map((feature) => (
          <div
            key={feature.label}
            className="rounded-lg bg-white/[0.02] border border-white/5 p-3 text-center"
          >
            <p className="text-xs font-medium text-gray-300">{feature.label}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "./tailwind.css";
import { useLoading, useRegisterAction } from "@pulse-editor/react-api";

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

  const { runAppAction } = useRegisterAction(
    {
      actionName: "exampleAction",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      beforeAction: async (args: any) => {
        console.log("Before action, args:", args);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      afterAction: async (args: any, result: any) => {
        console.log("After action, args:", args, "result:", result);
      },
    },
    [],
  );

  return (
    <div className="p-2 flex flex-col w-full h-full overflow-auto">
      <div className="flex items-center gap-x-1">
        GitHub:
        <button
          className="w-8 h-8 border border-gray-300 rounded-full p-1 hover:bg-gray-100"
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
            className="w-full h-full"
          />
        </button>
      </div>

      <div>
        <button
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-sm"
          onClick={() => setCount(count + 1)}
        >
          Click me to increase count
        </button>
      </div>
      <p className="text-blue-400">{count}</p>

      <div>
        <div>
          <input
            className="border-2 border-gray-300 rounded-sm p-2"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <button
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-sm"
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
          Enter text and click me to call server function which echoes a message
        </button>
        <p className="text-blue-400">{apiResult}</p>
      </div>

      <button
        className="pt-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-sm"
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
        Run exampleAction
      </button>
      {actionResult && <p className="text-blue-400">{actionResult}</p>}
    </div>
  );
}

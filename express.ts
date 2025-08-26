/**
 *  This is a local dev server for "npm run dev".
 */

import express from "express";
import cors from "cors";
import config from "./pulse.config";

const app = express();

app.use(cors());

// Log each request to the console
app.use((req, res, next) => {
  console.log(`✅ [${req.method}] Received: ${req.url}`);
  return next();
});

app.use(`/${config.id}/${config.version}`, express.static("dist"));

app.listen(3030, () => {
  console.log("🚀 Dev server running on http://localhost:3030\n");
});

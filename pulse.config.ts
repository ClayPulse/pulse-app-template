import { AppConfig, AppTypeEnum } from "@pulse-editor/shared-utils";
import packageJson from "./package.json" with { type: "json" };

/**
 * Pulse Editor Extension Config
 *
 */
const config: AppConfig = {
  // Do not use hyphen character '-' in the id. 
  // The id should be the same as the package name in package.json.
  id: packageJson.name,
  version: packageJson.version,
  libVersion: packageJson.dependencies["@pulse-editor/shared-utils"],
  displayName: packageJson.displayName,
  description: packageJson.description,
  appType: AppTypeEnum.FileView,
  visibility: packageJson["pulse-editor-marketplace"].visibility,
  recommendedHeight: 640,
  recommendedWidth: 360,
  thumbnail: "assets/thumbnail.png",
  preRegisteredActions: [],
};

export default config;

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const keys = readFileSync(resolve(root, ".env.development"), "utf-8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"))
  .map((line) => line.split("=")[0].trim())
  .filter((key) => key.startsWith("VITE_"));

const dts = [
  "// Generated from .env.development — do not edit by hand",
  '/// <reference types="vite/client" />',
  "",
  "interface ImportMetaEnv {",
  ...keys.map((key) => `  readonly ${key}: string;`),
  "}",
  "",
].join("\n");

const outPath = resolve(packageRoot, "src/env.d.ts");
writeFileSync(outPath, dts);
console.log(`env.d.ts generated from .env.development: ${keys.join(", ")}`);

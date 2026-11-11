import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  // Third-party skill sources are reference packages, not application code.
  // docs/research holds offline study scripts and third-party sources under analysis.
  globalIgnores([".agents/skills/**", "docs/research/**", ".next/**", "next-env.d.ts", "playwright-report/**", "test-results/**"]),
]);

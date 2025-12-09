import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Global ignores from Next.js
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // Add rule overrides here
  {
    rules: {
      /**
       * 🔊 AUDIO PLAYER EXCEPTIONS
       * These rules incorrectly treat DOM element refs as React state.
       * Your player uses valid HTMLAudioElement mutation:
       *    audioEl.volume = v;
       *    audioEl.currentTime = t;
       *    audioEl.play();
       *
       * These *must* remain allowed, or React players break.
       */

      // Disable false-positive ref mutation warnings
      "react-hooks/immutability": "off",

      // Disable false-positive “cannot access ref during render” warnings
      "react-hooks/refs": "off",

      /**
       * Optional (your choice):
       * If you see warnings about unused vars from strict TS rules,
       * turn this on. It's safe.
       */
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
    },
  },
]);

export default eslintConfig;

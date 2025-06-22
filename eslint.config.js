import reactPlugin from "eslint-plugin-react";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";

/** @type {Linter.Config} */
const config = {
  languageOptions: {
    globals: {
      window: "readonly",
      document: "readonly",
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: {
    react: reactPlugin,
    "@typescript-eslint": typescriptPlugin,
    prettier: prettierPlugin,
  },
  rules: {
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
};

export default config;

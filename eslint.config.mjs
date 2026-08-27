import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  { ignores: [".next/", "node_modules/"] },
  nextPlugin.configs.recommended,
  nextPlugin.configs["core-web-vitals"],
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@next/next/no-img-element": "off",
      "prefer-const": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-empty-interface": "off",
    },
  }
);

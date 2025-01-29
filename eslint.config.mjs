import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn", // Change to a warning instead of an error
      "@next/next/no-img-element": "off", // Disable <img> element warnings
      "prefer-const": "warn", // Change 'prefer-const' to a warning
      "@typescript-eslint/no-explicit-any": "off", // Allow the use of 'any'
      "react-hooks/exhaustive-deps": "warn", // Change missing dependencies in useEffect to a warning
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

export default eslintConfig;

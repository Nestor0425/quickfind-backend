import security from "eslint-plugin-security";

export default [
  {
    ignores: ["node_modules/", "dist/", "public/"], // Ignorar carpetas innecesarias
  },
  {
    languageOptions: {
      sourceType: "module", // Para módulos ESM
      ecmaVersion: "latest",
    },
    plugins: {
      security,
    },
    rules: {
      "security/detect-object-injection": "warn",
    },
  },
];
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extiende las configuraciones de Next.js
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Configuración adicional de reglas
  {
    files: ["*.ts", "*.tsx"],
    rules: {
      // Detecta variables, imports y enums no usados
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
        },
      ],

      // DESACTIVAR errores de 'any' en producción
      "@typescript-eslint/no-explicit-any": "off",

      // Permite usar <img> sin advertencias de Next.js
      "@next/next/no-img-element": "off",

      // Desactiva la regla de vars no usadas de JS (solo usamos la de TS)
      "no-unused-vars": "off",
    },
  },

  // Ignorar carpetas/archivos
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;

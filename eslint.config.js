import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import daStyle from 'eslint-config-dicodingacademy';
import pluginCypress from 'eslint-plugin-cypress';

export default defineConfig([
  globalIgnores(['dist']),
  daStyle,
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    ...pluginCypress.configs.recommended,
    files: ['cypress/**/*.{js,jsx}', '**/*.cy.{js,jsx}'],
  },
]);

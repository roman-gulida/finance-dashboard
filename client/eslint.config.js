import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      'plugin:import/recommended',
      'plugin:import/typescript',
      'plugin:prettier/recommended', // integrates Prettier with ESLint
    ],
    plugins: {
      prettier,
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Formatting rules (Prettier handles most)
      'prettier/prettier': 'error',

      // Import order
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external', 'internal']],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // React 17+ doesn't need "import React"
      'react/react-in-jsx-scope': 'off',
    },
  },
])

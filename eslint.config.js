import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import nextPlugin from '@next/eslint-plugin-next';

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
  recommendedConfig: js.configs.recommended,
});

export default [
  ...compat.extends('next/core-web-vitals'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        browser: true,
        node: true,
        es2022: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      '@next/next': nextPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
    },
  },
  {
    ignores: [
      'dist/',
      'build/',
      '.next/',
      'node_modules/',
      '*.js',
      'next.config.js',
    ],
  },
];

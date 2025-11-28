const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const reactPlugin = require('eslint-plugin-react');
const reactNativePlugin = require('eslint-plugin-react-native');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                // React globals (for new JSX transform)
                React: 'readonly',
                JSX: 'readonly',
                // React Native globals
                __DEV__: 'readonly',
                // ES6 globals
                Promise: 'readonly',
                Set: 'readonly',
                Map: 'readonly',
                WeakMap: 'readonly',
                WeakSet: 'readonly',
                Symbol: 'readonly',
                Proxy: 'readonly',
                Reflect: 'readonly',
                // Node globals
                module: 'readonly',
                require: 'readonly',
                process: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                exports: 'writable',
                console: 'readonly',
                setTimeout: 'readonly',
                setInterval: 'readonly',
                clearTimeout: 'readonly',
                clearInterval: 'readonly',
                setImmediate: 'readonly',
                clearImmediate: 'readonly',
                Buffer: 'readonly',
                global: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react: reactPlugin,
            'react-native': reactNativePlugin,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            // TypeScript recommended rules
            ...tsPlugin.configs.recommended.rules,
            // React recommended rules
            ...reactPlugin.configs.recommended.rules,
            // React Native rules
            'react-native/no-unused-styles': 'error',
            'react-native/split-platform-components': 'error',
            'react-native/no-inline-styles': 'off',
            'react-native/no-color-literals': 'off',
            'react-native/no-raw-text': 'off',
            'react-native/no-single-element-style-arrays': 'error',
            // Custom rules
            'react/react-in-jsx-scope': 'off',
            'react/no-unescaped-entities': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
    prettierConfig,
    {
        ignores: ['node_modules/**', '.expo/**', 'dist/**', 'build/**'],
    },
];

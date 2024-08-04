// @ts-check
import eslint from '@eslint/js';
import {includeIgnoreFile} from '@eslint/compat';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import path from 'node:path';

export default tseslint.config(
    // @ts-expect-error - upstream type conflict, safe to ignore. Remove this line when fixed upstream.
    includeIgnoreFile(path.resolve(import.meta.dirname, '.gitignore')),
    eslint.configs.recommended,
    tseslint.configs.eslintRecommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        },
        extends: tseslint.configs.recommendedTypeChecked,
        rules: {
            '@typescript-eslint/comma-dangle': 'error',
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {prefer: 'type-imports', fixStyle: 'inline-type-imports'}
            ],
            '@typescript-eslint/no-import-type-side-effects': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/quotes': ['error', 'single'],
            '@typescript-eslint/semi': ['error', 'always'],
            'no-console': 'error',
            'no-constant-condition': 'off',
            'no-else-return': [
                'error',
                {
                    allowElseIf: false
                }
            ],
            'prefer-const': 'error',
            'semi-spacing': [
                'error',
                {
                    before: false,
                    after: true
                }
            ],
            'semi-style': ['error', 'last']
        }
    },
    {
        name: 'prettier',
        files: ['**/*.ts'],
        plugins: {
            prettier: prettierPlugin
        },
        rules: {
            // @ts-expect-error - type's aren't accurate enough.
            ...prettierPlugin.configs?.recommended?.rules,
            ...prettierConfig.rules
        }
    },
    {
        name: 'tests',
        files: ['test/**/*.ts'],
        rules: {
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/only-throw-error': 'off',
            '@typescript-eslint/prefer-promise-reject-errors': 'off',
            '@typescript-eslint/require-await': 'off'
        }
    },
    {
        name: 'type tests',
        files: ['test/**/types/*.ts'],
        rules: {
            '@typescript-eslint/no-unused-vars': 'off'
        }
    },
    {
        name: 'benchmark',
        files: ['benchmarks/**/*.ts'],
        rules: {
            '@typescript-eslint/no-floating-promises': 'off',
            'no-console': 'off'
        }
    }
);

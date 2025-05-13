// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import * as importPlugin from 'eslint-plugin-import';

export default tseslint.config(
    {
        ignores: ['eslint.config.mjs'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            sourceType: 'commonjs',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        plugins: {
            import: importPlugin,
        },
        rules: {
            indent: ['error', 4],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            'import/order': [
                'warn',
                {
                    groups: [
                        ['builtin', 'external'], // Node.js and third party libraries
                        ['internal'], // internal modules (starts with @)
                        ['parent', 'sibling', 'index'], // sort according to file structure
                    ],
                    'newlines-between': 'always', // Gruplar arasında yeni satır bırak
                    alphabetize: {
                        order: 'asc',
                        orderImportKind: 'asc',
                    },
                },
            ],
        },
    }
);

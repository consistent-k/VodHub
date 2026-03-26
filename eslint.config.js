import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importX from 'eslint-plugin-import-x';
import next from 'eslint-config-next';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['apps/backend/**/*.{ts,tsx}'],
        plugins: {
            'import-x': importX
        },
        rules: {
            '@typescript-eslint/member-ordering': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            'import-x/order': [
                'warn',
                {
                    groups: ['builtin', 'external', ['internal', 'parent', 'sibling', 'index']],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true
                    }
                }
            ]
        },
        ignores: ['dist/', 'node_modules/', 'logs/']
    },
    {
        files: ['apps/frontend/**/*.{ts,tsx,js,jsx}'],
        extends: [...next],
        plugins: {
            prettier,
            'unused-imports': unusedImports,
            import: importPlugin
        },
        rules: {
            'no-unused-vars': [
                'error',
                {
                    vars: 'local',
                    args: 'none'
                }
            ],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            'react-hooks/exhaustive-deps': 'off',
            'unused-imports/no-unused-imports': 'warn',
            'import/order': [
                2,
                {
                    groups: ['builtin', 'external', ['internal', 'parent', 'sibling', 'index'], 'unknown'],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true
                    }
                }
            ]
        },
        ignores: ['node_modules/', '.next/', 'dist/']
    },
    {
        ignores: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/coverage/**']
    }
);
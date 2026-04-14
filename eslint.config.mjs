import importPlugin from 'eslint-plugin-import-x';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['node_modules/', 'apps/frontend/dist/', 'apps/backend/dist/']
    },
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        plugins: {
            react,
            'react-hooks': reactHooks,
            prettier,
            'unused-imports': unusedImports,
            'import-x': importPlugin
        },
        settings: {
            react: {
                version: 'detect'
            }
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-hooks/set-state-in-effect': 'off',
            'prettier/prettier': 'warn',
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/ban-ts-comment': 'off',
            'unused-imports/no-unused-imports': 'warn',
            'import-x/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'never',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true
                    }
                }
            ]
        }
    }
);

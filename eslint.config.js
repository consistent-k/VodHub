import eslint from '@eslint/js';
import importX from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            'import-x': importX
        }
    },
    {
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
        }
    },
    {
        ignores: ['dist/', 'node_modules/', 'logs/']
    }
);

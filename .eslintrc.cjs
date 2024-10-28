module.exports = {
    extends: ['@ecomfe/eslint-config', '@ecomfe/eslint-config/typescript', 'prettier'],
    plugins: ['import'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    rules: {
        '@babel/new-cap': 0,
        semi: [2, 'always'],
        'comma-dangle': ['error', 'never'],
        'no-console': 0,
        'import/order': [
            1,
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
    }
};

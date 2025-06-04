const PRIVATE_IMPORTS_ERROR = 'Private imports are prohibited, use public imports instead';
const RELATIVE_IMPORTS_ERROR = 'Prefer absolute imports instead of relatives (for root modules)';

module.exports = {
    extends: [
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:boundaries/recommended'
    ],
    parser: '@typescript-eslint/parser',
    settings: {
        'import/resolver': { typescript: {} },
        'boundaries/elements': [
            { type: 'app', pattern: 'app/*' },
            { type: 'processes', pattern: 'processes/*' },
            { type: 'pages', pattern: 'pages/*' },
            { type: 'widgets', pattern: 'widgets/*' },
            { type: 'features', pattern: 'features/*' },
            { type: 'entities', pattern: 'entities/*' },
            { type: 'shared', pattern: 'shared/*' }
        ],
        'boundaries/ignore': ['**/*.test.*']
    },
    rules: {
        'import/no-named-as-default': 1,
        'import/order': [
            'error',
            {
                alphabetize: { order: 'asc', caseInsensitive: true },
                'newlines-between': 'always',
                pathGroups: [
                    { group: 'external', position: 'before', pattern: '{react,react-dom/*}' },
                    { group: 'internal', position: 'after', pattern: '@/processes/**' },
                    { group: 'internal', position: 'after', pattern: '@/pages/**' },
                    { group: 'internal', position: 'after', pattern: '@/widgets/**' },
                    { group: 'internal', position: 'after', pattern: '@/features/**' },
                    { group: 'internal', position: 'after', pattern: '@/entities/**' },
                    { group: 'internal', position: 'after', pattern: '@/shared/lib/assets/**' },
                    { group: 'internal', position: 'after', pattern: '@/shared/**' }
                ],
                pathGroupsExcludedImportTypes: ['builtin'],
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index']
            }
        ],
        'no-restricted-imports': [
            'error',
            {
                patterns: [
                    { message: PRIVATE_IMPORTS_ERROR, group: ['@/app/**'] },
                    {
                        message: PRIVATE_IMPORTS_ERROR,
                        group: ['@/processes/*/**']
                    },
                    { message: PRIVATE_IMPORTS_ERROR, group: ['@/pages/*/**'] },
                    {
                        message: PRIVATE_IMPORTS_ERROR,
                        group: ['@/widgets/*/**']
                    },
                    {
                        message: PRIVATE_IMPORTS_ERROR,
                        group: ['@/features/*/**']
                    },
                    {
                        message: PRIVATE_IMPORTS_ERROR,
                        group: ['@/entities/*/**']
                    },
                    {
                        message: PRIVATE_IMPORTS_ERROR,
                        group: ['@/shared/lib/assets/icons/browsers/*/**']
                    },
                    {
                        message: PRIVATE_IMPORTS_ERROR,
                        group: ['@/shared/lib/providers/*/**']
                    },
                    {
                        message: PRIVATE_IMPORTS_ERROR,
                        group: ['@/shared/lib/hooks/*/**']
                    },
                    {
                        message: RELATIVE_IMPORTS_ERROR,
                        group: ['../**/app']
                    },
                    {
                        message: RELATIVE_IMPORTS_ERROR,
                        group: ['../**/processes']
                    },
                    {
                        message: RELATIVE_IMPORTS_ERROR,
                        group: ['../**/pages']
                    },
                    {
                        message: RELATIVE_IMPORTS_ERROR,
                        group: ['../**/widgets']
                    },
                    {
                        message: RELATIVE_IMPORTS_ERROR,
                        group: ['../**/features']
                    },
                    {
                        message: RELATIVE_IMPORTS_ERROR,
                        group: ['../**/entities']
                    },
                    {
                        message: RELATIVE_IMPORTS_ERROR,
                        group: ['../**/shared']
                    }
                ]
            }
        ],
        'boundaries/element-types': [
            'warn',
            {
                default: 'disallow',
                rules: [
                    { from: 'app', allow: ['processes', 'pages', 'widgets', 'features', 'entities', 'shared'] },
                    { from: 'processes', allow: ['pages', 'widgets', 'features', 'entities', 'shared'] },
                    { from: 'pages', allow: ['widgets', 'features', 'entities', 'shared'] },
                    { from: 'widgets', allow: ['features', 'entities', 'shared'] },
                    { from: 'features', allow: ['entities', 'shared'] },
                    { from: 'entities', allow: ['shared'] },
                    { from: 'shared', allow: ['shared'] }
                ]
            }
        ]
    },
    overrides: [{ files: ['**/*.test.*'], rules: { 'boundaries/element-types': 'off' } }]
};
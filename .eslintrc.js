module.exports = {
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended'
    ],
    plugins: [
        '@typescript-eslint',
    ],
    parser: '@typescript-eslint/parser',
    env: {
        node: true,
        mocha: true,
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'import/extensions': 'off',
        'import/prefer-default-export': 'off',
        'no-console': 'warn',
        'max-len': ['error', { code: 160 }],
        'no-plusplus': 'off',
        'import/no-unresolved': 'off',
        indent: [
            'error',
            4,
        ],
        'comma-dangle': ['warn', 'only-multiline'],
        'react/sort-comp': [
            2,
            {
                order: ['static-variables', 'static-methods', 'instance-variables', 'constructor', 'lifecycle', 'everything-else', 'render']
            }
        ],
    },
};

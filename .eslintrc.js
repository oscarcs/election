module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        'eslint:recommended',
        '@vue/typescript/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'semi': ['error'],
        'indent': ['error', 4],
        'linebreak-style': ['error', 'windows'],
        'brace-style': ['error', 'stroustrup'],
        '@typescript-eslint/no-explicit-any': 'off'
    }
};

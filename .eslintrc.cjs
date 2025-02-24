module.exports = {
  extends: ['airbnb-base', 'airbnb-typescript/base'],
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['.eslintrc.cjs', 'test/prismaMock.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    'no-underscore-dangle': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'no-param-reassign': 'off', // for cases such as `set.status = 201`
    'import/prefer-default-export': 'off',
    'max-len': 'off',
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'no-restricted-syntax': 'off',
    'guard-for-in': 'off',
    'linebreak-style': ['error', 'windows'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'snake_case', 'UPPER_CASE', 'PascalCase'],
      },
    ],
  },
};

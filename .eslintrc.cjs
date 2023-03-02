/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['@typescript-eslint', 'simple-import-sort', 'import'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
  },
}

module.exports = config

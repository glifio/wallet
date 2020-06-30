module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  extends: [
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'airbnb',
    'prettier',
    'prettier/react'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    allowImportExportEverywhere: false
  },
  plugins: ['prettier', 'react', 'jsx-a11y', 'react-hooks'],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 0,
    'react/display-name': 0,
    'no-confusing-arrow': 0,
    'arrow-parens': 0,
    'implicit-arrow-linebreak': 0,
    'no-unused-vars': 1,
    'react/jsx-props-no-spreading': 0,
    'no-shadow': 1,
    'react/destructuring-assignment': 0,
    'react/require-default-props': 0,
    'import/prefer-default-export': 0,
    'consistent-return': 0,
    semi: 0,
    'react/forbid-prop-types': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/anchor-is-valid': 0,
    'no-shadow': 0,
    camelcase: 0,
    'import/no-named-as-default': 0
  }
}

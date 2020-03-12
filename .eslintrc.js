module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-underscore-dangle': ['off'],
    'import/no-extraneous-dependencies': ['off'],
    'comma-dangle': ['off'],
    'global-require': ['off'],
    'no-restricted-syntax': ['off'],
    'no-useless-escape': ['off'],
    radix: ['off'],
    'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }],
    'no-param-reassign': ['off']
  }
};

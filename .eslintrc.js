module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    "lines-between-class-members": ["error", "always"],
    "object-curly-newline": ["error", { "multiline": true, "minProperties": 10 }],
    "camelcase": "off",
    "no-unused-expressions": [2, { allowShortCircuit: true }],
    "no-unused-vars": "off",
    "no-console": "off",
    "no-param-reassign": 0,
    "import/prefer-default-export": "off",
    "no-return-assign": ["error", "always"]
  },
};

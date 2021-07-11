module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    "lines-between-class-members": ["error", "always"],
    "object-curly-newline": ["error", { "multiline": true, "minProperties": 10 }],
    "no-unused-vars": "off"
  },
};

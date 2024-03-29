module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',

  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    "plugin:unicorn/recommended",
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "prettier/prettier": [
      "warn",
      { "singleQuote": true, "endOfLine": "auto", "tabWidth": 2, "printWidth": 120 }
    ],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-namespace': 'off',
    "unicorn/no-fn-reference-in-iterator": "off",
    "unicorn/no-array-for-each": "off",
    "unicorn/no-null": "off",
    "unicorn/consistent-destructuring": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/prefer-spread": "off",
    "unicorn/no-array-callback-reference": "off",
    "unicorn/consistent-function-scoping": "off",
    "unicorn/no-useless-undefined": "off",
    "unicorn/prefer-top-level-await": "off",
    "unicorn/prevent-abbreviations": [
      "error",
      {
        allowList: { Param: true, Req: true, Res: true },
      },
    ]
  },
};

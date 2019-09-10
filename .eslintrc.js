module.exports =  {
  parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
  plugins: ["@typescript-eslint", "import"],
  extends:  [
    'airbnb',
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier',
    'prettier/@typescript-eslint',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    // 'plugin:prettier/recommended',  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions:  {
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
    // project: "./tsconfig.json"
  },
  rules: {
    '@typescript-eslint/no-var-requires': 0, // to be compatible with JS/Node config files
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-unused-vars': [2, { 'varsIgnorePattern': '^_' , 'argsIgnorePattern': '^_'}],
    'no-unused-vars': [2, { "argsIgnorePattern": "^_" }],
    'no-console': 2,
    'no-underscore-dangle': 0,
    'import/prefer-default-export': 0,
    "class-methods-use-this": 0,
    "no-alert": 0,
    "no-plusplus": 0,
    "import/order": 0,
    "no-useless-constructor": 0
  },
  // "env": {
  //   "browser": true,
  // },
  // "globals": {
  //
  // }
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.js']
      }
    }
  }
};

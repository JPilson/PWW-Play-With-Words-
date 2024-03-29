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
    '@typescript-eslint/no-unused-vars':'off',
    '@typescript-eslint/type-annotation-spacing':'off',
    '@typescript-eslint/no-inferrable-types':'off',
    '@typescript-eslint/no-empty-function':'off',
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-non-null-assertion":"off",
    '@typescript-eslint/no-explicit-any':'off',

  }
}

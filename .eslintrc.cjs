/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-typescript/recommended', '@vue/eslint-config-prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-undef': 'off',
    'vue/no-lone-template': 'off',
    'vue/this-in-template': 'off',
    'vue/no-mutating-props': 'off',
    'vue/order-in-components': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-setup-props-destructure': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/require-default-prop': 'off',
    'vue/html-indent': 'off',
    'max-len': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        trailingComma: 'none',
        printWidth: 150,
        endOfLine: 'auto'
      }
    ],
    'no-unused-vars': 'off'
  },
  env: {
    'vue/setup-compiler-macros': true
  }
}

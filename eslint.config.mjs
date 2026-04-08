// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // 風格
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    'comma-dangle': ['error', 'always-multiline'],
    'indent': ['error', 2],
    'max-len': ['error', { code: 150 }],

    // Vue
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': ['error', {
      html: { void: 'always', normal: 'always', component: 'always' },
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
      multiline: 1,
    }],

    // 通用
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
  },
})

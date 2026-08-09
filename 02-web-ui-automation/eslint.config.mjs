import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'blob-report/**',
      'playwright/.cache/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Playwright rules apply to specs and setup files only — page objects are
  // plain classes and would trip test-specific rules.
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-conditional-in-test': 'error',
      'playwright/no-wait-for-timeout': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/expect-expect': 'error',
      'playwright/no-force-option': 'warn',
      'playwright/prefer-to-have-length': 'error',
      'playwright/require-top-level-describe': 'off',
    },
  },

  // Discourage raw CSS/XPath selectors outside of narrowly-justified cases.
  {
    files: ['src/pages/**/*.ts', 'tests/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: "CallExpression[callee.property.name='locator'][arguments.0.type='Literal']",
          message:
            'Prefer a user-facing locator (getByRole/getByLabel/getByPlaceholder/getByTestId) over a raw CSS selector.',
        },
      ],
    },
  },

  prettier
);

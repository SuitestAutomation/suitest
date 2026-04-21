import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import {defineConfig} from 'eslint/config';

export default defineConfig([
	{
		ignores: ['**/jest.config.js', 'eslint.config.mjs'],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				project: 'tsconfig.eslint.json',
				sourceType: 'module',
			},
		},
		plugins: {
			'@stylistic': stylistic,
		},
		rules: {
			// TypeScript rules
			'@typescript-eslint/adjacent-overload-signatures': 'error',
			'@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
			'@typescript-eslint/consistent-type-assertions': 'error',
			'@typescript-eslint/consistent-type-definitions': 'off',
			'@typescript-eslint/member-ordering': 'error',
			'@typescript-eslint/no-empty-function': 'error',
			'@typescript-eslint/no-empty-object-type': 'error', // Renamed from no-empty-interface in v8
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-misused-new': 'error',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-unnecessary-type-assertion': 'off',
			'@typescript-eslint/no-unused-vars': ['error', {
				varsIgnorePattern: 'jsx',
				argsIgnorePattern: '^_',
			}],
			'@typescript-eslint/no-use-before-define': 'off',
			'@typescript-eslint/no-require-imports': 'error', // Renamed from no-var-requires in v8
			'@typescript-eslint/prefer-for-of': 'error',
			'@typescript-eslint/prefer-function-type': 'error',
			'@typescript-eslint/prefer-namespace-keyword': 'error',
			'@typescript-eslint/prefer-readonly': 'error',
			'@typescript-eslint/triple-slash-reference': 'off', // Off because of Rollup.js
			'@typescript-eslint/unified-signatures': 'error',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/restrict-template-expressions': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unnecessary-type-constraint': 'off',

			// Stylistic rules (moved from core eslint and @typescript-eslint formatting rules)
			'@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
			'@stylistic/semi': ['error', 'always'],
			'@stylistic/member-delimiter-style': ['error', {
				multiline: { delimiter: 'comma', requireLast: true },
				singleline: { delimiter: 'comma', requireLast: false },
			}],
			'@stylistic/type-annotation-spacing': 'error',
			'@stylistic/comma-dangle': ['error', 'always-multiline'],
			'@stylistic/eol-last': 'error',
			'@stylistic/new-parens': 'error',
			'@stylistic/no-multiple-empty-lines': 'error',
			'@stylistic/no-trailing-spaces': 'error',
			'@stylistic/space-in-parens': ['error', 'never'],
			'@stylistic/padding-line-between-statements': ['error', {
				blankLine: 'always',
				prev: '*',
				next: 'return',
			}],

			// Core ESLint rules
			'arrow-body-style': 'error',
			'arrow-parens': ['off', 'as-needed'],
			'camelcase': 'error',
			'complexity': 'off',
			'constructor-super': 'error',
			'curly': 'error',
			'dot-notation': 'error',
			'eqeqeq': ['error', 'always'],
			'guard-for-in': 'error',
			'id-match': 'error',
			'linebreak-style': ['error', 'unix'],
			'max-classes-per-file': ['error', 1],
			'max-len': ['error', {
				ignorePattern: '//|\'|"',
				code: 120,
			}],
			'no-bitwise': 'error',
			'no-caller': 'error',
			'no-cond-assign': 'error',
			'no-console': 'off',
			'no-debugger': 'error',
			'no-duplicate-imports': 'error',
			'no-empty': 'error',
			'no-eval': 'error',
			'no-fallthrough': 'off',
			'no-invalid-this': 'off',
			'no-new-wrappers': 'error',
			'no-redeclare': 'off', // Off because TypeScript function overloads trigger false positives
			'no-shadow': ['off', { hoist: 'all' }],
			'no-throw-literal': 'error',
			'no-undef-init': 'error',
			'no-unsafe-finally': 'error',
			'no-unused-expressions': 'error',
			'no-unused-labels': 'error',
			'no-var': 'error',
			'object-shorthand': 'error',
			'one-var': ['error', 'never'],
			'prefer-const': 'error',
			'quote-props': 'off',
			'radix': 'error',
			'space-before-function-paren': 'off',
			'spaced-comment': 'off', // Off because of TypeScript triple slash references
			'use-isnan': 'error',
			'valid-typeof': 'off',
			'no-case-declarations': 'off',
		},
	},
]);
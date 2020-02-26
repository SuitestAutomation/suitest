module.exports = {
	'root': true,
    'env': {},
    'extends': [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'project': 'tsconfig.eslint.json',
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint',
        '@typescript-eslint/tslint'
    ],
    'rules': {
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/array-type': ['error', {'default': 'array-simple'}],
        '@typescript-eslint/ban-types': 'error',
        '@typescript-eslint/class-name-casing': 'error',
        '@typescript-eslint/consistent-type-assertions': 'error',
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                'accessibility': 'explicit'
            }
        ],
		// Off because there is no good way to check indentation of
		// multiline type alias
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                'multiline': {
                    'delimiter': 'comma',
                    'requireLast': true
                },
                'singleline': {
                    'delimiter': 'comma',
                    'requireLast': false
                }
            }
        ],
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/no-empty-function': 'error',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
		'@typescript-eslint/no-unused-vars': ['error', {'varsIgnorePattern': 'jsx'}],
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/prefer-for-of': 'error',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/prefer-readonly': 'error',
        '@typescript-eslint/quotes': [
            'error',
            'single',
            {
                'avoidEscape': true
            }
        ],
        '@typescript-eslint/semi': [
            'error',
            'always'
        ],
        '@typescript-eslint/triple-slash-reference': 'error',
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/unified-signatures': 'error',
        'arrow-body-style': 'error',
        'arrow-parens': [
            'off',
            'as-needed'
        ],
        'camelcase': 'error',
        'comma-dangle': ['error', 'always-multiline'],
        'complexity': 'off',
        'constructor-super': 'error',
        'curly': 'error',
        'dot-notation': 'error',
        'eol-last': 'error',
        'eqeqeq': [
            'error',
            'always'
        ],
        'guard-for-in': 'error',
        // 'id-blacklist': [
        //     'error',
        //     'any',
        //     'Number',
        //     'number',
        //     'String',
        //     'string',
        //     'Boolean',
        //     'boolean',
        //     'Undefined',
        //     'undefined'
        // ],
        'id-match': 'error',
        'linebreak-style': [
            'error',
            'unix'
        ],
        'max-classes-per-file': [
            'error',
            1
        ],
        'max-len': [
            'error',
            {
                'ignorePattern': '//|\'|"',
                'code': 120
            }
        ],
        'new-parens': 'error',
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
        'no-multiple-empty-lines': 'error',
        'no-new-wrappers': 'error',
        'no-redeclare': 'error',
        'no-shadow': [
            'off',
            {
                'hoist': 'all'
            }
        ],
        'no-throw-literal': 'error',
        'no-trailing-spaces': 'error',
        'no-undef-init': 'error',
        // 'no-underscore-dangle': 'error',
        'no-unsafe-finally': 'error',
        'no-unused-expressions': 'error',
        'no-unused-labels': 'error',
        'no-var': 'error',
        'object-shorthand': 'error',
        'one-var': [
            'error',
            'never'
        ],
        'padding-line-between-statements': [
            'error',
            {
                'blankLine': 'always',
                'prev': '*',
                'next': 'return'
            }
        ],
        'prefer-const': 'error',
        'quote-props': 'off',
        'radix': 'error',
        'space-before-function-paren': 'off',
        'space-in-parens': [
            'error',
            'never'
        ],
        'spaced-comment': 'error',
        'unicorn/filename-case': 'off',
        'use-isnan': 'error',
        'valid-typeof': 'off',
        '@typescript-eslint/tslint/config': [
            'error',
            {
                'rules': {
                    'encoding': true,
                    'import-spacing': true,
                    'jsdoc-format': true,
                    'no-reference-import': true,
                    'no-unnecessary-callback-wrapper': true,
                    'one-line': [
                        true,
                        'check-catch',
                        'check-else',
                        'check-finally',
                        'check-open-brace',
                        'check-whitespace'
                    ],
                    'whitespace': [
                        true,
                        'check-branch',
                        'check-decl',
                        'check-operator',
                        'check-separator',
                        'check-rest-spread',
                        'check-type',
                        'check-typecast',
                        'check-preblock'
                    ]
                }
            }
        ]
    }
};
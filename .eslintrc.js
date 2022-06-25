module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
        es6: true,
        node: true,
        jest: true,
    },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',    
    'plugin:jest/recommended',    
  ],
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn', // Imports of interfaces throw this.
    'react/jsx-one-expression-per-line': 0,
    // turn off all of prettier warning
    'prettier/prettier': 0,
    'require-jsdoc': [
        'off',
    ], // no need jsdoc in this front end project
    'no-invalid-this': 'off', // allow this keywords outside of classes or class-like objects
    'brace-style': [
        'error',
        'allman',
    ], // enforces Allman brace style
    'comma-dangle': [
        'warn',
        'always-multiline',
    ], // don't care trailing commas
    'curly': 'error', // require brace for all control statements
    'object-curly-spacing': [
        'error',
        'always',
    ], // requires spacing inside of braces (except {})
    "semi": "off",
    'multiline-ternary': [
        'error',
        'always-multiline',
    ], // enforces newlines between the operands of a ternary expression if the expression spans multiple lines.
    'no-console': 'off', // free to use console
    'no-debugger': 'error', // disallow debugger
    'no-extra-semi': 'error', // disallow unnecessary semicolons
    'no-constant-condition': 'error', // disallow constant condition eg: if(true)
    'no-alert': 'error', // disallow alert, confirm, promp
    'one-var-declaration-per-line': [
        'error',
        'initializations',
    ], // disallow var initializations on one line
    'one-var': [
        'error',
        {
            'uninitialized': 'always',
            'initialized': 'never',
        },
    ],
    'operator-linebreak': [
        'error',
        'after',
        {
            'overrides': {
                '?': 'before',
                ':': 'before',
            },
        },
    ], // requires linebreaks to be placed after the operator
    'max-len': [
        'error',
        {
            'code': 200,
            'ignoreComments': true,
            'ignoreTrailingComments': true,
            'ignoreUrls': true,
            'ignoreStrings': true,
            'ignoreTemplateLiterals': true,
        },
    ], // maximum line length
    'indent': [
        'error',
        4,
        {
            'SwitchCase': 1,
            'MemberExpression': 1,
            'flatTernaryExpressions': true,
            'offsetTernaryExpressions': true,
        },
    ], // indent 4 space, switch case indent 1 level
    'quotes': [
        'error',
        'single',
        {
            'avoidEscape': true,
        },
    ], // requires the use of single quotes, can use double quotes in string content
    'no-multi-str': 'error', // disallow multiline strings (by placing \ at the end)
    'no-mixed-spaces-and-tabs': 'error', // disallows mixed spaces and tabs for indentation
    'no-trailing-spaces': [
        'error',
        {
            'skipBlankLines': true,
        },
    ], // disallow trailing whitespace at the end of lines, allow in blank lines
    'space-unary-ops': [
        'error',
        {
            'nonwords': false,
        },
    ], // require space after unary operators (new, delete, typeof, void, yield), no space after unary operators -, +, --, ++, !, !!
    'no-unused-vars': [
        'error',
        {
            'argsIgnorePattern': '^_',
        },
    ], // warning about unused variables, ignore _varName
    'keyword-spacing': [
        'error',
    ], // require space before and after keyword, eg: if, else...
    'space-infix-ops': 'error', // require spacing around infix operators (+, -, ?, : =...)
    'space-before-blocks': [
        'error',
        'always',
    ], // blocks must always have at least one preceding space.
    'eol-last': 'error', // enforces that files end with a newline
    'space-in-parens': [
        'error',
        'never',
    ], // enforces zero spaces inside of parentheses
    'no-multiple-empty-lines': 'error', // no more than 2 blank lines
    'no-multi-spaces': 'error', // disallow multiple spaces, eg: let a =   1;
    'key-spacing': [
        'error',
        {
            'beforeColon': false,
            'afterColon': true,
        },
    ], // require no space before colon, space after colon (in object literal properties)
    'spaced-comment': [
        'error',
        'always',
        {
            'line': {
                'exceptions': [
                    '-',
                    '+',
                ],
                'markers': [
                    '=',
                    '!',
                    '/',
                    '*',
                ],
            },
            'block': {
                'exceptions': [
                    '-',
                    '+',
                ],
                'markers': [
                    '=',
                    '!',
                    ':',
                    '::',
                ],
                'balanced': true,
            },
        },
    ], // require a space after "//" mark
    'no-prototype-builtins': [
        'off',
    ], // free to use builtin protoype because we don't deal with inherit
    'no-class-assign': [
        'off',
    ], // temporary let the team assign it since we feel comfortable with MobX
    'prefer-const': [
        'warn',
    ], // free to use const, let
    // React rules
    'react/default-props-match-prop-types': 'off',
    'react/display-name': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-boolean-value': 'warn',
    'react/jsx-first-prop-new-line': [
        'warn',
        'multiline-multiprop',
    ],
    'react/jsx-closing-bracket-location': 'warn',
    'react/jsx-closing-tag-location': 'warn',
    'react/jsx-curly-spacing': 'warn',
    'react/jsx-indent-props': [
        'error',
        4,
    ],
    'react/jsx-pascal-case': 'error',
    'react/jsx-max-props-per-line': [
        'warn',
        {
            'maximum': 1,
        },
    ],
    'react/jsx-props-no-multi-spaces': 'error',
    'react/jsx-wrap-multilines': [
        'error',
        {
            'declaration': 'parens-new-line',
            'assignment': 'parens-new-line',
            'return': 'parens-new-line',
            'arrow': 'parens-new-line',
            'condition': 'parens-new-line',
            'logical': 'parens-new-line',
            'prop': 'parens-new-line',
        },
    ],
    'react/jsx-tag-spacing': [
        'error',
        {
            'closingSlash': 'never',
            'beforeSelfClosing': 'always',
            'afterOpening': 'never',
            'beforeClosing': 'never',
        },
    ],
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-literals': 'off',
    'react/jsx-no-undef': 'warn',
    'react/jsx-sort-props': [
        'warn',
        {
            'noSortAlphabetically': true,
            'reservedFirst': true,
            'shorthandLast': true,
            'callbacksLast': true,
        },
    ],
    'react/jsx-uses-react': 'warn',
    'react/jsx-uses-vars': 'warn',
    'react/no-children-prop': 'error',
    'react/no-danger': 'warn',
    'react/no-did-mount-set-state': 'off',
    'react/no-did-update-set-state': 'warn',
    'react/no-direct-mutation-state': 'warn',
    'react/no-multi-comp': 'off',
    'react/no-unknown-property': 'warn',
    'react/no-unused-prop-types': 'error',
    'react/prefer-es6-class': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/self-closing-comp': 'warn',
    'react/sort-comp': 'off',
    'react/no-string-refs': 'warn',
    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
        0,
        {}
    ],
    // TS rules
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-unused-vars': 0, // eslint prevented
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-this-alias': 'warn',
    "@typescript-eslint/semi": ["error"]
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['node_modules/', 'src/registerServiceWorker.ts'],
};

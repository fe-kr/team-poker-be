module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
	  'sort-imports': [
		  'error',
		  {
			  ignoreCase: false,
			  ignoreDeclarationSort: true,
			  ignoreMemberSort: false,
			  memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
			  allowSeparatedGroups: true,
		  },
	  ],
	  'import/order': [
		  'error',
		  {
			  groups: [
					'builtin',
				  'external',
				  'internal',
				  ['sibling', 'parent'],
				  'index',
				  'unknown',
			  ],
			  'newlines-between': 'always',
			  alphabetize: {
				  order: 'asc',
				  caseInsensitive: true,
			  },
		  },
	  ],
  },
};

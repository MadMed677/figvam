module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],
	rules: {
		// disable the rule for all files
		'@typescript-eslint/explicit-module-boundary-types': 'off'
	},
	overrides: [
		{
			// enable the rule specifically for TypeScript files
			files: ['*.ts', '*.tsx'],
			rules: {
				'@typescript-eslint/explicit-module-boundary-types': ['error']
			}
		}
	]
};

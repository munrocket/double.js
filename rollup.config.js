import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
	{
		input: 'src/double.js',
		output: { file: pkg.main, format: 'cjs' }
	},
	{
		input: 'src/double.js',
		output: { file: pkg.browser, name: 'Double', format: 'iife' },
		plugins: [babel({exclude: 'node_modules/**'})]
	}
];

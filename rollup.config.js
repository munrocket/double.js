import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
	{
		input: 'src/double.js',
		output: { file: pkg.main, format: 'cjs' },
		output: { file: pkg.browser, name: 'Double', format: 'iife' }
	},
	{
		input: 'src/double.js',
		output: { file: 'double.es5.js', name: 'Double', format: 'iife' },
		plugins: [babel({exclude: 'node_modules/**'})]
	}
];

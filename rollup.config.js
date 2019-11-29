import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
	{
		input: 'src/double.js',
		output: { file: pkg.main, name: 'Double', format: 'umd' }
	},
	{
		input: 'src/double.js',
		output: { file: './dist/double.es5.js', name: 'Double', format: 'iife' },
		plugins: [babel({exclude: 'node_modules/**'})]
	}
];

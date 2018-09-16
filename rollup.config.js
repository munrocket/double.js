import babel from 'rollup-plugin-babel';

export default [
	{
		input: 'src/double.js',
		output: { file: "dist/double.cjs.js", format: 'cjs' }
	},
	{
		input: 'src/double.js',
		output: { file: "dist/double.iife.js", name: 'D', format: 'iife' },
		plugins: [babel({exclude: 'node_modules/**'})]
	}
];
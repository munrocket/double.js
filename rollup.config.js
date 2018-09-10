export default [
	{
		input: 'src/double.js',
		output: [
			{ file: "dist/double.cjs.js", format: 'cjs' },
      { file: "dist/double.iife.js", name: 'D', format: 'iife' }
		]
	}
];
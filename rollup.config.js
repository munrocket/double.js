import babel from 'rollup-plugin-babel';

export default [
  {
    input: 'src/double.js',
    output: [
      { file: "dist/double.cjs.js", format: 'cjs' },
      { file: "dist/double.iife.js", name: 'Double', format: 'iife' }
    ]
  },
  {
    input: 'src/double.js',
    output: { file: "dist/double.iife.es5.js", name: 'Double', format: 'iife' },
    plugins: [babel({exclude: 'node_modules/**'})]
  }
];

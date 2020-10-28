import pkg from './package.json';
import tsconfig from './tsconfig.json';
import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';

export default [
  {
    input: 'src/double.ts',
    output: [
      { file: pkg.main, name: 'Double', format: 'umd' },
      { file: pkg.module, name: 'Double', format: 'esm' },
    ],
    plugins: [ typescript({ tsconfigOverride: tsconfig }) ]
  },
  {
    input: pkg.module,
    output: { file: './dist/double.es5.js', name: 'Double', format: 'iife' },
    plugins: [ babel({ exclude: 'node_modules/**' }) ]
  }
];

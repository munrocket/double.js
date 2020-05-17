import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';
import { asc } from "rollup-plugin-assemblyscript";
import babel from 'rollup-plugin-babel';

const tsconfig = {
  "compilerOptions": {
    "target": "es6",
    "module": "es6",
    "moduleResolution": "node",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "outDir": "./dist",
    "sourceMap": false,
    "declaration": true,
    "lib": ["es2018"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}

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
  },
  {
    input: 'wasm/mandel.as',
    //output: { dir: "wasm" },
    plugins: [
      asc({
        compilerOptions: {
          //outFile: 'wasm/mandel.wasm',
          optimizeLevel: 3,
          shrinkLevel: 2,
          runtime: 'none',
          importMemory: true
        }
      })
    ]
  }
];

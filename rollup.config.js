import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import pkg from './package.json';

export default [
    {
        input: 'src/js/index.js',
        external: ['ms'],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' }
        ],
        plugins: [
            resolve({
                preferBuiltins: false
            }),
            commonjs(),
            babel({
                exclude: 'node_modules/**'
            }),
            json({
                preferConst: true
            })
        ]
    }
];

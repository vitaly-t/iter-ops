import rollupPluginTerser from '@rollup/plugin-terser';
import rollupPluginGzip from 'rollup-plugin-gzip';
import rollupPluginTypescript from 'rollup-plugin-ts';
import type {RollupOptions} from 'rollup';

import p from './package.json' with {type: 'json'};

const pkg = p as typeof p & {
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
};

const externalDependencies = [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {})
];

const common = {
    input: 'src/index.ts',

    output: {
        sourcemap: false
    },

    external: (source) => {
        if (
            source.startsWith('node:') ||
            externalDependencies.some((dep) => source.startsWith(dep))
        ) {
            return true;
        }
        return undefined;
    },

    treeshake: {
        annotations: true,
        moduleSideEffects: [],
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
    }
} satisfies Partial<RollupOptions>;

const copyright = `/*!
 * ${pkg.name} v${pkg.version}
 * Copyright ${new Date().getFullYear()} ${pkg.author.name}
 * Released under the ${pkg.license} License
 * ${pkg.homepage}
 */
`;

/**
 * The node build.
 */
const node = {
    ...common,

    output: [
        {
            ...common.output,
            file: pkg.main,
            format: 'cjs'
        },
        {
            ...common.output,
            file: pkg.module,
            format: 'esm'
        }
    ],

    plugins: [
        rollupPluginTypescript({
            transpileOnly: true,
            tsconfig: 'tsconfig.build.json'
        })
    ]
} satisfies RollupOptions;

/**
 * The web build.
 */
const web = {
    ...common,

    output: [
        {
            ...common.output,
            sourcemap: true,
            file: pkg.exports['web'].default,
            format: 'iife',
            name: 'iterOps',
            banner: copyright
        },
        {
            ...common.output,
            sourcemap: true,
            file: pkg.exports['web'].import,
            format: 'esm',
            name: 'iterOps',
            banner: copyright
        }
    ],

    plugins: [
        rollupPluginTypescript({
            transpileOnly: true,
            tsconfig: 'tsconfig.build.web.json'
        }),
        rollupPluginTerser({
            format: {
                comments: 'some'
            }
        }),
        rollupPluginGzip()
    ]
} satisfies RollupOptions;

export default [node, web];

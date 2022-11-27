/**
 * Rollup Config.
 */

import rollupPluginNodeResolve from '@rollup/plugin-node-resolve';
import rollupPluginTypescript from '@rollup/plugin-typescript';
import rollupPluginAutoExternal from 'rollup-plugin-auto-external';
import rollupPluginDts from 'rollup-plugin-dts';
import {terser as rollupPluginTerser} from 'rollup-plugin-terser';
import rollupPluginGzip from 'rollup-plugin-gzip';

import pkg from './package.json';

const entries = ['src/index.ts', 'src/entry/async.ts', 'src/entry/sync.ts'];

const configs = entries.flatMap((input) => {
    const common = {
        input,

        output: {
            sourcemap: false,
            inlineDynamicImports: true,
        },

        external: [],

        treeshake: {
            annotations: true,
            moduleSideEffects: [],
            propertyReadSideEffects: false,
            unknownGlobalSideEffects: false,
        },
    };

    /**
     * Get new instances of all the common plugins.
     */
    function getPlugins(tsconfig = 'tsconfig.build.json') {
        return [
            rollupPluginAutoExternal(),
            rollupPluginNodeResolve(),
            rollupPluginTypescript({
                tsconfig,
            }),
        ];
    }

    const copyright = `/*!
 * ${pkg.name} v${pkg.version}
 * Copyright ${new Date().getFullYear()} ${pkg.author.name}
 * Released under the ${pkg.license} License
 * ${pkg.homepage}
 */
`;

    /**
     * Get the intended boolean value from the given string.
     */
    function getBoolean(value: unknown) {
        if (value === undefined) {
            return false;
        }
        const asNumber = Number(value);
        return Number.isNaN(asNumber)
            ? String(value).toLowerCase() === 'false'
                ? false
                : Boolean(String(value))
            : Boolean(asNumber);
    }

    const buildTypesForTestingOnly = getBoolean(process.env.BUILD_TYPES_ONLY);

    /**
     * The common JS build.
     */
    const cjs = {
        ...common,

        output: {
            ...common.output,
            dir: './dist',
            entryFileNames: '[name].js',
            format: 'cjs',
        },

        plugins: getPlugins(),
    };

    /**
     * The esm build.
     */
    const esm = {
        ...common,

        output: {
            ...common.output,
            dir: './dist',
            entryFileNames: '[name].mjs',
            format: 'esm',
        },

        plugins: getPlugins(),
    };

    const webFileNamePrefix = input.endsWith('index.ts')
        ? pkg.name
        : `${pkg.name}.[name]`;

    /**
     * The web script build.
     */
    const web = {
        ...common,

        output: {
            ...common.output,
            entryFileNames: `${webFileNamePrefix}.min.js`,
            sourcemap: true,
            dir: 'dist/web',
            format: 'iife',
            name: 'iterOps',
            banner: copyright,
        },

        plugins: [
            ...getPlugins('tsconfig.build.web.json'),
            rollupPluginTerser({
                output: {
                    comments: 'some',
                },
            }),
            rollupPluginGzip(),
        ],
    };

    /**
     * The web module build.
     */
    const webModule = {
        ...web,

        output: {
            ...web.output,
            entryFileNames: `${webFileNamePrefix}.min.mjs`,
            dir: 'dist/web',
            format: 'esm',
        },

        plugins: [
            ...getPlugins('tsconfig.build.web.json'),
            rollupPluginTerser({
                output: {
                    comments: 'some',
                },
            }),
            rollupPluginGzip(),
        ],
    };

    /**
     * The types.
     */
    const dts = {
        ...common,

        output: {
            dir: 'dist',
            entryFileNames: '[name].d.ts',
            format: 'esm',
        },

        plugins: [rollupPluginDts()],
    };

    /**
     * The module types.
     */
    const dmts = {
        ...dts,

        output: {
            ...dts.output,
            entryFileNames: '[name].d.mts',
        },
    };

    return buildTypesForTestingOnly
        ? [dts]
        : [cjs, esm, web, webModule, dts, dmts];
});

export default configs;

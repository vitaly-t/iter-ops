/**
 * Rollup Config.
 */

import rollupPluginNodeResolve from "@rollup/plugin-node-resolve";
import rollupPluginTypescript from "@rollup/plugin-typescript";
import rollupPluginAutoExternal from "rollup-plugin-auto-external";

import pkg from "./package.json";

const common = {
  input: "src/index.ts",

  output: {
    sourcemap: false,
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
function getPlugins() {
  return [
    rollupPluginAutoExternal(),
    rollupPluginNodeResolve(),
    rollupPluginTypescript({
      tsconfig: "tsconfig.build.json",
    }),
  ];
}

/**
 * The common JS build.
 */
const cjs = {
  ...common,

  output: {
    ...common.output,
    file: pkg.main,
    format: "cjs",
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
    file: pkg.module,
    format: "esm",
  },

  plugins: getPlugins(),
};

export default [cjs, esm];

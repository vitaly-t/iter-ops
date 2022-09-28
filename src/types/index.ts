export {
    IErrorContext,
    IterableExt,
    AsyncIterableExt,
    AnyIterable,
    AnyIterator,
    AnyIterableIterator,
    Operation,
    AnySync,
    Any,
    IterationState,
} from './common';

/**
 * These are for code abbreviation + smaller bundles:
 */
export const $S: typeof Symbol.iterator = Symbol.iterator;
export const $A: typeof Symbol.asyncIterator = Symbol.asyncIterator;

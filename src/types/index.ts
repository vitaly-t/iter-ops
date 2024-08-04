export type {
    IErrorContext,
    IterableExt,
    AsyncIterableExt,
    UnknownIterable,
    UnknownIterator,
    UnknownIterableOrIterator,
    Operation,
    SyncValue,
    Value,
    IterationState,
    TypedArray
} from './common';

export type {Decrement} from './utils';

/**
 * These are for code abbreviation + smaller bundles:
 */
export const $S: typeof Symbol.iterator = Symbol.iterator;
export const $A: typeof Symbol.asyncIterator = Symbol.asyncIterator;

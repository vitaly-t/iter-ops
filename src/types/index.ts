export {
    AsyncIterableExt,
    AsyncOperation,
    DuelOperation,
    IErrorContext,
    IterableExt,
    IterationState,
    SyncOperation,
    SyncValue,
    TypedArray,
    UnknownIterable,
    UnknownIterator,
    Value,
} from './common';

export {FlattenAsync, FlattenSync} from './utils';

/**
 * These are for code abbreviation + smaller bundles:
 */
export const $S: typeof Symbol.iterator = Symbol.iterator;
export const $A: typeof Symbol.asyncIterator = Symbol.asyncIterator;

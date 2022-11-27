export {SyncOperation, IterableExt} from '../types';

export {pipe} from '../pipe/sync';

/////////////
// Operators:
export {aggregate} from '../ops/aggregate/sync';
export {catchError} from '../ops/catch-error/sync';
export {concat} from '../ops/concat/sync';
export {count} from '../ops/count/sync';
export {defaultEmpty} from '../ops/default-empty/sync';
export {distinct} from '../ops/distinct/sync';
export {drain} from '../ops/drain/sync';
export {empty} from '../ops/empty/sync';
export {every} from '../ops/every/sync';
export {filter} from '../ops/filter/sync';
export {first} from '../ops/first/sync';
export {flat} from '../ops/flat/sync';
export {flatMap} from '../ops/flat-map/sync';
export {indexBy, IIndexedValue} from '../ops/index-by/sync';
export {isEmpty} from '../ops/is-empty/sync';
export {last} from '../ops/last/sync';
export {map} from '../ops/map/sync';
export {
    onEnd,
    IIterationSummary,
    IDuration,
    IValueDuration,
} from '../ops/on-end/sync';
export {page} from '../ops/page/sync';
export {reduce} from '../ops/reduce/sync';
export {repeat} from '../ops/repeat/sync';
export {skip} from '../ops/skip/sync';
export {skipUntil} from '../ops/skip-until/sync';
export {skipWhile} from '../ops/skip-while/sync';
export {some} from '../ops/some/sync';
export {
    split,
    ISplitIndex,
    ISplitOptions,
    SplitValueCarry,
} from '../ops/split/sync';
export {spread} from '../ops/spread/sync';
export {take} from '../ops/take/sync';
export {takeLast} from '../ops/take-last/sync';
export {takeUntil} from '../ops/take-until/sync';
export {takeWhile} from '../ops/take-while/sync';
export {tap} from '../ops/tap/sync';
export {timeout} from '../ops/timeout/sync';
export {timing, IValueTiming} from '../ops/timing/sync';
export {toArray} from '../ops/to-array/sync';
export {zip} from '../ops/zip/sync';

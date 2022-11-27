import {createDuelOperation} from '../utils';
import {$A, $S, AsyncOperation, DuelOperation, SyncOperation} from '../types';

/**
 * Checks if the iterable is empty, and emits a boolean flag.
 *
 * ```ts
 * import {pipe, isEmpty} from 'iter-ops';
 *
 * const i = pipe(
 *     [],
 *     isEmpty()
 * );
 *
 * console.log(...i); //=> true
 *
 * console.log(i.first); //=> true
 * ```
 *
 * @see
 *  - {@link empty}
 *  - {@link defaultEmpty}
 * @category Sync+Async
 */
export function isEmpty(...args: unknown[]): DuelOperation<unknown, boolean> {
    return createDuelOperation(isEmptySync, isEmptyAsync, args);
}

/**
 * Checks if the iterable is empty, and emits a boolean flag.
 *
 * ```ts
 * import {pipe, isEmpty} from 'iter-ops';
 *
 * const i = pipe(
 *     [],
 *     isEmpty()
 * );
 *
 * console.log(...i); //=> true
 *
 * console.log(i.first); //=> true
 * ```
 *
 * @see
 *  - {@link empty}
 *  - {@link defaultEmpty}
 * @category Operations
 */
export function isEmptySync(): SyncOperation<unknown, boolean> {
    return (iterable) => ({
        [$S](): Iterator<boolean> {
            const i = iterable[$S]();
            let finished = false;
            return {
                next(): IteratorResult<boolean> {
                    if (!finished) {
                        const a = i.next();
                        finished = true;
                        return {value: !!a.done, done: false};
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    });
}

/**
 * Checks if the iterable is empty, and emits a boolean flag.
 *
 * ```ts
 * import {pipe, isEmpty} from 'iter-ops';
 *
 * const i = pipe(
 *     [],
 *     isEmpty()
 * );
 *
 * console.log(...i); //=> true
 *
 * console.log(i.first); //=> true
 * ```
 *
 * @see
 *  - {@link empty}
 *  - {@link defaultEmpty}
 * @category Operations
 */
export function isEmptyAsync(): AsyncOperation<unknown, boolean> {
    return (iterable) => ({
        [$A](): AsyncIterator<boolean> {
            const i = iterable[$A]();
            let finished = false;
            return {
                next(): Promise<IteratorResult<boolean>> {
                    if (finished) {
                        return Promise.resolve({value: undefined, done: true});
                    }
                    finished = true;
                    return i
                        .next()
                        .then((a) => ({value: !!a.done, done: false}));
                },
            };
        },
    });
}

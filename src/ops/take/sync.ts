import {$S, SyncOperation} from '../../types';

/**
 * Emits up to `count` number of values, then stops iteration.
 *
 * ```ts
 * import {pipe, take} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     take(2)
 * );
 *
 * console.log(...i); //=> 1, 2
 * ```
 *
 * @see
 *  - {@link takeLast}
 *  - {@link takeUntil}
 *  - {@link takeWhile}
 * @category Operations
 */
export function take<T>(count: number): SyncOperation<T, T> {
    return (iterable) => ({
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            let index = 0,
                finished: boolean;
            return {
                next(): IteratorResult<T> {
                    if (!finished) {
                        const a = i.next();
                        finished = a.done || index++ >= count;
                        if (!finished) {
                            return a;
                        }
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    });
}

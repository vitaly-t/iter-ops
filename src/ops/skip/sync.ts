import {$S, SyncOperation} from '../../types';

/**
 * Starts emitting values after `count` number of values.
 *
 * ```ts
 * import {pipe, skip} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     skip(2)
 * );
 *
 * console.log(...i); //=> 3, 4, 5
 * ```
 *
 * @see
 *  - {@link skipUntil}
 *  - {@link skipWhile}
 * @category Operations
 */
export function skip<T>(count: number): SyncOperation<T, T> {
    return (iterable) => ({
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            let index = 0,
                finished = false;
            return {
                next(): IteratorResult<T> {
                    let a = i.next();
                    if (!finished) {
                        while (!a.done && index++ < count) {
                            a = i.next();
                        }
                        finished = true;
                    }
                    return a;
                },
            };
        },
    });
}

import {$A, AsyncOperation} from '../../types';

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

export function skip<T>(count: number): AsyncOperation<T, T> {
    return (iterable) => ({
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            let index = 0,
                finished = false;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (!finished) {
                            finished = a.done || index++ >= count;
                        }
                        return finished ? a : this.next();
                    });
                },
            };
        },
    });
}

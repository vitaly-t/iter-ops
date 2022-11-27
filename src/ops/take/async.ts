import {$A, AsyncOperation} from '../../types';

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
export function take<T>(count: number): AsyncOperation<T, T> {
    return (iterable) => ({
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            let index = 0,
                finished: boolean;
            return {
                next(): Promise<IteratorResult<T>> {
                    if (finished) {
                        return Promise.resolve({value: undefined, done: true});
                    }
                    return i.next().then((a) => {
                        finished = a.done || index++ >= count;
                        return finished ? {value: undefined, done: true} : a;
                    });
                },
            };
        },
    });
}

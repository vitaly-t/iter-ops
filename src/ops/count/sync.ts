import {$S, IterationState, SyncOperation} from '../../types';

/**
 * Goes through the entire iterable, counting the values, and produces a one-value iterable with the count.
 *
 * ```ts
 * import {pipe, count} from 'iter-ops';
 *
 * const i = pipe(
 *     'hello world!',
 *     count()
 * );
 *
 * console.log(...i); //=> 12
 *
 * console.log(i.first); //=> 12
 * ```
 *
 * When the optional predicate is specified, only values that satisfy the predicate are counted.
 *
 * ```ts
 * import {pipe, count} from 'iter-ops';
 *
 * const i = pipe(
 *     'hello world!',
 *     count(a => a === 'l')
 * );
 *
 * console.log(...i); //=> 3
 *
 * console.log(i.first); //=> 3
 * ```
 *
 * @category Operations
 */
export function count<T>(
    cb?: (value: T, index: number, state: IterationState) => boolean
): SyncOperation<T, number> {
    return (iterable) => ({
        [$S](): Iterator<number> {
            const i = iterable[$S]();
            const test = typeof cb === 'function' && cb;
            const state: IterationState = {};
            let value = 0,
                index = 0,
                finished = false,
                a: IteratorResult<any>;
            return {
                next(): IteratorResult<number> {
                    while (!finished) {
                        a = i.next();
                        if (a.done) {
                            finished = true;
                            return {value, done: false};
                        }
                        if (!test || test(a.value, index++, state)) {
                            value++;
                        }
                    }
                    return a;
                },
            };
        },
    });
}

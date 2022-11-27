import {$S, IterationState, SyncOperation} from '../../types';

/**
 * Produces a one-value iterable, with the first emitted value.
 *
 * Without the optional predicate, it is the same as `take(1)`.
 *
 * ```ts
 * import {pipe, first} from 'iter-ops';
 *
 * const i = pipe(
 *     [10, 20, 30],
 *     first()
 * );
 *
 * console.log(...i); //=> 10
 *
 * console.log(i.first); //=> 10
 * ```
 *
 * When the optional predicate is provided, the first value satisfying it will be emitted.
 *
 * ```ts
 * import {pipe, first} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     first(a => a % 2 === 0) // first even number
 * );
 *
 * console.log(...i); //=> 2
 * ```
 *
 * @see
 *  - {@link last}
 *  - {@link take}
 *  - {@link takeLast}
 * @category Operations
 */
export function first<T>(
    cb?: (value: T, index: number, state: IterationState) => boolean
): SyncOperation<T, T> {
    return (iterable) => ({
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const state: IterationState = {};
            const test = typeof cb === 'function' && cb;
            let index = 0,
                finished: boolean;
            return {
                next(): IteratorResult<T> {
                    if (finished) {
                        return {value: undefined, done: true};
                    }
                    let a;
                    while (
                        !(a = i.next()).done &&
                        test &&
                        !test(a.value, index++, state)
                    );
                    finished = true;
                    return a;
                },
            };
        },
    });
}

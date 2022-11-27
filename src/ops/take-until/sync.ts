import {$S, SyncOperation, IterationState} from '../../types';

/**
 * Takes values until the predicate test succeeds.
 * The value for which predicate succeeds is excluded.
 *
 * ```ts
 * import {pipe, takeUntil} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     takeUntil(a => a > 2) // take until value > 2
 * );
 *
 * console.log(...i); //=> 1, 2
 * ```
 *
 * @see
 *  - {@link skip}
 *  - {@link skipUntil}
 *  - {@link skipWhile}
 *  - {@link take}
 *  - {@link takeLast}
 *  - {@link takeWhile}
 * @category Operations
 */
export function takeUntil<T>(
    cb: (value: T, index: number, state: IterationState) => boolean
): SyncOperation<T, T> {
    return (iterable) => ({
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0,
                stopped: boolean;
            return {
                next(): IteratorResult<T> {
                    if (!stopped) {
                        const a = i.next();
                        stopped = a.done || cb(a.value, index++, state);
                        if (!stopped) {
                            return a;
                        }
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    });
}

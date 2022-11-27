import {$S, IterationState, SyncOperation} from '../../types';

/**
 * Skips values until the predicate test succeeds.
 * The value for which predicate succeeds is not skipped.
 *
 * ```ts
 * import {pipe, skipUntil} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     skipUntil(a => a > 5) // skip until value > 5
 * );
 *
 * console.log(...i); //=> 6, 7, 8, 9
 * ```
 *
 * @see
 *  - {@link skip}
 *  - {@link skipWhile}
 *  - {@link take}
 *  - {@link takeLast}
 *  - {@link takeUntil}
 *  - {@link takeWhile}
 * @category Operations
 */
export function skipUntil<T>(
    cb: (value: T, index: number, state: IterationState) => boolean
): SyncOperation<T, T> {
    return (iterable) => ({
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0,
                started: boolean;
            return {
                next(): IteratorResult<T> {
                    let a = i.next();
                    if (!started) {
                        while (!a.done && !cb(a.value, index++, state)) {
                            a = i.next();
                        }
                        started = !a.done;
                    }
                    return a;
                },
            };
        },
    });
}

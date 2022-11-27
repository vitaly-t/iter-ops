import {$S, IterationState, SyncOperation} from '../../types';

/**
 * Skips values while the predicate test succeeds.
 *
 * ```ts
 * import {pipe, skipWhile} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     skipWhile(a => a < 5) // skip while value < 5
 * );
 *
 * console.log(...i); //=> 5, 6, 7, 8, 9
 * ```
 *
 * @see
 *  - {@link skip}
 *  - {@link skipUntil}
 *  - {@link take}
 *  - {@link takeLast}
 *  - {@link takeUntil}
 *  - {@link takeWhile}
 * @category Operations
 */
export function skipWhile<T>(
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
                        while (!a.done && cb(a.value, index++, state)) {
                            a = i.next();
                        }
                        started = true;
                    }
                    return a;
                },
            };
        },
    });
}

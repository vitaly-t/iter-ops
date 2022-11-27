import {$S, IterationState, SyncOperation} from '../../types';

/**
 * Taps into each value, without changing the output, for logging or debugging.
 *
 * ```ts
 * import {pipe, tap} from 'iter-ops';
 *
 * const i = pipe(
 *     'text',
 *     tap(a => {
 *         console.log(a); //=> t e x t
 *     })
 * ); //=> IterableExt<string>
 *
 * const result = [...i]; // t e x t
 * ```
 * @category Operations
 */
export function tap<T>(
    cb: (value: T, index: number, state: IterationState) => void
): SyncOperation<T, T> {
    return (iterable) => ({
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    const a = i.next();
                    if (!a.done) {
                        cb(a.value, index++, state);
                    }
                    return a;
                },
            };
        },
    });
}

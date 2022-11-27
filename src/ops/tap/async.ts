import {$A, AsyncOperation, IterationState} from '../../types';

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
): AsyncOperation<T, T> {
    return (iterable) => ({
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (!a.done) {
                            cb(a.value, index++, state);
                        }
                        return a;
                    });
                },
            };
        },
    });
}

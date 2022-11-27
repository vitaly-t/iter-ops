import {$A, AsyncOperation, IterationState} from '../../types';

/**
 * Emits each value after the callback result resolves, to control/mitigate the processing flow.
 *
 * The resolved value itself is ignored.
 *
 * ```ts
 * import {pipe, toAsync, tap, throttle} from 'iter-ops';
 *
 * const i = pipe(
 *     toAsync([1, 2, 3, 4, 5]),
 *     throttle(async (value, index, state) => {
 *         await processValue(value);
 *     }),
 *     tap(value => {
 *         // value = 1, 2, 3, 4, 5 (each delayed by processing time)
 *     })
 * );
 * ```
 *
 * @see
 *  - {@link delay}
 * @category Operations
 */
export function throttle<T>(
    cb: (value: T, index: number, state: IterationState) => Promise<any>
): AsyncOperation<T, T> {
    return (iterable) => ({
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i
                        .next()
                        .then((a) =>
                            a.done
                                ? a
                                : cb(a.value, index++, state).then(() => a)
                        );
                },
            };
        },
    });
}

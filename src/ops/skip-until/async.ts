import {$A, AsyncOperation, IterationState} from '../../types';
import {isPromiseLike} from '../../typeguards';

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
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): AsyncOperation<T, T> {
    return (iterable) => ({
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const state: IterationState = {};
            let index = 0,
                started: boolean;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (started || a.done) {
                            return a;
                        }
                        const r = cb(
                            a.value,
                            index++,
                            state
                        ) as Promise<boolean>;
                        const out = (flag: any) => {
                            started = flag;
                            return started ? a : this.next();
                        };
                        return isPromiseLike(r) ? r.then(out) : out(r);
                    });
                },
            };
        },
    });
}

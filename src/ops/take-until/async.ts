import {$A, AsyncOperation, IterationState} from '../../types';
import {isPromiseLike} from '../../typeguards';

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
                stopped: boolean;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (stopped || a.done) {
                            return {value: undefined, done: true};
                        }
                        const r = cb(
                            a.value,
                            index++,
                            state
                        ) as Promise<boolean>;
                        const out = (flag: any): IteratorResult<T> => {
                            stopped = flag;
                            return stopped ? {value: undefined, done: true} : a;
                        };
                        return isPromiseLike(r) ? r.then(out) : out(r);
                    });
                },
            };
        },
    });
}

import {$A, AsyncOperation, IterationState} from '../../types';
import {isPromiseLike} from '../../typeguards';

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
    cb?: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): AsyncOperation<T, T> {
    return (iterable) => ({
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const state: IterationState = {};
            const test = typeof cb === 'function' && cb;
            let index = 0,
                finished = false;
            return {
                next(): Promise<IteratorResult<T>> {
                    if (finished) {
                        return Promise.resolve({value: undefined, done: true});
                    }
                    return i.next().then((a) => {
                        const r = (a.done ||
                            !test ||
                            test(a.value, index++, state)) as Promise<boolean>;
                        const out = (flag: any) => {
                            finished = flag;
                            return finished ? a : this.next();
                        };
                        return isPromiseLike(r) ? r.then(out) : out(r);
                    });
                },
            };
        },
    });
}

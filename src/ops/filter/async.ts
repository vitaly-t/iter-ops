import {$A, AsyncOperation, IterationState} from '../../types';
import {isPromiseLike} from '../../typeguards';

/**
 * Standard {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array.filter} logic for the iterable,
 * extended with iteration state + async.
 *
 * In the example below, we take advantage of the {@link IterationState}, to detect and remove repeated
 * values (do not confuse with {@link distinct}, which removes all duplicates).
 *
 * ```ts
 * import {pipe, filter} from 'iter-ops';
 *
 * const i = pipe(
 *     iterable,
 *     filter((value, index, state) => {
 *         if(value === state.previousValue) {
 *             return false;
 *         }
 *         state.previousValue = value;
 *         return true;
 *     })
 * );
 * ```
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array.filter}
 * @category Operations
 */
export function filter<T>(
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
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (a.done) {
                            return a;
                        }
                        const r = cb(
                            a.value,
                            index++,
                            state
                        ) as Promise<boolean>;
                        const out = (flag: any) => (flag ? a : this.next());
                        return isPromiseLike(r) ? r.then(out) : out(r);
                    });
                },
            };
        },
    });
}

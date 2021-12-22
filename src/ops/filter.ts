import {IterationState, Operation} from '../types';
import {createOperation} from '../shared';
import {isPromise} from '../utils';

/**
 * Standard `Array.filter` logic for the iterable, extended with iteration state + async.
 *
 * In the example below, we take advantage of the [[IterationState]], to detect and remove repeated
 * values (do not confuse with [[distinct]], which removes all duplicates).
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
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
 * @category Sync+Async
 */
export function filter<T>(cb: (value: T, index: number, state: IterationState) => boolean | Promise<boolean>): Operation<T, T> {
    return createOperation(filterSync, filterAsync, arguments);
}

function filterSync<T>(iterable: Iterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    let a;
                    while (!(a = i.next()).done && !cb(a.value, index++, state));
                    return a;
                }
            };
        }
    };
}

function filterAsync<T>(iterable: AsyncIterable<T>, cb: (value: T, index: number, state: IterationState) => boolean | Promise<boolean>): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => {
                        if (a.done) {
                            return a;
                        }
                        const r = cb(a.value, index++, state) as Promise<boolean>;
                        const out = (flag: any) => flag ? a : this.next();
                        return isPromise(r) ? r.then(out) : out(r);
                    });
                }
            };
        }
    };
}

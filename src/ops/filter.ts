import {$A, $S, IterationState, Operation, SyncOperation} from '../types';
import {isPromiseLike} from '../typeguards';
import {createOperation} from '../utils';

/**
 * Standard `Array.filter` logic for the iterable, extended with iteration state.
 *
 * In the example below, we are able to use a type guard to filter out all the nullable values.
 *
 * ```ts
 * import {pipe, filter} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, null, "foo"],
 *     filter((value): value is NonNullable<typeof value> => value != null)
 * );
 * ```
 *
 * Note: The asynchronous version of this function cannot make use of type guards.\
 * Give a :+1: to the [Asynchronous Type Guards issue](https://github.com/microsoft/TypeScript/issues/37681)
 * if you want support for this.
 *
 * @see
 *  - [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
 * @category Sync
 */
export function filter<T, S extends T = T>(
    cb: (value: T, index: number, state: IterationState) => value is S
): SyncOperation<T, S>;

/**
 * Standard `Array.filter` logic for the iterable, extended with iteration state + async.
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
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
 * @category Sync+Async
 */
export function filter<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): Operation<T, T>;

export function filter(...args: unknown[]) {
    return createOperation(filterSync, filterAsync, args);
}

function filterSync<T>(
    iterable: Iterable<T>,
    cb: (value: T, index: number, state: IterationState) => boolean
): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    let a;
                    while (
                        !(a = i.next()).done &&
                        !cb(a.value, index++, state)
                    );
                    return a;
                },
            };
        },
    };
}

function filterAsync<T>(
    iterable: AsyncIterable<T>,
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): AsyncIterable<T> {
    return {
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
    };
}

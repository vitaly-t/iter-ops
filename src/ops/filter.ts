import {createDuelOperation} from '../utils';
import {
    $A,
    $S,
    AsyncOperation,
    DuelOperation,
    IterationState,
    SyncOperation,
} from '../types';
import {isPromiseLike} from '../typeguards';

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
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array.filter}
 * @category Sync+Async
 */
export function filter<T, S extends T = T>(
    cb: (value: T, index: number, state: IterationState) => value is S
): DuelOperation<T, S>;

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
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array.filter}
 * @category Sync+Async
 */
export function filter<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, T>;

export function filter<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(filterSync, filterAsync, [cb]);
}

/**
 * Standard {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array.filter} logic for the iterable,
 * extended with iteration state.
 *
 * In the example below, we are able to use a type guard to filter out all the nullable values.
 *
 * ```ts
 * import {pipe, filter} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     filter((value) => value >= 2)
 * );
 * ```
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array.filter}
 * @category Operations
 */
export function filterSync<T, S extends T = T>(
    cb: (value: T, index: number, state: IterationState) => value is S
): SyncOperation<T, S>;

/**
 * Standard {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array.filter} logic for the iterable,
 * extended with iteration state.
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
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array.filter}
 * @category Operations
 */
export function filterSync<T>(
    cb: (value: T, index: number, state: IterationState) => boolean
): SyncOperation<T, T>;

export function filterSync<T, S extends T = T>(
    cb: (value: T, index: number, state: IterationState) => boolean
): SyncOperation<T, S> {
    return (iterable) => ({
        [$S](): Iterator<S> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): IteratorResult<S> {
                    let a;
                    while (
                        !(a = i.next()).done &&
                        !cb(a.value, index++, state)
                    );
                    return a as IteratorResult<S>;
                },
            };
        },
    });
}

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
export function filterAsync<T>(
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

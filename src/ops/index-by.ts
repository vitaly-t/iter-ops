import {$A, $S, AsyncOperation, IterationState, Operation} from '../types';
import {isPromiseLike} from '../typeguards';
import {createOperation} from '../utils';

/**
 * Pair of `{index, value}` that passed predicate test of {@link indexBy} operator.
 */
export interface IIndexedValue<T> {
    /**
     * Index of the value that passed the predicate test.
     */
    index: number;

    /**
     * Value that corresponds to the `index`.
     */
    value: T;
}

/**
 * Emits indexed values that pass the predicate test.
 *
 * ```ts
 * import {pipe, indexBy} from 'iter-ops';
 *
 * const i = pipe(
 *     [12, 7, 30, 9],
 *     indexBy(a => a % 2 === 0) // index even numbers
 * );
 *
 * console.log(...i); //=> {index: 0, value: 12}, {index: 2, value: 30}
 * ```
 *
 * @see
 *  - {@link IIndexedValue}
 * @category Sync+Async
 */
export function indexBy<T>(
    cb: (value: T, index: number, state: IterationState) => boolean
): Operation<T, IIndexedValue<T>>;

/**
 * Emits indexed values that pass the predicate test.
 *
 * ```ts
 * import {pipe, indexBy} from 'iter-ops';
 *
 * const i = pipe(
 *     [12, 7, 30, 9],
 *     indexBy(a => a % 2 === 0) // index even numbers
 * );
 *
 * console.log(...i); //=> {index: 0, value: 12}, {index: 2, value: 30}
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline.
 *
 * @see
 *  - {@link IIndexedValue}
 * @category Sync+Async
 */
export function indexBy<T>(
    cb: (value: T, index: number, state: IterationState) => Promise<boolean>
): AsyncOperation<T, IIndexedValue<T>>;

export function indexBy(...args: unknown[]) {
    return createOperation(indexBySync, indexByAsync, args);
}

function indexBySync<T>(
    iterable: Iterable<T>,
    cb: (value: T, index: number, state: IterationState) => boolean
): Iterable<IIndexedValue<T>> {
    return {
        [$S](): Iterator<IIndexedValue<T>> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = -1;
            return {
                next(): IteratorResult<IIndexedValue<T>> {
                    let a;
                    while (
                        !(a = i.next()).done &&
                        !cb(a.value, ++index, state)
                    );
                    return a.done
                        ? a
                        : {value: {index, value: a.value}, done: false};
                },
            };
        },
    };
}

function indexByAsync<T>(
    iterable: AsyncIterable<T>,
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): AsyncIterable<IIndexedValue<T>> {
    return {
        [$A](): AsyncIterator<IIndexedValue<T>> {
            const i = iterable[$A]();
            const state: IterationState = {};
            let index = -1;
            return {
                next(): Promise<IteratorResult<IIndexedValue<T>>> {
                    return i.next().then((a) => {
                        if (a.done) {
                            return a;
                        }
                        const r = cb(
                            a.value,
                            ++index,
                            state
                        ) as Promise<boolean>;
                        const out = (flag: any) =>
                            flag
                                ? {value: {index, value: a.value}, done: false}
                                : this.next();
                        return isPromiseLike(r) ? r.then(out) : out(r);
                    });
                },
            };
        },
    };
}

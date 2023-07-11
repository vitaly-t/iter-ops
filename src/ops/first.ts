import {$A, $S, IterationState, Operation} from '../types';
import {isPromiseLike} from '../typeguards';
import {createOperation} from '../utils';

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
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link last}
 *  - {@link take}
 *  - {@link takeLast}
 * @category Sync+Async
 */
export function first<T>(
    cb?: (
        value: T,
        index: number,
        state: IterationState,
    ) => boolean | Promise<boolean>,
): Operation<T, T>;

export function first(...args: unknown[]) {
    return createOperation(firstSync, firstAsync, args);
}

function firstSync<T>(
    iterable: Iterable<T>,
    cb?: (value: T, index: number, state: IterationState) => boolean,
): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const state: IterationState = {};
            const test = typeof cb === 'function' && cb;
            let index = 0,
                finished: boolean;
            return {
                next(): IteratorResult<T> {
                    if (finished) {
                        return {value: undefined, done: true};
                    }
                    let a;
                    while (
                        !(a = i.next()).done &&
                        test &&
                        !test(a.value, index++, state)
                    );
                    finished = true;
                    return a;
                },
            };
        },
    };
}

function firstAsync<T>(
    iterable: AsyncIterable<T>,
    cb?: (
        value: T,
        index: number,
        state: IterationState,
    ) => boolean | Promise<boolean>,
): AsyncIterable<T> {
    return {
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
    };
}

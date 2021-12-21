import {IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Repeats every value specified number of times.
 *
 * ```ts
 * import {pipe, repeat} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     repeat(2)
 * );
 *
 * console.log(...i); //=> 1, 1, 1, 2, 2, 2, 3, 3, 3
 * ```
 *
 * @see [[retry]]
 * @category Sync+Async
 */
export function repeat<T>(count: number): Operation<T, T>;

/**
 * Repeats every value, while the callback is returning `true` (or resolves with `true`).
 * - `value` - repeated value
 * - `index` - original value index
 * - `count` - repeats count thus far (starts with 0)
 * - `state` - iteration state
 *
 * Note that the `Promise`-returning version works only inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * ```ts
 * import {pipe, repeat} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7],
 *     repeat((a, idx, c) => a % 2 === 0 && c < 2) // repeat even numbers 2 times
 * );
 *
 * console.log(...i); //=> 1, 2, 2, 2, 3, 4, 4, 4, 5, 6, 6, 6, 7
 * ```
 *
 * @see [[retry]]
 * @category Sync+Async
 */
export function repeat<T>(cb: (value: T, index: number, count: number, state: IterationState) => boolean | Promise<boolean>): Operation<T, T>;

export function repeat<T>(count: number | ((value: T, index: number, count: number, state: IterationState) => boolean | Promise<boolean>)): Operation<T, T> {
    return createOperation(repeatSync, repeatAsync, arguments);
}

function repeatSync<T>(iterable: Iterable<T>, count: number | ((value: T, index: number, count: number, state: IterationState) => boolean)): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            const cb = typeof count === 'function' && count;
            const getCopyCount = () => !cb && count > 0 ? count as number : 0;
            let copyCount = getCopyCount();
            let index = -1, copied = 0, start = true, a: IteratorResult<T>;
            return {
                next(): IteratorResult<T> {
                    if (start) {
                        a = i.next();
                        start = false;
                        index++;
                        copied = 0;
                        copyCount = getCopyCount();
                    }
                    if (a.done) {
                        return a;
                    }
                    if (cb) {
                        start = !cb(a.value, index, copied++, state);
                        return a;
                    }
                    if (copyCount) {
                        copyCount--;
                    } else {
                        start = true;
                    }
                    return a;
                }
            };
        }
    };
}

function repeatAsync<T>(iterable: AsyncIterable<T>, count: number | ((value: T, index: number, count: number, state: IterationState) => boolean | Promise<boolean>)): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const state: IterationState = {};
            const cb = typeof count === 'function' && count;
            const getCopyCount = () => !cb && count > 0 ? count as number : 0;
            let copyCount = getCopyCount();
            let index = -1, copied = 0, start = true, a: IteratorResult<T>;
            return {
                async next(): Promise<IteratorResult<T>> {
                    if (start) {
                        a = await i.next();
                        start = false;
                        index++;
                        copied = 0;
                        copyCount = getCopyCount();
                    }
                    if (a.done) {
                        return a;
                    }
                    if (cb) {
                        start = !(await (cb(a.value, index, copied++, state) as Promise<boolean>));
                        return a;
                    }
                    if (copyCount) {
                        copyCount--;
                    } else {
                        start = true;
                    }
                    return a;
                }
            };
        }
    };
}

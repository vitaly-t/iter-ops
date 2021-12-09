import {IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Repeats every value specified number of times.
 */
export function repeat<T>(count: number): Operation<T, T>;

/**
 * Repeats every value, while the callback is returning true.
 * `index` - original value index;
 * `count` - repeats count thus far (starts with 0).
 */
export function repeat<T>(cb: (value: T, index: number, count: number, state: IterationState) => boolean): Operation<T, T>;

/**
 * Repeats every value, for as long as the callback result resolves with true.
 * `index` - original value index;
 * `count` - repeats count thus far (starts with 0).
 *
 * This works only inside asynchronous iterables.
 */
export function repeat<T>(cb: (value: T, index: number, count: number, state: IterationState) => Promise<boolean>): Operation<T, T>;

/**
 * Starts emitting values after "count" number of values.
 */
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
                        start = !(await cb(a.value, index, copied++, state));
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

import {$A, $S, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Emits up to `count` number of values, then stops iteration.
 *
 * ```ts
 * import {pipe, take} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     take(2)
 * );
 *
 * console.log(...i); //=> 1, 2
 * ```
 *
 * @see [[takeLast]]
 * @category Sync+Async
 */
export function take<T>(count: number): Operation<T, T>;

export function take(...args: unknown[]) {
    return createOperation(takeSync, takeAsync, args);
}

function takeSync<T>(iterable: Iterable<T>, count: number): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            let index = 0, finished: boolean;
            return {
                next(): IteratorResult<T> {
                    if (!finished) {
                        const a = i.next();
                        finished = a.done || index++ >= count;
                        if (!finished) {
                            return a;
                        }
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function takeAsync<T>(iterable: AsyncIterable<T>, count: number): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            let index = 0, finished: boolean;
            return {
                next(): Promise<IteratorResult<T>> {
                    if (finished) {
                        return Promise.resolve({value: undefined, done: true});
                    }
                    return i.next().then(a => {
                        finished = a.done || index++ >= count;
                        return finished ? {value: undefined, done: true} : a;
                    });
                }
            };
        }
    };
}

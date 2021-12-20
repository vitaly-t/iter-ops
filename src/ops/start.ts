import {IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Starts emitting values, once the predicate returns a truthy value.
 *
 * ```ts
 * import {pipe, start} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     start(a => a === 5) // start emitting when 5 is encountered
 * );
 *
 * console.log(...i); //=> 5, 6, 7, 8, 9
 * ```
 *
 * @see [[stop]]
 * @category Sync+Async
 */
export function start<T>(cb: (value: T, index: number, state: IterationState) => boolean): Operation<T, T> {
    return createOperation(startSync, startAsync, arguments);
}

function startSync<T>(iterable: Iterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let index = 0, started: boolean;
            return {
                next(): IteratorResult<T> {
                    let a = i.next();
                    if (!started) {
                        while (!a.done && !cb(a.value, index++, state)) {
                            a = i.next();
                        }
                        started = true;
                    }
                    return a;
                }
            };
        }
    };
}

function startAsync<T>(iterable: AsyncIterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const state: IterationState = {};
            let index = 0, started: boolean;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => {
                        if (!started) {
                            started = a.done || cb(a.value, index++, state);
                        }
                        return started ? a : this.next();
                    });
                }
            };
        }
    };
}

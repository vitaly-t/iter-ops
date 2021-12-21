import {IterationState, Operation} from '../types';
import {createOperation, isPromise} from '../utils';

/**
 * Stops iteration, once the predicate test passes.
 *
 * ```ts
 * import {pipe, stop} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     stop(a => a === 5) // stop when 5 is encountered
 * );
 *
 * console.log(...i); //=> 1, 2, 3, 4
 * ```
 *
 * Note that the predicate can only return a `Promise` inside asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @category Sync+Async
 */
export function stop<T>(cb: (value: T, index: number, state: IterationState) => boolean | Promise<boolean>): Operation<T, T> {
    return createOperation(stopSync, stopAsync, arguments);
}

function stopSync<T>(iterable: Iterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let index = 0, stopped: boolean;
            return {
                next(): IteratorResult<T> {
                    if (!stopped) {
                        const a = i.next();
                        stopped = a.done || cb(a.value, index++, state);
                        if (!stopped) {
                            return a;
                        }
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function stopAsync<T>(iterable: AsyncIterable<T>, cb: (value: T, index: number, state: IterationState) => boolean | Promise<boolean>): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const state: IterationState = {};
            let index = 0, stopped: boolean;
            return {
                next(): Promise<IteratorResult<T>> {
                    if (stopped) {
                        return Promise.resolve({value: undefined, done: true});
                    }
                    return i.next().then(a => {
                        const r = (a.done || cb(a.value, index++, state)) as Promise<boolean>;
                        const out = (flag: any): IteratorResult<T> => {
                            stopped = flag;
                            return stopped ? {value: undefined, done: true} : a;
                        };
                        return isPromise(r) ? r.then(out) : out(r);
                    });
                }
            };
        }
    };
}

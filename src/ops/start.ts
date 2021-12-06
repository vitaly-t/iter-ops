import {IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Starts emitting values, once the predicate returns a truthy value.
 */
export function start<T>(cb: (value: T, index: number, state: IterationState) => boolean): Operation<T, T> {
    return createOperation(startSync, startAsync, arguments);
}

function startSync<T>(iterable: Iterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let index = 0, done = false;
            return {
                next(): IteratorResult<T> {
                    let a = i.next();
                    if (!done) {
                        while (!a.done && !cb(a.value, index++, state)) {
                            a = i.next();
                        }
                        done = true;
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
            let index = 0, done = false;
            return {
                async next(): Promise<IteratorResult<T>> {
                    let a = await i.next();
                    if (!done) {
                        while (!a.done && !cb(a.value, index++, state)) {
                            a = await i.next();
                        }
                        done = true;
                    }
                    return a;
                }
            };
        }
    };
}

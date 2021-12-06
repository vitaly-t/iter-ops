import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Starts emitting values after "count" number of values.
 */
export function skip<T>(count: number): Operation<T, T> {
    return createOperation(skipSync, skipAsync, arguments);
}

function skipSync<T>(iterable: Iterable<T>, count: number): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = 0, done = false;
            return {
                next(): IteratorResult<T> {
                    let a = i.next();
                    if (!done) {
                        while (!a.done && index++ < count) {
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

function skipAsync<T>(iterable: AsyncIterable<T>, count: number): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            let index = 0, done = false;
            return {
                async next(): Promise<IteratorResult<T>> {
                    let a = await i.next();
                    if (!done) {
                        while (!a.done && index++ < count) {
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

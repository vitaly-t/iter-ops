import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Emits up to "count" number of values.
 */
export function take<T>(count: number): Operation<T, T> {
    return createOperation(takeSync, takeAsync, arguments);
}

function takeSync<T>(iterable: Iterable<T>, count: number): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = 0, done = false;
            return {
                next(): IteratorResult<T> {
                    if (!done) {
                        const a = i.next();
                        if (a.done || index++ >= count) {
                            done = true;
                        } else {
                            return a;
                        }
                    }
                    return {value: undefined, done};
                }
            };
        }
    };
}

function takeAsync<T>(iterable: AsyncIterable<T>, count: number): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            let index = 0, done = false;
            return {
                async next(): Promise<IteratorResult<T>> {
                    if (!done) {
                        const a = await i.next();
                        if (a.done || index++ >= count) {
                            done = true;
                        } else {
                            return a;
                        }
                    }
                    return {value: undefined, done};
                }
            };
        }
    };
}

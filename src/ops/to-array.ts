import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Accumulates all values and emits an array.
 *
 * @see [[aggregate]]
 * @category Sync+Async
 */
export function toArray<T>(): Operation<T, T[]> {
    return createOperation(toArraySync, toArrayAsync);
}

function toArraySync<T>(iterable: Iterable<T>): Iterable<T[]> {
    return {
        [Symbol.iterator](): Iterator<T[]> {
            const i = iterable[Symbol.iterator]();
            let done = false;
            return {
                next(): IteratorResult<T[]> {
                    if (done) {
                        return {value: undefined, done};
                    }
                    const arr = [];
                    let a;
                    while (!(a = i.next()).done) {
                        arr.push(a.value);
                    }
                    done = true;
                    return {value: arr, done: false};
                }
            };
        }
    };
}

function toArrayAsync<T>(iterable: AsyncIterable<T>): AsyncIterable<T[]> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T[]> {
            const i = iterable[Symbol.asyncIterator]();
            const value: T[] = [];
            let finished = false;
            return {
                next(): Promise<IteratorResult<T[]>> {
                    return i.next().then(a => {
                        if (a.done) {
                            if (finished) {
                                return a;
                            }
                            finished = true;
                            return {value, done: false};
                        }
                        value.push(a.value);
                        return this.next();
                    });
                }
            };
        }
    };
}

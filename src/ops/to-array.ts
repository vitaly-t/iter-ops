import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Accumulates all values and emits an array.
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
                    return {value: arr};
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
            let done = false;
            return {
                next(): Promise<IteratorResult<T[]>> {
                    return i.next().then(a => {
                        if (!a.done) {
                            value.push(a.value);
                            return this.next();
                        }
                        if (done) {
                            return {value: undefined, done};
                        }
                        done = true;
                        return {value};
                    });
                }
            };
        }
    };
}

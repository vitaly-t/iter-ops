import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Aggregates/accumulates all values into array, passes it into the callback/aggregate,
 * to process the data and return the result.
 *
 * If the callback result is an iterable that you want to emit values,
 * follow it up with the spread operator.
 */
export function aggregate<T, R>(cb: (arr: T[]) => R): Operation<T, R> {
    return createOperation(aggregateSync, aggregateAsync, arguments);
}

function aggregateSync<T, R>(iterable: Iterable<T>, cb: (arr: T[]) => R): Iterable<R> {
    return {
        [Symbol.iterator](): Iterator<R> {
            const i = iterable[Symbol.iterator]();
            let finished = false;
            return {
                next(): IteratorResult<R> {
                    if (finished) {
                        return {value: undefined, done: true};
                    }
                    const arr: T[] = [];
                    let a;
                    while (!(a = i.next()).done) {
                        arr.push(a.value);
                    }
                    finished = true;
                    return {value: cb(arr)};
                }
            };
        }
    };
}

function aggregateAsync<T, R>(iterable: AsyncIterable<T>, cb: (arr: T[]) => R): AsyncIterable<R> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<R> {
            const i = iterable[Symbol.asyncIterator]();
            const arr: T[] = [];
            let finished = false;
            return {
                next(): Promise<IteratorResult<R>> {
                    return i.next().then(a => {
                        if (a.done) {
                            if (finished) {
                                return a;
                            }
                            finished = true;
                            return {value: cb(arr)};
                        }
                        arr.push(a.value);
                        return this.next();
                    });
                }
            };
        }
    };
}

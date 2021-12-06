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
            let done = false;
            return {
                next(): IteratorResult<R> {
                    if (done) {
                        return {value: undefined, done};
                    }
                    const arr: T[] = [];
                    let a;
                    while (!(a = i.next()).done) {
                        arr.push(a.value);
                    }
                    done = true;
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
            let done = false;
            return {
                async next(): Promise<IteratorResult<R>> {
                    if (done) {
                        return {value: undefined, done};
                    }
                    const arr: T[] = [];
                    let a;
                    while (!(a = await i.next()).done) {
                        arr.push(a.value);
                    }
                    done = true;
                    return {value: cb(arr)};
                }
            };
        }
    };
}

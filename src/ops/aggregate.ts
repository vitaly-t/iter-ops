import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Aggregates/accumulates all values into array, passes it into the callback/aggregate,
 * to process the data and return the result.
 *
 * If the callback result is an iterable that you want to emit values, follow it up with the [[spread]] operator.
 *
 * It basically repeats the logic of combining [[toArray]] + [[map]].
 *
 * ```ts
 * import {pipe, aggregate, spread} from 'iter-ops';
 *
 * const input = [7, 4, 3, 8, 2, 1]; // unsorted list
 *
 * const i = pipe(
 *     input,
 *     aggregate(values => values.sort()), // sort the values
 *     spread() // spread aggregation result
 * );
 *
 * console.log([...i]); //=> [ 1, 2, 3, 4, 7, 8 ]
 * ```
 *
 * @see [[https://github.com/vitaly-t/iter-ops/wiki/Aggregates Aggregates]]
 * @category Sync+Async
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
                    return {value: cb(arr), done: false};
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
                            return {value: cb(arr), done: false};
                        }
                        arr.push(a.value);
                        return this.next();
                    });
                }
            };
        }
    };
}

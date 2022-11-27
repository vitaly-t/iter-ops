import {$A, AsyncOperation} from '../../types';

/**
 * Aggregates/accumulates all values into array, passes it into the callback/aggregate,
 * to process the data and return the result. It is to simplify integration into the pipeline,
 * of external functions that can only operate on a complete data set.
 *
 * If the callback result is an iterable that you want to emit values, follow it up with the {@link spread} operator.
 *
 * It basically repeats the logic of combining {@link toArray} + {@link map}.
 *
 * ```ts
 * import {pipe, aggregate, spread} from 'iter-ops';
 *
 * const input = [7, 4, 3, 8, 2, 1]; // unsorted list
 *
 * const i = pipe(
 *     input,
 *     aggregate(values => values.sort((a, b) => a - b)), // sort the values
 *     spread() // spread aggregation result
 * );
 *
 * console.log(...i); //=> 1, 2, 3, 4, 7, 8
 * ```
 *
 * @see
 *  - {@link https://github.com/vitaly-t/iter-ops/wiki/Aggregates Aggregates}
 * @category Operations
 */
export function aggregate<T, R>(cb: (arr: T[]) => R): AsyncOperation<T, R> {
    return (iterable) => ({
        [$A](): AsyncIterator<R> {
            const i = iterable[$A]();
            const arr: T[] = [];
            let finished = false;
            return {
                next(): Promise<IteratorResult<R>> {
                    return i.next().then((a) => {
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
                },
            };
        },
    });
}

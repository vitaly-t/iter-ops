import {$A, $S, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Goes through the entire iterable, counting the values, and produces a one-value iterable with the count.
 *
 * ```ts
 * import {pipe, count} from 'iter-ops';
 *
 * const i = pipe(
 *     'hello world!',
 *     count()
 * );
 *
 * console.log(...i); //=> 12
 *
 * console.log(i.first); //=> 12
 * ```
 *
 * @category Sync+Async
 */
export function count<T>(): Operation<T, number> {
    return createOperation(countSync, countAsync);
}

function countSync<T>(iterable: Iterable<T>): Iterable<number> {
    return {
        [$S](): Iterator<number> {
            const i = iterable[$S]();
            let value = 0, finished = false, a: IteratorResult<any>;
            return {
                next(): IteratorResult<number> {
                    while (!finished) {
                        a = i.next();
                        if (a.done) {
                            finished = true;
                            return {value, done: false};
                        }
                        value++;
                    }
                    return a;
                }
            };
        }
    };
}

function countAsync<T>(iterable: AsyncIterable<T>): AsyncIterable<number> {
    return {
        [$A](): AsyncIterator<number> {
            const i = iterable[$A]();
            let value = 0, finished = false;
            return {
                next(): Promise<IteratorResult<number>> {
                    return i.next().then(a => {
                        if (a.done) {
                            if (finished) {
                                return a;
                            }
                            finished = true;
                            return {value, done: false};
                        }
                        value++;
                        return this.next();
                    });
                }
            };
        }
    };
}

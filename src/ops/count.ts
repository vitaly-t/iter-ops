import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Goes through the entire iterable, counting the values,
 * and produces a one-value iterable with the count.
 */
export function count<T>(): Operation<T, number> {
    return createOperation(countSync, countAsync);
}

function countSync<T>(iterable: Iterable<T>): Iterable<number> {
    return {
        [Symbol.iterator](): Iterator<number> {
            const i = iterable[Symbol.iterator]();
            let value = 0, finished = false, a: IteratorResult<any>;
            return {
                next(): IteratorResult<number> {
                    while (!finished) {
                        a = i.next();
                        if (a.done) {
                            finished = true;
                            return {value};
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
        [Symbol.asyncIterator](): AsyncIterator<number> {
            const i = iterable[Symbol.asyncIterator]();
            let value = 0, finished = false;
            return {
                next(): Promise<IteratorResult<number>> {
                    return i.next().then(a => {
                        if (a.done) {
                            if (finished) {
                                return a;
                            }
                            finished = true;
                            return {value};
                        }
                        value++;
                        return this.next();
                    });
                }
            };
        }
    };
}

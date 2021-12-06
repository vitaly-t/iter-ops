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
            let done = false;
            return {
                next(): IteratorResult<number> {
                    let value;
                    if (done) {
                        return {value, done};
                    }
                    const i = iterable[Symbol.iterator]();
                    value = 0;
                    while (!i.next().done) {
                        value++;
                    }
                    done = true;
                    return {value};
                }
            };
        }
    };
}

function countAsync<T>(iterable: AsyncIterable<T>): AsyncIterable<number> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<number> {
            let done = false;
            return {
                async next(): Promise<IteratorResult<number>> {
                    let value;
                    if (done) {
                        return {value, done};
                    }
                    const i = iterable[Symbol.asyncIterator]();
                    value = 0;
                    while (!(await i.next()).done) {
                        value++;
                    }
                    done = true;
                    return {value};
                }
            };
        }
    };
}
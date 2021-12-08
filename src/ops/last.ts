import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Produces a one-value iterable, with the last emitted value.
 *
 * When optional predicate is provided, the last value satisfying it will be emitted.
 */
export function last<T>(cb?: (value: T, index: number) => boolean): Operation<T, T> {
    return createOperation(lastSync, lastAsync, arguments);
}

function lastSync<T>(iterable: Iterable<T>, cb?: (value: T, index: number) => boolean): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const test = typeof cb === 'function' && cb;
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    let a, r;
                    while (!(a = i.next()).done) {
                        if (!test || test(a.value, index++)) {
                            r = a;
                        }
                    }
                    if (r) {
                        return {value: r.value};
                    }
                    return a;
                }
            };
        }
    };
}

function lastAsync<T>(iterable: AsyncIterable<T>, cb?: (value: T, index: number) => boolean): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const test = typeof cb === 'function' && cb;
            let finished = false, index = 0, value: IteratorResult<T>;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => {
                        if (a.done) {
                            if (finished || !value) {
                                return a;
                            }
                            finished = true;
                            return value;
                        }
                        if (!test || test(a.value, index++)) {
                            value = a;
                        }
                        return this.next();
                    });
                }
            };
        }
    };
}

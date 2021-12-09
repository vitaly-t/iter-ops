import {Operation} from '../../types';
import {createOperation, throwOnSync} from '../../utils';

/**
 * When the value is a Promise, it is resolved, or else returned as is.
 */
export function wait<T>(): Operation<Promise<T> | T, T>;

export function wait<T>() {
    return createOperation(throwOnSync('wait'), waitAsync, arguments);
}

export function waitAsync<T>(iterable: AsyncIterable<Promise<T> | T>): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => {
                        if (a.done) {
                            return a as any;
                        }
                        const p = a.value as Promise<T>;
                        return typeof p?.then === 'function' ? p?.then(value => ({value, done: false})) : a;
                    });
                }
            };
        }
    };
}

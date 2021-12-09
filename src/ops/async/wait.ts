import {Operation} from '../../types';
import {createOperation, throwOnSync} from '../../utils';

export function wait<T>(): Operation<Promise<T> | T, T>;

/**
 * Bla
 */
export function wait<T>(): Operation<Promise<T>, T> {
    return createOperation(throwOnSync('wait'), waitAsync as any, arguments);
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
                        if (typeof p?.then === 'function') {
                            return p?.then(value => ({value, done: false}));
                        }
                        return a;
                    });
                }
            };
        }
    };
}

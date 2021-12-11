import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Emits up to `count` number of values.
 *
 * @category Sync+Async
 */
export function take<T>(count: number): Operation<T, T> {
    return createOperation(takeSync, takeAsync, arguments);
}

function takeSync<T>(iterable: Iterable<T>, count: number): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    const a = i.next();
                    return a.done || index++ < count ? a : {value: undefined, done: true};
                }
            };
        }
    };
}

function takeAsync<T>(iterable: AsyncIterable<T>, count: number): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => a.done || index++ < count ? a : {value: undefined, done: true});
                }
            };
        }
    };
}

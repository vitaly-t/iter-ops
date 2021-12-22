import {Operation} from '../types';
import {createOperation, iterateOnce} from '../utils';

/**
 * Splits values into pages of fixed size (last page can be smaller).
 *
 * ```ts
 * import {pipe, page} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     page(2)
 * );
 *
 * console.log(...i); //=> [1, 2], [3, 4], [5]
 * ```
 *
 * It throws an error when `size` is less than 1 or not a `number`.
 *
 * @see [[split]]
 * @category Sync+Async
 */
export function page<T>(size: number): Operation<T, T[]> {
    return createOperation(pageSync, pageAsync, arguments);
}

function pageSync<T>(iterable: Iterable<T>, size: number): Iterable<T[]> {
    return {
        [Symbol.iterator](): Iterator<T[]> {
            if (typeof size !== 'number' || size < 1) {
                return iterateOnce(true, () => {
                    throw new TypeError(`Page size >= 1 is required: ${JSON.stringify(size)}`);
                }) as any;
            }
            const i = iterable[Symbol.iterator]();
            return {
                next(): IteratorResult<T[]> {
                    const value = [];
                    let a, c = 0;
                    while (c++ < size && !(a = i.next()).done) {
                        value.push(a.value);
                    }
                    if (value.length) {
                        return {value, done: false};
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function pageAsync<T>(iterable: AsyncIterable<T>, size: number): AsyncIterable<T[]> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T[]> {
            if (typeof size !== 'number' || size < 1) {
                return iterateOnce(false, () => {
                    throw new TypeError(`Page size >= 1 is required: ${JSON.stringify(size)}`);
                }) as any;
            }
            const i = iterable[Symbol.asyncIterator]();
            return {
                next(): Promise<IteratorResult<T[]>> {
                    const value: T[] = [];
                    let c = 1;
                    const nextValue = (): any => i.next().then(a => {
                        if (a.done) {
                            return value.length ? {value, done: false} : a;
                        }
                        value.push(a.value);
                        return c++ < size ? nextValue() : {value, done: false};
                    });
                    return nextValue();
                }
            };
        }
    };
}

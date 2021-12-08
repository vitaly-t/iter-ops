import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Splits values into pages of fixed size (last page can be smaller).
 *
 * Throws an error when page size is less than 1 or not a number.
 */
export function page<T>(size: number): Operation<T, T[]> {
    return createOperation(pageSync, pageAsync, arguments);
}

function pageSync<T>(iterable: Iterable<T>, size: number): Iterable<T[]> {
    return {
        [Symbol.iterator](): Iterator<T[]> {
            const i = iterable[Symbol.iterator]();
            let start = true;
            return {
                next(): IteratorResult<T[]> {
                    if (start) {
                        if (typeof size !== 'number' || size < 1) {
                            throw new TypeError(`Page size >= 1 is required: ${JSON.stringify(size)}`);
                        }
                        start = false;
                    }
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
            const i = iterable[Symbol.asyncIterator]();
            let start = true;
            return {
                async next(): Promise<IteratorResult<T[]>> {
                    if (start) {
                        if (typeof size !== 'number' || size < 1) {
                            throw new TypeError(`Page size >= 1 is required: ${JSON.stringify(size)}`);
                        }
                        start = false;
                    }
                    const value = [];
                    let a, c = 0;
                    while (c++ < size && !(a = await i.next()).done) {
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

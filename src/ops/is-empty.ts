import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Checks if the iterable can produce any value,
 * and returns a one-value iterable with the flag.
 */
export function isEmpty<T>(): Operation<T, boolean> {
    return createOperation(isEmptySync, isEmptyAsync);
}

function isEmptySync<T>(iterable: Iterable<T>): Iterable<boolean> {
    return {
        [Symbol.iterator](): Iterator<boolean> {
            let done = false;
            return {
                next(): IteratorResult<boolean> {
                    if (done) {
                        return {value: undefined, done};
                    }
                    const a = iterable[Symbol.iterator]().next();
                    done = true;
                    return {value: !!a.done};
                }
            };
        }
    };
}

function isEmptyAsync<T>(iterable: AsyncIterable<T>): AsyncIterable<boolean> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<boolean> {
            let done = false;
            return {
                async next(): Promise<IteratorResult<boolean>> {
                    if (done) {
                        return {value: undefined, done};
                    }
                    const a = await iterable[Symbol.asyncIterator]().next();
                    done = true;
                    return {value: !!a.done};
                }
            };
        }
    };
}

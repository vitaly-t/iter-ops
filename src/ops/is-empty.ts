import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Checks if the iterable can produce any value, and returns a one-value iterable with the boolean flag.
 *
 * @category Sync+Async
 */
export function isEmpty<T>(): Operation<T, boolean> {
    return createOperation(isEmptySync, isEmptyAsync);
}

function isEmptySync<T>(iterable: Iterable<T>): Iterable<boolean> {
    return {
        [Symbol.iterator](): Iterator<boolean> {
            const i = iterable[Symbol.iterator]();
            let finished = false;
            return {
                next(): IteratorResult<boolean> {
                    if (!finished) {
                        const a = i.next();
                        finished = true;
                        return {value: !!a.done, done: false};
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function isEmptyAsync<T>(iterable: AsyncIterable<T>): AsyncIterable<boolean> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<boolean> {
            const i = iterable[Symbol.asyncIterator]();
            let finished = false;
            return {
                next(): Promise<IteratorResult<boolean>> {
                    return i.next().then(a => {
                        if (!finished) {
                            finished = true;
                            return {value: !!a.done, done: false};
                        }
                        return {value: undefined, done: true};
                    });
                }
            };
        }
    };
}

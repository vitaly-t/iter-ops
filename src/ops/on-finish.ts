import {Operation} from '../types';
import {createOperation} from '../utils';

export interface IIteratorSummary {
    /**
     * Total count of items iterated through.
     */
    count: number;

    /**
     * Time in ms it took to finish the iterable.
     */
    duration: number;

    /**
     * Indication whether the iteration is synchronous.
     */
    sync: boolean;
}

/**
 * @category Sync+Async
 */
export function onFinish<T>(cb: (s: IIteratorSummary) => void): Operation<T, T> {
    return createOperation(onFinishSync, onFinishAsync, arguments);
}

function onFinishSync<T>(iterable: Iterable<T>, cb: (s: IIteratorSummary) => void): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let start: number, finished: boolean, count = 0;
            return {
                next(): IteratorResult<T> {
                    if (!start) {
                        start = Date.now();
                    }
                    const a = i.next();
                    if (a.done && !finished) {
                        finished = true;
                        cb({count, duration: Date.now() - start, sync: true});
                    }
                    count++;
                    return a;
                }
            };
        }
    };
}

function onFinishAsync<T>(iterable: AsyncIterable<T>, cb: (s: IIteratorSummary) => void): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next();
                }
            };
        }
    };
}

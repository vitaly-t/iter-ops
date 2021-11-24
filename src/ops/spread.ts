import {Piper} from '../types';
import {pipe} from '../pipe';

/**
 * Spreads iterable values.
 */
export function spread<T extends Iterable<R>, R>(): Piper<T, R> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<R> {
            return {
                next(): IteratorResult<R> {
                    return {value: undefined, done: true};
                }
            };
        }
    });
}

// declaration tests:
pipe(['text'], spread());

pipe([[1], [2], [3]], spread());

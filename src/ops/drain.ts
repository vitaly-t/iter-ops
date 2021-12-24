import {$A, $S, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Drains the iterable of all emitted values, and then emits an empty iterable.
 * Therefore, it cannot be used for infinite sequences.
 *
 * The operator doesn't change type of the previous iterable.
 *
 * ```ts
 * import {pipe, map, wait, drain, onEnd} from 'iter-ops';
 *
 * const i = pipe(
 *     iterable,
 *     map(a => myService.request(a)), // map into promise
 *     wait(), // resolve each promise
 *     drain(), // drain all values
 *     onEnd(s => {
 *         console.log('duration:', s.duration);
 *     })
 * );
 *
 * // Below, even though we trigger iteration just for the first value,
 * // onEnd will still be triggerred, because we drain the iterable:
 *
 * await i.first; // iterates to the first item
 * ```
 *
 * @see [[empty]], [[isEmpty]], [[defaultEmpty]]
 * @category Sync+Async
 */
export function drain<T>(): Operation<T, T> {
    return createOperation(drainSync, drainAsync, arguments);
}

function drainSync<T>(iterable: Iterable<T>): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            return {
                next(): IteratorResult<T> {
                    while (!i.next().done);
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function drainAsync<T>(iterable: AsyncIterable<T>): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => a.done ? a : this.next());
                }
            };
        }
    };
}

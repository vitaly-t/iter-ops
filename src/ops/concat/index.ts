import type {DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';
import {concat as concatAsync} from './async';
import {concat as concatSync} from './sync';

/**
 * Merges current iterable with any combination of values, iterators or iterables.
 * Merged inputs are iterated over after depleting the current iterable, in the order in which they were specified,
 * i.e. the standard {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat Array.concat} logic.
 *
 * ```ts
 * import {pipe, concat} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2],
 *     concat(3, 4, [5, 6])
 * );
 *
 * console.log(...i); //=> 1 2 3 4 5 6
 * ```
 *
 * Note that if you concatenate asynchronous iterables inside a synchronous pipeline, they will be processed as simple values.
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat Array.concat}
 * @category Sync+Async
 */
export function concat<T, Vs extends readonly unknown[]>(
    ...values: Vs
): DuelOperation<
    T,
    | T
    | (Vs[number] extends
          | Iterable<infer U>
          | Iterator<infer U>
          | AsyncIterable<infer U>
          | AsyncIterator<infer U>
          ? U
          : never)
> {
    return createDuelOperation<T, any>(concatSync, concatAsync, values);
}

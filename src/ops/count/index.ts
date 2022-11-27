import type {IterationState, DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';
import {count as countAsync} from './async';
import {count as countSync} from './sync';

/**
 * Goes through the entire iterable, counting the values, and produces a one-value iterable with the count.
 *
 * ```ts
 * import {pipe, count} from 'iter-ops';
 *
 * const i = pipe(
 *     'hello world!',
 *     count()
 * );
 *
 * console.log(...i); //=> 12
 *
 * console.log(i.first); //=> 12
 * ```
 *
 * When the optional predicate is specified, only values that satisfy the predicate are counted.
 *
 * ```ts
 * import {pipe, count} from 'iter-ops';
 *
 * const i = pipe(
 *     'hello world!',
 *     count(a => a === 'l')
 * );
 *
 * console.log(...i); //=> 3
 *
 * console.log(i.first); //=> 3
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @category Sync+Async
 */
export function count<T>(
    cb?: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, number> {
    return createDuelOperation<T, number>(countSync, countAsync, [cb]);
}

import type {DuelOperation, IterationState} from '../../types';
import {createDuelOperation} from '../../utils';

import {flatMap as flatMapAsync} from './async';
import {flatMap as flatMapSync} from './sync';

/**
 * Remaps and then flattens an iterable, consistent with the logic of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap Array.flatMap}
 *
 * ```ts
 * import {pipe, flatMap} from 'iter-ops';
 *
 * const i = pipe(
 *     ['hello', 'world!'],
 *     flatMap(a => a.length)
 * );
 *
 * console.log(...i); //=> 5 6
 * ```
 *
 * Note that when handling a synchronous iterable, this operator can remap+flatten only synchronous sub-iterables.
 * But when handling an asynchronous iterable, it can remap+flatten mixed sub-iterables, i.e. any combination of
 * synchronous and asynchronous sub-iterables.
 *
 * @see
 *  - {@link flat}
 *  - {@link map}
 * @category Sync+Async
 */

export function flatMap<T, R>(
    cb: (value: T, index: number, state: IterationState) => R | Promise<R>
): DuelOperation<
    T,
    R extends Iterable<infer E> | AsyncIterable<infer E> ? E : R
> {
    return createDuelOperation<
        T,
        R extends Iterable<infer E> | AsyncIterable<infer E> ? E : R
    >(flatMapSync as any, flatMapAsync, [cb]);
}

import type {IterationState, DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {map as mapAsync} from './async';
import {map as mapSync} from './sync';

/**
 * Standard {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map Array.map} logic for the iterable,
 * extended for supporting iteration state.
 *
 * When the callback is asynchronous (returns a `Promise`), the operator does not resolve the value,
 * because this library gives you the flexibility of resolving those in a variety of ways:
 *  - you can follow it up with operator {@link wait} when you want a simple one-by-one resolution
 *  - you can follow it up with operator {@link waitRace} when you want values emitted as they resolve
 *  - you can follow it up with {@link aggregate} + `Promise.all`, if you want to group the resolution
 *  - you can provide any custom resolution logic
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map Array.map}
 *  - {@link wait}
 *  - {@link waitRace}
 * @category Sync+Async
 */
export function map<T, R>(
    cb: (value: T, index: number, state: IterationState) => R
): DuelOperation<T, R> {
    return createDuelOperation<T, R>(mapSync, mapAsync, [cb]);
}

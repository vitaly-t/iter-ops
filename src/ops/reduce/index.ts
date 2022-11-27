import type {IterationState, DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {reduce as reduceAsync} from './async';
import {reduce as reduceSync} from './sync';

/**
 * Standard reducer for the iterable, extended for fully async syntax + iteration state.
 *
 * Below is an example of calculating the average from a sequence of numbers:
 *
 * ```ts
 * import {pipe, reduce} from 'iter-ops';
 *
 * const input = [3, 0, -2, 5, 9, 4];
 *
 * const i = pipe(input, reduce((p, c, idx, state) => {
 *     state.sum = (state.sum ?? p) + c;
 *     return p && state.sum / (idx + 1);
 * }));
 *
 * console.log(...i); //=> 3.1666(6)
 * ```
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce Array.reduce}
 *
 * @category Sync+Async
 */

export function reduce<T>(
    reducer: (
        previousValue: T,
        currentValue: T,
        index: number,
        state: IterationState
    ) => T | Promise<T>
): DuelOperation<T, T>;

export function reduce<T, R>(
    reducer: (
        previousValue: R,
        currentValue: T,
        index: number,
        state: IterationState
    ) => R | Promise<R>,
    initialValue: R | Promise<R>
): DuelOperation<T, R>;

export function reduce<T, R = T>(
    ...args:
        | [
              (
                  previousValue: T,
                  currentValue: T,
                  index: number,
                  state: IterationState
              ) => T | Promise<T>
          ]
        | [
              (
                  previousValue: R,
                  currentValue: T,
                  index: number,
                  state: IterationState
              ) => R | Promise<R>,
              R | Promise<R>
          ]
): DuelOperation<T, R> {
    return createDuelOperation<T, R>(reduceSync, reduceAsync, args);
}

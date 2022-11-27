import type {DuelOperation, IterationState} from '../../types';
import {createDuelOperation} from '../../utils';

import {filter as filterAsync} from './async';
import {filter as filterSync} from './sync';

/**
 * Standard {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array.filter} logic for the iterable,
 * extended with iteration state + async.
 *
 * In the example below, we take advantage of the {@link IterationState}, to detect and remove repeated
 * values (do not confuse with {@link distinct}, which removes all duplicates).
 *
 * ```ts
 * import {pipe, filter} from 'iter-ops';
 *
 * const i = pipe(
 *     iterable,
 *     filter((value, index, state) => {
 *         if(value === state.previousValue) {
 *             return false;
 *         }
 *         state.previousValue = value;
 *         return true;
 *     })
 * );
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array.filter}
 * @category Sync+Async
 */
export function filter<T, S extends T = T>(
    cb: (value: T, index: number, state: IterationState) => value is S
): DuelOperation<T, S>;

/**
 * Standard {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array.filter} logic for the iterable,
 * extended with iteration state + async.
 *
 * In the example below, we take advantage of the {@link IterationState}, to detect and remove repeated
 * values (do not confuse with {@link distinct}, which removes all duplicates).
 *
 * ```ts
 * import {pipe, filter} from 'iter-ops';
 *
 * const i = pipe(
 *     iterable,
 *     filter((value, index, state) => {
 *         if(value === state.previousValue) {
 *             return false;
 *         }
 *         state.previousValue = value;
 *         return true;
 *     })
 * );
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array.filter}
 * @category Sync+Async
 */
export function filter<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, T>;

export function filter<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(filterSync, filterAsync, [cb]);
}

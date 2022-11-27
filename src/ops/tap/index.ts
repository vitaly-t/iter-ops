import type {IterationState, DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {tap as tapAsync} from './async';
import {tap as tapSync} from './sync';

/**
 * Taps into each value, without changing the output, for logging or debugging.
 *
 * ```ts
 * import {pipe, tap} from 'iter-ops';
 *
 * const i = pipe(
 *     'text',
 *     tap(a => {
 *         console.log(a); //=> t e x t
 *     })
 * ); //=> IterableExt<string>
 *
 * const result = [...i]; // t e x t
 * ```
 *
 * @category Sync+Async
 */
export function tap<T>(
    cb: (value: T, index: number, state: IterationState) => void
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(tapSync, tapAsync, [cb]);
}

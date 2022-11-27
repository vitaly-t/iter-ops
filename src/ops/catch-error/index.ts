import type {IErrorContext, DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';
import {catchError as catchErrorSync} from './sync';
import {catchError as catchErrorAsync} from './async';

/**
 * Catches iteration errors (see {@link https://github.com/vitaly-t/iter-ops/wiki/Error-Handling Error Handling}).
 *
 * What you can do inside the error handler:
 *
 * - nothing (we let it skip the value)
 * - provide a new/alternative value (via `ctx.emit(value)`)
 * - re-throw the original error
 * - throw a new error
 *
 * @see
 *  - {@link https://github.com/vitaly-t/iter-ops/wiki/Error-Handling Error Handling}
 *  - {@link catchError}
 *
 * @category Diagnostics
 */
export function catchError<T>(
    cb: (error: any, ctx: IErrorContext<T>) => void
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(catchErrorSync, catchErrorAsync, [cb]);
}

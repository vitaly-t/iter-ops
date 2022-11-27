import type {Value, DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';
import {defaultEmpty as defaultEmptyAsync} from './async';
import {defaultEmpty as defaultEmptySync} from './sync';

/**
 * Adds a default value, iterator or iterable to an empty pipeline.
 *
 * If the pipeline has at least one value, the defaults are ignored.
 *
 * ```ts
 * import {pipe, defaultEmpty} from 'iter-ops';
 *
 * const i = pipe(
 *     [], // empty iterable/pipeline
 *     defaultEmpty([1, 2, 3]) // default for an empty pipeline
 * );
 *
 * console.log(...i); //=> 1, 2, 3
 * ```
 *
 * Note that if you add asynchronous defaults into a synchronous pipeline, they will be processed as simple values.
 *
 * @see
 *  - {@link empty}
 *  - {@link isEmpty}
 * @category Sync+Async
 */
export function defaultEmpty<T, D>(value: Value<D>): DuelOperation<T, T | D> {
    return createDuelOperation<T, D>(defaultEmptySync, defaultEmptyAsync, [
        value,
    ]);
}

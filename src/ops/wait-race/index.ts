import type {DuelOperation} from '../../types';
import {createDuelOperation, forwardThrough} from '../../utils';

import {waitRace as waitRaceAsync} from './async';

/**
 * Caches up every N promises, to race-resolve them and emit unordered results.
 *
 * It improves performance when handling multiple lengthy asynchronous operations,
 * by letting you process results in the order in which they resolve, rather than
 * the order in which those operations are created.
 *
 * Passing in `cacheSize` < 2 deactivates caching, and it then works like {@link wait}.
 *
 * ```ts
 * import {pipeAsync, map, waitRace} from 'iter-ops';
 *
 * const i = pipeAsync(
 *              [1, 2, 3, 4, 5],
 *              map(a => Promise.resolve(a * 10)), // replace with async processing
 *              waitRace(3) // cache & wait for up to 3 values at a time
 *              );
 *
 * for await (const a of i) {
 *     console.log(a); //=> 10, 40, 20, 50, 30 (unordered race-resolution)
 * }
 * ```
 *
 * This operator can handle a combination of promises and simple values, with the latter
 * emitted immediately, as they appear.
 *
 * When results need to be linked to the source, you can simply remap the operations,
 * like shown in the following example:
 *
 * ```ts
 * import {pipeAsync, map, waitRace} from 'iter-ops';
 *
 * const i = pipeAsync(
 *              [1, 2, 3],
 *              map(s => Promise.resolve(s * 10).then(r => ({s, r}))), // {source, resolution}
 *              waitRace(2)
 *              );
 *
 * for await (const a of i) {
 *     console.log(a); //=> {s: 1, r: 10}, {s: 3, r: 30}, {s: 2, r: 20} (unordered race-resolution)
 * }
 * ```
 *
 * @param cacheSize
 * Maximum number of promises to be cached up for concurrent resolution racing. Larger cache size
 * results in better concurrency. Setting it to less than 2 will deactivate caching completely,
 * and instead apply the same logic as operator {@link wait}.
 *
 * @throws `Error: 'Operator "waitRace" requires asynchronous pipeline'` when used inside a synchronous pipeline.
 *
 * @see
 *  - {@link wait}
 *
 * @category Async-only
 */
export function waitRace<T>(
    cacheSize: number
): DuelOperation<Promise<T> | T, T> {
    return createDuelOperation<Promise<T> | T, T>(
        forwardThrough as any,
        waitRaceAsync,
        [cacheSize]
    );
}

import type {DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {empty as emptyAsync} from './async';
import {empty as emptySync} from './sync';

/**
 * Emits an empty iterable, without pulling any values from the source,
 * i.e. it simply replaces the source iterable with an empty one.
 *
 * The operator doesn't change type of the previous iterable.
 *
 * @see
 *  - {@link drain}
 *  - {@link isEmpty}
 *  - {@link defaultEmpty}
 * @category Sync+Async
 */
export function empty(): DuelOperation<unknown, never> {
    return createDuelOperation(emptySync, emptyAsync);
}

import {expectType} from 'tsd';

import type {IterableExt} from '../../../../src';
import {tap, pipe} from '../../../../src/entry/sync';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(
    iterableNumber,
    tap(() => {})
);
expectType<IterableExt<number>>(test1);

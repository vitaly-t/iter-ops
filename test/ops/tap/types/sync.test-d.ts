import {expectType} from 'tsd';

import {tap, pipe, type IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(
    iterableNumber,
    tap(() => {})
);
expectType<IterableExt<number>>(test1);

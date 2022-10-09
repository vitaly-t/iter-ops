import {expectType} from 'tsd';

import {stop, pipe, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(
    iterableNumber,
    stop((value) => true)
);
expectType<IterableExt<number>>(test1);

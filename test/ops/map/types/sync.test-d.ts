import {expectType} from 'tsd';

import {type IterableExt, map, pipe} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(
    iterableNumber,
    map((value) => 'foo')
);
expectType<IterableExt<string>>(test1);

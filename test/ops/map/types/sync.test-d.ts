import {expectType} from 'tsd';

import {IterableExt, map, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(
    iterableNumber,
    map((value) => 'foo')
);
expectType<IterableExt<string>>(test1);

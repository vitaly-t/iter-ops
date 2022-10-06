import {expectType} from 'tsd';

import {reduce, pipeSync, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<Iterable<number>>;

const test1 = pipeSync(
    iterableNumber,
    reduce(() => 'foo')
);
expectType<IterableExt<string>>(test1);

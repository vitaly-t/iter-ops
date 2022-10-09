import {expectType} from 'tsd';

import {reduce, pipe, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<Iterable<number>>;

const test1 = pipe(
    iterableNumber,
    reduce(() => 'foo')
);
expectType<IterableExt<string>>(test1);

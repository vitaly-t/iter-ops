import {expectType} from 'tsd';

import {IterableExt, last, pipe} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(iterableNumber, last());
expectType<IterableExt<number>>(test1);

const test2 = pipe(
    iterableNumber,
    last((value, index) => true),
);
expectType<IterableExt<number>>(test2);

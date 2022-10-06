import {expectType} from 'tsd';

import {IterableExt, last, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(iterableNumber, last());
expectType<IterableExt<number>>(test1);

const test2 = pipeSync(
    iterableNumber,
    last((value, index) => true)
);
expectType<IterableExt<number>>(test2);

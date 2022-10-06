import {expectType} from 'tsd';

import {stop, pipeSync, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(
    iterableNumber,
    stop((value) => true)
);
expectType<IterableExt<number>>(test1);

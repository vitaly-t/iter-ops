import {expectType} from 'tsd';

import {flatMap, IterableExt, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<Iterable<number>>;

const test1 = pipeSync(
    iterableNumber,
    flatMap((value) => {
        expectType<number>(value);
        return 123;
    })
);
expectType<IterableExt<number>>(test1);

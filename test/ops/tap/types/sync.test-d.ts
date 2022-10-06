import {expectType} from 'tsd';

import {tap, pipeSync, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(
    iterableNumber,
    tap(() => {})
);
expectType<IterableExt<number>>(test1);

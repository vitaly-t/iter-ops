import {expectType} from 'tsd';

import {toArray, pipeSync, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(iterableNumber, toArray());
expectType<IterableExt<number[]>>(test1);

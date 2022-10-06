import {expectType} from 'tsd';

import {repeat, pipeSync, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(iterableNumber, repeat(2));
expectType<IterableExt<number>>(test1);

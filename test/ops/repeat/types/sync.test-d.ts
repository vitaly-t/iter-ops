import {expectType} from 'tsd';

import {repeat, pipe, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(iterableNumber, repeat(2));
expectType<IterableExt<number>>(test1);

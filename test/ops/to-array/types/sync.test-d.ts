import {expectType} from 'tsd';

import {toArray, pipe, type IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(iterableNumber, toArray());
expectType<IterableExt<number[]>>(test1);

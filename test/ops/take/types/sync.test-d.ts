import {expectType} from 'tsd';

import {take, pipe, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(iterableNumber, take(5));
expectType<IterableExt<number>>(test1);

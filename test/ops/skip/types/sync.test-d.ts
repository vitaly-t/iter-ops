import {expectType} from 'tsd';

import {skip, pipe, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(iterableNumber, skip(2));
expectType<IterableExt<number>>(test1);

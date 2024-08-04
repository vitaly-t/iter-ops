import {expectType} from 'tsd';

import {takeLast, pipe, type IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(iterableNumber, takeLast(5));
expectType<IterableExt<number>>(test1);

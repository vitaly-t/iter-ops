import {expectType} from 'tsd';

import {takeLast, pipeSync, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(iterableNumber, takeLast(5));
expectType<IterableExt<number>>(test1);

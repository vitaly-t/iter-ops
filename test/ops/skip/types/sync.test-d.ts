import {expectType} from 'tsd';

import {skip, pipeSync, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(iterableNumber, skip(2));
expectType<IterableExt<number>>(test1);

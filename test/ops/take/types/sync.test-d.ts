import {expectType} from 'tsd';

import {take, pipeSync, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(iterableNumber, take(5));
expectType<IterableExt<number>>(test1);

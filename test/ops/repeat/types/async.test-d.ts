import {expectType} from 'tsd';

import {repeat, pipe, type AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(iterableNumber, repeat(2));
expectType<AsyncIterableExt<number>>(test1);

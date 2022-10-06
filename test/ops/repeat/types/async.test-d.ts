import {expectType} from 'tsd';

import {repeat, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(iterableNumber, repeat(2));
expectType<AsyncIterableExt<number>>(test1);

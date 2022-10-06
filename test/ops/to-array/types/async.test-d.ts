import {expectType} from 'tsd';

import {toArray, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(iterableNumber, toArray());
expectType<AsyncIterableExt<number[]>>(test1);

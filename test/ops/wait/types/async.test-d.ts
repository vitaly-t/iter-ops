import {expectType} from 'tsd';

import {wait, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<Promise<number>>;

const test1 = pipeAsync(iterableNumber, wait());
expectType<AsyncIterableExt<number>>(test1);

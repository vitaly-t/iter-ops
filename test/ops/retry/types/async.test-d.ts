import {expectType} from 'tsd';

import {retry, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(iterableNumber, retry(2));
expectType<AsyncIterableExt<number>>(test1);

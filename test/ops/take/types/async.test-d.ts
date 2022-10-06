import {expectType} from 'tsd';

import {take, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(iterableNumber, take(5));
expectType<AsyncIterableExt<number>>(test1);

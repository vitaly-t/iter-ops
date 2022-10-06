import {expectType} from 'tsd';

import {skip, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(iterableNumber, skip(2));
expectType<AsyncIterableExt<number>>(test1);

import {expectType} from 'tsd';

import {takeLast, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(iterableNumber, takeLast(5));
expectType<AsyncIterableExt<number>>(test1);

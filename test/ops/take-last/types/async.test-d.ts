import {expectType} from 'tsd';

import {takeLast, pipe, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(iterableNumber, takeLast(5));
expectType<AsyncIterableExt<number>>(test1);

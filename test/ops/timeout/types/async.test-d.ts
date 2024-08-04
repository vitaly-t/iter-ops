import {expectType} from 'tsd';

import {timeout, pipe, type AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<string>;

const test1 = pipe(iterableNumber, timeout(10));
expectType<AsyncIterableExt<string>>(test1);

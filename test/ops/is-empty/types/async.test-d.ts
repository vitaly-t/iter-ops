import {expectType} from 'tsd';

import {AsyncIterableExt, isEmpty, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(iterableNumber, isEmpty());
expectType<AsyncIterableExt<boolean>>(test1);
